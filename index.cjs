'use strict';
// Stable CommonJS entrypoint for Node and AI tooling.
const compiler=require('./lib/compiler.cjs');
const ai=require('./lib/ai-native.cjs');
const components=require('./lib/component-registry.cjs');
module.exports={...compiler,...ai,...components};
