import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "protocol/index": "src/protocol/index.ts",
    "client/index": "src/client/index.ts",
    "host/index": "src/host/index.ts",
    "react/index": "src/react/index.ts",
    "testing/index": "src/testing/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
  external: ["react", "react/jsx-runtime"],
})
