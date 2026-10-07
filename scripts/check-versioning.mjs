import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const script = new URL('assets/js/main.js', root);
const source = await readFile(script, 'utf8');
let offline = false;
const context = vm.createContext({
    URL,
    document: { currentScript: { src: script.href }, addEventListener() {} },
    localStorage: { getItem() { return null; } },
    fetch: async target => {
        if (offline) throw new Error('Offline');
        return { ok: true, text: () => readFile(new URL(target), 'utf8') };
    },
    DOMParser: class {
        parseFromString(html) {
            const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
            return { getElementById: id => ids.has(id) };
        }
    }
});
vm.runInContext(source, context);

const pages = (await readdir(new URL('versions/1.0/', root))).filter(page => page.endsWith('.html'));
for (const page of pages) {
    // Each page must switch both ways, including a GitHub Pages project prefix.
    for (const base of ['https://medinet.example/', 'https://example.github.io/MediNet/docs/', root.href]) {
        const sharedScript = new URL('assets/js/main.js', base).href;
        const current = new URL(page + '?source=docs', base).href;
        const archived = new URL('versions/1.0/' + page + '?source=docs', base).href;
        assert.equal(context.documentationVersionTarget(current, sharedScript, '1.0').href, archived);
        assert.equal(context.documentationVersionTarget(archived, sharedScript, '2.0').href, current);
    }
    // Confirm the archived destination is present and still loads shared assets.
    const archive = await readFile(new URL('versions/1.0/' + page, root), 'utf8');
    assert.match(archive, /src="..\/..\/assets\/js\/main.js"/);
    assert.match(archive, /href="..\/..\/assets\/css\/style.css"/);
}
const base = 'https://example.github.io/MediNet/';
assert.equal(context.documentationVersionTarget(base + 'changelog.html#release-2', new URL('assets/js/main.js', base), '1.0').href, base + 'versions/1.0/index.html');
assert.equal(context.documentationVersionTarget(base, new URL('assets/js/main.js', base), '1.0').href, base + 'versions/1.0/index.html');
assert.equal(context.documentationVersionTarget(base + 'versions/1.0/', new URL('assets/js/main.js', base), '2.0').href, base + 'index.html');

const guide = new URL('user-guide.html', root);
const archiveGuide = new URL('versions/1.0/user-guide.html', root);
const archivedHTML = await readFile(archiveGuide, 'utf8');
const sharedHTML = await readFile(guide, 'utf8');
const currentIDs = new Set([...sharedHTML.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
const commonID = [...archivedHTML.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]).find(id => currentIDs.has(id));
assert.ok(commonID, 'The guide retains at least one section anchor across versions');
guide.hash = commonID;
assert.equal(await context.documentationVersionLink(guide.href, script.href, '1.0'), archiveGuide.href + '#' + commonID);
guide.hash = 'section-that-does-not-exist';
assert.equal(await context.documentationVersionLink(guide.href, script.href, '1.0'), archiveGuide.href);
offline = true;
guide.hash = commonID;
assert.equal(await context.documentationVersionLink(guide.href, script.href, '1.0'), archiveGuide.href);

const rootCases = await readFile(new URL('use-cases.html', root), 'utf8');
const archivedCases = await readFile(new URL('versions/1.0/use-cases.html', root), 'utf8');
const caseIDs = html => new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
const originalCaseIDs = caseIDs(archivedCases);
const currentCaseIDs = caseIDs(rootCases);
for (const id of originalCaseIDs) assert.ok(currentCaseIDs.has(id), 'Preserve original use-case anchor: ' + id);
for (const id of ['fig-1', 'fig-2', 'fig-4', ...Array.from({ length: 7 }, (_, i) => 'step-' + (i + 1))]) {
    assert.ok(originalCaseIDs.has(id) && currentCaseIDs.has(id), 'Use-case section and figure exist in both versions: ' + id);
}
assert.match(source, /v2\.0\.1 · Stable/);
assert.match(source, /v1\.0 · Stable/);
assert.doesNotMatch(source, /documentation-archive-notice|You are reading archived/);

console.log('Version checks passed for ' + pages.length + ' pages: root, project subpaths, local files, archive assets, valid/missing/offline anchors.');
