import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    base: "src/base.ts",
    cardano: "src/cardano.ts",
    "cardano-wasm": "src/cardano-wasm.ts",
    "cardano-mini-app": "src/cardano-mini-app.ts",
    "cardano-mini-app-protocol": "src/cardano-mini-app-protocol.ts",
    "cardano-mini-app-client": "src/cardano-mini-app-client.ts",
    "cardano-mini-app-host": "src/cardano-mini-app-host.ts",
    "cardano-mini-app-react": "src/cardano-mini-app-react.ts",
    "cardano-mini-app-testing": "src/cardano-mini-app-testing.ts",
    bitcoin: "src/bitcoin.ts",
    midnight: "src/midnight.ts",
  },
  format: ["esm", "cjs"],
  dts: false,
  clean: true,
  splitting: false,
})
