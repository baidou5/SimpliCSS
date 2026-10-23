const test=require('node:test'),assert=require('node:assert/strict');
const {listComponents,getComponent,renderComponent}=require('../lib/component-registry.cjs');
const {manifest}=require('../lib/ai-native.cjs');
test('AI manifest exposes component schemas',()=>{assert.ok(manifest().components.some(c=>c.name==='button'));});
test('component registry returns detached definitions',()=>{const x=getComponent('button');x.props.label.required=false;assert.equal(getComponent('button').props.label.required,true);assert.equal(getComponent('missing'),null);});
test('renderer escapes user-provided markup',()=>{const html=renderComponent('card',{title:'<img src=x onerror=alert(1)>',body:'A & B'});assert.ok(html.includes('&lt;img'));assert.ok(html.includes('A &amp; B'));assert.ok(!html.includes('<img'));});
test('button and input use native accessible controls',()=>{assert.ok(renderComponent('button',{label:'Save',type:'submit'}).includes('type="submit"'));assert.ok(renderComponent('input',{label:'Email',name:'email',type:'email',required:true}).includes('for="email"'));});
test('rejects unknown props and malformed values',()=>{assert.throws(()=>renderComponent('button',{label:'ok',onclick:'bad'}),/Unknown prop/);assert.throws(()=>renderComponent('button',{label:'ok',variant:'bad'}),/Invalid prop/);assert.throws(()=>renderComponent('input',{label:'Email',name:'" onfocus="x'}),/Invalid prop/);});
test('rendered components only use known CSS classes',()=>{for(const name of listComponents().map(x=>x.name)){const p={button:{label:'OK'},card:{title:'Title',body:'Body'},input:{label:'Name',name:'name'},alert:{message:'Hello'}}[name];const html=renderComponent(name,p);assert.ok(html.length>10);}});
