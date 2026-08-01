import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    cardano: "src/cardano.ts",
    "cardano-lib": "src/cardano-lib.ts",
    "mini-app": "src/mini-app.ts",
    "mini-app-protocol": "src/mini-app-protocol.ts",
    "mini-app-client": "src/mini-app-client.ts",
    "mini-app-host": "src/mini-app-host.ts",
    "mini-app-react": "src/mini-app-react.ts",
    "mini-app-testing": "src/mini-app-testing.ts",
  },
  format: ["esm", "cjs"],
  dts: false,
  clean: true,
  splitting: false,
})
