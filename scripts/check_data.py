from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
creators=json.loads((R/'data'/'creators.json').read_text())
works=json.loads((R/'data'/'works-enriched.json').read_text())
pics=json.loads((R/'data'/'portrait_sources.json').read_text())
vids=json.loads((R/'data'/'video_sources.json').read_text())
assert len(creators)==10 and len(pics)==10
slugs={c['slug'] for c in creators}
assert len(slugs)==10
assert all(w['artistSlug'] in slugs for w in works)
assert all(v['artistSlug'] in slugs for v in vids)
assert len({w['id'] for w in works})==len(works)
assert all(not v.get('embedUrl') or v['embedUrl'].startswith('https://player.vimeo.com/video/') for v in vids)
print('PASS:',len(creators),'creators,',len(works),'works,',len(pics),'portrait sources,',len(vids),'video records')
print('External media playback and portrait URLs must be checked in the real deployment; this script checks data only.')
