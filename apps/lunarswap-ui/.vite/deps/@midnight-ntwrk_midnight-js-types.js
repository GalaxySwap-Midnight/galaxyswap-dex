import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  FailEntirely,
  FailFallible,
  InvalidProtocolSchemeError,
  LogLevel,
  SucceedEntirely,
  ZKConfigProvider,
  createBalancedTx,
  createProverKey,
  createUnbalancedTx,
  createVerifierKey,
  createZKIR,
  getImpureCircuitIds
} from "./chunk-JBSRDCWX.js";
import {
  UnprovenTransaction
} from "./chunk-3EUISLED.js";
import "./chunk-F26S4VBV.js";
export {
  FailEntirely,
  FailFallible,
  InvalidProtocolSchemeError,
  LogLevel,
  SucceedEntirely,
  UnprovenTransaction,
  ZKConfigProvider,
  createBalancedTx,
  createProverKey,
  createUnbalancedTx,
  createVerifierKey,
  createZKIR,
  getImpureCircuitIds
};
//# sourceMappingURL=@midnight-ntwrk_midnight-js-types.js.map
