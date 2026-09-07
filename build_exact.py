"""Rebuild the exact js13k submission ZIP from the checked-in packed intermediate.
This path is deterministic and requires only Python 3 + zopfli.
Readable gameplay source lives in src/game.js.
"""
from pathlib import Path
import binascii, struct, zipfile
import zopfli.zlib
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'dist'
LIMIT=13_312
def make_zip(data:bytes)->bytes:
    compressed=zopfli.zlib.compress(data,numiterations=50)[2:-4]
    name=b'index.html'; crc=binascii.crc32(data)&0xffffffff
    date=((2026-1980)<<9)|(9<<5)|7
    local=struct.pack('<IHHHHHIIIHH',0x04034b50,20,0,8,0,date,crc,len(compressed),len(data),len(name),0)+name
    central=struct.pack('<IHHHHHHIIIHHHHHII',0x02014b50,20,20,0,8,0,date,crc,len(compressed),len(data),len(name),0,0,0,0,0o644<<16,0)+name
    end=struct.pack('<IHHHHIIH',0x06054b50,0,0,1,1,len(central),len(local)+len(compressed),0)
    return local+compressed+central+end
def main():
    OUT.mkdir(exist_ok=True)
    template=(ROOT/'src/template.html').read_text(encoding='utf-8')
    packed=(ROOT/'dist/game.packed.js').read_text(encoding='utf-8')
    data=template.replace('/*GAME*/',packed).encode()
    pkg=make_zip(data)
    if len(pkg)>LIMIT: raise SystemExit(f'NOT SUBMITTABLE: {len(pkg)} bytes')
    (OUT/'index.html').write_bytes(data)
    z=OUT/'STEAL_THE_RAINBOW_js13k_SUBMIT.zip'; z.write_bytes(pkg)
    with zipfile.ZipFile(z) as a:
        assert a.namelist()==['index.html']; assert a.read('index.html')==data; assert a.testzip() is None
    print(f'SUBMISSION ZIP: {len(pkg):,} / {LIMIT:,} bytes; {LIMIT-len(pkg)} bytes free')
if __name__=='__main__': main()
