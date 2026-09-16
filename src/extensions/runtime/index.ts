import { executeAction, type Action, type Context } from '../../sdk/index.ts';
import { loadInstalled } from '../install/index.ts';
import { RibbitError } from '../../engine/records/index.ts';

export async function dispatch(
  command: { actions: Record<string, Action> },
  action: string,
  input: unknown,
  args: unknown,
  config: unknown,
  ctx: Context,
) {
  if (!Object.hasOwn(command.actions, action)) throw new RibbitError(2, 'Unknown action');

  return executeAction(command.actions[action], input, args, config, ctx);
}

export async function dispatchInstalled(
  type: string,
  action: string,
  input: unknown,
  args: unknown,
  config: unknown,
  ctx: Context,
  home?: string,
) {
  return dispatch(await loadInstalled(type, home), action, input, args, config, ctx);
}
