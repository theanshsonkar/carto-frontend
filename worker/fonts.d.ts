// Fonts are bundled as ArrayBuffers via the wrangler "Data" rule (see wrangler.jsonc).
declare module "*.ttf" {
  const data: ArrayBuffer;
  export default data;
}
