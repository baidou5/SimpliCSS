# SimpliCSS AI Component Registry

Experimental schema-driven components for AI coding assistants. All markup is produced from allowlisted props; text is HTML-escaped. No HTML injection, arbitrary attributes or event handlers are supported.

CLI usage:

```bash
node bin/simplicss.cjs components
node bin/simplicss.cjs component button
node bin/simplicss.cjs render button '{"label":"Save","variant":"primary"}'
node bin/simplicss.cjs manifest
```

JavaScript API:

```js
const {listComponents,getComponent,renderComponent}=require('./lib/component-registry.cjs');
console.log(listComponents());
console.log(renderComponent('input',{label:'Email',name:'email',type:'email'}));
```

Current registry: `button`, `card`, `input`, `alert`. Generated HTML uses styles from `dist/simplicss-ui.css`. Interactive modal, tabs and dropdown components are not registered yet because they need lifecycle and focus-management contracts.

AI tools should call `components` before `render`, validate properties against the returned schema, and include the component stylesheet. This is **not** an MCP server or complete component library yet.
