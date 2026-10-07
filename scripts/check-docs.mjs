import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const pages = (await readdir(root)).filter(file => file.endsWith('.html'));
const archive = (await readdir(new URL('versions/1.0/', root))).filter(file => file.endsWith('.html')).map(file => 'versions/1.0/' + file);
for (const page of [...pages, ...archive]) {
    const url = new URL(page, root);
    const html = await readFile(url, 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, page + ': unique anchors');
    for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
        const ref = match[1];
        if (/^(?:https?:|mailto:|data:|javascript:)/.test(ref) || ref === '#' || !ref) continue;
        const target = new URL(ref, url);
        const hash = target.hash; target.hash = '';
        await access(target).catch(() => assert.fail(page + ': missing local target ' + ref));
        if (hash && target.pathname.endsWith('.html')) {
            const destination = await readFile(target, 'utf8');
            assert.ok(destination.includes('id="' + decodeURIComponent(hash.slice(1)) + '"'), page + ': missing anchor ' + ref);
        }
    }
}
console.log('Local targets, image paths and unique/linked anchors passed for ' + (pages.length + archive.length) + ' pages.');
