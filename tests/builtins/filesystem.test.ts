import { test, expect } from 'bun:test';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { filesystemCommands } from '../../src/builtins/filesystem.ts';
import { Budget, executeAction, type Context } from '../../src/sdk/index.ts';

function ctx(object: any = {}): Context & { payload?: string } {
  const budget = new Budget();
  const c: Context & { payload?: string } = {
    budget,
    signal: budget.signal,
    log() {},
    llm: {
      async text() {
        throw new Error('unexpected');
      },
      async object(_i, evidence) {
        c.payload = String(evidence);

        return object;
      },
    },
  };

  return c;
}

test('find filters ignored candidates and rejects invented IDs before returning originals', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ribbit-find-'));

  try {
    await writeFile(join(root, '.gitignore'), 'drop.ts\n');
    await writeFile(join(root, 'drop.ts'), 'no');
    await writeFile(join(root, 'keep.ts'), 'yes');
    await writeFile(join(root, 'other.ts'), 'y');
    const ok = ctx({ ids: ['1'] });

    try {
      const rows = (await executeAction(
        filesystemCommands.find.actions.run,
        null,
        { root, about: 'keep' },
        {},
        ok,
      )) as any[];

      expect(ok.payload).toContain('keep.ts');
      expect(ok.payload).not.toContain('drop.ts');
      expect(rows).toMatchObject([{ id: '1', value: { relativePath: 'keep.ts' } }]);
    } finally {
      ok.budget.close();
    }
    const bad = ctx({ ids: ['invented'] });

    try {
      await expect(
        executeAction(filesystemCommands.find.actions.run, null, { root, about: 'keep' }, {}, bad),
      ).rejects.toMatchObject({ code: 4 });
    } finally {
      bad.budget.close();
    }
    const over = ctx({ ids: ['1'] });

    over.llm.object = async () => {
      throw new Error('inference after budget');
    };
    try {
      await expect(
        executeAction(filesystemCommands.find.actions.run, null, { root, about: 'keep', maxFiles: 1 }, {}, over),
      ).rejects.toMatchObject({ code: 6 });
    } finally {
      over.budget.close();
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test('tree metadata-only makes no inference and describe requires a complete ID set', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ribbit-tree-'));

  try {
    await mkdir(join(root, 'sub'));
    await writeFile(join(root, 'a.txt'), 'a');
    await writeFile(join(root, 'sub', 'b.txt'), 'b');
    const quiet = ctx();

    quiet.llm.object = async () => {
      throw new Error('tree inference');
    };
    try {
      const value = (await executeAction(
        filesystemCommands.tree.actions.run,
        null,
        { root, depth: 3 },
        {},
        quiet,
      )) as any;

      expect(value.nodes.map((n: any) => n.value.relativePath).toSorted()).toEqual(['a.txt', 'sub', 'sub/b.txt']);
    } finally {
      quiet.budget.close();
    }
    const about = ctx({ ids: ['1'] });

    try {
      const value = (await executeAction(
        filesystemCommands.tree.actions.run,
        null,
        { root, about: 'a' },
        {},
        about,
      )) as any;
      const paths = value.nodes.map((n: any) => n.value.relativePath);

      expect(paths).toContain('a.txt');
    } finally {
      about.budget.close();
    }
    const describe = ctx({ descriptions: [{ id: 'missing', text: 'no' }] });

    try {
      await expect(
        executeAction(filesystemCommands.tree.actions.run, null, { root, describe: true }, {}, describe),
      ).rejects.toMatchObject({ code: 4 });
    } finally {
      describe.budget.close();
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
