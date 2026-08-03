// Root entry re-exports the shared protocol (types, zod schemas, constants).
// The client, host, and testing surfaces live behind subpath exports:
//   @xray-network/xray-js-mini-app-bridge/client
//   @xray-network/xray-js-mini-app-bridge/host
//   @xray-network/xray-js-mini-app-bridge/testing
export * from "./protocol/index.js"
