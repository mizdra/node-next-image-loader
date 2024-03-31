import I_NODE_MASCOT from '../assets/node-mascot.png';
import { deepEqual } from 'node:assert/strict';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

deepEqual(I_NODE_MASCOT, {
  src: `data:image/png;base64,${await readFile(join(import.meta.dirname, '../assets/node-mascot.png'), 'base64')}`,
  height: 1200,
  width: 1200,
});
