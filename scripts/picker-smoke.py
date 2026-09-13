"""Exercise the real fzf backend on an isolated controlling PTY."""
import os, pty, select, signal, tempfile, time, json
from pathlib import Path
binary=str(Path('dist/ribbit').resolve())
with tempfile.TemporaryDirectory(prefix='ribbit-picker-') as scratch:
    source=Path(scratch)/'input.jsonl'
    hostile='chosen\tlabel\n\x1b[31m --bind=enter:execute(touch NEVER)'
    source.write_text(json.dumps(hostile)+'\n'+json.dumps('other')+'\n')
    results=[]
    for cancel in [False,True]:
        dest=Path(scratch)/('cancel.out' if cancel else 'selected.out')
        pid,fd=pty.fork()
        if pid==0:
            out=os.open(dest,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
            os.dup2(out,1);os.close(out)
            os.environ['TERM']='xterm-256color'
            os.execv(binary,[binary,'pick','--file',str(source),'--input','jsonl','--output','jsonl','--query','chosen'])
        started=time.monotonic(); sent=False;status=None;screen=b''
        while time.monotonic()-started<10:
            readable,_,_=select.select([fd],[],[],.1)
            if readable:
                try:screen+=os.read(fd,65536)
                except OSError:pass
            if not sent and time.monotonic()-started>1:
                os.write(fd,b'\x1b' if cancel else b'\r');sent=True
            done,status=os.waitpid(pid,os.WNOHANG)
            if done:break
        else:
            os.kill(pid,signal.SIGKILL);os.waitpid(pid,0);raise RuntimeError('Picker timed out')
        os.close(fd)
        code=os.waitstatus_to_exitcode(status)
        output=dest.read_text()
        assert code==(130 if cancel else 0),(code,screen[-1500:])
        if cancel:assert output==''
        else:assert json.loads(output)==hostile,output
        results.append({'cancel':cancel,'exit':code,'identityPreserved':not cancel,'stdoutClean':True})
    print(json.dumps({'schemaVersion':1,'backend':'fzf','results':results},indent=2))
