# SimpliCSS AI-Native Foundation

This is an **experimental machine-readable API** for AI coding assistants and developers. It does not require any proprietary AI service.

## CLI

```sh
node bin/simplicss.cjs manifest simplicss.config.json
node bin/simplicss.cjs validate simplicss.config.json
```

Both commands output JSON to stdout. Validation exits with code **2** if unsupported classes are found (and 1 for fatal errors). It reads static classes from `content` patterns and checks the configured `safelist`; unknown dynamic expressions must be safelisted.

## Programmatic API

```js
const {manifest,validate}=require('./lib/ai-native.cjs');
console.log(manifest({theme:{colors:{brand:'#123456'}}}));
console.log(validate({classes:['flex','bg-primari']}));
```

`manifest()` enumerates supported variant names, utility families, arbitrary prefixes and design tokens. `validate()` provides stable JSON diagnostics and up to three edit-distance suggestions. Suggestions are **hints, not automatic fixes**.

## Known limits

- Manifest entries describe utility families, not every possible valid generated class.
- No AST parsing, MCP server, schema-driven component generation or browser validation yet.
- No automatic substitution or coercion of potentially unsafe CSS.
- AI models should validate the emitted class list and use documented component markup instead of inferring unknown utility names.
