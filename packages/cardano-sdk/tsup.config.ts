import { defineConfig } from "tsup"
import { pluginReplace } from "@espcom/esbuild-plugin-replace"

export default defineConfig([
  {
    entry: ["src/index.ts"],
    outDir: "dist/nodejs",
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
  },
  {
    entry: ["src/index.ts"],
    outDir: "dist/browser",
    format: ["esm"],
    dts: true,
    clean: true,
    esbuildPlugins: [
      // @ts-ignore
      pluginReplace([
        {
          filter: /\.ts$/,
          replace: "@xray-network/xray-js-cardano-wasm/nodejs",
          replacer: () => "@xray-network/xray-js-cardano-wasm/browser",
        },
      ]),
    ],
  },
  {
    entry: ["src/index.ts"],
    outDir: "dist/web",
    format: ["esm"],
    dts: true,
    clean: true,
    esbuildPlugins: [
      // @ts-ignore
      pluginReplace([
        {
          filter: /\.ts$/,
          replace: "@xray-network/xray-js-cardano-wasm/nodejs",
          replacer: () => "@xray-network/xray-js-cardano-wasm/web",
        },
      ]),
    ],
  },
])
