import * as wasm from "./uplc_wasm_bg.wasm";
export * from "./uplc_wasm_bg.js";
import { __wbg_set_wasm } from "./uplc_wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
