import { deepEqual } from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import bunAllGIF from '../assets/burnallgifs.png';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
async function readAssetAsBase64(path) {
  return await readFile(join(__dirname, path), 'base64');
}

deepEqual(bunAllGIF, {
  src: `data:image/png;base64,${await readAssetAsBase64('../assets/burnallgifs.png')}`,
  width: 199,
  height: 117,
});
