const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/SimpliCSS.css', 'utf8');
const dist = fs.readFileSync('dist/SimpliCSS.css', 'utf8');

test('distributed framework contains core utilities', () => {
  for (const selector of ['.rounded-lg', '.grid-cols-12', '.text-blue', '.md\\:flex-row']) {
    assert.ok(dist.includes(selector), 'Missing distribution utility: ' + selector);
  }
});

test('spacing scale increases consistently', () => {
  assert.match(source, /\.m-4\s*\{\s*margin:\s*32px;/);
});

test('responsive variants do not escape media queries', () => {
  const prelude = source.split('/* Responsive utilities: mobile-first')[0];
  assert.doesNotMatch(prelude, /\.(?:sm|md|lg)\\:/);
  assert.doesNotMatch(source, /@media\s*\(max-width:/);
  assert.match(source, /@media\s*\(min-width:\s*640px\)/);
  assert.match(source, /@media\s*\(min-width:\s*768px\)/);
  assert.match(source, /@media\s*\(min-width:\s*1024px\)/);
});
