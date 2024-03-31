/**
 * @param {string} url
 * @returns {URL | null}
 */
export function tryParseURL(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

// https://github.com/vercel/next.js/blob/1c5aa7fa09cc5503c621c534fc40065cbd2aefcb/packages/next/src/build/webpack-config.ts#L247
export const mimeTypes = {
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

/**
 * @param {string} ext
 * @returns {ext is keyof typeof mimeTypes}
 */
export function isImageExtension(ext) {
  return ext in mimeTypes;
}
