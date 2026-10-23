const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const css=fs.readFileSync('src/simplicss-ui.css','utf8');
test('button variants and keyboard focus states exist',()=>{
 for(const name of ['sc-btn','sc-btn-primary','sc-btn-secondary','sc-btn-outline','sc-btn-sm','sc-btn-lg'])assert.match(css,new RegExp('\\.'+name+'[{: ]'));
 assert.match(css,/:focus-visible/);
});
test('form controls include invalid and disabled states',()=>{
 for(const name of ['sc-input','sc-select','sc-textarea'])assert.ok(css.includes('.'+name));
 assert.match(css,/aria-invalid/);assert.match(css,/:disabled/);
});
test('dark, RTL logical properties and reduced motion',()=>{
 assert.match(css,/\[data-theme="dark"\]/);
 assert.match(css,/border-inline-start/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
