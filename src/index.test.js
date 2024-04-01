import { deepEqual } from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import bunAllGIF from '../assets/burnallgifs.png';

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
async function readAssetAsBase64(path) {
  return await readFile(new URL(path, import.meta.url).pathname, 'base64');
}

deepEqual(bunAllGIF, {
  src: `data:image/png;base64,${await readAssetAsBase64('../assets/burnallgifs.png')}`,
  width: 199,
  height: 117,
});
