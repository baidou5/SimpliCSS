'use strict';
const fs=require('node:fs'),path=require('node:path');
const defaults={
 colors:{primary:'#2563eb',secondary:'#475569',success:'#16a34a',danger:'#dc2626',surface:'#fff',ink:'#0f172a'},
 spacing:{0:'0',1:'0.25rem',2:'0.5rem',3:'0.75rem',4:'1rem',5:'1.25rem',6:'1.5rem',8:'2rem',10:'2.5rem',12:'3rem',16:'4rem'},
 screens:{sm:'640px',md:'768px',lg:'1024px',xl:'1280px'},
 radii:{none:'0',sm:'0.25rem',md:'0.5rem',lg:'0.75rem',xl:'1rem',full:'9999px'}
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
 const cols=/^grid-cols-(\d+)$/.exec(name);
 if(cols&&+cols[1]>=1&&+cols[1]<=24)return 'grid-template-columns:repeat('+cols[1]+',minmax(0,1fr))';
 const fraction=/^w-(\d+)\/(\d+)$/.exec(name);
 if(fraction&&+fraction[2]>0&&+fraction[2]<=24&&+fraction[1]<=+fraction[2])return 'width:'+(+fraction[1]/+fraction[2]*100).toFixed(6).replace(/\.?0+$/,'')+'%';
 return null;
}
function parseToken(token,t){
 if(typeof token!=='string'||token.length>180||!/^[\w:\/-]+$/.test(token))return null;
 const parts=token.split(':'),name=parts.pop();
 if(parts.length>3||new Set(parts).size!==parts.length)return null;
 const screen=parts.filter(x=>Object.hasOwn(t.screens,x));
 const state=parts.filter(x=>['hover','focus','active','disabled','focus-visible'].includes(x));
 if(screen.length>1||state.length>1||parts.some(x=>!Object.hasOwn(t.screens,x)&&!['hover','focus','active','disabled','focus-visible','dark','rtl'].includes(x)))return null;
 const rule=utility(name,t);if(!rule)return null;
 let selector='.'+token.replace(/([^a-zA-Z0-9_-])/g,'\\$1');
 if(state.length)selector+=':'+state[0];
 if(parts.includes('dark'))selector='.dark '+selector+', [data-theme="dark"] '+selector;
 if(parts.includes('rtl'))selector='[dir="rtl"] '+selector;
 let css=selector+'{'+rule+'}';
 if(screen.length)css='@media (min-width:'+t.screens[screen[0]]+'){'+css+'}';
 return css;
}
function extractClasses(source){
 const tokens=new Set(),regex=/\b(?:class|className)\s*=\s*["']([^"']*)["']/g;
 for(let m;(m=regex.exec(source));)for(const token of m[1].split(/\s+/))if(token)tokens.add(token);
 return tokens;
}
function compile({sources=[],safelist=[],theme={}}={}){
 const t=makeTheme(theme),tokens=new Set(safelist),generated=[],unknown=[];
 for(const source of sources)for(const token of extractClasses(source))tokens.add(token);
 for(const token of [...tokens].sort()){const css=parseToken(token,t);if(css)generated.push(css);else unknown.push(token);}
 const vars=Object.entries(t.colors).map(([k,v])=>'--sc-'+k+':'+v).join(';');
 return {css:'/* SimpliCSS 2 generated utilities */\n:root{'+vars+'}\n'+generated.join('\n')+'\n',generated:generated.length,unknown};
}
function build({cwd=process.cwd(),configFile='simplicss.config.json'}={}){
 const file=path.resolve(cwd,configFile),config=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
 const paths=config.content||['./index.html'];
 if(!Array.isArray(paths)||!paths.every(x=>typeof x==='string'))throw Error('content must be file paths');
 const result=compile({sources:paths.map(x=>fs.readFileSync(path.resolve(cwd,x),'utf8')),safelist:config.safelist||[],theme:config.theme||{}});
 const output=path.resolve(cwd,config.output||'dist/simplicss.generated.css');
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,result.css);
 return {...result,output};
}
module.exports={compile,build,extractClasses,parseToken,makeTheme};
