"""Linux peak RSS for the unchanged 100k-small-record workload."""
import subprocess,tempfile,json,time,platform
from pathlib import Path
binary=str(Path('dist/ribbit').resolve())
with tempfile.TemporaryDirectory(prefix='ribbit-memory-') as tmp:
    data=Path(tmp)/'data.jsonl'
    with data.open('w') as f:
        for i in range(100000):f.write(json.dumps({'n':i,'label':'small-record'})+'\n')
    empty=Path(tmp)/'empty.jsonl';empty.write_text('')
    results=[]
    def measure(command,source):
        with source.open('rb') as stdin:
            p=subprocess.Popen([binary,*command,'--input','jsonl','--output','jsonl'],stdin=stdin,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
            peak=0
            while p.poll() is None:
                try:
                    lines=Path(f'/proc/{p.pid}/status').read_text().splitlines()
                    peak=max([peak]+[int(line.split()[1])*1024 for line in lines if line.startswith('VmHWM:')])
                except (FileNotFoundError,ProcessLookupError):pass
                time.sleep(.002)
            assert p.returncode==0,p.stderr.read()
            return peak
    for command in [['take','100000'],['select','n']]:
        baselines=[measure(command,empty) for _ in range(3)]
        peaks=[measure(command,data) for _ in range(3)]
        incremental=max(peaks)-min(baselines)
        results.append({'command':command,'records':100000,'baselinePeakRSSBytes':baselines,'workloadPeakRSSBytes':peaks,'incrementalRSSBytes':incremental,'incrementalUnder128MiB':incremental<=128*1024*1024})
    report={'schemaVersion':1,'platform':platform.platform(),'results':results,'note':'Same argv with empty input versus 100k records; maximum workload peak minus minimum empty-input peak across three runs. /proc sampling every 2ms.'}
    Path('benchmarks').mkdir(exist_ok=True)
    Path('benchmarks/stream-linux.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
