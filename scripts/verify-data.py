#!/usr/bin/env python3
import json, pathlib, urllib.parse
root=pathlib.Path(__file__).resolve().parents[1]
creators=json.loads((root/'data/creators.json').read_text())
works=json.loads((root/'data/works.json').read_text())
assert len(creators)==10, 'Expected ten artists'
slugs={x['slug'] for x in creators}
assert len(slugs)==10
ids=set()
for c in creators:
    assert c['kind']=='external_editorial_reference'
    assert c['registeredOnCreaXa'] is False
    assert c['rate'] is None and c['availableForHire'] is None
for w in works:
    assert w['artistSlug'] in slugs
    assert w['id'] not in ids
    ids.add(w['id'])
    for u in [w['officialProjectUrl'],w['media']['videoEmbedUrl']]:
        if u:
            x=urllib.parse.urlsplit(u)
            assert x.scheme=='https' and x.hostname
    assert w['media']['imageUrl'] is None, 'Image media requires permission review'
print(f'PASS: {len(creators)} sourced editorial artist records, {len(works)} project records; no fabricated portrait media included')
