"""Installed runtime checks; no provider or network calls; raw startup samples retained."""
import hashlib, json, os, pathlib, platform, shutil, signal, subprocess, tempfile, time
ROOT = pathlib.Path(__file__).resolve().parent
installed = ROOT / 'dist/install'
results = {'platform': platform.platform(), 'machine': platform.machine(), 'samples': {}}
with tempfile.TemporaryDirectory(prefix='ribbit-runtime-') as temp:
    home = pathlib.Path(temp)
    target = home / 'install'
    shutil.copytree(installed, target)
    # No source or node_modules is copied to the installed consumer.
    sentinel = home / 'imports'
    env = {**os.environ, 'RIBBIT_SPIKE_SENTINEL': str(sentinel), 'HTTP_PROXY': 'http://127.0.0.1:1', 'HTTPS_PROXY': 'http://127.0.0.1:1'}
    for name in ['ribbit-node', 'ribbit-bun']:
        executable = str(target / name)
        def run(*args):
            return subprocess.run([executable, *args], cwd=home, env=env, capture_output=True, text=True, timeout=10)
        samples = []
        for i in range(31):
            start = time.perf_counter()
            result = run('describe', str(target))
            samples.append((time.perf_counter() - start) * 1000)
            assert result.returncode == 0, result.stderr
            assert json.loads(result.stdout)['schemaVersion'] == 1
        assert not sentinel.exists(), 'discovery imported executable extension'
        result = run('run', str(target), 'typed', '2')
        assert result.returncode == 0 and result.stdout == '0:typed\n1:typed\n', result
        assert sentinel.read_text() == 'imported\n'
        sentinel.unlink()
        result = run('run', str(target), 'typed', '0')
        assert result.returncode != 0 and result.stdout == '', result
        sentinel.unlink()
        proc = subprocess.Popen([executable, 'run', str(target), 'cancel', '100'], cwd=home, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        first = proc.stdout.readline()
        assert first == '0:cancel\n', first
        proc.send_signal(signal.SIGINT)
        rest, err = proc.communicate(timeout=3)
        assert proc.returncode == 130, (proc.returncode, rest, err)
        assert len(rest.splitlines()) < 99
        sentinel.unlink()
        warm = sorted(samples[1:])
        results['samples'][name] = {'firstProcessMs': samples[0], 'warmMs': samples[1:], 'warmP95Ms': warm[28], 'checks': ['installed execution', 'manifest import sentinel', 'argument validation', 'streaming', 'SIGINT 130'], 'sha256': hashlib.sha256((target/name).read_bytes()).hexdigest()}
print(json.dumps(results, indent=2))
