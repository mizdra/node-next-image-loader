import path from 'node:path';

import sizeOf from 'image-size';

// https://github.com/vercel/next.js/blob/1c5aa7fa09cc5503c621c534fc40065cbd2aefcb/packages/next/src/build/webpack-config.ts#L247
const imageExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp', '.svg']);

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

  const { width, height } = sizeOf.default(new Uint8Array(source));

  return {
    format: 'module',
    shortCircuit: true,
    source: `export default ${JSON.stringify({
      src: url, // TODO: encode to base64
      width,
      height,
    })}`,
  };
};
