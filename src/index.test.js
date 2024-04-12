import { deepEqual } from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import test from 'node:test';
import burnAllGIF from '../assets/burnallgifs.png';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
async function readAssetAsBase64(path) {
  return await readFile(join(__dirname, path), 'base64');
}

test('import', async () => {
  deepEqual(burnAllGIF, {
    src: `data:image/png;base64,${await readAssetAsBase64('../assets/burnallgifs.png')}`,
    width: 199,
    height: 117,
  });
});

test('require', async () => {
  const require = createRequire(import.meta.url);
  const burnAllGIF = require('../assets/burnallgifs.png');
  deepEqual(burnAllGIF, {
    src: `data:image/png;base64,${await readAssetAsBase64('../assets/burnallgifs.png')}`,
    width: 199,
    height: 117,
  });
});
