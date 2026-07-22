import * as wasm from "./cardano_message_signing_bg.wasm";
import { __wbg_set_wasm } from "./cardano_message_signing_bg.js";
__wbg_set_wasm(wasm);
export * from "./cardano_message_signing_bg.js";
