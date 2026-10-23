'use strict';
const fs=require('node:fs'),path=require('node:path');
const engine3=require('./engine3.cjs');
const defaults={
 colors:{primary:'#2563eb',secondary:'#475569',success:'#16a34a',danger:'#dc2626',surface:'#fff',ink:'#0f172a'},
 spacing:{0:'0',1:'0.25rem',2:'0.5rem',3:'0.75rem',4:'1rem',5:'1.25rem',6:'1.5rem',8:'2rem',10:'2.5rem',12:'3rem',16:'4rem'},
 screens:{sm:'640px',md:'768px',lg:'1024px',xl:'1280px'},
 radii:{none:'0',sm:'0.25rem',md:'0.5rem',lg:'0.75rem',xl:'1rem',full:'9999px'},
 fontSizes:{xs:'0.75rem',sm:'0.875rem',base:'1rem',lg:'1.125rem',xl:'1.25rem','2xl':'1.5rem','3xl':'1.875rem'},
 shadows:{sm:'0 1px 2px rgb(0 0 0 / 0.08)',md:'0 4px 8px rgb(0 0 0 / 0.12)',lg:'0 12px 24px rgb(0 0 0 / 0.16)'}
};
const fixed={
 flex:'display:flex',grid:'display:grid',block:'display:block',hidden:'display:none',inline:'display:inline','inline-block':'display:inline-block',
 'flex-row':'flex-direction:row','flex-col':'flex-direction:column','flex-wrap':'flex-wrap:wrap',
 'items-start':'align-items:flex-start','items-center':'align-items:center','items-end':'align-items:flex-end',
 'justify-start':'justify-content:flex-start','justify-center':'justify-content:center','justify-end':'justify-content:flex-end','justify-between':'justify-content:space-between',
 relative:'position:relative',absolute:'position:absolute',fixed:'position:fixed',sticky:'position:sticky',
 'w-full':'width:100%','h-full':'height:100%','w-auto':'width:auto','h-auto':'height:auto',
 'w-screen':'width:100vw','h-screen':'height:100vh','min-h-screen':'min-height:100vh',
 'overflow-hidden':'overflow:hidden','overflow-auto':'overflow:auto',
 'text-left':'text-align:left','text-center':'text-align:center','text-right':'text-align:right',
 'font-bold':'font-weight:700','font-semibold':'font-weight:600','font-normal':'font-weight:400',
 'cursor-pointer':'cursor:pointer','select-none':'user-select:none'
};
function makeTheme(custom={}){
 if(!custom||typeof custom!=='object'||Array.isArray(custom))throw Error('Theme must be an object');
 const t={};
 for(const key of Object.keys(defaults)){
  const extra=custom[key]||{};
  if(typeof extra!=='object'||Array.isArray(extra))throw Error('Invalid theme section '+key);
  t[key]={...defaults[key],...extra};
  for(const [name,value] of Object.entries(t[key])){
   if(!/^[\w-]+$/.test(name)||typeof value!=='string'||/[{};<>\\]/.test(value))throw Error('Invalid theme token '+name);
  }
 }
 if(custom.darkColors!==undefined){
  if(!custom.darkColors||typeof custom.darkColors!=='object'||Array.isArray(custom.darkColors))throw Error('Invalid darkColors');
  t.darkColors={};
  for(const [name,value] of Object.entries(custom.darkColors)){
   if(!Object.hasOwn(t.colors,name)||typeof value!=='string'||/[{};<>\\\\]/.test(value))throw Error('Invalid dark color');
   t.darkColors[name]=value;
  }
 }
 for(const x of Object.values(t.screens))if(!/^\d+(?:\.\d+)?(?:px|rem|em)$/.test(x))throw Error('Invalid breakpoint');
 return t;
}
function utility(name,t){
 if(Object.hasOwn(fixed,name))return fixed[name];
 const spacing=/^(m|mx|my|mt|mr|mb|ml|ms|me|p|px|py|pt|pr|pb|pl|ps|pe|gap|gap-x|gap-y)-([\w-]+)$/.exec(name);
 if(spacing&&Object.hasOwn(t.spacing,spacing[2])){
  const props={m:'margin',mx:'margin-inline',my:'margin-block',mt:'margin-top',mr:'margin-right',mb:'margin-bottom',ml:'margin-left',ms:'margin-inline-start',me:'margin-inline-end',p:'padding',px:'padding-inline',py:'padding-block',pt:'padding-top',pr:'padding-right',pb:'padding-bottom',pl:'padding-left',ps:'padding-inline-start',pe:'padding-inline-end',gap:'gap','gap-x':'column-gap','gap-y':'row-gap'};
  return props[spacing[1]]+':'+t.spacing[spacing[2]];
 }
 const color=/^(bg|text|border)-([\w-]+)$/.exec(name);
 if(color&&Object.hasOwn(t.colors,color[2]))return {bg:'background-color',text:'color',border:'border-color'}[color[1]]+':var(--sc-'+color[2]+')';
 const rounded=/^rounded-([\w-]+)$/.exec(name);
 if(rounded&&Object.hasOwn(t.radii,rounded[1]))return 'border-radius:'+t.radii[rounded[1]];
 const textSize=/^text-([\w-]+)$/.exec(name);
 if(textSize&&Object.hasOwn(t.fontSizes,textSize[1]))return 'font-size:var(--sc-font-'+textSize[1]+')';
 const shadow=/^shadow-([\w-]+)$/.exec(name);
 if(shadow&&Object.hasOwn(t.shadows,shadow[1]))return 'box-shadow:var(--sc-shadow-'+shadow[1]+')';
 const cols=/^grid-cols-(\d+)$/.exec(name);
 if(cols&&+cols[1]>=1&&+cols[1]<=24)return 'grid-template-columns:repeat('+cols[1]+',minmax(0,1fr))';
 const fraction=/^w-(\d+)\/(\d+)$/.exec(name);
 if(fraction&&+fraction[2]>0&&+fraction[2]<=24&&+fraction[1]<=+fraction[2])return 'width:'+(+fraction[1]/+fraction[2]*100).toFixed(6).replace(/\.?0+$/,'')+'%';
 return null;
}
// Engine 3 parser keeps the stable compiler API and legacy utility table.
function parseToken(token,theme){return engine3.compileToken(token,theme,utility);}
function extractClasses(source){return engine3.extractClasses(source);}
function globRegex(pattern){
 const input=pattern.replace(/\\/g,'/');
 let expression='^';
 const special='.+^$()|{}[]\\';
 for(let i=0;i<input.length;i++){
  const ch=input[i];
  if(ch==='*'){
   if(input[i+1]==='*'){
    i++;
    if(input[i+1]==='/'){i++;expression+='(?:.*/)?'}
    else expression+='.*';
   }else expression+='[^/]*';
  }else if(ch==='?')expression+='[^/]';
  else expression+=special.includes(ch)?'\\'+ch:ch;
 }
 return new RegExp(expression+'$');
}
function expandContentFiles(cwd,patterns){
 const root=path.resolve(cwd),collected=new Set();
 const ignored=new Set(['node_modules','.git','vendor','dist','coverage','.next','build']);
 const allowed=/\.(?:html?|jsx?|tsx?|vue|php)$/i;
 function within(p){return p===root||p.startsWith(root+path.sep)}
 function walk(dir,match){
  if(!fs.existsSync(dir))return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
   if(ignored.has(entry.name)||entry.isSymbolicLink())continue;
   const target=path.join(dir,entry.name);
   if(entry.isDirectory())walk(target,match);
   else if(entry.isFile()&&allowed.test(entry.name)&&match(path.relative(root,target).split(path.sep).join('/')))collected.add(target);
  }
 }
 for(const pattern of patterns){
  if(typeof pattern!=='string'||!pattern.trim())throw Error('Invalid content entry');
  const normalized=pattern.replace(/\\/g,'/').replace(/^\.\//,'');
  const wildcard=normalized.search(/[*?]/);
  const prefix=wildcard<0?normalized:normalized.slice(0,wildcard);
  const anchor=path.resolve(root,wildcard<0?normalized:prefix.replace(/\/?[^/]*$/,''));
  if(!within(anchor))throw Error('Content outside project');
  if(wildcard<0){
   if(!fs.existsSync(anchor))throw Error('Content path not found: '+pattern);
   if(fs.statSync(anchor).isDirectory())walk(anchor,()=>true);
   else collected.add(anchor);
  }else{
   const matcher=globRegex(normalized);
   walk(anchor,relative=>matcher.test(relative));
  }
 }
 return [...collected].sort();
}
function compile({sources=[],safelist=[],theme={}}={}){
 const t=makeTheme(theme),tokens=new Set(safelist),generated=[],unknown=[];
 for(const source of sources)for(const token of extractClasses(source))tokens.add(token);
 for(const token of [...tokens].sort()){const css=parseToken(token,t);if(css)generated.push(css);else unknown.push(token);}
 const vars=[
  ...Object.entries(t.colors).map(([k,v])=>'--sc-'+k+':'+v),
  ...Object.entries(t.fontSizes).map(([k,v])=>'--sc-font-'+k+':'+v),
  ...Object.entries(t.shadows).map(([k,v])=>'--sc-shadow-'+k+':'+v)
 ].join(';');
 const dark=t.darkColors||{};
 const darkRules=Object.keys(dark).length?'.dark, [data-theme="dark"]{'+Object.entries(dark).map(([k,v])=>'--sc-'+k+':'+v).join(';')+'}\n':'';
 return {css:'/* SimpliCSS 2 generated utilities */\n:root{'+vars+'}\n'+darkRules+generated.join('\n')+'\n',generated:generated.length,unknown};
}
function build({cwd=process.cwd(),configFile='simplicss.config.json'}={}){
 const root=path.resolve(cwd);
 const file=path.resolve(root,configFile);
 if(!file.startsWith(root+path.sep)&&file!==root)throw Error('Config outside project');
 const config=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
 const patterns=config.content||['./index.html'];
 if(!Array.isArray(patterns))throw Error('content must be file paths');
 const paths=expandContentFiles(root,patterns);
 const result=compile({sources:paths.map(x=>fs.readFileSync(x,'utf8')),safelist:config.safelist||[],theme:config.theme||{}});
 const output=path.resolve(root,config.output||'dist/simplicss.generated.css');
 if(!output.startsWith(root+path.sep))throw Error('Output outside project');
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,result.css);
 return {...result,output,filesScanned:paths.length};
}
module.exports={compile,build,extractClasses,expandContentFiles,parseToken,makeTheme};
