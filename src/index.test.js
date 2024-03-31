import { pathToFileURL } from 'node:url';
import I_NODE_MASCOT from '../assets/node-mascot.png';
import { deepEqual } from 'node:assert/strict';
import { join } from 'node:path';

console.log({ I_NODE_MASCOT });

deepEqual(I_NODE_MASCOT, {
  src: pathToFileURL(join(import.meta.dirname, '../assets/node-mascot.png')).href,
  height: 1200,
  width: 1200,
});
