import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as cube from './build-cube.mjs';

let out;
const spaces = () =>
  readdirSync(out)
    .filter((d) => existsSync(join(out, d, 'space.json')))
    .map((d) => {
      const space = JSON.parse(readFileSync(join(out, d, 'space.json'), 'utf8'));
      const res = Object.fromEntries(
        readdirSync(join(out, d, 'resources')).map((f) => {
          const r = JSON.parse(readFileSync(join(out, d, 'resources', f), 'utf8'));
          return [r.id, r];
        }),
      );
      return { space, res };
    });
const first = (title) => title.split('\n')[0];

before(() => {
  out = mkdtempSync(join(tmpdir(), 'cube-test-'));
  cube.build(out);
});

test('a Conclusion after the last Part is not absorbed into that Part', () => {
  const part4 = spaces().find(({ space }) => space.title.includes('Part Four'));
  const titles = Object.values(part4.res).map((r) => first(r.title));
  assert.ok(!titles.some((t) => t.startsWith('ch17')), `Part Four holds ${titles.join(' | ')}`);
  const chapters = spaces().find(({ space }) => space.title === 'Capital · Chapters');
  const partsMap = chapters.space.maps.find((m) => m.title === 'Parts');
  const onParts = Object.keys(partsMap.positions).map((id) => first(chapters.res[id].title));
  assert.ok(onParts.at(-1).startsWith('ch17'), `Parts map ends with ${onParts.at(-1)}`);
});

test('the concept-map caption overlaps no concept node', () => {
  for (const { space, res } of spaces().filter(({ space }) => space.title.endsWith('· Argument'))) {
    const m = space.maps.find((x) => x.title === 'Concept map');
    const rect = (id) => {
      const p = m.positions[id];
      return [p.x, p.y, p.x + (p.size?.width ?? 260), p.y + (p.size?.height ?? 146)];
    };
    const cap = Object.keys(m.positions).find((id) => res[id].title === 'Reading the map');
    const c = rect(cap);
    for (const id of Object.keys(m.positions).filter((id) => id !== cap)) {
      const r = rect(id);
      const overlap = r[0] < c[2] && r[2] > c[0] && r[1] < c[3] && r[3] > c[1];
      assert.ok(!overlap, `${space.title}: caption overlaps "${first(res[id].title)}"`);
    }
  }
});

test('the mermaid parser refuses a line it cannot read', () => {
  const src = '```mermaid\ngraph TD\n  A[Start] -->|drives| B[End]\n```\n';
  assert.throws(() => cube.mermaid(src), /mermaid/i);
});

test('two Resources with the same key in one Space are refused', () => {
  const sp = new cube.Space('test:duplicate', 'Duplicate');
  sp.ur('same', 'One');
  assert.throws(() => sp.ur('same', 'Two'), /duplicate/i);
});

test('a finished book missing from BOOKS is reported', () => {
  const root = mkdtempSync(join(tmpdir(), 'cube-books-'));
  mkdirSync(join(root, 'books/new-book/deep-read'), { recursive: true });
  writeFileSync(join(root, 'books/new-book/deep-read/synthesis.md'), '# x\n');
  mkdirSync(join(root, 'books/half-done'), { recursive: true });
  assert.equal(typeof cube.missingBooks, 'function', 'missingBooks is not exported');
  assert.deepEqual(cube.missingBooks(root), ['new-book']);
});
