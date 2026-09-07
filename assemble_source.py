"""Reassemble the readable source convenience file from ordered parts."""
from pathlib import Path
ROOT=Path(__file__).resolve().parent
parts=sorted((ROOT/'src/readable_parts').glob('*.js'))
data=''.join(p.read_text(encoding='utf-8') for p in parts)
(ROOT/'src/game.js').write_text(data,encoding='utf-8')
print(f'wrote src/game.js ({len(data.encode()):,} bytes) from {len(parts)} parts')
