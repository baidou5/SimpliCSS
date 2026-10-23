const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('src/simplicss-interactions.js','utf8');
const css=fs.readFileSync('src/simplicss-interactions.css','utf8');
test('interaction exports and expected keyboard handlers',()=>{
 for(const name of ['createModal','createTabs','createDropdown'])assert.ok(js.includes('export function '+name+'('));
 for(const key of ['Escape','ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'])assert.ok(js.includes(key));
});
test('native modal semantics and CSS focus support',()=>{
 assert.ok(js.includes('showModal()'));assert.ok(js.includes("addEventListener('close'"));
 assert.match(css,/:focus-visible/);assert.match(css,/::backdrop/);assert.match(css,/\[hidden\]/);
});
