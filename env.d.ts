declare module "*.wasm" {
  const content: WebAssembly.Module;
  export default content;
}

declare module "*.ttf?inline" {
  const content: string;
  export default content;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    otherLocals: {
      test: string;
    };
  }
}
