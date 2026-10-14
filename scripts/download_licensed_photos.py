#!/usr/bin/env python3
"""Download ONLY the listed Wikimedia Commons Creative Commons licensed photo assets.
Needs ordinary internet access; run in your own Antigravity/local terminal.
License attribution is mandatory; this is not a download of copyrighted artist portfolios.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import json, time
ROOT=Path(__file__).resolve().parents[1]
records=json.loads((ROOT/'data'/'portrait_sources.json').read_text())
records+=json.loads((ROOT/'data'/'licensed_work_photo_sources.json').read_text())
for item in records:
    if not item.get('downloadUrl') or not item.get('license'):
        continue
    output=ROOT/item['expectedFile']
    output.parent.mkdir(parents=True,exist_ok=True)
    if output.exists() and output.stat().st_size > 1000:
        print('EXISTS',output);continue
    try:
        req=Request(item['downloadUrl'], headers={'User-Agent':'CreaXaEducationalMediaIndexer/1.0 (Creative Commons attribution; via Wikimedia Commons)'})
        with urlopen(req,timeout=25) as response:
            content_type=response.headers.get('Content-Type','').lower()
            data=response.read(12_000_001)
        if len(data)>12_000_000 or 'image/' not in content_type:
            raise ValueError(f'Unexpected response type/size: {content_type}; {len(data)} bytes')
        import io
        from PIL import Image
        with Image.open(io.BytesIO(data)) as img:
            img.verify()
        output.write_bytes(data)
        print('DOWNLOADED',output,len(data),'bytes')
    except Exception as e:
        print('FAILED',item.get('creatorSlug') or item.get('artistSlug'),str(e))
    time.sleep(1)
print('Review image identity, licensing, attribution and personality rights before publishing.')
