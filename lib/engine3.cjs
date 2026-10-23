'use strict';
/**
 * SimpliCSS Engine 3 tokenizer + variant parser.
 * Explicitly supports a safe subset of CSS arbitrary values.
 */
const MAX_TOKEN_LENGTH=240;
const STATES=Object.freeze({
 hover:':hover',focus:':focus','focus-visible':':focus-visible',
 active:':active',disabled:':disabled',checked:':checked',
 required:':required',invalid:':invalid',visited:':visited',
 first:':first-child',last:':last-child',odd:':nth-child(odd)',
 even:':nth-child(even)'
});
const ARBITRARY_PROPERTIES=Object.freeze({
 w:'width',h:'height','min-w':'min-width','max-w':'max-width',
 'min-h':'min-height','max-h':'max-height',
 p:'padding',px:'padding-inline',py:'padding-block',
 pt:'padding-top',pb:'padding-bottom',pl:'padding-left',pr:'padding-right',
 m:'margin',mx:'margin-inline',my:'margin-block',
 mt:'margin-top',mb:'margin-bottom',ml:'margin-left',mr:'margin-right',
 gap:'gap','gap-x':'column-gap','gap-y':'row-gap',
 bg:'background-color',text:'color',border:'border-color',
 rounded:'border-radius','grid-cols':'grid-template-columns',
 opacity:'opacity',z:'z-index',leading:'line-height',
 tracking:'letter-spacing',top:'top',left:'left',right:'right',bottom:'bottom',inset:'inset'
});
function splitOutsideBrackets(value,separator=':'){
 let depth=0,result=[],chunk='';
 for(const ch of value){
  if(ch==='[')depth++;
  if(ch===']'){depth--;if(depth<0)return null;}
  if(ch===separator&&depth===0){result.push(chunk);chunk='';}
  else chunk+=ch;
 }
 if(depth!==0)return null;
 result.push(chunk);
 return result;
}
function escapeSelector(value){return value.replace(/([^a-zA-Z0-9_-])/g,'\\$1')}
function normalizeArbitraryValue(raw){
 if(!raw||raw.length>128)return null;
 if(/[;{}<>\\'\"@]/.test(raw)||raw.includes(String.fromCharCode(96))||/url\s*\(|expression\s*\(/i.test(raw))return null;
 if(!/^[a-zA-Z0-9#%(),.+\-*/_]+$/.test(raw))return null;
 let depth=0;
 for(const ch of raw){if(ch==='(')depth++;if(ch===')')depth--;if(depth<0||depth>4)return null;}
 if(depth!==0)return null;
 const normalized=raw.replace(/_/g,' ');
 if(/\b(?:javascript|data|vbscript)\s*:/i.test(normalized))return null;
 return normalized;
}
function arbitraryDeclaration(name){
 const match=/^([a-z][a-z0-9-]*)-\[(.+)\]$/.exec(name);
 if(!match||!Object.hasOwn(ARBITRARY_PROPERTIES,match[1]))return null;
 const value=normalizeArbitraryValue(match[2]);
 if(value===null)return null;
 // Typed inference for ambiguous Tailwind-style text/border utilities.
 const isLength=/^-?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)(?:px|rem|em|vw|vh|ch|ex|%)$/.test(value)||
  /^(?:clamp|min|max|calc)\(/.test(value);
 const property=match[1]==='text'&&isLength?'font-size':
  match[1]==='border'&&isLength?'border-width':ARBITRARY_PROPERTIES[match[1]];
 return property+':'+value;
}
function compileToken(token,theme,standardUtility){
 if(typeof token!=='string'||token.length>MAX_TOKEN_LENGTH)return null;
 const chunks=splitOutsideBrackets(token);
 if(!chunks||chunks.some(x=>!x)||chunks.length>7)return null;
 const name=chunks.pop(),variants=chunks;
 if(!/^[a-zA-Z][\w\/-]*$/.test(name)&&!/^[a-z][a-z0-9-]*-\[[^\]]+\]$/.test(name))return null;
 const seen=new Set();let screen=null;
 for(const variant of variants){
  if(seen.has(variant))return null;seen.add(variant);
  if(Object.hasOwn(theme.screens,variant)){if(screen)return null;screen=variant;}
  else if(!Object.hasOwn(STATES,variant)&&!['dark','rtl','ltr','group-hover','peer-checked'].includes(variant))return null;
 }
 if(seen.has('rtl')&&seen.has('ltr'))return null;
 const declaration=arbitraryDeclaration(name)||standardUtility(name,theme);
 if(!declaration)return null;
 let selectors=['.'+escapeSelector(token)];
 for(const variant of variants){
  if(Object.hasOwn(STATES,variant))selectors=selectors.map(s=>s+STATES[variant]);
 }
 if(seen.has('group-hover'))selectors=selectors.map(s=>'.group:hover '+s);
 if(seen.has('peer-checked'))selectors=selectors.map(s=>'.peer:checked ~ '+s);
 // Dark and direction attributes often share the same HTML root element.
 // Emit both same-ancestor and nested-ancestor forms for reliable composition.
 if(seen.has('dark')&&(seen.has('rtl')||seen.has('ltr'))){
  const dir=seen.has('rtl')?'rtl':'ltr';
  selectors=selectors.flatMap(s=>[
   '[dir="'+dir+'"].dark '+s,
   '[dir="'+dir+'"][data-theme="dark"] '+s,
   '[dir="'+dir+'"] .dark '+s,
   '[dir="'+dir+'"] [data-theme="dark"] '+s,
   '.dark [dir="'+dir+'"] '+s,
   '[data-theme="dark"] [dir="'+dir+'"] '+s
  ]);
 }else{
  if(seen.has('dark'))selectors=selectors.flatMap(s=>['.dark '+s,'[data-theme="dark"] '+s]);
  if(seen.has('rtl'))selectors=selectors.map(s=>'[dir="rtl"] '+s);
  if(seen.has('ltr'))selectors=selectors.map(s=>'[dir="ltr"] '+s);
 }
 let output=selectors.join(', ')+'{'+declaration+'}';
 if(screen)output='@media (min-width:'+theme.screens[screen]+'){'+output+'}';
 return output;
}
function addTokens(set,value){
 for(const token of value.split(/\s+/)){
  if(token&&token.length<=MAX_TOKEN_LENGTH&&/^[a-zA-Z][\w:\/\-\[\]#%.(),+*]+$/.test(token))set.add(token);
 }
}
function extractClasses(source){
 if(typeof source!=='string')throw new TypeError('Source must be a string');
 const found=new Set();
 // Static quoted HTML, Blade, Vue and JSX. Dynamic bindings are intentionally excluded.
 const attributes=/(?:^|[\s<])(?:class|className)\s*=\s*(["'])([\s\S]*?)\1/g;
 for(const match of source.matchAll(attributes))addTokens(found,match[2]);
 // React literal expression syntax: className={'foo'} / className={"foo"}.
 const jsx=/\bclassName\s*=\s*\{\s*(["'])([^"'\n]*)\1\s*\}/g;
 for(const match of source.matchAll(jsx))addTokens(found,match[2]);
 return found;
}
module.exports={extractClasses,compileToken,splitOutsideBrackets,
 normalizeArbitraryValue,arbitraryDeclaration,escapeSelector};
