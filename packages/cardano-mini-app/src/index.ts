// Root entry re-exports the shared protocol (types, zod schemas, constants).
// The client, host, and testing surfaces live behind subpath exports:
//   @xray-network/mini-app-sdk/client
//   @xray-network/mini-app-sdk/host
//   @xray-network/mini-app-sdk/testing
export * from "./protocol"
