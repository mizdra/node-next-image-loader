import path from 'node:path';
import type { LoadHook, ResolveHook } from 'node:module';

import sizeOf from 'image-size';

// https://github.com/vercel/next.js/blob/1c5aa7fa09cc5503c621c534fc40065cbd2aefcb/packages/next/src/build/webpack-config.ts#L247
const imageExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp', '.svg']);

export const resolve: ResolveHook = async (specifier, context, nextResolve) => {
  const ext = path.extname(specifier);

  if (!imageExts.has(ext)) {
    return nextResolve(specifier, context);
  }

  return {
    shortCircuit: true,
    url: context.parentURL ? new URL(specifier, context.parentURL).href : specifier,
  };
};

export const load: LoadHook = async (url, context, nextLoad) => {
  const ext = path.extname(new URL(url).pathname);
  if (!imageExts.has(ext)) {
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
    source: JSON.stringify({ width, height, url }),
  };
};
