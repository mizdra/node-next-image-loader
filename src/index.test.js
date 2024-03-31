import { deepEqual } from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import I_JS from '../assets/js.png';

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
async function readAssetAsBase64(path) {
  return await readFile(new URL(path, import.meta.url).pathname, 'base64');
}

deepEqual(I_JS, {
  src: `data:image/png;base64,${await readAssetAsBase64('../assets/js.png')}`,
  width: 1052,
  height: 1052,
});
