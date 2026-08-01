import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
  },
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    dts: false,
    clean: false,
    noExternal: [/^@xray-network\/xray-cardano-lib/, /^@noble\/hashes/, /^@scure\//],
  },
])
