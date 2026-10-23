const test=require('node:test');
const assert=require('node:assert/strict');
const {compile}=require('../lib/compiler.cjs');
test('font size and shadow classes produce real declarations',()=>{
 const r=compile({safelist:['text-2xl','shadow-md']});
 assert.equal(r.generated,2);
 assert.deepEqual(r.unknown,[]);
 assert.ok(r.css.includes('font-size:var(--sc-font-2xl)'));
 assert.ok(r.css.includes('box-shadow:var(--sc-shadow-md)'));
});
test('compiler CSS output uses actual newlines',()=>{
 const r=compile({safelist:['flex']});
 assert.ok(r.css.includes('\n:root{'));
 assert.ok(r.css.includes('\n.flex{display:flex}'));
});
