# SimpliCSS 2 experimental compiler

Existing `src/SimpliCSS.css` and complete `dist/SimpliCSS.css` remain supported. The compiler is opt-in.

## Run

```bash
node bin/simplicss.cjs build simplicss.config.json
```

Copy `simplicss.config.example.json` to `simplicss.config.json` and list explicit HTML/JSX file paths. Example classes: `flex flex-col md:flex-row gap-4 dark:bg-ink rtl:ms-4 hover:text-brand`.

Literal `class` and `className` attributes are scanned. Dynamically constructed tokens, template strings, Blade interpolations and bound attributes require a `safelist` entry. `dark:` uses `.dark` or `[data-theme="dark"]`; `rtl:` uses `[dir="rtl"]`.

Experimental foundation only: glob scanning, variant composition, plugins, source maps and performance benchmarking are planned, not implemented. Use trusted theme configuration.

## Framework scanning
`content` supports explicit file paths, folders and recursive glob-style paths such as `resources/**/*.blade.php`, `src/**/*.vue` and `app/**/*.tsx`. Scanner excludes `node_modules`, `vendor`, `.git`, `dist`, `coverage` and build directories. Static class and className values are extracted. Dynamic Blade/Vue/JSX expressions should be included in `safelist`; there is no AST parser yet.

Example:
```json
{"content":["resources/**/*.blade.php","resources/**/*.js","src/**/*.vue","src/**/*.tsx"],"output":"dist/simplicss.generated.css","safelist":["hidden","md:flex-row"]}
```
