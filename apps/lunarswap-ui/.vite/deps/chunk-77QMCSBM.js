import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  NetworkId as NetworkId2
} from "./chunk-VVLZNQWN.js";
import {
  NetworkId
} from "./chunk-DCR4CYXC.js";
import {
  __toESM,
  require_dist,
  require_dist2,
  require_dist3
} from "./chunk-YEDOAZYA.js";

// ../../node_modules/.pnpm/@midnight-ntwrk+midnight-js-network-id@2.0.2/node_modules/@midnight-ntwrk/midnight-js-network-id/dist/index.mjs
var import_dist = __toESM(require_dist(), 1);
var import_dist2 = __toESM(require_dist2(), 1);
var import_dist3 = __toESM(require_dist3(), 1);
import * as runtime from "@midnight-ntwrk/compact-runtime";
var NetworkId4;
(function(NetworkId5) {
  NetworkId5["Undeployed"] = "Undeployed";
  NetworkId5["DevNet"] = "DevNet";
  NetworkId5["TestNet"] = "TestNet";
  NetworkId5["MainNet"] = "MainNet";
})(NetworkId4 || (NetworkId4 = {}));
var NetworkIdTypeError = class extends TypeError {
  networkId;
  /**
   * @param networkId A string representation of the invalid network identifier.
   */
  constructor(networkId) {
    super(`Invalid network ID: '${networkId}'. Must be one of: ${Object.values(NetworkId4).join(", ")}`);
    this.networkId = networkId;
  }
};
var toLedgerNetworkId = (id) => {
  switch (id) {
    case NetworkId4.Undeployed:
      return NetworkId.Undeployed;
    case NetworkId4.DevNet:
      return NetworkId.DevNet;
    case NetworkId4.TestNet:
      return NetworkId.TestNet;
    case NetworkId4.MainNet:
      return NetworkId.MainNet;
    default:
      throw new NetworkIdTypeError(String(id));
  }
};
var toRuntimeNetworkId = (id) => {
  switch (id) {
    case NetworkId4.Undeployed:
      return runtime.NetworkId.Undeployed;
    case NetworkId4.DevNet:
      return runtime.NetworkId.DevNet;
    case NetworkId4.TestNet:
      return runtime.NetworkId.TestNet;
    case NetworkId4.MainNet:
      return runtime.NetworkId.MainNet;
    default:
      throw new NetworkIdTypeError(String(id));
  }
};
var toZswapNetworkId = (id) => {
  switch (id) {
    case NetworkId4.Undeployed:
      return NetworkId2.Undeployed;
    case NetworkId4.DevNet:
      return NetworkId2.DevNet;
    case NetworkId4.TestNet:
      return NetworkId2.TestNet;
    case NetworkId4.MainNet:
      return NetworkId2.MainNet;
    default:
      throw new NetworkIdTypeError(String(id));
  }
};
var currentNetworkId = NetworkId4.Undeployed;
var setNetworkId = (id) => {
  currentNetworkId = id;
};
var getNetworkId = () => currentNetworkId;
var getRuntimeNetworkId = () => toRuntimeNetworkId(getNetworkId());
var getLedgerNetworkId = () => toLedgerNetworkId(getNetworkId());
var getZswapNetworkId = () => toZswapNetworkId(getNetworkId());
var stringToNetworkId = (networkId) => {
  switch (networkId) {
    case "Undeployed":
      return NetworkId4.Undeployed;
    case "DevNet":
      return NetworkId4.DevNet;
    case "TestNet":
      return NetworkId4.TestNet;
    case "MainNet":
      return NetworkId4.MainNet;
    default:
      return null;
  }
};
var networkIdToHex = (networkId) => {
  switch (networkId) {
    case NetworkId4.Undeployed:
      return "00";
    case NetworkId4.DevNet:
      return "01";
    case NetworkId4.TestNet:
      return "02";
    case NetworkId4.MainNet:
      return "04";
    default:
      throw new NetworkIdTypeError(String(networkId));
  }
};

export {
  NetworkId4 as NetworkId,
  NetworkIdTypeError,
  setNetworkId,
  getNetworkId,
  getRuntimeNetworkId,
  getLedgerNetworkId,
  getZswapNetworkId,
  stringToNetworkId,
  networkIdToHex
};
//# sourceMappingURL=chunk-77QMCSBM.js.map
