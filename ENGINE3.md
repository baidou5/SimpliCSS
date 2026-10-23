# SimpliCSS Engine 3 (experimental)

Engine 3 is an **opt-in compiler improvement** layered over the existing
SimpliCSS v2 utility compiler. The public API (`compile`, `build`,
`parseToken`, `extractClasses`, `makeTheme`) is preserved.
Static `src/SimpliCSS.css` and `dist/SimpliCSS.css` are unchanged.

## Arbitrary values

Supported utility prefixes are deliberately allowlisted:

- Dimensions: `w`, `h`, `min-w`, `max-w`, `min-h`, `max-h`
- Spacing: `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`, `gap`, `gap-x`, `gap-y`
- Colors and sizing: `bg`, `text`, `border`, `rounded`
- Layout and positioning: `grid-cols`, `opacity`, `z`, `leading`, `tracking`, `inset`, `top`, `right`, `bottom`, `left`

Examples:

```html
<div class="w-[320px] p-[1.25rem] bg-[#0f172a]"></div>
<div class="w-[calc(100%_-_2rem)] grid-cols-[200px_1fr]"></div>
<p class="text-[18px] border-[2px]">Hello</p>
```

Use underscores for spaces inside bracket values. Engine 3 infers font sizes
from length/function values of `text-[...]`, and border widths from
length/function values of `border-[...]`. This is an intentionally small,
safe syntax: no arbitrary CSS properties, URL functions, injected selectors,
or semicolon-separated declarations.

## Variants

Supported: `sm`, `md`, `lg`, `xl` and custom configured breakpoints;
`hover`, `focus`, `focus-visible`, `active`, `disabled`,
`checked`, `required`, `invalid`, `visited`, `first`, `last`,
`odd`, `even`; `dark`, `rtl`, `ltr`, `group-hover`,
and `peer-checked`. Variants can be combined, for example:

```html
<html dir="rtl" class="dark">
  <button class="md:dark:rtl:hover:bg-[#111111]">Action</button>
</html>
```

Only one breakpoint and at most six prefixes are accepted, with duplicates
and incompatible `rtl:ltr` rejected. The generator escapes class selectors
and does not allow user-defined selectors.

## Scanner

Extracts literal class strings from HTML/Blade/Vue and `className` from JSX
including the static `className={'...'}` form. It intentionally **does not
interpret arbitrary JavaScript, Vue `:class`, JSX dynamic expressions, Blade
interpolations or template literals**. List classes constructed at runtime in
`safelist` in your SimpliCSS config.

This is a conservative lexical scanner, **not an AST parser**. AST parsers
and framework-specific analyzers are future work.

## Run

```bash
npm test
node bin/simplicss.cjs build simplicss.config.json
```

Engine 3 tests are in `tests/engine3.test.cjs`. Full compatibility and
cross-browser visual testing remain release gates; do not publish this as a
stable major version until CI and browser tests pass.
