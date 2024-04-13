import { register } from 'node:module';
import { registerRequireHook } from './hook.js';

// Register the hook for `import` statements and dynamic `import()`.
register('./hook.js', import.meta.url);

// Register the hook for `require()`.
// ref: https://github.com/nodejs/node/issues/52219
registerRequireHook();
