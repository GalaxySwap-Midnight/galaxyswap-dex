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
} from "./chunk-77QMCSBM.js";
import "./chunk-VVLZNQWN.js";
import "./chunk-DCR4CYXC.js";
import "./chunk-OCNPWTNL.js";
import "./chunk-WGYX3V4F.js";
import "./chunk-YEDOAZYA.js";
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
