import path from 'node:path';
import sizeOf from 'image-size';
import { isImageExtension, mimeTypes, tryParseURL } from './util.js';
import { addHook } from 'pirates';
import { readFileSync } from 'node:fs';

/** @type {import('node:module').LoadHook} */
export const load = async (url, context, nextLoad) => {
  // `url` may be 'node:fs', 'file:///path/to/node-mascot.png', and so on.

  const parsedURL = tryParseURL(url);
  if (parsedURL === null) {
    // If `url` is not file protocol, fallback to the next loader.
    return nextLoad(url, context);
  }

  const ext = path.extname(url);
  if (!isImageExtension(ext)) {
    // If `url` is not image file, fallback to the next loader.
    return nextLoad(url, context);
  }

  const { source } = await nextLoad(url, { ...context, format: 'module' });
  if (source === undefined || typeof source === 'string') {
    throw new Error(`Expected source to be a ArrayBuffer or TypedArray, but got ${source}`);
  }

  const buffer = Buffer.from(source);
  const { width, height } = sizeOf.default(buffer);

  return {
    format: 'module',
    shortCircuit: true,
    source: `export default ${JSON.stringify({
      src: `data:${mimeTypes[ext]};base64,${buffer.toString('base64')}`,
      width,
      height,
    })}`,
  };
};

export function registerRequireHook() {
  addHook(
    (_code, filename) => {
      const ext = path.extname(filename);
      if (!isImageExtension(ext)) throw new Error(`Expected ${filename} to be an image file, but got ${ext}`);
      const buffer = readFileSync(filename);
      const { width, height } = sizeOf.default(buffer);
      return `module.exports = ${JSON.stringify({
        src: `data:${mimeTypes[ext]};base64,${buffer.toString('base64')}`,
        width,
        height,
      })}`;
    },
    { ext: Object.keys(mimeTypes) },
  );
}
