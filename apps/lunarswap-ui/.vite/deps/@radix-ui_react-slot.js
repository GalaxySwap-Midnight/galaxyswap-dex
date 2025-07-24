import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  Slot,
  Slottable,
  createSlot,
  createSlottable
} from "./chunk-JCZVGNR3.js";
import "./chunk-QP4VQXGB.js";
import "./chunk-U5A52HJA.js";
import "./chunk-YEDOAZYA.js";
export {
  Slot as Root,
  Slot,
  Slottable,
  createSlot,
  createSlottable
};
