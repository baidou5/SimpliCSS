/* SimpliCSS UI interactions — browser ESM, no dependencies */
const focusable='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const visible = el => !!(el.getClientRects().length);
function getFocusables(root){return [...root.querySelectorAll(focusable)].filter(el=>visible(el)&&!el.closest('[inert]'))}
export function createModal(dialog,{trigger=null}={}){
 if(!(dialog instanceof HTMLDialogElement))throw new TypeError('Modal requires a native <dialog> element');
 let returnTo=null;
 function open(){if(dialog.open)return;returnTo=trigger||document.activeElement;dialog.showModal();(dialog.querySelector('[autofocus]')||getFocusables(dialog)[0]||dialog).focus()}
 function close(){if(dialog.open)dialog.close()}
 const onClick=e=>{if(e.target.closest('[data-sc-modal-close]'))close()};
 const onClosed=()=>{if(returnTo?.isConnected&&typeof returnTo.focus==='function')returnTo.focus()};
 dialog.addEventListener('click',onClick);
 dialog.addEventListener('close',onClosed);
 return {open,close,destroy(){dialog.removeEventListener('click',onClick);dialog.removeEventListener('close',onClosed)}};
}
export function createTabs(root){
 const tabs=[...root.querySelectorAll('[role="tab"]')].filter(x=>x.closest('[role="tablist"]')?.parentElement===root);
 if(!tabs.length)throw new Error('Tabs require a tablist with tabs');
 const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')||''));
 function activate(index,{focus=false}={}){
  if(index<0||index>=tabs.length||tabs[index].disabled||!panels[index])return;
  tabs.forEach((tab,i)=>{const on=i===index;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;if(panels[i])panels[i].hidden=!on});
  if(focus)tabs[index].focus();
 }
 const onClick=e=>{const index=tabs.indexOf(e.target.closest('[role="tab"]'));if(index>=0)activate(index)};
 const onKey=e=>{
  const index=tabs.indexOf(e.target);if(index<0)return;
  const vertical=tabs[index].parentElement.getAttribute('aria-orientation')==='vertical';
  const next=vertical?'ArrowDown':'ArrowRight',prev=vertical?'ArrowUp':'ArrowLeft';
  let target;
  if(e.key===next||e.key===prev){const dir=e.key===next?1:-1;for(let n=1;n<=tabs.length;n++){const k=(index+dir*n+tabs.length*n)%tabs.length;if(!tabs[k].disabled){target=k;break}}}
  else if(e.key==='Home')target=tabs.findIndex(t=>!t.disabled);
  else if(e.key==='End')target=tabs.findLastIndex(t=>!t.disabled);
  if(target!==undefined&&target>=0){e.preventDefault();activate(target,{focus:true})}
 };
 root.addEventListener('click',onClick);root.addEventListener('keydown',onKey);
 const selected=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'&&!t.disabled);
 activate(selected>=0?selected:tabs.findIndex(t=>!t.disabled));
 return {activate,destroy(){root.removeEventListener('click',onClick);root.removeEventListener('keydown',onKey)}};
}
export function createDropdown(trigger,menu){
 if(!trigger||!menu)throw new Error('Dropdown needs trigger and menu');
 trigger.setAttribute('aria-haspopup','true');trigger.setAttribute('aria-expanded','false');
 menu.hidden=true;
 function close({restoreFocus=false}={}){menu.hidden=true;trigger.setAttribute('aria-expanded','false');if(restoreFocus)trigger.focus()}
 function open({focus=false}={}){menu.hidden=false;trigger.setAttribute('aria-expanded','true');if(focus)(getFocusables(menu)[0]||menu).focus()}
 const onTrigger=e=>{e.preventDefault();menu.hidden?open():close()};
 const onKey=e=>{if(e.key==='Escape'&&!menu.hidden){e.preventDefault();close({restoreFocus:true})}else if(e.target===trigger&&e.key==='ArrowDown'){e.preventDefault();open({focus:true})}};
 const onDoc=e=>{if(!menu.hidden&&!trigger.contains(e.target)&&!menu.contains(e.target))close()};
 trigger.addEventListener('click',onTrigger);trigger.addEventListener('keydown',onKey);
 menu.addEventListener('keydown',onKey);document.addEventListener('pointerdown',onDoc);
 return {open,close,destroy(){trigger.removeEventListener('click',onTrigger);trigger.removeEventListener('keydown',onKey);menu.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',onDoc)}};
}
