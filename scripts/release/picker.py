"""Run the packaged picker on a real controlling terminal; stdout remains separate."""
import json, os, pty, select, signal, sys, tempfile, time

args = json.loads(sys.argv[1])
cancel = sys.argv[2] == 'cancel'
with tempfile.TemporaryDirectory(prefix='ribbit-pty-') as directory:
    output = os.path.join(directory, 'output')
    pid, fd = pty.fork()
    if pid == 0:
        stream = os.open(output, os.O_WRONLY | os.O_CREAT, 0o600)
        os.dup2(stream, 1)
        os.close(stream)
        os.execv(args[0], args)
    start = time.monotonic()
    last_output = start
    screen = b''
    sent = False
    try:
        while time.monotonic() - start < 120:
            ready, _, _ = select.select([fd], [], [], .1)
            if ready:
                try:
                    chunk = os.read(fd, 65536)
                    screen += chunk
                    if chunk:
                        last_output = time.monotonic()
                except OSError:
                    pass
            if screen and not sent and time.monotonic() - last_output > .6:
                os.write(fd, b'\x1b' if cancel else b'\r')
                sent = True
            done, status = os.waitpid(pid, os.WNOHANG)
            if done:
                print(json.dumps({'code': os.waitstatus_to_exitcode(status), 'out': open(output).read(), 'screen': screen.decode(errors='replace')}))
                break
        else:
            os.kill(pid, signal.SIGKILL)
            os.waitpid(pid, 0)
            raise RuntimeError('Picker timed out')
    finally:
        os.close(fd)
