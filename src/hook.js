import path from 'node:path';

import sizeOf from 'image-size';

/**
 * @typedef {['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp', '.svg']} ImageExts
 */

// https://github.com/vercel/next.js/blob/1c5aa7fa09cc5503c621c534fc40065cbd2aefcb/packages/next/src/build/webpack-config.ts#L247
/** @type {Set<string>} */
const imageExts = new Set(
  /** @satisfies {ImageExts} */ ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp', '.svg'],
);
/**
 * @param {string} url
 * @returns {URL | null}
 */
function tryParseURL(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
};

/** @type {import('node:module').LoadHook} */
export const load = async (url, context, nextLoad) => {
  // `url` may be 'node:fs', 'file:///path/to/node-mascot.png', and so on.

  const parsedURL = tryParseURL(url);
  if (parsedURL === null) {
    // If `url` is not file protocol, fallback to the next loader.
    return nextLoad(url, context);
  }

  const ext = path.extname(url);
  if (!imageExts.has(ext)) {
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
    format: 'commonjs',
    shortCircuit: true,
    source: `module.exports = ${JSON.stringify({
      src: `data:${mimeTypes[/** @type {ImageExts[number]} */ (ext)]};base64,${buffer.toString('base64')}`,
      width,
      height,
    })}`,
  };
};
