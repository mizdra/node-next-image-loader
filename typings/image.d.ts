interface StaticImageData {
  src: string;
  height: number;
  width: number;
  // blurDataURL?: string; // TODO: Support blurDataURL
}

declare module '*.png' {
  const content: StaticImageData;

  export default content;
}
