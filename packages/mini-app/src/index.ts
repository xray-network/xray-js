// Root entry re-exports the shared protocol (types, zod schemas, constants).
// The client, host, and testing surfaces live behind subpath exports:
//   @xray-network/xray-js-mini-app/client
//   @xray-network/xray-js-mini-app/host
//   @xray-network/xray-js-mini-app/testing
export * from "./protocol/index.js"
