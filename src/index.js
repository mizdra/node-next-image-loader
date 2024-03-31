import path from 'node:path';

import sizeOf from 'image-size';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// https://github.com/vercel/next.js/blob/1c5aa7fa09cc5503c621c534fc40065cbd2aefcb/packages/next/src/build/webpack-config.ts#L247
const imageExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp', '.svg']);

/** @type {import('node:module').ResolveHook} */
export const resolve = async (specifier, context, nextResolve) => {
  const ext = path.extname(specifier);

  if (!imageExts.has(ext)) {
    return nextResolve(specifier, context);
  }

  return {
    shortCircuit: true,
    url: context.parentURL ? new URL(specifier, context.parentURL).href : specifier,
  };
};

/** @type {import('node:module').LoadHook} */
export const load = async (url, context, nextLoad) => {
  const ext = path.extname(fileURLToPath(url));
  if (!imageExts.has(ext)) {
    return nextLoad(url, context);
  }

  // const { source } = await nextLoad(url, { ...context, format: 'module' });
  // if (source === undefined || typeof source === 'string') {
  //   throw new Error(`Expected source to be a ArrayBuffer or TypedArray, but got ${source}`);
  // }

  const source = await readFile(fileURLToPath(url));

  const { width, height } = sizeOf.default(source);

  return {
    format: 'module',
    shortCircuit: true,
    source: JSON.stringify({ width, height, url }),
  };
};
