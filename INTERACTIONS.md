# SimpliCSS UI Interactions (experimental)

Import `dist/simplicss-interactions.css` after `dist/simplicss-ui.css`. Import browser module `src/simplicss-interactions.js` as an ES module. No external dependencies.

## Modal
```html
<button id="open" type="button">Open settings</button>
<dialog id="settings" class="sc-dialog" aria-labelledby="settings-title">
 <div class="sc-dialog-body">
  <h2 id="settings-title">Settings</h2>
  <button type="button" data-sc-modal-close>Close</button>
 </div>
</dialog>
<script type="module">
 import {createModal} from './src/simplicss-interactions.js';
 const trigger=document.getElementById('open');
 const modal=createModal(document.getElementById('settings'),{trigger});
 trigger.addEventListener('click',modal.open);
</script>
```
Native dialog provides focus containment and Escape; the helper restores the previous trigger's focus on close.

## Tabs
```html
<div id="prefs">
 <div class="sc-tabs" role="tablist" aria-label="Preferences">
  <button class="sc-tab" role="tab" id="general-tab" aria-controls="general-panel" aria-selected="true">General</button>
  <button class="sc-tab" role="tab" id="security-tab" aria-controls="security-panel">Security</button>
 </div>
 <section class="sc-tab-panel" role="tabpanel" id="general-panel" aria-labelledby="general-tab">General content</section>
 <section class="sc-tab-panel" role="tabpanel" id="security-panel" aria-labelledby="security-tab" hidden>Security content</section>
</div>
<script type="module">
 import {createTabs} from './src/simplicss-interactions.js';
 createTabs(document.getElementById('prefs'));
</script>
```

## Dropdown
Use a trigger button with `aria-controls` referring to a menu container, e.g. `<div class="sc-menu" id="actions">...</div>`. Call `createDropdown(trigger,menu)`. Escape and outside pointer clicks close it. This is a disclosure/dropdown suitable for simple buttons and links, **not** a complete WAI-ARIA menu widget with arrow-key item navigation.

All helpers return `destroy()`; call it when unmounting in Vue/React. Additional automated browser accessibility tests are required before a stable release.
