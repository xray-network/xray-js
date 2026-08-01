---
"@xray-network/xray-js-cardano": major
"@xray-network/xray-js-mini-app": major
"@xray-network/xray-js": major
---

Replace the environment-specific Cardano WebAssembly packages with the universal pure-JavaScript `@xray-network/xray-cardano-lib`. The umbrella package now exposes the library through `@xray-network/xray-js/cardano/lib`, while its Cardano SDK entry point exposes the `CardanoLib` namespace; the former `cardano/wasm` entry point has been removed. `PlutusData`, `PlutusConstr`, and CIP-8 message signing now use implementations from the same pure-JavaScript library. The Cardano SDK also replaces its bundled BIP-39 and Bech32 implementations with Scure and uses the Cardano library's CBOR codec. The mini-app package is now chain-neutral and is exposed through `@xray-network/xray-js/mini-app`; its Cardano support remains available through the CIP-30 modules. The placeholder Base, Bitcoin, and Midnight namespaces and subpath exports have also been removed until those SDKs are implemented.
