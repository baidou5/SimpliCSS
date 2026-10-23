# SimpliCSS UI — experimental component layer

Optional CSS components: buttons, cards, form controls, alerts and layout helpers.

Include `src/simplicss-ui.css` or `dist/simplicss-ui.css` alongside your chosen SimpliCSS utilities bundle. No JavaScript is required for the components included here.

```html
<link rel="stylesheet" href="dist/SimpliCSS.css">
<link rel="stylesheet" href="dist/simplicss-ui.css">
<div class="sc-card">
  <div class="sc-card-header"><h2>Welcome</h2></div>
  <div class="sc-card-body sc-stack">
    <label class="sc-label" for="email">Email</label>
    <input class="sc-input" id="email" type="email" autocomplete="email">
    <button class="sc-btn sc-btn-primary" type="button">Continue</button>
  </div>
</div>
```

Dark styles respond to `.dark` or `[data-theme="dark"]`. Add semantic `--sc-*` color variables for your theme. RTL uses logical border properties.

Accessibility: visible keyboard focus; native controls; explicit labels; disabled and invalid states. Interactive disclosures, modal dialogs, dropdowns and keyboard-driven navigation are **not** provided yet; they require separate accessible behavior implementations.

Use this CSS layer as an experimental prototype until visual/browser/accessibility testing has passed.
