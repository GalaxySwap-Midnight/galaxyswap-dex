import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  NetworkId,
  NetworkIdTypeError,
  getLedgerNetworkId,
  getNetworkId,
  getRuntimeNetworkId,
  getZswapNetworkId,
  networkIdToHex,
  setNetworkId,
  stringToNetworkId
} from "./chunk-YUOMWMST.js";
import "./chunk-T53552ZF.js";
import "./chunk-3EUISLED.js";
import "./chunk-F26S4VBV.js";
export {
  NetworkId,
  NetworkIdTypeError,
  getLedgerNetworkId,
  getNetworkId,
  getRuntimeNetworkId,
  getZswapNetworkId,
  networkIdToHex,
  setNetworkId,
  stringToNetworkId
};
//# sourceMappingURL=@midnight-ntwrk_midnight-js-network-id.js.map
