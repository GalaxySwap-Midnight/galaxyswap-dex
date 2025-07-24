import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  require_lodash
} from "./chunk-RW4DUVTL.js";
import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS,
  __toESM,
  require_dist,
  require_dist2,
  require_dist3
} from "./chunk-F26S4VBV.js";

// node_modules/vite-plugin-node-polyfills/shims/buffer/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  Blob: () => Blob,
  BlobOptions: () => BlobOptions,
  Buffer: () => Buffer$1,
  File: () => File,
  FileOptions: () => FileOptions,
  INSPECT_MAX_BYTES: () => INSPECT_MAX_BYTES,
  SlowBuffer: () => SlowBuffer,
  TranscodeEncoding: () => TranscodeEncoding,
  atob: () => atob,
  btoa: () => btoa,
  constants: () => constants,
  default: () => Buffer,
  isAscii: () => isAscii,
  isUtf8: () => isUtf8,
  kMaxLength: () => kMaxLength,
  kStringMaxLength: () => kStringMaxLength,
  resolveObjectURL: () => resolveObjectURL,
  transcode: () => transcode
});
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}
var import_dist, import_dist2, import_dist3, buffer, base64Js, lookup, revLookup, Arr, code, i, len, ieee754, Buffer, Blob, BlobOptions, Buffer$1, File, FileOptions, INSPECT_MAX_BYTES, SlowBuffer, TranscodeEncoding, atob, btoa, constants, isAscii, isUtf8, kMaxLength, kStringMaxLength, resolveObjectURL, transcode;
var init_dist = __esm({
  "node_modules/vite-plugin-node-polyfills/shims/buffer/dist/index.js"() {
    import_dist = __toESM(require_dist());
    import_dist2 = __toESM(require_dist2());
    import_dist3 = __toESM(require_dist3());
    buffer = {};
    base64Js = {};
    base64Js.byteLength = byteLength;
    base64Js.toByteArray = toByteArray;
    base64Js.fromByteArray = fromByteArray;
    lookup = [];
    revLookup = [];
    Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    ieee754 = {};
    ieee754.read = function(buffer2, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer2[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    ieee754.write = function(buffer2, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer2[offset + i - d] |= s * 128;
    };
    (function(exports) {
      const base64 = base64Js;
      const ieee754$1 = ieee754;
      const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer2;
      exports.SlowBuffer = SlowBuffer2;
      exports.INSPECT_MAX_BYTES = 50;
      const K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      const { Uint8Array: GlobalUint8Array, ArrayBuffer: GlobalArrayBuffer, SharedArrayBuffer: GlobalSharedArrayBuffer } = globalThis;
      Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new GlobalUint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, GlobalUint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer2.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer2.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new GlobalUint8Array(length);
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function Buffer2(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer2.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (GlobalArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, GlobalArrayBuffer) || value && isInstance(value.buffer, GlobalArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof GlobalSharedArrayBuffer !== "undefined" && (isInstance(value, GlobalSharedArrayBuffer) || value && isInstance(value.buffer, GlobalSharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer2.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer2.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer2.prototype, GlobalUint8Array.prototype);
      Object.setPrototypeOf(Buffer2, GlobalUint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer2.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer2.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer2.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength2(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, GlobalUint8Array)) {
          const copy2 = new GlobalUint8Array(arrayView);
          return fromArrayBuffer(copy2.buffer, copy2.byteOffset, copy2.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new GlobalUint8Array(array);
        } else if (length === void 0) {
          buf = new GlobalUint8Array(array, byteOffset);
        } else {
          buf = new GlobalUint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer2.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer2(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer2.alloc(+length);
      }
      Buffer2.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer2.prototype;
      };
      Buffer2.compare = function compare(a, b) {
        if (isInstance(a, GlobalUint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
        if (isInstance(b, GlobalUint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
        if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer2.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer2.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer2.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer2 = Buffer2.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, GlobalUint8Array)) {
            if (pos + buf.length > buffer2.length) {
              if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
              buf.copy(buffer2, pos);
            } else {
              GlobalUint8Array.prototype.set.call(
                buffer2,
                buf,
                pos
              );
            }
          } else if (!Buffer2.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer2, pos);
          }
          pos += buf.length;
        }
        return buffer2;
      };
      function byteLength2(string, encoding) {
        if (Buffer2.isBuffer(string)) {
          return string.length;
        }
        if (GlobalArrayBuffer.isView(string) || isInstance(string, GlobalArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.byteLength = byteLength2;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer2.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer2.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer2.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer2.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
      Buffer2.prototype.equals = function equals(b) {
        if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer2.compare(this, b) === 0;
      };
      Buffer2.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
      }
      Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, GlobalUint8Array)) {
          target = Buffer2.from(target, target.offset, target.byteLength);
        }
        if (!Buffer2.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
        if (buffer2.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer2.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
        if (byteOffset >= buffer2.length) {
          if (dir) return -1;
          else byteOffset = buffer2.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer2.from(val, encoding);
        }
        if (Buffer2.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof GlobalUint8Array.prototype.indexOf === "function") {
            if (dir) {
              return GlobalUint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
            } else {
              return GlobalUint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer2.prototype.includes = function includes2(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer2.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer2.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      const MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer2.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer2.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength3, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength3 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength3, this.length);
        }
        let val = this[offset + --byteLength3];
        let mul = 1;
        while (byteLength3 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength3] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength3, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength3 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
        return val;
      };
      Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength3, this.length);
        let i = byteLength3;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
        return val;
      };
      Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754$1.read(this, offset, true, 23, 4);
      };
      Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754$1.read(this, offset, false, 23, 4);
      };
      Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754$1.read(this, offset, true, 52, 8);
      };
      Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754$1.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
          checkInt(this, value, offset, byteLength3, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength3 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
          checkInt(this, value, offset, byteLength3, maxBytes, 0);
        }
        let i = byteLength3 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength3 - 1);
          checkInt(this, value, offset, byteLength3, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength3 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength3 - 1);
          checkInt(this, value, offset, byteLength3, limit - 1, -limit);
        }
        let i = byteLength3 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4);
        }
        ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8);
        }
        ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer2.prototype.copy = function copy2(target, targetStart, start, end) {
        if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof GlobalUint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          GlobalUint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer2.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code2 = val.charCodeAt(0);
            if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
              val = code2;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      const errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength3) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength3] === void 0) {
          boundsError(offset, buf.length - (byteLength3 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength3) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength3 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength3 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength3 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength3 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength3);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      const hexSliceLookupTable = function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    })(buffer);
    Buffer = buffer.Buffer;
    Blob = buffer.Blob;
    BlobOptions = buffer.BlobOptions;
    Buffer$1 = buffer.Buffer;
    File = buffer.File;
    FileOptions = buffer.FileOptions;
    INSPECT_MAX_BYTES = buffer.INSPECT_MAX_BYTES;
    SlowBuffer = buffer.SlowBuffer;
    TranscodeEncoding = buffer.TranscodeEncoding;
    atob = buffer.atob;
    btoa = buffer.btoa;
    constants = buffer.constants;
    isAscii = buffer.isAscii;
    isUtf8 = buffer.isUtf8;
    kMaxLength = buffer.kMaxLength;
    kStringMaxLength = buffer.kStringMaxLength;
    resolveObjectURL = buffer.resolveObjectURL;
    transcode = buffer.transcode;
  }
});

// ../../node_modules/.pnpm/level-supports@6.2.0/node_modules/level-supports/index.js
var require_level_supports = __commonJS({
  "../../node_modules/.pnpm/level-supports@6.2.0/node_modules/level-supports/index.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    exports.supports = function supports(...manifests) {
      const manifest = manifests.reduce((acc, m) => Object.assign(acc, m), {});
      const implicitSnapshots = manifest.implicitSnapshots || manifest.snapshots || false;
      const explicitSnapshots = manifest.explicitSnapshots || false;
      return Object.assign(manifest, {
        implicitSnapshots,
        explicitSnapshots,
        snapshots: implicitSnapshots,
        has: manifest.has || false,
        permanence: manifest.permanence || false,
        seek: manifest.seek || false,
        createIfMissing: manifest.createIfMissing || false,
        errorIfExists: manifest.errorIfExists || false,
        deferredOpen: manifest.deferredOpen || false,
        streams: manifest.streams || false,
        encodings: Object.assign({}, manifest.encodings),
        events: Object.assign({}, manifest.events),
        additionalMethods: Object.assign({}, manifest.additionalMethods),
        signals: Object.assign({}, manifest.signals)
      });
    };
  }
});

// ../../node_modules/.pnpm/module-error@1.0.2/node_modules/module-error/index.js
var require_module_error = __commonJS({
  "../../node_modules/.pnpm/module-error@1.0.2/node_modules/module-error/index.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    module.exports = class ModuleError extends Error {
      /**
       * @param {string} message Error message
       * @param {{ code?: string, cause?: Error, expected?: boolean, transient?: boolean }} [options]
       */
      constructor(message, options) {
        super(message || "");
        if (typeof options === "object" && options !== null) {
          if (options.code) this.code = String(options.code);
          if (options.expected) this.expected = true;
          if (options.transient) this.transient = true;
          if (options.cause) this.cause = options.cause;
        }
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/text-endec.js
var require_text_endec = __commonJS({
  "../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/text-endec.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var lazy = null;
    module.exports = function() {
      if (lazy === null) {
        lazy = {
          textEncoder: new TextEncoder(),
          textDecoder: new TextDecoder()
        };
      }
      return lazy;
    };
  }
});

// ../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/encoding.js
var require_encoding = __commonJS({
  "../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/encoding.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var ModuleError = require_module_error();
    var formats = /* @__PURE__ */ new Set(["buffer", "view", "utf8"]);
    var Encoding = class {
      /**
       * @param {IEncoding<TIn,TFormat,TOut>} options
       */
      constructor(options) {
        this.encode = options.encode || this.encode;
        this.decode = options.decode || this.decode;
        this.name = options.name || this.name;
        this.format = options.format || this.format;
        if (typeof this.encode !== "function") {
          throw new TypeError("The 'encode' property must be a function");
        }
        if (typeof this.decode !== "function") {
          throw new TypeError("The 'decode' property must be a function");
        }
        this.encode = this.encode.bind(this);
        this.decode = this.decode.bind(this);
        if (typeof this.name !== "string" || this.name === "") {
          throw new TypeError("The 'name' property must be a string");
        }
        if (typeof this.format !== "string" || !formats.has(this.format)) {
          throw new TypeError("The 'format' property must be one of 'buffer', 'view', 'utf8'");
        }
        if (options.createViewTranscoder) {
          this.createViewTranscoder = options.createViewTranscoder;
        }
        if (options.createBufferTranscoder) {
          this.createBufferTranscoder = options.createBufferTranscoder;
        }
        if (options.createUTF8Transcoder) {
          this.createUTF8Transcoder = options.createUTF8Transcoder;
        }
      }
      get commonName() {
        return (
          /** @type {string} */
          this.name.split("+")[0]
        );
      }
      /** @return {BufferFormat<TIn,TOut>} */
      createBufferTranscoder() {
        throw new ModuleError(`Encoding '${this.name}' cannot be transcoded to 'buffer'`, {
          code: "LEVEL_ENCODING_NOT_SUPPORTED"
        });
      }
      /** @return {ViewFormat<TIn,TOut>} */
      createViewTranscoder() {
        throw new ModuleError(`Encoding '${this.name}' cannot be transcoded to 'view'`, {
          code: "LEVEL_ENCODING_NOT_SUPPORTED"
        });
      }
      /** @return {UTF8Format<TIn,TOut>} */
      createUTF8Transcoder() {
        throw new ModuleError(`Encoding '${this.name}' cannot be transcoded to 'utf8'`, {
          code: "LEVEL_ENCODING_NOT_SUPPORTED"
        });
      }
    };
    exports.Encoding = Encoding;
  }
});

// ../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/formats.js
var require_formats = __commonJS({
  "../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/formats.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { Buffer: Buffer2 } = (init_dist(), __toCommonJS(dist_exports)) || {};
    var { Encoding } = require_encoding();
    var textEndec = require_text_endec();
    var BufferFormat = class extends Encoding {
      /**
       * @param {Omit<IEncoding<TIn, Buffer, TOut>, 'format'>} options
       */
      constructor(options) {
        super({ ...options, format: "buffer" });
      }
      /** @override */
      createViewTranscoder() {
        return new ViewFormat({
          encode: this.encode,
          // Buffer is a view (UInt8Array)
          decode: (data) => this.decode(
            Buffer2.from(data.buffer, data.byteOffset, data.byteLength)
          ),
          name: `${this.name}+view`
        });
      }
      /** @override */
      createBufferTranscoder() {
        return this;
      }
    };
    var ViewFormat = class extends Encoding {
      /**
       * @param {Omit<IEncoding<TIn, Uint8Array, TOut>, 'format'>} options
       */
      constructor(options) {
        super({ ...options, format: "view" });
      }
      /** @override */
      createBufferTranscoder() {
        return new BufferFormat({
          encode: (data) => {
            const view = this.encode(data);
            return Buffer2.from(view.buffer, view.byteOffset, view.byteLength);
          },
          decode: this.decode,
          // Buffer is a view (UInt8Array)
          name: `${this.name}+buffer`
        });
      }
      /** @override */
      createViewTranscoder() {
        return this;
      }
    };
    var UTF8Format = class extends Encoding {
      /**
       * @param {Omit<IEncoding<TIn, string, TOut>, 'format'>} options
       */
      constructor(options) {
        super({ ...options, format: "utf8" });
      }
      /** @override */
      createBufferTranscoder() {
        return new BufferFormat({
          encode: (data) => Buffer2.from(this.encode(data), "utf8"),
          decode: (data) => this.decode(data.toString("utf8")),
          name: `${this.name}+buffer`
        });
      }
      /** @override */
      createViewTranscoder() {
        const { textEncoder, textDecoder } = textEndec();
        return new ViewFormat({
          encode: (data) => textEncoder.encode(this.encode(data)),
          decode: (data) => this.decode(textDecoder.decode(data)),
          name: `${this.name}+view`
        });
      }
      /** @override */
      createUTF8Transcoder() {
        return this;
      }
    };
    exports.BufferFormat = BufferFormat;
    exports.ViewFormat = ViewFormat;
    exports.UTF8Format = UTF8Format;
  }
});

// ../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/encodings.js
var require_encodings = __commonJS({
  "../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/lib/encodings.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { Buffer: Buffer2 } = (init_dist(), __toCommonJS(dist_exports)) || { Buffer: { isBuffer: () => false } };
    var { textEncoder, textDecoder } = require_text_endec()();
    var { BufferFormat, ViewFormat, UTF8Format } = require_formats();
    var identity = (v) => v;
    exports.utf8 = new UTF8Format({
      encode: function(data) {
        return Buffer2.isBuffer(data) ? data.toString("utf8") : ArrayBuffer.isView(data) ? textDecoder.decode(data) : String(data);
      },
      decode: identity,
      name: "utf8",
      createViewTranscoder() {
        return new ViewFormat({
          encode: function(data) {
            return ArrayBuffer.isView(data) ? data : textEncoder.encode(data);
          },
          decode: function(data) {
            return textDecoder.decode(data);
          },
          name: `${this.name}+view`
        });
      },
      createBufferTranscoder() {
        return new BufferFormat({
          encode: function(data) {
            return Buffer2.isBuffer(data) ? data : ArrayBuffer.isView(data) ? Buffer2.from(data.buffer, data.byteOffset, data.byteLength) : Buffer2.from(String(data), "utf8");
          },
          decode: function(data) {
            return data.toString("utf8");
          },
          name: `${this.name}+buffer`
        });
      }
    });
    exports.json = new UTF8Format({
      encode: JSON.stringify,
      decode: JSON.parse,
      name: "json"
    });
    exports.buffer = new BufferFormat({
      encode: function(data) {
        return Buffer2.isBuffer(data) ? data : ArrayBuffer.isView(data) ? Buffer2.from(data.buffer, data.byteOffset, data.byteLength) : Buffer2.from(String(data), "utf8");
      },
      decode: identity,
      name: "buffer",
      createViewTranscoder() {
        return new ViewFormat({
          encode: function(data) {
            return ArrayBuffer.isView(data) ? data : Buffer2.from(String(data), "utf8");
          },
          decode: function(data) {
            return Buffer2.from(data.buffer, data.byteOffset, data.byteLength);
          },
          name: `${this.name}+view`
        });
      }
    });
    exports.view = new ViewFormat({
      encode: function(data) {
        return ArrayBuffer.isView(data) ? data : textEncoder.encode(data);
      },
      decode: identity,
      name: "view",
      createBufferTranscoder() {
        return new BufferFormat({
          encode: function(data) {
            return Buffer2.isBuffer(data) ? data : ArrayBuffer.isView(data) ? Buffer2.from(data.buffer, data.byteOffset, data.byteLength) : Buffer2.from(String(data), "utf8");
          },
          decode: identity,
          name: `${this.name}+buffer`
        });
      }
    });
    exports.hex = new BufferFormat({
      encode: function(data) {
        return Buffer2.isBuffer(data) ? data : Buffer2.from(String(data), "hex");
      },
      decode: function(buffer2) {
        return buffer2.toString("hex");
      },
      name: "hex"
    });
    exports.base64 = new BufferFormat({
      encode: function(data) {
        return Buffer2.isBuffer(data) ? data : Buffer2.from(String(data), "base64");
      },
      decode: function(buffer2) {
        return buffer2.toString("base64");
      },
      name: "base64"
    });
  }
});

// ../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/index.js
var require_level_transcoder = __commonJS({
  "../../node_modules/.pnpm/level-transcoder@1.0.1/node_modules/level-transcoder/index.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var ModuleError = require_module_error();
    var encodings = require_encodings();
    var { Encoding } = require_encoding();
    var { BufferFormat, ViewFormat, UTF8Format } = require_formats();
    var kFormats = Symbol("formats");
    var kEncodings = Symbol("encodings");
    var validFormats = /* @__PURE__ */ new Set(["buffer", "view", "utf8"]);
    var Transcoder = class {
      /**
       * @param {Array<'buffer'|'view'|'utf8'>} formats
       */
      constructor(formats) {
        if (!Array.isArray(formats)) {
          throw new TypeError("The first argument 'formats' must be an array");
        } else if (!formats.every((f) => validFormats.has(f))) {
          throw new TypeError("Format must be one of 'buffer', 'view', 'utf8'");
        }
        this[kEncodings] = /* @__PURE__ */ new Map();
        this[kFormats] = new Set(formats);
        for (const k in encodings) {
          try {
            this.encoding(k);
          } catch (err) {
            if (err.code !== "LEVEL_ENCODING_NOT_SUPPORTED") throw err;
          }
        }
      }
      /**
       * @returns {Array<Encoding<any,T,any>>}
       */
      encodings() {
        return Array.from(new Set(this[kEncodings].values()));
      }
      /**
       * @param {string|MixedEncoding<any, any, any>} encoding
       * @returns {Encoding<any, T, any>}
       */
      encoding(encoding) {
        let resolved = this[kEncodings].get(encoding);
        if (resolved === void 0) {
          if (typeof encoding === "string" && encoding !== "") {
            resolved = lookup2[encoding];
            if (!resolved) {
              throw new ModuleError(`Encoding '${encoding}' is not found`, {
                code: "LEVEL_ENCODING_NOT_FOUND"
              });
            }
          } else if (typeof encoding !== "object" || encoding === null) {
            throw new TypeError("First argument 'encoding' must be a string or object");
          } else {
            resolved = from(encoding);
          }
          const { name, format } = resolved;
          if (!this[kFormats].has(format)) {
            if (this[kFormats].has("view")) {
              resolved = resolved.createViewTranscoder();
            } else if (this[kFormats].has("buffer")) {
              resolved = resolved.createBufferTranscoder();
            } else if (this[kFormats].has("utf8")) {
              resolved = resolved.createUTF8Transcoder();
            } else {
              throw new ModuleError(`Encoding '${name}' cannot be transcoded`, {
                code: "LEVEL_ENCODING_NOT_SUPPORTED"
              });
            }
          }
          for (const k of [encoding, name, resolved.name, resolved.commonName]) {
            this[kEncodings].set(k, resolved);
          }
        }
        return resolved;
      }
    };
    exports.Transcoder = Transcoder;
    function from(options) {
      if (options instanceof Encoding) {
        return options;
      }
      const maybeType = "type" in options && typeof options.type === "string" ? options.type : void 0;
      const name = options.name || maybeType || `anonymous-${anonymousCount++}`;
      switch (detectFormat(options)) {
        case "view":
          return new ViewFormat({ ...options, name });
        case "utf8":
          return new UTF8Format({ ...options, name });
        case "buffer":
          return new BufferFormat({ ...options, name });
        default: {
          throw new TypeError("Format must be one of 'buffer', 'view', 'utf8'");
        }
      }
    }
    function detectFormat(options) {
      if ("format" in options && options.format !== void 0) {
        return options.format;
      } else if ("buffer" in options && typeof options.buffer === "boolean") {
        return options.buffer ? "buffer" : "utf8";
      } else if ("code" in options && Number.isInteger(options.code)) {
        return "view";
      } else {
        return "buffer";
      }
    }
    var aliases = {
      binary: encodings.buffer,
      "utf-8": encodings.utf8
    };
    var lookup2 = {
      ...encodings,
      ...aliases
    };
    var anonymousCount = 0;
  }
});

// ../../node_modules/.pnpm/events@3.3.0/node_modules/events/events.js
var require_events = __commonJS({
  "../../node_modules/.pnpm/events@3.3.0/node_modules/events/events.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    module.exports = EventEmitter;
    module.exports.once = once;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy2 = new Array(n);
      for (var i = 0; i < n; ++i)
        copy2[i] = arr[i];
      return copy2;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// ../../node_modules/.pnpm/maybe-combine-errors@1.0.0/node_modules/maybe-combine-errors/index.js
var require_maybe_combine_errors = __commonJS({
  "../../node_modules/.pnpm/maybe-combine-errors@1.0.0/node_modules/maybe-combine-errors/index.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var kErrors = Symbol("kErrors");
    module.exports = function(errors) {
      errors = errors.filter(defined);
      if (errors.length === 0) return;
      if (errors.length === 1) return errors[0];
      return new CombinedError(errors);
    };
    var CombinedError = class extends Error {
      constructor(errors) {
        const unique = new Set(errors.map(getMessage).filter(Boolean));
        const message = Array.from(unique).join("; ");
        super(message);
        value(this, "name", "CombinedError");
        value(this, kErrors, errors);
        getter(this, "stack", () => errors.map(getStack).join("\n\n"));
        getter(this, "transient", () => errors.length > 0 && errors.every(transient));
        getter(this, "expected", () => errors.length > 0 && errors.every(expected));
      }
      [Symbol.iterator]() {
        return this[kErrors][Symbol.iterator]();
      }
    };
    function value(obj, prop, value2) {
      Object.defineProperty(obj, prop, { value: value2 });
    }
    function getter(obj, prop, get) {
      Object.defineProperty(obj, prop, { get });
    }
    function defined(err) {
      return err != null;
    }
    function getMessage(err) {
      return err.message;
    }
    function getStack(err) {
      return err.stack;
    }
    function transient(err) {
      return err.transient === true;
    }
    function expected(err) {
      return err.expected === true;
    }
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/common.js
var require_common = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/common.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var ModuleError = require_module_error();
    var deprecations = /* @__PURE__ */ new Set();
    exports.getOptions = function(options, def) {
      if (typeof options === "object" && options !== null) {
        return options;
      }
      if (def !== void 0) {
        return def;
      }
      return {};
    };
    exports.emptyOptions = Object.freeze({});
    exports.noop = function() {
    };
    exports.resolvedPromise = Promise.resolve();
    exports.deprecate = function(message) {
      if (!deprecations.has(message)) {
        deprecations.add(message);
        const c = globalThis.console;
        if (typeof c !== "undefined" && typeof c.warn === "function") {
          c.warn(new ModuleError(message, { code: "LEVEL_LEGACY" }));
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/errors.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/errors.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var ModuleError = require_module_error();
    var AbortError = class extends ModuleError {
      constructor(cause) {
        super("Operation has been aborted", {
          code: "LEVEL_ABORTED",
          cause
        });
      }
      // Set name to AbortError for web compatibility. See:
      // https://dom.spec.whatwg.org/#aborting-ongoing-activities
      // https://github.com/nodejs/node/pull/35911#discussion_r515779306
      get name() {
        return "AbortError";
      }
    };
    exports.AbortError = AbortError;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/abstract-iterator.js
var require_abstract_iterator = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/abstract-iterator.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var ModuleError = require_module_error();
    var combineErrors = require_maybe_combine_errors();
    var { getOptions, emptyOptions, noop } = require_common();
    var { AbortError } = require_errors();
    var kWorking = Symbol("working");
    var kDecodeOne = Symbol("decodeOne");
    var kDecodeMany = Symbol("decodeMany");
    var kSignal = Symbol("signal");
    var kPendingClose = Symbol("pendingClose");
    var kClosingPromise = Symbol("closingPromise");
    var kKeyEncoding = Symbol("keyEncoding");
    var kValueEncoding = Symbol("valueEncoding");
    var kKeys = Symbol("keys");
    var kValues = Symbol("values");
    var kLimit = Symbol("limit");
    var kCount = Symbol("count");
    var kEnded = Symbol("ended");
    var CommonIterator = class {
      constructor(db, options) {
        if (typeof db !== "object" || db === null) {
          const hint = db === null ? "null" : typeof db;
          throw new TypeError(`The first argument must be an abstract-level database, received ${hint}`);
        }
        if (typeof options !== "object" || options === null) {
          throw new TypeError("The second argument must be an options object");
        }
        this[kWorking] = false;
        this[kPendingClose] = null;
        this[kClosingPromise] = null;
        this[kKeyEncoding] = options[kKeyEncoding];
        this[kValueEncoding] = options[kValueEncoding];
        this[kLimit] = Number.isInteger(options.limit) && options.limit >= 0 ? options.limit : Infinity;
        this[kCount] = 0;
        this[kSignal] = options.signal != null ? options.signal : null;
        this[kEnded] = false;
        this.db = db;
        this.db.attachResource(this);
      }
      get count() {
        return this[kCount];
      }
      get limit() {
        return this[kLimit];
      }
      async next() {
        startWork(this);
        try {
          if (this[kEnded] || this[kCount] >= this[kLimit]) {
            this[kEnded] = true;
            return void 0;
          }
          let item = await this._next();
          if (item === void 0) {
            this[kEnded] = true;
            return void 0;
          }
          try {
            item = this[kDecodeOne](item);
          } catch (err) {
            throw new IteratorDecodeError(err);
          }
          this[kCount]++;
          return item;
        } finally {
          endWork(this);
        }
      }
      async _next() {
      }
      async nextv(size, options) {
        if (!Number.isInteger(size)) {
          throw new TypeError("The first argument 'size' must be an integer");
        }
        options = getOptions(options, emptyOptions);
        if (size < 1) size = 1;
        if (this[kLimit] < Infinity) size = Math.min(size, this[kLimit] - this[kCount]);
        startWork(this);
        try {
          if (this[kEnded] || size <= 0) {
            this[kEnded] = true;
            return [];
          }
          const items = await this._nextv(size, options);
          if (items.length === 0) {
            this[kEnded] = true;
            return items;
          }
          try {
            this[kDecodeMany](items);
          } catch (err) {
            throw new IteratorDecodeError(err);
          }
          this[kCount] += items.length;
          return items;
        } finally {
          endWork(this);
        }
      }
      async _nextv(size, options) {
        const acc = [];
        while (acc.length < size) {
          const item = await this._next(options);
          if (item !== void 0) {
            acc.push(item);
          } else {
            this[kEnded] = true;
            break;
          }
        }
        return acc;
      }
      async all(options) {
        options = getOptions(options, emptyOptions);
        startWork(this);
        try {
          if (this[kEnded] || this[kCount] >= this[kLimit]) {
            return [];
          }
          const items = await this._all(options);
          try {
            this[kDecodeMany](items);
          } catch (err) {
            throw new IteratorDecodeError(err);
          }
          this[kCount] += items.length;
          return items;
        } catch (err) {
          endWork(this);
          await destroy(this, err);
        } finally {
          this[kEnded] = true;
          if (this[kWorking]) {
            endWork(this);
            await this.close();
          }
        }
      }
      async _all(options) {
        let count = this[kCount];
        const acc = [];
        while (true) {
          const size = this[kLimit] < Infinity ? Math.min(1e3, this[kLimit] - count) : 1e3;
          if (size <= 0) {
            return acc;
          }
          const items = await this._nextv(size, options);
          if (items.length === 0) {
            return acc;
          }
          acc.push.apply(acc, items);
          count += items.length;
        }
      }
      seek(target, options) {
        options = getOptions(options, emptyOptions);
        if (this[kClosingPromise] !== null) {
        } else if (this[kWorking]) {
          throw new ModuleError("Iterator is busy: cannot call seek() until next() has completed", {
            code: "LEVEL_ITERATOR_BUSY"
          });
        } else {
          const keyEncoding = this.db.keyEncoding(options.keyEncoding || this[kKeyEncoding]);
          const keyFormat = keyEncoding.format;
          if (options.keyEncoding !== keyFormat) {
            options = { ...options, keyEncoding: keyFormat };
          }
          const mapped = this.db.prefixKey(keyEncoding.encode(target), keyFormat, false);
          this._seek(mapped, options);
          this[kEnded] = false;
        }
      }
      _seek(target, options) {
        throw new ModuleError("Iterator does not support seek()", {
          code: "LEVEL_NOT_SUPPORTED"
        });
      }
      async close() {
        if (this[kClosingPromise] !== null) {
          return this[kClosingPromise].catch(noop);
        }
        this[kClosingPromise] = new Promise((resolve, reject) => {
          this[kPendingClose] = () => {
            this[kPendingClose] = null;
            privateClose(this).then(resolve, reject);
          };
        });
        if (!this[kWorking]) {
          this[kPendingClose]();
        }
        return this[kClosingPromise];
      }
      async _close() {
      }
      async *[Symbol.asyncIterator]() {
        try {
          let item;
          while ((item = await this.next()) !== void 0) {
            yield item;
          }
        } catch (err) {
          await destroy(this, err);
        } finally {
          await this.close();
        }
      }
    };
    var AbstractIterator = class extends CommonIterator {
      constructor(db, options) {
        super(db, options);
        this[kKeys] = options.keys !== false;
        this[kValues] = options.values !== false;
      }
      [kDecodeOne](entry) {
        const key = entry[0];
        const value = entry[1];
        if (key !== void 0) {
          entry[0] = this[kKeys] ? this[kKeyEncoding].decode(key) : void 0;
        }
        if (value !== void 0) {
          entry[1] = this[kValues] ? this[kValueEncoding].decode(value) : void 0;
        }
        return entry;
      }
      [kDecodeMany](entries) {
        const keyEncoding = this[kKeyEncoding];
        const valueEncoding = this[kValueEncoding];
        for (const entry of entries) {
          const key = entry[0];
          const value = entry[1];
          if (key !== void 0) entry[0] = this[kKeys] ? keyEncoding.decode(key) : void 0;
          if (value !== void 0) entry[1] = this[kValues] ? valueEncoding.decode(value) : void 0;
        }
      }
    };
    var AbstractKeyIterator = class extends CommonIterator {
      [kDecodeOne](key) {
        return this[kKeyEncoding].decode(key);
      }
      [kDecodeMany](keys) {
        const keyEncoding = this[kKeyEncoding];
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key !== void 0) keys[i] = keyEncoding.decode(key);
        }
      }
    };
    var AbstractValueIterator = class extends CommonIterator {
      [kDecodeOne](value) {
        return this[kValueEncoding].decode(value);
      }
      [kDecodeMany](values) {
        const valueEncoding = this[kValueEncoding];
        for (let i = 0; i < values.length; i++) {
          const value = values[i];
          if (value !== void 0) values[i] = valueEncoding.decode(value);
        }
      }
    };
    var IteratorDecodeError = class extends ModuleError {
      constructor(cause) {
        super("Iterator could not decode data", {
          code: "LEVEL_DECODE_ERROR",
          cause
        });
      }
    };
    var startWork = function(iterator) {
      if (iterator[kClosingPromise] !== null) {
        throw new ModuleError("Iterator is not open: cannot read after close()", {
          code: "LEVEL_ITERATOR_NOT_OPEN"
        });
      } else if (iterator[kWorking]) {
        throw new ModuleError("Iterator is busy: cannot read until previous read has completed", {
          code: "LEVEL_ITERATOR_BUSY"
        });
      } else if (iterator[kSignal] !== null && iterator[kSignal].aborted) {
        throw new AbortError();
      }
      iterator[kWorking] = true;
    };
    var endWork = function(iterator) {
      iterator[kWorking] = false;
      if (iterator[kPendingClose] !== null) {
        iterator[kPendingClose]();
      }
    };
    var privateClose = async function(iterator) {
      await iterator._close();
      iterator.db.detachResource(iterator);
    };
    var destroy = async function(iterator, err) {
      try {
        await iterator.close();
      } catch (closeErr) {
        throw combineErrors([err, closeErr]);
      }
      throw err;
    };
    AbstractIterator.keyEncoding = kKeyEncoding;
    AbstractIterator.valueEncoding = kValueEncoding;
    exports.AbstractIterator = AbstractIterator;
    exports.AbstractKeyIterator = AbstractKeyIterator;
    exports.AbstractValueIterator = AbstractValueIterator;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/default-kv-iterator.js
var require_default_kv_iterator = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/default-kv-iterator.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { AbstractKeyIterator, AbstractValueIterator } = require_abstract_iterator();
    var kIterator = Symbol("iterator");
    var kHandleOne = Symbol("handleOne");
    var kHandleMany = Symbol("handleMany");
    var DefaultKeyIterator = class extends AbstractKeyIterator {
      constructor(db, options) {
        super(db, options);
        this[kIterator] = db.iterator({ ...options, keys: true, values: false });
      }
      [kHandleOne](entry) {
        return entry[0];
      }
      [kHandleMany](entries) {
        for (let i = 0; i < entries.length; i++) {
          entries[i] = entries[i][0];
        }
      }
    };
    var DefaultValueIterator = class extends AbstractValueIterator {
      constructor(db, options) {
        super(db, options);
        this[kIterator] = db.iterator({ ...options, keys: false, values: true });
      }
      [kHandleOne](entry) {
        return entry[1];
      }
      [kHandleMany](entries) {
        for (let i = 0; i < entries.length; i++) {
          entries[i] = entries[i][1];
        }
      }
    };
    for (const Iterator of [DefaultKeyIterator, DefaultValueIterator]) {
      Iterator.prototype._next = async function() {
        const entry = await this[kIterator].next();
        return entry === void 0 ? entry : this[kHandleOne](entry);
      };
      Iterator.prototype._nextv = async function(size, options) {
        const entries = await this[kIterator].nextv(size, options);
        this[kHandleMany](entries);
        return entries;
      };
      Iterator.prototype._all = async function(options) {
        const entries = await this[kIterator].all(options);
        this[kHandleMany](entries);
        return entries;
      };
      Iterator.prototype._seek = function(target, options) {
        this[kIterator].seek(target, options);
      };
      Iterator.prototype._close = async function() {
        return this[kIterator].close();
      };
    }
    exports.DefaultKeyIterator = DefaultKeyIterator;
    exports.DefaultValueIterator = DefaultValueIterator;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/deferred-iterator.js
var require_deferred_iterator = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/deferred-iterator.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { AbstractIterator, AbstractKeyIterator, AbstractValueIterator } = require_abstract_iterator();
    var ModuleError = require_module_error();
    var kNut = Symbol("nut");
    var kUndefer = Symbol("undefer");
    var kFactory = Symbol("factory");
    var kSignalOptions = Symbol("signalOptions");
    var DeferredIterator = class extends AbstractIterator {
      constructor(db, options) {
        super(db, options);
        this[kNut] = null;
        this[kFactory] = () => db.iterator(options);
        this[kSignalOptions] = { signal: options.signal };
        this.db.defer(() => this[kUndefer](), this[kSignalOptions]);
      }
    };
    var DeferredKeyIterator = class extends AbstractKeyIterator {
      constructor(db, options) {
        super(db, options);
        this[kNut] = null;
        this[kFactory] = () => db.keys(options);
        this[kSignalOptions] = { signal: options.signal };
        this.db.defer(() => this[kUndefer](), this[kSignalOptions]);
      }
    };
    var DeferredValueIterator = class extends AbstractValueIterator {
      constructor(db, options) {
        super(db, options);
        this[kNut] = null;
        this[kFactory] = () => db.values(options);
        this[kSignalOptions] = { signal: options.signal };
        this.db.defer(() => this[kUndefer](), this[kSignalOptions]);
      }
    };
    for (const Iterator of [DeferredIterator, DeferredKeyIterator, DeferredValueIterator]) {
      Iterator.prototype[kUndefer] = function() {
        if (this.db.status === "open") {
          this[kNut] = this[kFactory]();
        }
      };
      Iterator.prototype._next = async function() {
        if (this[kNut] !== null) {
          return this[kNut].next();
        } else if (this.db.status === "opening") {
          return this.db.deferAsync(() => this._next(), this[kSignalOptions]);
        } else {
          throw new ModuleError("Iterator is not open: cannot call next() after close()", {
            code: "LEVEL_ITERATOR_NOT_OPEN"
          });
        }
      };
      Iterator.prototype._nextv = async function(size, options) {
        if (this[kNut] !== null) {
          return this[kNut].nextv(size, options);
        } else if (this.db.status === "opening") {
          return this.db.deferAsync(() => this._nextv(size, options), this[kSignalOptions]);
        } else {
          throw new ModuleError("Iterator is not open: cannot call nextv() after close()", {
            code: "LEVEL_ITERATOR_NOT_OPEN"
          });
        }
      };
      Iterator.prototype._all = async function(options) {
        if (this[kNut] !== null) {
          return this[kNut].all();
        } else if (this.db.status === "opening") {
          return this.db.deferAsync(() => this._all(options), this[kSignalOptions]);
        } else {
          throw new ModuleError("Iterator is not open: cannot call all() after close()", {
            code: "LEVEL_ITERATOR_NOT_OPEN"
          });
        }
      };
      Iterator.prototype._seek = function(target, options) {
        if (this[kNut] !== null) {
          this[kNut]._seek(target, options);
        } else if (this.db.status === "opening") {
          this.db.defer(() => this._seek(target, options), this[kSignalOptions]);
        }
      };
      Iterator.prototype._close = async function() {
        if (this[kNut] !== null) {
          return this[kNut].close();
        } else if (this.db.status === "opening") {
          return this.db.deferAsync(() => this._close());
        }
      };
    }
    exports.DeferredIterator = DeferredIterator;
    exports.DeferredKeyIterator = DeferredKeyIterator;
    exports.DeferredValueIterator = DeferredValueIterator;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/prefixes.js
var require_prefixes = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/prefixes.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    exports.prefixDescendantKey = function(key, keyFormat, descendant, ancestor) {
      while (descendant !== null && descendant !== ancestor) {
        key = descendant.prefixKey(key, keyFormat, true);
        descendant = descendant.parent;
      }
      return key;
    };
    exports.isDescendant = function(db, ancestor) {
      while (true) {
        if (db.parent == null) return false;
        if (db.parent === ancestor) return true;
        db = db.parent;
      }
    };
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/prewrite-batch.js
var require_prewrite_batch = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/prewrite-batch.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { prefixDescendantKey, isDescendant } = require_prefixes();
    var kDb = Symbol("db");
    var kPrivateOperations = Symbol("privateOperations");
    var kPublicOperations = Symbol("publicOperations");
    var PrewriteBatch = class {
      constructor(db, privateOperations, publicOperations) {
        this[kDb] = db;
        this[kPrivateOperations] = privateOperations;
        this[kPublicOperations] = publicOperations;
      }
      add(op) {
        const isPut = op.type === "put";
        const delegated = op.sublevel != null;
        const db = delegated ? op.sublevel : this[kDb];
        const keyError = db._checkKey(op.key);
        if (keyError != null) throw keyError;
        op.keyEncoding = db.keyEncoding(op.keyEncoding);
        if (isPut) {
          const valueError = db._checkValue(op.value);
          if (valueError != null) throw valueError;
          op.valueEncoding = db.valueEncoding(op.valueEncoding);
        } else if (op.type !== "del") {
          throw new TypeError("A batch operation must have a type property that is 'put' or 'del'");
        }
        const keyEncoding = op.keyEncoding;
        const preencodedKey = keyEncoding.encode(op.key);
        const keyFormat = keyEncoding.format;
        const siblings = delegated && !isDescendant(op.sublevel, this[kDb]) && op.sublevel !== this[kDb];
        const encodedKey = delegated && !siblings ? prefixDescendantKey(preencodedKey, keyFormat, db, this[kDb]) : preencodedKey;
        if (delegated && !siblings) {
          op.sublevel = null;
        }
        let publicOperation = null;
        if (this[kPublicOperations] !== null && !siblings) {
          publicOperation = Object.assign({}, op);
          publicOperation.encodedKey = encodedKey;
          if (delegated) {
            publicOperation.key = encodedKey;
            publicOperation.keyEncoding = this[kDb].keyEncoding(keyFormat);
          }
          this[kPublicOperations].push(publicOperation);
        }
        op.key = siblings ? encodedKey : this[kDb].prefixKey(encodedKey, keyFormat, true);
        op.keyEncoding = keyFormat;
        if (isPut) {
          const valueEncoding = op.valueEncoding;
          const encodedValue = valueEncoding.encode(op.value);
          const valueFormat = valueEncoding.format;
          op.value = encodedValue;
          op.valueEncoding = valueFormat;
          if (publicOperation !== null) {
            publicOperation.encodedValue = encodedValue;
            if (delegated) {
              publicOperation.value = encodedValue;
              publicOperation.valueEncoding = this[kDb].valueEncoding(valueFormat);
            }
          }
        }
        this[kPrivateOperations].push(op);
        return this;
      }
    };
    exports.PrewriteBatch = PrewriteBatch;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/abstract-chained-batch.js
var require_abstract_chained_batch = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/abstract-chained-batch.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var combineErrors = require_maybe_combine_errors();
    var ModuleError = require_module_error();
    var { getOptions, emptyOptions, noop } = require_common();
    var { prefixDescendantKey, isDescendant } = require_prefixes();
    var { PrewriteBatch } = require_prewrite_batch();
    var kStatus = Symbol("status");
    var kPublicOperations = Symbol("publicOperations");
    var kLegacyOperations = Symbol("legacyOperations");
    var kPrivateOperations = Symbol("privateOperations");
    var kClosePromise = Symbol("closePromise");
    var kLength = Symbol("length");
    var kPrewriteRun = Symbol("prewriteRun");
    var kPrewriteBatch = Symbol("prewriteBatch");
    var kPrewriteData = Symbol("prewriteData");
    var kAddMode = Symbol("addMode");
    var AbstractChainedBatch = class {
      constructor(db, options) {
        if (typeof db !== "object" || db === null) {
          const hint = db === null ? "null" : typeof db;
          throw new TypeError(`The first argument must be an abstract-level database, received ${hint}`);
        }
        const enableWriteEvent = db.listenerCount("write") > 0;
        const enablePrewriteHook = !db.hooks.prewrite.noop;
        this[kPublicOperations] = enableWriteEvent ? [] : null;
        this[kLegacyOperations] = enableWriteEvent || enablePrewriteHook ? null : [];
        this[kLength] = 0;
        this[kStatus] = "open";
        this[kClosePromise] = null;
        this[kAddMode] = getOptions(options, emptyOptions).add === true;
        if (enablePrewriteHook) {
          const data = new PrewriteData([], enableWriteEvent ? [] : null);
          this[kPrewriteData] = data;
          this[kPrewriteBatch] = new PrewriteBatch(db, data[kPrivateOperations], data[kPublicOperations]);
          this[kPrewriteRun] = db.hooks.prewrite.run;
        } else {
          this[kPrewriteData] = null;
          this[kPrewriteBatch] = null;
          this[kPrewriteRun] = null;
        }
        this.db = db;
        this.db.attachResource(this);
      }
      get length() {
        if (this[kPrewriteData] !== null) {
          return this[kLength] + this[kPrewriteData].length;
        } else {
          return this[kLength];
        }
      }
      put(key, value, options) {
        assertStatus(this);
        options = getOptions(options, emptyOptions);
        const delegated = options.sublevel != null;
        const db = delegated ? options.sublevel : this.db;
        const original = options;
        const keyError = db._checkKey(key);
        const valueError = db._checkValue(value);
        if (keyError != null) throw keyError;
        if (valueError != null) throw valueError;
        const op = Object.assign({}, options, {
          type: "put",
          key,
          value,
          keyEncoding: db.keyEncoding(options.keyEncoding),
          valueEncoding: db.valueEncoding(options.valueEncoding)
        });
        if (this[kPrewriteRun] !== null) {
          try {
            this[kPrewriteRun](op, this[kPrewriteBatch]);
            op.keyEncoding = db.keyEncoding(op.keyEncoding);
            op.valueEncoding = db.valueEncoding(op.valueEncoding);
          } catch (err) {
            throw new ModuleError("The prewrite hook failed on batch.put()", {
              code: "LEVEL_HOOK_ERROR",
              cause: err
            });
          }
        }
        const keyEncoding = op.keyEncoding;
        const preencodedKey = keyEncoding.encode(op.key);
        const keyFormat = keyEncoding.format;
        const siblings = delegated && !isDescendant(op.sublevel, this.db) && op.sublevel !== this.db;
        const encodedKey = delegated && !siblings ? prefixDescendantKey(preencodedKey, keyFormat, db, this.db) : preencodedKey;
        const valueEncoding = op.valueEncoding;
        const encodedValue = valueEncoding.encode(op.value);
        const valueFormat = valueEncoding.format;
        if (delegated && !siblings) {
          op.sublevel = null;
        }
        if (this[kPublicOperations] !== null && !siblings) {
          const publicOperation = Object.assign({}, op);
          publicOperation.encodedKey = encodedKey;
          publicOperation.encodedValue = encodedValue;
          if (delegated) {
            publicOperation.key = encodedKey;
            publicOperation.value = encodedValue;
            publicOperation.keyEncoding = this.db.keyEncoding(keyFormat);
            publicOperation.valueEncoding = this.db.valueEncoding(valueFormat);
          }
          this[kPublicOperations].push(publicOperation);
        } else if (this[kLegacyOperations] !== null && !siblings) {
          const legacyOperation = Object.assign({}, original);
          legacyOperation.type = "put";
          legacyOperation.key = key;
          legacyOperation.value = value;
          this[kLegacyOperations].push(legacyOperation);
        }
        op.key = siblings ? encodedKey : this.db.prefixKey(encodedKey, keyFormat, true);
        op.value = encodedValue;
        op.keyEncoding = keyFormat;
        op.valueEncoding = valueFormat;
        if (this[kAddMode]) {
          this._add(op);
        } else {
          this._put(op.key, encodedValue, op);
        }
        this[kLength]++;
        return this;
      }
      _put(key, value, options) {
      }
      del(key, options) {
        assertStatus(this);
        options = getOptions(options, emptyOptions);
        const delegated = options.sublevel != null;
        const db = delegated ? options.sublevel : this.db;
        const original = options;
        const keyError = db._checkKey(key);
        if (keyError != null) throw keyError;
        const op = Object.assign({}, options, {
          type: "del",
          key,
          keyEncoding: db.keyEncoding(options.keyEncoding)
        });
        if (this[kPrewriteRun] !== null) {
          try {
            this[kPrewriteRun](op, this[kPrewriteBatch]);
            op.keyEncoding = db.keyEncoding(op.keyEncoding);
          } catch (err) {
            throw new ModuleError("The prewrite hook failed on batch.del()", {
              code: "LEVEL_HOOK_ERROR",
              cause: err
            });
          }
        }
        const keyEncoding = op.keyEncoding;
        const preencodedKey = keyEncoding.encode(op.key);
        const keyFormat = keyEncoding.format;
        const encodedKey = delegated ? prefixDescendantKey(preencodedKey, keyFormat, db, this.db) : preencodedKey;
        if (delegated) op.sublevel = null;
        if (this[kPublicOperations] !== null) {
          const publicOperation = Object.assign({}, op);
          publicOperation.encodedKey = encodedKey;
          if (delegated) {
            publicOperation.key = encodedKey;
            publicOperation.keyEncoding = this.db.keyEncoding(keyFormat);
          }
          this[kPublicOperations].push(publicOperation);
        } else if (this[kLegacyOperations] !== null) {
          const legacyOperation = Object.assign({}, original);
          legacyOperation.type = "del";
          legacyOperation.key = key;
          this[kLegacyOperations].push(legacyOperation);
        }
        op.key = this.db.prefixKey(encodedKey, keyFormat, true);
        op.keyEncoding = keyFormat;
        if (this[kAddMode]) {
          this._add(op);
        } else {
          this._del(op.key, op);
        }
        this[kLength]++;
        return this;
      }
      _del(key, options) {
      }
      _add(op) {
      }
      clear() {
        assertStatus(this);
        this._clear();
        if (this[kPublicOperations] !== null) this[kPublicOperations] = [];
        if (this[kLegacyOperations] !== null) this[kLegacyOperations] = [];
        if (this[kPrewriteData] !== null) this[kPrewriteData].clear();
        this[kLength] = 0;
        return this;
      }
      _clear() {
      }
      async write(options) {
        assertStatus(this);
        options = getOptions(options);
        if (this[kLength] === 0) {
          return this.close();
        } else {
          this[kStatus] = "writing";
          const close = prepareClose(this);
          try {
            if (this[kPrewriteData] !== null) {
              const publicOperations = this[kPrewriteData][kPublicOperations];
              const privateOperations = this[kPrewriteData][kPrivateOperations];
              const length = this[kPrewriteData].length;
              for (let i = 0; i < length; i++) {
                const op = privateOperations[i];
                if (this[kAddMode]) {
                  this._add(op);
                } else if (op.type === "put") {
                  this._put(op.key, op.value, op);
                } else {
                  this._del(op.key, op);
                }
              }
              if (publicOperations !== null && length !== 0) {
                this[kPublicOperations] = this[kPublicOperations].concat(publicOperations);
              }
            }
            await this._write(options);
          } catch (err) {
            close();
            try {
              await this[kClosePromise];
            } catch (closeErr) {
              err = combineErrors([err, closeErr]);
            }
            throw err;
          }
          close();
          if (this[kPublicOperations] !== null) {
            this.db.emit("write", this[kPublicOperations]);
          } else if (this[kLegacyOperations] !== null) {
            this.db.emit("batch", this[kLegacyOperations]);
          }
          return this[kClosePromise];
        }
      }
      async _write(options) {
      }
      async close() {
        if (this[kClosePromise] !== null) {
          return this[kClosePromise].catch(noop);
        } else {
          prepareClose(this)();
          return this[kClosePromise];
        }
      }
      async _close() {
      }
    };
    var prepareClose = function(batch) {
      let close;
      batch[kClosePromise] = new Promise((resolve, reject) => {
        close = () => {
          privateClose(batch).then(resolve, reject);
        };
      });
      return close;
    };
    var privateClose = async function(batch) {
      batch[kStatus] = "closing";
      await batch._close();
      batch.db.detachResource(batch);
    };
    var PrewriteData = class {
      constructor(privateOperations, publicOperations) {
        this[kPrivateOperations] = privateOperations;
        this[kPublicOperations] = publicOperations;
      }
      get length() {
        return this[kPrivateOperations].length;
      }
      clear() {
        for (const k of [kPublicOperations, kPrivateOperations]) {
          const ops = this[k];
          if (ops !== null) {
            ops.splice(0, ops.length);
          }
        }
      }
    };
    var assertStatus = function(batch) {
      if (batch[kStatus] !== "open") {
        throw new ModuleError("Batch is not open: cannot change operations after write() or close()", {
          code: "LEVEL_BATCH_NOT_OPEN"
        });
      }
      if (batch.db.status !== "open") {
        throw new ModuleError("Database is not open", {
          code: "LEVEL_DATABASE_NOT_OPEN"
        });
      }
    };
    exports.AbstractChainedBatch = AbstractChainedBatch;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/default-chained-batch.js
var require_default_chained_batch = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/default-chained-batch.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { AbstractChainedBatch } = require_abstract_chained_batch();
    var kEncoded = Symbol("encoded");
    var DefaultChainedBatch = class extends AbstractChainedBatch {
      constructor(db) {
        super(db, { add: true });
        this[kEncoded] = [];
      }
      _add(op) {
        this[kEncoded].push(op);
      }
      _clear() {
        this[kEncoded] = [];
      }
      async _write(options) {
        return this.db._batch(this[kEncoded], options);
      }
    };
    exports.DefaultChainedBatch = DefaultChainedBatch;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/hooks.js
var require_hooks = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/hooks.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { noop } = require_common();
    var kFunctions = Symbol("functions");
    var kAsync = Symbol("async");
    var DatabaseHooks = class {
      constructor() {
        this.postopen = new Hook({ async: true });
        this.prewrite = new Hook({ async: false });
        this.newsub = new Hook({ async: false });
      }
    };
    var Hook = class {
      constructor(options) {
        this[kAsync] = options.async;
        this[kFunctions] = /* @__PURE__ */ new Set();
        this.noop = true;
        this.run = runner(this);
      }
      add(fn) {
        assertFunction(fn);
        this[kFunctions].add(fn);
        this.noop = false;
        this.run = runner(this);
      }
      delete(fn) {
        assertFunction(fn);
        this[kFunctions].delete(fn);
        this.noop = this[kFunctions].size === 0;
        this.run = runner(this);
      }
    };
    var assertFunction = function(fn) {
      if (typeof fn !== "function") {
        const hint = fn === null ? "null" : typeof fn;
        throw new TypeError(`The first argument must be a function, received ${hint}`);
      }
    };
    var runner = function(hook) {
      if (hook.noop) {
        return noop;
      } else if (hook[kFunctions].size === 1) {
        const [fn] = hook[kFunctions];
        return fn;
      } else if (hook[kAsync]) {
        const run = async function(functions, ...args) {
          for (const fn of functions) {
            await fn(...args);
          }
        };
        return run.bind(null, Array.from(hook[kFunctions]));
      } else {
        const run = function(functions, ...args) {
          for (const fn of functions) {
            fn(...args);
          }
        };
        return run.bind(null, Array.from(hook[kFunctions]));
      }
    };
    exports.DatabaseHooks = DatabaseHooks;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/event-monitor.js
var require_event_monitor = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/event-monitor.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { deprecate } = require_common();
    exports.EventMonitor = class EventMonitor {
      constructor(emitter, events) {
        for (const event of events) {
          this[event.name] = false;
          if (event.deprecated) {
            event.message = `The '${event.name}' event is deprecated in favor of '${event.alt}' and will be removed in a future version of abstract-level`;
          }
        }
        const map = new Map(events.map((e) => [e.name, e]));
        const monitor = this;
        emitter.on("newListener", beforeAdded);
        emitter.on("removeListener", afterRemoved);
        function beforeAdded(name) {
          const event = map.get(name);
          if (event !== void 0) {
            monitor[name] = true;
            if (event.deprecated) {
              deprecate(event.message);
            }
          }
        }
        function afterRemoved(name) {
          if (map.has(name)) {
            monitor[name] = this.listenerCount(name) > 0;
          }
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/deferred-queue.js
var require_deferred_queue = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/deferred-queue.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { getOptions, emptyOptions } = require_common();
    var { AbortError } = require_errors();
    var kOperations = Symbol("operations");
    var kSignals = Symbol("signals");
    var kHandleAbort = Symbol("handleAbort");
    var DeferredOperation = class {
      constructor(fn, signal) {
        this.fn = fn;
        this.signal = signal;
      }
    };
    var DeferredQueue = class {
      constructor() {
        this[kOperations] = [];
        this[kSignals] = /* @__PURE__ */ new Set();
        this[kHandleAbort] = this[kHandleAbort].bind(this);
      }
      add(fn, options) {
        options = getOptions(options, emptyOptions);
        const signal = options.signal;
        if (signal == null) {
          this[kOperations].push(new DeferredOperation(fn, null));
          return;
        }
        if (signal.aborted) {
          fn(new AbortError());
          return;
        }
        if (!this[kSignals].has(signal)) {
          this[kSignals].add(signal);
          signal.addEventListener("abort", this[kHandleAbort], { once: true });
        }
        this[kOperations].push(new DeferredOperation(fn, signal));
      }
      drain() {
        const operations = this[kOperations];
        const signals = this[kSignals];
        this[kOperations] = [];
        this[kSignals] = /* @__PURE__ */ new Set();
        for (const signal of signals) {
          signal.removeEventListener("abort", this[kHandleAbort]);
        }
        for (const operation of operations) {
          operation.fn.call(null);
        }
      }
      [kHandleAbort](ev) {
        const signal = ev.target;
        const err = new AbortError();
        const aborted = [];
        this[kOperations] = this[kOperations].filter(function(operation) {
          if (operation.signal !== null && operation.signal === signal) {
            aborted.push(operation);
            return false;
          } else {
            return true;
          }
        });
        this[kSignals].delete(signal);
        for (const operation of aborted) {
          operation.fn.call(null, err);
        }
      }
    };
    exports.DeferredQueue = DeferredQueue;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/range-options.js
var require_range_options = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/range-options.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var rangeOptions = /* @__PURE__ */ new Set(["lt", "lte", "gt", "gte"]);
    module.exports = function(options, keyEncoding) {
      const result = {};
      for (const k in options) {
        if (!hasOwnProperty.call(options, k)) continue;
        if (k === "keyEncoding" || k === "valueEncoding") continue;
        if (rangeOptions.has(k)) {
          result[k] = keyEncoding.encode(options[k]);
        } else {
          result[k] = options[k];
        }
      }
      result.reverse = !!result.reverse;
      result.limit = Number.isInteger(result.limit) && result.limit >= 0 ? result.limit : -1;
      return result;
    };
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/abstract-sublevel-iterator.js
var require_abstract_sublevel_iterator = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/abstract-sublevel-iterator.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { AbstractIterator, AbstractKeyIterator, AbstractValueIterator } = require_abstract_iterator();
    var kUnfix = Symbol("unfix");
    var kIterator = Symbol("iterator");
    var AbstractSublevelIterator = class extends AbstractIterator {
      constructor(db, options, iterator, unfix) {
        super(db, options);
        this[kIterator] = iterator;
        this[kUnfix] = unfix;
      }
      async _next() {
        const entry = await this[kIterator].next();
        if (entry !== void 0) {
          const key = entry[0];
          if (key !== void 0) entry[0] = this[kUnfix](key);
        }
        return entry;
      }
      async _nextv(size, options) {
        const entries = await this[kIterator].nextv(size, options);
        const unfix = this[kUnfix];
        for (const entry of entries) {
          const key = entry[0];
          if (key !== void 0) entry[0] = unfix(key);
        }
        return entries;
      }
      async _all(options) {
        const entries = await this[kIterator].all(options);
        const unfix = this[kUnfix];
        for (const entry of entries) {
          const key = entry[0];
          if (key !== void 0) entry[0] = unfix(key);
        }
        return entries;
      }
    };
    var AbstractSublevelKeyIterator = class extends AbstractKeyIterator {
      constructor(db, options, iterator, unfix) {
        super(db, options);
        this[kIterator] = iterator;
        this[kUnfix] = unfix;
      }
      async _next() {
        const key = await this[kIterator].next();
        return key === void 0 ? key : this[kUnfix](key);
      }
      async _nextv(size, options) {
        const keys = await this[kIterator].nextv(size, options);
        const unfix = this[kUnfix];
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key !== void 0) keys[i] = unfix(key);
        }
        return keys;
      }
      async _all(options) {
        const keys = await this[kIterator].all(options);
        const unfix = this[kUnfix];
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key !== void 0) keys[i] = unfix(key);
        }
        return keys;
      }
    };
    var AbstractSublevelValueIterator = class extends AbstractValueIterator {
      constructor(db, options, iterator) {
        super(db, options);
        this[kIterator] = iterator;
      }
      async _next() {
        return this[kIterator].next();
      }
      async _nextv(size, options) {
        return this[kIterator].nextv(size, options);
      }
      async _all(options) {
        return this[kIterator].all(options);
      }
    };
    for (const Iterator of [AbstractSublevelIterator, AbstractSublevelKeyIterator, AbstractSublevelValueIterator]) {
      Iterator.prototype._seek = function(target, options) {
        this[kIterator].seek(target, options);
      };
      Iterator.prototype._close = async function() {
        return this[kIterator].close();
      };
    }
    exports.AbstractSublevelIterator = AbstractSublevelIterator;
    exports.AbstractSublevelKeyIterator = AbstractSublevelKeyIterator;
    exports.AbstractSublevelValueIterator = AbstractSublevelValueIterator;
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/abstract-sublevel.js
var require_abstract_sublevel = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/lib/abstract-sublevel.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var ModuleError = require_module_error();
    var { Buffer: Buffer2 } = (init_dist(), __toCommonJS(dist_exports)) || {};
    var {
      AbstractSublevelIterator,
      AbstractSublevelKeyIterator,
      AbstractSublevelValueIterator
    } = require_abstract_sublevel_iterator();
    var kGlobalPrefix = Symbol("prefix");
    var kLocalPrefix = Symbol("localPrefix");
    var kLocalPath = Symbol("localPath");
    var kGlobalPath = Symbol("globalPath");
    var kGlobalUpperBound = Symbol("upperBound");
    var kPrefixRange = Symbol("prefixRange");
    var kRoot = Symbol("root");
    var kParent = Symbol("parent");
    var kUnfix = Symbol("unfix");
    var textEncoder = new TextEncoder();
    var defaults = { separator: "!" };
    module.exports = function({ AbstractLevel }) {
      class AbstractSublevel extends AbstractLevel {
        static defaults(options) {
          if (options == null) {
            return defaults;
          } else if (!options.separator) {
            return { ...options, separator: "!" };
          } else {
            return options;
          }
        }
        // TODO: add autoClose option, which if true, does parent.attachResource(this)
        constructor(db, name, options) {
          const { separator, manifest, ...forward } = AbstractSublevel.defaults(options);
          const names = [].concat(name).map((name2) => trim(name2, separator));
          const reserved = separator.charCodeAt(0) + 1;
          const root = db[kRoot] || db;
          if (!names.every((name2) => textEncoder.encode(name2).every((x) => x > reserved && x < 127))) {
            throw new ModuleError(`Sublevel name must use bytes > ${reserved} < ${127}`, {
              code: "LEVEL_INVALID_PREFIX"
            });
          }
          super(mergeManifests(db, manifest), forward);
          const localPrefix = names.map((name2) => separator + name2 + separator).join("");
          const globalPrefix = (db.prefix || "") + localPrefix;
          const globalUpperBound = globalPrefix.slice(0, -1) + String.fromCharCode(reserved);
          this[kRoot] = root;
          this[kParent] = db;
          this[kLocalPath] = names;
          this[kGlobalPath] = db.prefix ? db.path().concat(names) : names;
          this[kGlobalPrefix] = new MultiFormat(globalPrefix);
          this[kGlobalUpperBound] = new MultiFormat(globalUpperBound);
          this[kLocalPrefix] = new MultiFormat(localPrefix);
          this[kUnfix] = new Unfixer();
        }
        prefixKey(key, keyFormat, local) {
          const prefix = local ? this[kLocalPrefix] : this[kGlobalPrefix];
          if (keyFormat === "utf8") {
            return prefix.utf8 + key;
          } else if (key.byteLength === 0) {
            return prefix[keyFormat];
          } else if (keyFormat === "view") {
            const view = prefix.view;
            const result = new Uint8Array(view.byteLength + key.byteLength);
            result.set(view, 0);
            result.set(key, view.byteLength);
            return result;
          } else {
            const buffer2 = prefix.buffer;
            return Buffer2.concat([buffer2, key], buffer2.byteLength + key.byteLength);
          }
        }
        // Not exposed for now.
        [kPrefixRange](range, keyFormat) {
          if (range.gte !== void 0) {
            range.gte = this.prefixKey(range.gte, keyFormat, false);
          } else if (range.gt !== void 0) {
            range.gt = this.prefixKey(range.gt, keyFormat, false);
          } else {
            range.gte = this[kGlobalPrefix][keyFormat];
          }
          if (range.lte !== void 0) {
            range.lte = this.prefixKey(range.lte, keyFormat, false);
          } else if (range.lt !== void 0) {
            range.lt = this.prefixKey(range.lt, keyFormat, false);
          } else {
            range.lte = this[kGlobalUpperBound][keyFormat];
          }
        }
        get prefix() {
          return this[kGlobalPrefix].utf8;
        }
        get db() {
          return this[kRoot];
        }
        get parent() {
          return this[kParent];
        }
        path(local = false) {
          return local ? this[kLocalPath] : this[kGlobalPath];
        }
        async _open(options) {
          return this[kParent].open({ passive: true });
        }
        async _put(key, value, options) {
          return this[kParent].put(key, value, options);
        }
        async _get(key, options) {
          return this[kParent].get(key, options);
        }
        async _getMany(keys, options) {
          return this[kParent].getMany(keys, options);
        }
        async _del(key, options) {
          return this[kParent].del(key, options);
        }
        async _batch(operations, options) {
          return this[kParent].batch(operations, options);
        }
        // TODO: call parent instead of root
        async _clear(options) {
          this[kPrefixRange](options, options.keyEncoding);
          return this[kRoot].clear(options);
        }
        // TODO: call parent instead of root
        _iterator(options) {
          this[kPrefixRange](options, options.keyEncoding);
          const iterator = this[kRoot].iterator(options);
          const unfix = this[kUnfix].get(this[kGlobalPrefix].utf8.length, options.keyEncoding);
          return new AbstractSublevelIterator(this, options, iterator, unfix);
        }
        _keys(options) {
          this[kPrefixRange](options, options.keyEncoding);
          const iterator = this[kRoot].keys(options);
          const unfix = this[kUnfix].get(this[kGlobalPrefix].utf8.length, options.keyEncoding);
          return new AbstractSublevelKeyIterator(this, options, iterator, unfix);
        }
        _values(options) {
          this[kPrefixRange](options, options.keyEncoding);
          const iterator = this[kRoot].values(options);
          return new AbstractSublevelValueIterator(this, options, iterator);
        }
      }
      return { AbstractSublevel };
    };
    var mergeManifests = function(parent, manifest) {
      return {
        // Inherit manifest of parent db
        ...parent.supports,
        // Disable unsupported features
        createIfMissing: false,
        errorIfExists: false,
        // Unset additional events because we're not forwarding them
        events: {},
        // Unset additional methods (like approximateSize) which we can't support here unless
        // the AbstractSublevel class is overridden by an implementation of `abstract-level`.
        additionalMethods: {},
        // Inherit manifest of custom AbstractSublevel subclass. Such a class is not
        // allowed to override encodings.
        ...manifest,
        encodings: {
          utf8: supportsEncoding(parent, "utf8"),
          buffer: supportsEncoding(parent, "buffer"),
          view: supportsEncoding(parent, "view")
        }
      };
    };
    var supportsEncoding = function(parent, encoding) {
      return parent.supports.encodings[encoding] ? parent.keyEncoding(encoding).name === encoding : false;
    };
    var MultiFormat = class {
      constructor(key) {
        this.utf8 = key;
        this.view = textEncoder.encode(key);
        this.buffer = Buffer2 ? Buffer2.from(this.view.buffer, 0, this.view.byteLength) : {};
      }
    };
    var Unfixer = class {
      constructor() {
        this.cache = /* @__PURE__ */ new Map();
      }
      get(prefixLength, keyFormat) {
        let unfix = this.cache.get(keyFormat);
        if (unfix === void 0) {
          if (keyFormat === "view") {
            unfix = function(prefixLength2, key) {
              return key.subarray(prefixLength2);
            }.bind(null, prefixLength);
          } else {
            unfix = function(prefixLength2, key) {
              return key.slice(prefixLength2);
            }.bind(null, prefixLength);
          }
          this.cache.set(keyFormat, unfix);
        }
        return unfix;
      }
    };
    var trim = function(str, char) {
      let start = 0;
      let end = str.length;
      while (start < end && str[start] === char) start++;
      while (end > start && str[end - 1] === char) end--;
      return str.slice(start, end);
    };
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/abstract-level.js
var require_abstract_level = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/abstract-level.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { supports } = require_level_supports();
    var { Transcoder } = require_level_transcoder();
    var { EventEmitter } = require_events();
    var ModuleError = require_module_error();
    var combineErrors = require_maybe_combine_errors();
    var { AbstractIterator } = require_abstract_iterator();
    var { DefaultKeyIterator, DefaultValueIterator } = require_default_kv_iterator();
    var { DeferredIterator, DeferredKeyIterator, DeferredValueIterator } = require_deferred_iterator();
    var { DefaultChainedBatch } = require_default_chained_batch();
    var { DatabaseHooks } = require_hooks();
    var { PrewriteBatch } = require_prewrite_batch();
    var { EventMonitor } = require_event_monitor();
    var { getOptions, noop, emptyOptions, resolvedPromise } = require_common();
    var { prefixDescendantKey, isDescendant } = require_prefixes();
    var { DeferredQueue } = require_deferred_queue();
    var rangeOptions = require_range_options();
    var kResources = Symbol("resources");
    var kCloseResources = Symbol("closeResources");
    var kQueue = Symbol("queue");
    var kDeferOpen = Symbol("deferOpen");
    var kOptions = Symbol("options");
    var kStatus = Symbol("status");
    var kStatusChange = Symbol("statusChange");
    var kStatusLocked = Symbol("statusLocked");
    var kDefaultOptions = Symbol("defaultOptions");
    var kTranscoder = Symbol("transcoder");
    var kKeyEncoding = Symbol("keyEncoding");
    var kValueEncoding = Symbol("valueEncoding");
    var kEventMonitor = Symbol("eventMonitor");
    var kArrayBatch = Symbol("arrayBatch");
    var AbstractLevel = class extends EventEmitter {
      constructor(manifest, options) {
        super();
        if (typeof manifest !== "object" || manifest === null) {
          throw new TypeError("The first argument 'manifest' must be an object");
        }
        options = getOptions(options);
        const { keyEncoding, valueEncoding, passive, ...forward } = options;
        this[kResources] = /* @__PURE__ */ new Set();
        this[kQueue] = new DeferredQueue();
        this[kDeferOpen] = true;
        this[kOptions] = forward;
        this[kStatus] = "opening";
        this[kStatusChange] = null;
        this[kStatusLocked] = false;
        this.hooks = new DatabaseHooks();
        this.supports = supports(manifest, {
          deferredOpen: true,
          // TODO (next major): add seek
          snapshots: manifest.snapshots !== false,
          permanence: manifest.permanence !== false,
          encodings: manifest.encodings || {},
          events: Object.assign({}, manifest.events, {
            opening: true,
            open: true,
            closing: true,
            closed: true,
            write: true,
            put: true,
            del: true,
            batch: true,
            clear: true
          })
        });
        this[kEventMonitor] = new EventMonitor(this, [
          { name: "write" },
          { name: "put", deprecated: true, alt: "write" },
          { name: "del", deprecated: true, alt: "write" },
          { name: "batch", deprecated: true, alt: "write" }
        ]);
        this[kTranscoder] = new Transcoder(formats(this));
        this[kKeyEncoding] = this[kTranscoder].encoding(keyEncoding || "utf8");
        this[kValueEncoding] = this[kTranscoder].encoding(valueEncoding || "utf8");
        for (const encoding of this[kTranscoder].encodings()) {
          if (!this.supports.encodings[encoding.commonName]) {
            this.supports.encodings[encoding.commonName] = true;
          }
        }
        this[kDefaultOptions] = {
          empty: emptyOptions,
          entry: Object.freeze({
            keyEncoding: this[kKeyEncoding].commonName,
            valueEncoding: this[kValueEncoding].commonName
          }),
          entryFormat: Object.freeze({
            keyEncoding: this[kKeyEncoding].format,
            valueEncoding: this[kValueEncoding].format
          }),
          key: Object.freeze({
            keyEncoding: this[kKeyEncoding].commonName
          }),
          keyFormat: Object.freeze({
            keyEncoding: this[kKeyEncoding].format
          })
        };
        queueMicrotask(() => {
          if (this[kDeferOpen]) {
            this.open({ passive: false }).catch(noop);
          }
        });
      }
      get status() {
        return this[kStatus];
      }
      get parent() {
        return null;
      }
      keyEncoding(encoding) {
        return this[kTranscoder].encoding(encoding != null ? encoding : this[kKeyEncoding]);
      }
      valueEncoding(encoding) {
        return this[kTranscoder].encoding(encoding != null ? encoding : this[kValueEncoding]);
      }
      async open(options) {
        options = { ...this[kOptions], ...getOptions(options) };
        options.createIfMissing = options.createIfMissing !== false;
        options.errorIfExists = !!options.errorIfExists;
        const postopen = this.hooks.postopen.noop ? null : this.hooks.postopen.run;
        const passive = options.passive;
        if (passive && this[kDeferOpen]) {
          await void 0;
        }
        assertUnlocked(this);
        while (this[kStatusChange] !== null) await this[kStatusChange].catch(noop);
        assertUnlocked(this);
        if (passive) {
          if (this[kStatus] !== "open") throw new NotOpenError();
        } else if (this[kStatus] === "closed" || this[kDeferOpen]) {
          this[kDeferOpen] = false;
          this[kStatusChange] = resolvedPromise;
          this[kStatusChange] = (async () => {
            this[kStatus] = "opening";
            try {
              this.emit("opening");
              await this._open(options);
            } catch (err) {
              this[kStatus] = "closed";
              this[kQueue].drain();
              try {
                await this[kCloseResources]();
              } catch (resourceErr) {
                err = combineErrors([err, resourceErr]);
              }
              throw new NotOpenError(err);
            }
            this[kStatus] = "open";
            if (postopen !== null) {
              let hookErr;
              try {
                this[kStatusLocked] = true;
                await postopen(options);
              } catch (err) {
                hookErr = convertRejection(err);
              } finally {
                this[kStatusLocked] = false;
              }
              if (hookErr) {
                this[kStatus] = "closing";
                this[kQueue].drain();
                try {
                  await this[kCloseResources]();
                  await this._close();
                } catch (closeErr) {
                  this[kStatusLocked] = true;
                  hookErr = combineErrors([hookErr, closeErr]);
                }
                this[kStatus] = "closed";
                throw new ModuleError("The postopen hook failed on open()", {
                  code: "LEVEL_HOOK_ERROR",
                  cause: hookErr
                });
              }
            }
            this[kQueue].drain();
            this.emit("open");
          })();
          try {
            await this[kStatusChange];
          } finally {
            this[kStatusChange] = null;
          }
        } else if (this[kStatus] !== "open") {
          throw new NotOpenError();
        }
      }
      async _open(options) {
      }
      async close() {
        assertUnlocked(this);
        while (this[kStatusChange] !== null) await this[kStatusChange].catch(noop);
        assertUnlocked(this);
        if (this[kStatus] === "open" || this[kDeferOpen]) {
          const fromInitial = this[kDeferOpen];
          this[kDeferOpen] = false;
          this[kStatusChange] = resolvedPromise;
          this[kStatusChange] = (async () => {
            this[kStatus] = "closing";
            this[kQueue].drain();
            try {
              this.emit("closing");
              await this[kCloseResources]();
              if (!fromInitial) await this._close();
            } catch (err) {
              this[kStatus] = "open";
              this[kQueue].drain();
              throw new NotClosedError(err);
            }
            this[kStatus] = "closed";
            this[kQueue].drain();
            this.emit("closed");
          })();
          try {
            await this[kStatusChange];
          } finally {
            this[kStatusChange] = null;
          }
        } else if (this[kStatus] !== "closed") {
          throw new NotClosedError();
        }
      }
      async [kCloseResources]() {
        if (this[kResources].size === 0) {
          return;
        }
        const resources = Array.from(this[kResources]);
        const promises = resources.map(closeResource);
        return Promise.allSettled(promises).then(async (results) => {
          const errors = [];
          for (let i = 0; i < results.length; i++) {
            if (results[i].status === "fulfilled") {
              this[kResources].delete(resources[i]);
            } else {
              errors.push(convertRejection(results[i].reason));
            }
          }
          if (errors.length > 0) {
            throw combineErrors(errors);
          }
        });
      }
      async _close() {
      }
      async get(key, options) {
        options = getOptions(options, this[kDefaultOptions].entry);
        if (this[kStatus] === "opening") {
          return this.deferAsync(() => this.get(key, options));
        }
        assertOpen(this);
        const err = this._checkKey(key);
        if (err) throw err;
        const keyEncoding = this.keyEncoding(options.keyEncoding);
        const valueEncoding = this.valueEncoding(options.valueEncoding);
        const keyFormat = keyEncoding.format;
        const valueFormat = valueEncoding.format;
        if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
          options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
        }
        const encodedKey = keyEncoding.encode(key);
        const value = await this._get(this.prefixKey(encodedKey, keyFormat, true), options);
        try {
          return value === void 0 ? value : valueEncoding.decode(value);
        } catch (err2) {
          throw new ModuleError("Could not decode value", {
            code: "LEVEL_DECODE_ERROR",
            cause: err2
          });
        }
      }
      async _get(key, options) {
        return void 0;
      }
      async getMany(keys, options) {
        options = getOptions(options, this[kDefaultOptions].entry);
        if (this[kStatus] === "opening") {
          return this.deferAsync(() => this.getMany(keys, options));
        }
        assertOpen(this);
        if (!Array.isArray(keys)) {
          throw new TypeError("The first argument 'keys' must be an array");
        }
        if (keys.length === 0) {
          return [];
        }
        const keyEncoding = this.keyEncoding(options.keyEncoding);
        const valueEncoding = this.valueEncoding(options.valueEncoding);
        const keyFormat = keyEncoding.format;
        const valueFormat = valueEncoding.format;
        if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
          options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
        }
        const mappedKeys = new Array(keys.length);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const err = this._checkKey(key);
          if (err) throw err;
          mappedKeys[i] = this.prefixKey(keyEncoding.encode(key), keyFormat, true);
        }
        const values = await this._getMany(mappedKeys, options);
        try {
          for (let i = 0; i < values.length; i++) {
            if (values[i] !== void 0) {
              values[i] = valueEncoding.decode(values[i]);
            }
          }
        } catch (err) {
          throw new ModuleError(`Could not decode one or more of ${values.length} value(s)`, {
            code: "LEVEL_DECODE_ERROR",
            cause: err
          });
        }
        return values;
      }
      async _getMany(keys, options) {
        return new Array(keys.length).fill(void 0);
      }
      async put(key, value, options) {
        if (!this.hooks.prewrite.noop) {
          return this.batch([{ type: "put", key, value }], options);
        }
        options = getOptions(options, this[kDefaultOptions].entry);
        if (this[kStatus] === "opening") {
          return this.deferAsync(() => this.put(key, value, options));
        }
        assertOpen(this);
        const err = this._checkKey(key) || this._checkValue(value);
        if (err) throw err;
        const keyEncoding = this.keyEncoding(options.keyEncoding);
        const valueEncoding = this.valueEncoding(options.valueEncoding);
        const keyFormat = keyEncoding.format;
        const valueFormat = valueEncoding.format;
        const enableWriteEvent = this[kEventMonitor].write;
        const original = options;
        if (options === this[kDefaultOptions].entry) {
          options = this[kDefaultOptions].entryFormat;
        } else if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
          options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
        }
        const encodedKey = keyEncoding.encode(key);
        const prefixedKey = this.prefixKey(encodedKey, keyFormat, true);
        const encodedValue = valueEncoding.encode(value);
        await this._put(prefixedKey, encodedValue, options);
        if (enableWriteEvent) {
          const op = Object.assign({}, original, {
            type: "put",
            key,
            value,
            keyEncoding,
            valueEncoding,
            encodedKey,
            encodedValue
          });
          this.emit("write", [op]);
        } else {
          this.emit("put", key, value);
        }
      }
      async _put(key, value, options) {
      }
      async del(key, options) {
        if (!this.hooks.prewrite.noop) {
          return this.batch([{ type: "del", key }], options);
        }
        options = getOptions(options, this[kDefaultOptions].key);
        if (this[kStatus] === "opening") {
          return this.deferAsync(() => this.del(key, options));
        }
        assertOpen(this);
        const err = this._checkKey(key);
        if (err) throw err;
        const keyEncoding = this.keyEncoding(options.keyEncoding);
        const keyFormat = keyEncoding.format;
        const enableWriteEvent = this[kEventMonitor].write;
        const original = options;
        if (options === this[kDefaultOptions].key) {
          options = this[kDefaultOptions].keyFormat;
        } else if (options.keyEncoding !== keyFormat) {
          options = Object.assign({}, options, { keyEncoding: keyFormat });
        }
        const encodedKey = keyEncoding.encode(key);
        const prefixedKey = this.prefixKey(encodedKey, keyFormat, true);
        await this._del(prefixedKey, options);
        if (enableWriteEvent) {
          const op = Object.assign({}, original, {
            type: "del",
            key,
            keyEncoding,
            encodedKey
          });
          this.emit("write", [op]);
        } else {
          this.emit("del", key);
        }
      }
      async _del(key, options) {
      }
      // TODO (future): add way for implementations to declare which options are for the
      // whole batch rather than defaults for individual operations. E.g. the sync option
      // of classic-level, that should not be copied to individual operations.
      batch(operations, options) {
        if (!arguments.length) {
          assertOpen(this);
          return this._chainedBatch();
        }
        options = getOptions(options, this[kDefaultOptions].empty);
        return this[kArrayBatch](operations, options);
      }
      // Wrapped for async error handling
      async [kArrayBatch](operations, options) {
        if (this[kStatus] === "opening") {
          return this.deferAsync(() => this[kArrayBatch](operations, options));
        }
        assertOpen(this);
        if (!Array.isArray(operations)) {
          throw new TypeError("The first argument 'operations' must be an array");
        }
        if (operations.length === 0) {
          return;
        }
        const length = operations.length;
        const enablePrewriteHook = !this.hooks.prewrite.noop;
        const enableWriteEvent = this[kEventMonitor].write;
        const publicOperations = enableWriteEvent ? new Array(length) : null;
        const privateOperations = new Array(length);
        const prewriteBatch = enablePrewriteHook ? new PrewriteBatch(this, privateOperations, publicOperations) : null;
        for (let i = 0; i < length; i++) {
          const op = Object.assign({}, options, operations[i]);
          const isPut = op.type === "put";
          const delegated = op.sublevel != null;
          const db = delegated ? op.sublevel : this;
          const keyError = db._checkKey(op.key);
          if (keyError != null) throw keyError;
          op.keyEncoding = db.keyEncoding(op.keyEncoding);
          if (isPut) {
            const valueError = db._checkValue(op.value);
            if (valueError != null) throw valueError;
            op.valueEncoding = db.valueEncoding(op.valueEncoding);
          } else if (op.type !== "del") {
            throw new TypeError("A batch operation must have a type property that is 'put' or 'del'");
          }
          if (enablePrewriteHook) {
            try {
              this.hooks.prewrite.run(op, prewriteBatch);
              op.keyEncoding = db.keyEncoding(op.keyEncoding);
              if (isPut) op.valueEncoding = db.valueEncoding(op.valueEncoding);
            } catch (err) {
              throw new ModuleError("The prewrite hook failed on batch()", {
                code: "LEVEL_HOOK_ERROR",
                cause: err
              });
            }
          }
          const keyEncoding = op.keyEncoding;
          const preencodedKey = keyEncoding.encode(op.key);
          const keyFormat = keyEncoding.format;
          const siblings = delegated && !isDescendant(op.sublevel, this) && op.sublevel !== this;
          const encodedKey = delegated && !siblings ? prefixDescendantKey(preencodedKey, keyFormat, db, this) : preencodedKey;
          if (delegated && !siblings) {
            op.sublevel = null;
          }
          let publicOperation = null;
          if (enableWriteEvent && !siblings) {
            publicOperation = Object.assign({}, op);
            publicOperation.encodedKey = encodedKey;
            if (delegated) {
              publicOperation.key = encodedKey;
              publicOperation.keyEncoding = this.keyEncoding(keyFormat);
            }
            publicOperations[i] = publicOperation;
          }
          op.key = siblings ? encodedKey : this.prefixKey(encodedKey, keyFormat, true);
          op.keyEncoding = keyFormat;
          if (isPut) {
            const valueEncoding = op.valueEncoding;
            const encodedValue = valueEncoding.encode(op.value);
            const valueFormat = valueEncoding.format;
            op.value = encodedValue;
            op.valueEncoding = valueFormat;
            if (enableWriteEvent && !siblings) {
              publicOperation.encodedValue = encodedValue;
              if (delegated) {
                publicOperation.value = encodedValue;
                publicOperation.valueEncoding = this.valueEncoding(valueFormat);
              }
            }
          }
          privateOperations[i] = op;
        }
        await this._batch(privateOperations, options);
        if (enableWriteEvent) {
          this.emit("write", publicOperations);
        } else if (!enablePrewriteHook) {
          this.emit("batch", operations);
        }
      }
      async _batch(operations, options) {
      }
      sublevel(name, options) {
        const xopts = AbstractSublevel.defaults(options);
        const sublevel = this._sublevel(name, xopts);
        if (!this.hooks.newsub.noop) {
          try {
            this.hooks.newsub.run(sublevel, xopts);
          } catch (err) {
            throw new ModuleError("The newsub hook failed on sublevel()", {
              code: "LEVEL_HOOK_ERROR",
              cause: err
            });
          }
        }
        return sublevel;
      }
      _sublevel(name, options) {
        return new AbstractSublevel(this, name, options);
      }
      prefixKey(key, keyFormat, local) {
        return key;
      }
      async clear(options) {
        options = getOptions(options, this[kDefaultOptions].empty);
        if (this[kStatus] === "opening") {
          return this.deferAsync(() => this.clear(options));
        }
        assertOpen(this);
        const original = options;
        const keyEncoding = this.keyEncoding(options.keyEncoding);
        options = rangeOptions(options, keyEncoding);
        options.keyEncoding = keyEncoding.format;
        if (options.limit !== 0) {
          await this._clear(options);
          this.emit("clear", original);
        }
      }
      async _clear(options) {
      }
      iterator(options) {
        const keyEncoding = this.keyEncoding(options && options.keyEncoding);
        const valueEncoding = this.valueEncoding(options && options.valueEncoding);
        options = rangeOptions(options, keyEncoding);
        options.keys = options.keys !== false;
        options.values = options.values !== false;
        options[AbstractIterator.keyEncoding] = keyEncoding;
        options[AbstractIterator.valueEncoding] = valueEncoding;
        options.keyEncoding = keyEncoding.format;
        options.valueEncoding = valueEncoding.format;
        if (this[kStatus] === "opening") {
          return new DeferredIterator(this, options);
        }
        assertOpen(this);
        return this._iterator(options);
      }
      _iterator(options) {
        return new AbstractIterator(this, options);
      }
      keys(options) {
        const keyEncoding = this.keyEncoding(options && options.keyEncoding);
        const valueEncoding = this.valueEncoding(options && options.valueEncoding);
        options = rangeOptions(options, keyEncoding);
        options[AbstractIterator.keyEncoding] = keyEncoding;
        options[AbstractIterator.valueEncoding] = valueEncoding;
        options.keyEncoding = keyEncoding.format;
        options.valueEncoding = valueEncoding.format;
        if (this[kStatus] === "opening") {
          return new DeferredKeyIterator(this, options);
        }
        assertOpen(this);
        return this._keys(options);
      }
      _keys(options) {
        return new DefaultKeyIterator(this, options);
      }
      values(options) {
        const keyEncoding = this.keyEncoding(options && options.keyEncoding);
        const valueEncoding = this.valueEncoding(options && options.valueEncoding);
        options = rangeOptions(options, keyEncoding);
        options[AbstractIterator.keyEncoding] = keyEncoding;
        options[AbstractIterator.valueEncoding] = valueEncoding;
        options.keyEncoding = keyEncoding.format;
        options.valueEncoding = valueEncoding.format;
        if (this[kStatus] === "opening") {
          return new DeferredValueIterator(this, options);
        }
        assertOpen(this);
        return this._values(options);
      }
      _values(options) {
        return new DefaultValueIterator(this, options);
      }
      defer(fn, options) {
        if (typeof fn !== "function") {
          throw new TypeError("The first argument must be a function");
        }
        this[kQueue].add(function(abortError) {
          if (!abortError) fn();
        }, options);
      }
      deferAsync(fn, options) {
        if (typeof fn !== "function") {
          throw new TypeError("The first argument must be a function");
        }
        return new Promise((resolve, reject) => {
          this[kQueue].add(function(abortError) {
            if (abortError) reject(abortError);
            else fn().then(resolve, reject);
          }, options);
        });
      }
      // TODO: docs and types
      attachResource(resource) {
        if (typeof resource !== "object" || resource === null || typeof resource.close !== "function") {
          throw new TypeError("The first argument must be a resource object");
        }
        this[kResources].add(resource);
      }
      // TODO: docs and types
      detachResource(resource) {
        this[kResources].delete(resource);
      }
      _chainedBatch() {
        return new DefaultChainedBatch(this);
      }
      _checkKey(key) {
        if (key === null || key === void 0) {
          return new ModuleError("Key cannot be null or undefined", {
            code: "LEVEL_INVALID_KEY"
          });
        }
      }
      _checkValue(value) {
        if (value === null || value === void 0) {
          return new ModuleError("Value cannot be null or undefined", {
            code: "LEVEL_INVALID_VALUE"
          });
        }
      }
    };
    var { AbstractSublevel } = require_abstract_sublevel()({ AbstractLevel });
    exports.AbstractLevel = AbstractLevel;
    exports.AbstractSublevel = AbstractSublevel;
    var assertOpen = function(db) {
      if (db[kStatus] !== "open") {
        throw new ModuleError("Database is not open", {
          code: "LEVEL_DATABASE_NOT_OPEN"
        });
      }
    };
    var assertUnlocked = function(db) {
      if (db[kStatusLocked]) {
        throw new ModuleError("Database status is locked", {
          code: "LEVEL_STATUS_LOCKED"
        });
      }
    };
    var formats = function(db) {
      return Object.keys(db.supports.encodings).filter((k) => !!db.supports.encodings[k]);
    };
    var closeResource = function(resource) {
      return resource.close();
    };
    var convertRejection = function(reason) {
      if (reason instanceof Error) {
        return reason;
      }
      if (Object.prototype.toString.call(reason) === "[object Error]") {
        return reason;
      }
      const hint = reason === null ? "null" : typeof reason;
      const msg = `Promise rejection reason must be an Error, received ${hint}`;
      return new TypeError(msg);
    };
    var NotOpenError = class extends ModuleError {
      constructor(cause) {
        super("Database failed to open", {
          code: "LEVEL_DATABASE_NOT_OPEN",
          cause
        });
      }
    };
    var NotClosedError = class extends ModuleError {
      constructor(cause) {
        super("Database failed to close", {
          code: "LEVEL_DATABASE_NOT_CLOSED",
          cause
        });
      }
    };
  }
});

// ../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/index.js
var require_abstract_level2 = __commonJS({
  "../../node_modules/.pnpm/abstract-level@2.0.2/node_modules/abstract-level/index.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    exports.AbstractLevel = require_abstract_level().AbstractLevel;
    exports.AbstractSublevel = require_abstract_level().AbstractSublevel;
    exports.AbstractIterator = require_abstract_iterator().AbstractIterator;
    exports.AbstractKeyIterator = require_abstract_iterator().AbstractKeyIterator;
    exports.AbstractValueIterator = require_abstract_iterator().AbstractValueIterator;
    exports.AbstractChainedBatch = require_abstract_chained_batch().AbstractChainedBatch;
  }
});

// ../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/util/key-range.js
var require_key_range = __commonJS({
  "../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/util/key-range.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    module.exports = function createKeyRange(options) {
      const lower = options.gte !== void 0 ? options.gte : options.gt !== void 0 ? options.gt : void 0;
      const upper = options.lte !== void 0 ? options.lte : options.lt !== void 0 ? options.lt : void 0;
      const lowerExclusive = options.gte === void 0;
      const upperExclusive = options.lte === void 0;
      if (lower !== void 0 && upper !== void 0) {
        return IDBKeyRange.bound(lower, upper, lowerExclusive, upperExclusive);
      } else if (lower !== void 0) {
        return IDBKeyRange.lowerBound(lower, lowerExclusive);
      } else if (upper !== void 0) {
        return IDBKeyRange.upperBound(upper, upperExclusive);
      } else {
        return null;
      }
    };
  }
});

// ../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/util/deserialize.js
var require_deserialize = __commonJS({
  "../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/util/deserialize.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var textEncoder = new TextEncoder();
    module.exports = function(data) {
      if (data === void 0) {
        return data;
      } else if (data instanceof Uint8Array) {
        return data;
      } else if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
      } else {
        return textEncoder.encode(data);
      }
    };
  }
});

// ../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/iterator.js
var require_iterator = __commonJS({
  "../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/iterator.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { AbstractIterator } = require_abstract_level2();
    var createKeyRange = require_key_range();
    var deserialize2 = require_deserialize();
    var kCache = Symbol("cache");
    var kFinished = Symbol("finished");
    var kOptions = Symbol("options");
    var kCurrentOptions = Symbol("currentOptions");
    var kPosition = Symbol("position");
    var kLocation = Symbol("location");
    var kFirst = Symbol("first");
    var emptyOptions = {};
    var Iterator = class extends AbstractIterator {
      constructor(db, location, options) {
        super(db, options);
        this[kCache] = [];
        this[kFinished] = this.limit === 0;
        this[kOptions] = options;
        this[kCurrentOptions] = { ...options };
        this[kPosition] = void 0;
        this[kLocation] = location;
        this[kFirst] = true;
      }
      // Note: if called by _all() then size can be Infinity. This is an internal
      // detail; by design AbstractIterator.nextv() does not support Infinity.
      async _nextv(size, options) {
        this[kFirst] = false;
        if (this[kFinished]) {
          return [];
        }
        if (this[kCache].length > 0) {
          size = Math.min(size, this[kCache].length);
          return this[kCache].splice(0, size);
        }
        if (this[kPosition] !== void 0) {
          if (this[kOptions].reverse) {
            this[kCurrentOptions].lt = this[kPosition];
            this[kCurrentOptions].lte = void 0;
          } else {
            this[kCurrentOptions].gt = this[kPosition];
            this[kCurrentOptions].gte = void 0;
          }
        }
        let keyRange;
        try {
          keyRange = createKeyRange(this[kCurrentOptions]);
        } catch (_2) {
          this[kFinished] = true;
          return [];
        }
        const transaction = this.db.db.transaction([this[kLocation]], "readonly");
        const store = transaction.objectStore(this[kLocation]);
        const entries = [];
        const promise = new Promise(function(resolve, reject) {
          transaction.onabort = () => {
            reject(transaction.error || new Error("aborted by user"));
          };
          transaction.oncomplete = () => {
            resolve(entries);
          };
        });
        if (!this[kOptions].reverse) {
          let keys;
          let values;
          const complete = () => {
            if (keys === void 0 || values === void 0) return;
            const length = Math.max(keys.length, values.length);
            if (length === 0 || size === Infinity) {
              this[kFinished] = true;
            } else {
              this[kPosition] = keys[length - 1];
            }
            entries.length = length;
            for (let i = 0; i < length; i++) {
              const key = keys[i];
              const value = values[i];
              entries[i] = [
                this[kOptions].keys ? deserialize2(key) : void 0,
                this[kOptions].values ? deserialize2(value) : void 0
              ];
            }
            maybeCommit(transaction);
          };
          if (this[kOptions].keys || size < Infinity) {
            store.getAllKeys(keyRange, size < Infinity ? size : void 0).onsuccess = (ev) => {
              keys = ev.target.result;
              complete();
            };
          } else {
            keys = [];
            complete();
          }
          if (this[kOptions].values) {
            store.getAll(keyRange, size < Infinity ? size : void 0).onsuccess = (ev) => {
              values = ev.target.result;
              complete();
            };
          } else {
            values = [];
            complete();
          }
        } else {
          const method = !this[kOptions].values && store.openKeyCursor ? "openKeyCursor" : "openCursor";
          store[method](keyRange, "prev").onsuccess = (ev) => {
            const cursor = ev.target.result;
            if (cursor) {
              const { key, value } = cursor;
              this[kPosition] = key;
              entries.push([
                this[kOptions].keys && key !== void 0 ? deserialize2(key) : void 0,
                this[kOptions].values && value !== void 0 ? deserialize2(value) : void 0
              ]);
              if (entries.length < size) {
                cursor.continue();
              } else {
                maybeCommit(transaction);
              }
            } else {
              this[kFinished] = true;
            }
          };
        }
        return promise;
      }
      async _next() {
        if (this[kCache].length > 0) {
          return this[kCache].shift();
        }
        if (!this[kFinished]) {
          let size = Math.min(100, this.limit - this.count);
          if (this[kFirst]) {
            this[kFirst] = false;
            size = 1;
          }
          this[kCache] = await this._nextv(size, emptyOptions);
          return this[kCache].shift();
        }
      }
      async _all(options) {
        this[kFirst] = false;
        const cache = this[kCache].splice(0, this[kCache].length);
        const size = this.limit - this.count - cache.length;
        if (size <= 0) {
          return cache;
        }
        let entries = await this._nextv(size, emptyOptions);
        if (cache.length > 0) entries = cache.concat(entries);
        return entries;
      }
      _seek(target, options) {
        this[kFirst] = true;
        this[kCache] = [];
        this[kFinished] = false;
        this[kPosition] = void 0;
        this[kCurrentOptions] = { ...this[kOptions] };
        let keyRange;
        try {
          keyRange = createKeyRange(this[kOptions]);
        } catch (_2) {
          this[kFinished] = true;
          return;
        }
        if (keyRange !== null && !keyRange.includes(target)) {
          this[kFinished] = true;
        } else if (this[kOptions].reverse) {
          this[kCurrentOptions].lte = target;
        } else {
          this[kCurrentOptions].gte = target;
        }
      }
    };
    exports.Iterator = Iterator;
    function maybeCommit(transaction) {
      if (typeof transaction.commit === "function") {
        transaction.commit();
      }
    }
  }
});

// ../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/util/clear.js
var require_clear = __commonJS({
  "../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/util/clear.js"(exports, module) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    module.exports = async function clear(db, location, keyRange, options) {
      if (options.limit === 0) return;
      const transaction = db.db.transaction([location], "readwrite");
      const store = transaction.objectStore(location);
      let count = 0;
      const promise = new Promise(function(resolve, reject) {
        transaction.oncomplete = resolve;
        transaction.onabort = function() {
          reject(transaction.error || new Error("aborted by user"));
        };
      });
      const method = store.openKeyCursor ? "openKeyCursor" : "openCursor";
      const direction = options.reverse ? "prev" : "next";
      store[method](keyRange, direction).onsuccess = function(ev) {
        const cursor = ev.target.result;
        if (cursor) {
          store.delete(cursor.key).onsuccess = function() {
            if (options.limit <= 0 || ++count < options.limit) {
              cursor.continue();
            }
          };
        }
      };
      return promise;
    };
  }
});

// ../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/index.js
var require_browser_level = __commonJS({
  "../../node_modules/.pnpm/browser-level@2.0.0/node_modules/browser-level/index.js"(exports) {
    "use strict";
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    var { AbstractLevel } = require_abstract_level2();
    var { Iterator } = require_iterator();
    var deserialize2 = require_deserialize();
    var clear = require_clear();
    var createKeyRange = require_key_range();
    var DEFAULT_PREFIX = "level-js-";
    var kIDB = Symbol("idb");
    var kNamePrefix = Symbol("namePrefix");
    var kLocation = Symbol("location");
    var kVersion = Symbol("version");
    var kStore = Symbol("store");
    var kOnComplete = Symbol("onComplete");
    var BrowserLevel = class extends AbstractLevel {
      constructor(location, options) {
        const { prefix, version, ...forward } = options || {};
        super({
          encodings: { view: true },
          snapshots: false,
          createIfMissing: false,
          errorIfExists: false,
          seek: true
        }, forward);
        if (typeof location !== "string" || location === "") {
          throw new TypeError("The first argument 'location' must be a non-empty string");
        }
        this[kLocation] = location;
        this[kNamePrefix] = prefix == null ? DEFAULT_PREFIX : prefix;
        this[kVersion] = parseInt(version || 1, 10);
        this[kIDB] = null;
      }
      get location() {
        return this[kLocation];
      }
      get namePrefix() {
        return this[kNamePrefix];
      }
      get version() {
        return this[kVersion];
      }
      // Exposed for backwards compat and unit tests
      get db() {
        return this[kIDB];
      }
      get type() {
        return "browser-level";
      }
      async _open(options) {
        const request = indexedDB.open(this[kNamePrefix] + this[kLocation], this[kVersion]);
        request.onupgradeneeded = (ev) => {
          const db = ev.target.result;
          if (!db.objectStoreNames.contains(this[kLocation])) {
            db.createObjectStore(this[kLocation]);
          }
        };
        return new Promise((resolve, reject) => {
          request.onerror = function() {
            reject(request.error || new Error("unknown error"));
          };
          request.onsuccess = () => {
            this[kIDB] = request.result;
            resolve();
          };
        });
      }
      [kStore](mode) {
        const transaction = this[kIDB].transaction([this[kLocation]], mode);
        return transaction.objectStore(this[kLocation]);
      }
      [kOnComplete](request) {
        const transaction = request.transaction;
        return new Promise(function(resolve, reject) {
          transaction.onabort = function() {
            reject(transaction.error || new Error("aborted by user"));
          };
          transaction.oncomplete = function() {
            resolve(request.result);
          };
        });
      }
      async _get(key, options) {
        const store = this[kStore]("readonly");
        const request = store.get(key);
        const value = await this[kOnComplete](request);
        return deserialize2(value);
      }
      async _getMany(keys, options) {
        const store = this[kStore]("readonly");
        const iterator = keys.values();
        const n = Math.min(16, keys.length);
        const bees = new Array(n);
        const values = new Array(keys.length);
        let keyIndex = 0;
        let abort = false;
        const bee = async function() {
          try {
            for (const key of iterator) {
              if (abort) break;
              const valueIndex = keyIndex++;
              const request = store.get(key);
              await new Promise(function(resolve, reject) {
                request.onsuccess = () => {
                  values[valueIndex] = deserialize2(request.result);
                  resolve();
                };
                request.onerror = (ev) => {
                  ev.stopPropagation();
                  reject(request.error);
                };
              });
            }
          } catch (err) {
            abort = true;
            throw err;
          }
        };
        for (let i = 0; i < n; i++) {
          bees[i] = bee();
        }
        await Promise.allSettled(bees);
        return values;
      }
      async _del(key, options) {
        const store = this[kStore]("readwrite");
        const request = store.delete(key);
        return this[kOnComplete](request);
      }
      async _put(key, value, options) {
        const store = this[kStore]("readwrite");
        const request = store.put(value, key);
        return this[kOnComplete](request);
      }
      // TODO: implement key and value iterators
      _iterator(options) {
        return new Iterator(this, this[kLocation], options);
      }
      async _batch(operations, options) {
        const store = this[kStore]("readwrite");
        const transaction = store.transaction;
        let index = 0;
        let error;
        const promise = new Promise(function(resolve, reject) {
          transaction.onabort = function() {
            reject(error || transaction.error || new Error("aborted by user"));
          };
          transaction.oncomplete = resolve;
        });
        function loop() {
          const op = operations[index++];
          const key = op.key;
          let req;
          try {
            req = op.type === "del" ? store.delete(key) : store.put(op.value, key);
          } catch (err) {
            error = err;
            transaction.abort();
            return;
          }
          if (index < operations.length) {
            req.onsuccess = loop;
          } else if (typeof transaction.commit === "function") {
            transaction.commit();
          }
        }
        loop();
        return promise;
      }
      async _clear(options) {
        let keyRange;
        try {
          keyRange = createKeyRange(options);
        } catch (e) {
          return;
        }
        if (options.limit >= 0) {
          return clear(this, this[kLocation], keyRange, options);
        }
        const store = this[kStore]("readwrite");
        const request = keyRange ? store.delete(keyRange) : store.clear();
        return this[kOnComplete](request);
      }
      async _close() {
        this[kIDB].close();
      }
    };
    BrowserLevel.destroy = async function(location, prefix) {
      if (prefix == null) {
        prefix = DEFAULT_PREFIX;
      }
      const request = indexedDB.deleteDatabase(prefix + location);
      return new Promise(function(resolve, reject) {
        request.onsuccess = resolve;
        request.onerror = reject;
      });
    };
    exports.BrowserLevel = BrowserLevel;
  }
});

// ../../node_modules/.pnpm/level@9.0.0/node_modules/level/browser.js
var require_browser = __commonJS({
  "../../node_modules/.pnpm/level@9.0.0/node_modules/level/browser.js"(exports) {
    var import_dist46 = __toESM(require_dist());
    var import_dist47 = __toESM(require_dist2());
    var import_dist48 = __toESM(require_dist3());
    exports.Level = require_browser_level().BrowserLevel;
  }
});

// ../../node_modules/.pnpm/@midnight-ntwrk+midnight-js-level-private-state-provider@2.0.2/node_modules/@midnight-ntwrk/midnight-js-level-private-state-provider/dist/index.mjs
var import_dist43 = __toESM(require_dist(), 1);
var import_dist44 = __toESM(require_dist2(), 1);
var import_dist45 = __toESM(require_dist3(), 1);
init_dist();
var import_level = __toESM(require_browser(), 1);
var import_lodash = __toESM(require_lodash(), 1);

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.js
var import_dist40 = __toESM(require_dist());
var import_dist41 = __toESM(require_dist2());
var import_dist42 = __toESM(require_dist3());

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/class-registry.js
var import_dist10 = __toESM(require_dist(), 1);
var import_dist11 = __toESM(require_dist2(), 1);
var import_dist12 = __toESM(require_dist3(), 1);

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/registry.js
var import_dist7 = __toESM(require_dist(), 1);
var import_dist8 = __toESM(require_dist2(), 1);
var import_dist9 = __toESM(require_dist3(), 1);

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/double-indexed-kv.js
var import_dist4 = __toESM(require_dist(), 1);
var import_dist5 = __toESM(require_dist2(), 1);
var import_dist6 = __toESM(require_dist3(), 1);
var DoubleIndexedKV = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map();
    this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }
  getByKey(key) {
    return this.keyToValue.get(key);
  }
  getByValue(value) {
    return this.valueToKey.get(value);
  }
  clear() {
    this.keyToValue.clear();
    this.valueToKey.clear();
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/registry.js
var Registry = class {
  constructor(generateIdentifier) {
    this.generateIdentifier = generateIdentifier;
    this.kv = new DoubleIndexedKV();
  }
  register(value, identifier) {
    if (this.kv.getByValue(value)) {
      return;
    }
    if (!identifier) {
      identifier = this.generateIdentifier(value);
    }
    this.kv.set(identifier, value);
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(value) {
    return this.kv.getByValue(value);
  }
  getValue(identifier) {
    return this.kv.getByKey(identifier);
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/class-registry.js
var ClassRegistry = class extends Registry {
  constructor() {
    super((c) => c.name);
    this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(value, options) {
    if (typeof options === "object") {
      if (options.allowProps) {
        this.classToAllowedProps.set(value, options.allowProps);
      }
      super.register(value, options.identifier);
    } else {
      super.register(value, options);
    }
  }
  getAllowedProps(value) {
    return this.classToAllowedProps.get(value);
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/custom-transformer-registry.js
var import_dist16 = __toESM(require_dist(), 1);
var import_dist17 = __toESM(require_dist2(), 1);
var import_dist18 = __toESM(require_dist3(), 1);

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/util.js
var import_dist13 = __toESM(require_dist(), 1);
var import_dist14 = __toESM(require_dist2(), 1);
var import_dist15 = __toESM(require_dist3(), 1);
function valuesOfObj(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  const values = [];
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
}
function find(record, predicate) {
  const values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  const valuesNotNever = values;
  for (let i = 0; i < valuesNotNever.length; i++) {
    const value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
function forEach(record, run) {
  Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (let i = 0; i < record.length; i++) {
    const value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/custom-transformer-registry.js
var CustomTransformerRegistry = class {
  constructor() {
    this.transfomers = {};
  }
  register(transformer) {
    this.transfomers[transformer.name] = transformer;
  }
  findApplicable(v) {
    return find(this.transfomers, (transformer) => transformer.isApplicable(v));
  }
  findByName(name) {
    return this.transfomers[name];
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/plainer.js
var import_dist31 = __toESM(require_dist(), 1);
var import_dist32 = __toESM(require_dist2(), 1);
var import_dist33 = __toESM(require_dist3(), 1);

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/is.js
var import_dist19 = __toESM(require_dist(), 1);
var import_dist20 = __toESM(require_dist2(), 1);
var import_dist21 = __toESM(require_dist3(), 1);
var getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
var isUndefined = (payload) => typeof payload === "undefined";
var isNull = (payload) => payload === null;
var isPlainObject = (payload) => {
  if (typeof payload !== "object" || payload === null)
    return false;
  if (payload === Object.prototype)
    return false;
  if (Object.getPrototypeOf(payload) === null)
    return true;
  return Object.getPrototypeOf(payload) === Object.prototype;
};
var isEmptyObject = (payload) => isPlainObject(payload) && Object.keys(payload).length === 0;
var isArray = (payload) => Array.isArray(payload);
var isString = (payload) => typeof payload === "string";
var isNumber = (payload) => typeof payload === "number" && !isNaN(payload);
var isBoolean = (payload) => typeof payload === "boolean";
var isRegExp = (payload) => payload instanceof RegExp;
var isMap = (payload) => payload instanceof Map;
var isSet = (payload) => payload instanceof Set;
var isSymbol = (payload) => getType(payload) === "Symbol";
var isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
var isError = (payload) => payload instanceof Error;
var isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
var isPrimitive = (payload) => isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
var isBigint = (payload) => typeof payload === "bigint";
var isInfinite = (payload) => payload === Infinity || payload === -Infinity;
var isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
var isURL = (payload) => payload instanceof URL;

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/pathstringifier.js
var import_dist22 = __toESM(require_dist(), 1);
var import_dist23 = __toESM(require_dist2(), 1);
var import_dist24 = __toESM(require_dist3(), 1);
var escapeKey = (key) => key.replace(/\./g, "\\.");
var stringifyPath = (path) => path.map(String).map(escapeKey).join(".");
var parsePath = (string) => {
  const result = [];
  let segment = "";
  for (let i = 0; i < string.length; i++) {
    let char = string.charAt(i);
    const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
    if (isEscapedDot) {
      segment += ".";
      i++;
      continue;
    }
    const isEndOfSegment = char === ".";
    if (isEndOfSegment) {
      result.push(segment);
      segment = "";
      continue;
    }
    segment += char;
  }
  const lastSegment = segment;
  result.push(lastSegment);
  return result;
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/transformer.js
var import_dist25 = __toESM(require_dist(), 1);
var import_dist26 = __toESM(require_dist2(), 1);
var import_dist27 = __toESM(require_dist3(), 1);
function simpleTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var simpleRules = [
  simpleTransformation(isUndefined, "undefined", () => null, () => void 0),
  simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
    if (typeof BigInt !== "undefined") {
      return BigInt(v);
    }
    console.error("Please add a BigInt polyfill.");
    return v;
  }),
  simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
  simpleTransformation(isError, "Error", (v, superJson) => {
    const baseError = {
      name: v.name,
      message: v.message
    };
    superJson.allowedErrorProps.forEach((prop) => {
      baseError[prop] = v[prop];
    });
    return baseError;
  }, (v, superJson) => {
    const e = new Error(v.message);
    e.name = v.name;
    e.stack = v.stack;
    superJson.allowedErrorProps.forEach((prop) => {
      e[prop] = v[prop];
    });
    return e;
  }),
  simpleTransformation(isRegExp, "regexp", (v) => "" + v, (regex) => {
    const body = regex.slice(1, regex.lastIndexOf("/"));
    const flags = regex.slice(regex.lastIndexOf("/") + 1);
    return new RegExp(body, flags);
  }),
  simpleTransformation(
    isSet,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (v) => [...v.values()],
    (v) => new Set(v)
  ),
  simpleTransformation(isMap, "map", (v) => [...v.entries()], (v) => new Map(v)),
  simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
    if (isNaNValue(v)) {
      return "NaN";
    }
    if (v > 0) {
      return "Infinity";
    } else {
      return "-Infinity";
    }
  }, Number),
  simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
    return "-0";
  }, Number),
  simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var symbolRule = compositeTransformation((s, superJson) => {
  if (isSymbol(s)) {
    const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
    return isRegistered;
  }
  return false;
}, (s, superJson) => {
  const identifier = superJson.symbolRegistry.getIdentifier(s);
  return ["symbol", identifier];
}, (v) => v.description, (_2, a, superJson) => {
  const value = superJson.symbolRegistry.getValue(a[1]);
  if (!value) {
    throw new Error("Trying to deserialize unknown symbol");
  }
  return value;
});
var constructorToName = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((obj, ctor) => {
  obj[ctor.name] = ctor;
  return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, (v) => ["typed-array", v.constructor.name], (v) => [...v], (v, a) => {
  const ctor = constructorToName[a[1]];
  if (!ctor) {
    throw new Error("Trying to deserialize unknown typed array");
  }
  return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass?.constructor) {
    const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
  const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
  return ["class", identifier];
}, (clazz, superJson) => {
  const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
  if (!allowedProps) {
    return { ...clazz };
  }
  const result = {};
  allowedProps.forEach((prop) => {
    result[prop] = clazz[prop];
  });
  return result;
}, (v, a, superJson) => {
  const clazz = superJson.classRegistry.getValue(a[1]);
  if (!clazz) {
    throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  }
  return Object.assign(Object.create(clazz.prototype), v);
});
var customRule = compositeTransformation((value, superJson) => {
  return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return ["custom", transformer.name];
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return transformer.serialize(value);
}, (v, a, superJson) => {
  const transformer = superJson.customTransformerRegistry.findByName(a[1]);
  if (!transformer) {
    throw new Error("Trying to deserialize unknown custom value");
  }
  return transformer.deserialize(v);
});
var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
var transformValue = (value, superJson) => {
  const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableCompositeRule) {
    return {
      value: applicableCompositeRule.transform(value, superJson),
      type: applicableCompositeRule.annotation(value, superJson)
    };
  }
  const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableSimpleRule) {
    return {
      value: applicableSimpleRule.transform(value, superJson),
      type: applicableSimpleRule.annotation
    };
  }
  return void 0;
};
var simpleRulesByAnnotation = {};
simpleRules.forEach((rule) => {
  simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = (json, type, superJson) => {
  if (isArray(type)) {
    switch (type[0]) {
      case "symbol":
        return symbolRule.untransform(json, type, superJson);
      case "class":
        return classRule.untransform(json, type, superJson);
      case "custom":
        return customRule.untransform(json, type, superJson);
      case "typed-array":
        return typedArrayRule.untransform(json, type, superJson);
      default:
        throw new Error("Unknown transformation: " + type);
    }
  } else {
    const transformation = simpleRulesByAnnotation[type];
    if (!transformation) {
      throw new Error("Unknown transformation: " + type);
    }
    return transformation.untransform(json, superJson);
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/accessDeep.js
var import_dist28 = __toESM(require_dist(), 1);
var import_dist29 = __toESM(require_dist2(), 1);
var import_dist30 = __toESM(require_dist3(), 1);
var getNthKey = (value, n) => {
  if (n > value.size)
    throw new Error("index out of bounds");
  const keys = value.keys();
  while (n > 0) {
    keys.next();
    n--;
  }
  return keys.next().value;
};
function validatePath(path) {
  if (includes(path, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
}
var getDeep = (object, path) => {
  validatePath(path);
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (isSet(object)) {
      object = getNthKey(object, +key);
    } else if (isMap(object)) {
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(object, row);
      switch (type) {
        case "key":
          object = keyOfRow;
          break;
        case "value":
          object = object.get(keyOfRow);
          break;
      }
    } else {
      object = object[key];
    }
  }
  return object;
};
var setDeep = (object, path, mapper) => {
  validatePath(path);
  if (path.length === 0) {
    return mapper(object);
  }
  let parent = object;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (isArray(parent)) {
      const index = +key;
      parent = parent[index];
    } else if (isPlainObject(parent)) {
      parent = parent[key];
    } else if (isSet(parent)) {
      const row = +key;
      parent = getNthKey(parent, row);
    } else if (isMap(parent)) {
      const isEnd = i === path.length - 2;
      if (isEnd) {
        break;
      }
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(parent, row);
      switch (type) {
        case "key":
          parent = keyOfRow;
          break;
        case "value":
          parent = parent.get(keyOfRow);
          break;
      }
    }
  }
  const lastKey = path[path.length - 1];
  if (isArray(parent)) {
    parent[+lastKey] = mapper(parent[+lastKey]);
  } else if (isPlainObject(parent)) {
    parent[lastKey] = mapper(parent[lastKey]);
  }
  if (isSet(parent)) {
    const oldValue = getNthKey(parent, +lastKey);
    const newValue = mapper(oldValue);
    if (oldValue !== newValue) {
      parent.delete(oldValue);
      parent.add(newValue);
    }
  }
  if (isMap(parent)) {
    const row = +path[path.length - 2];
    const keyToRow = getNthKey(parent, row);
    const type = +lastKey === 0 ? "key" : "value";
    switch (type) {
      case "key": {
        const newKey = mapper(keyToRow);
        parent.set(newKey, parent.get(keyToRow));
        if (newKey !== keyToRow) {
          parent.delete(keyToRow);
        }
        break;
      }
      case "value": {
        parent.set(keyToRow, mapper(parent.get(keyToRow)));
        break;
      }
    }
  }
  return object;
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/plainer.js
function traverse(tree, walker2, origin = []) {
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, (subtree, key) => traverse(subtree, walker2, [...origin, ...parsePath(key)]));
    return;
  }
  const [nodeValue, children] = tree;
  if (children) {
    forEach(children, (child, key) => {
      traverse(child, walker2, [...origin, ...parsePath(key)]);
    });
  }
  walker2(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, (type, path) => {
    plain = setDeep(plain, path, (v) => untransformValue(v, type, superJson));
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path) {
    const object = getDeep(plain, parsePath(path));
    identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
      plain = setDeep(plain, identicalObjectPath, () => object);
    });
  }
  if (isArray(annotations)) {
    const [root, other] = annotations;
    root.forEach((identicalPath) => {
      plain = setDeep(plain, parsePath(identicalPath), () => plain);
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
var isDeep = (object, superJson) => isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
function addIdentity(object, path, identities) {
  const existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path);
  } else {
    identities.set(object, [path]);
  }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  const result = {};
  let rootEqualityPaths = void 0;
  identitites.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map((path) => path.map(String)).sort((a, b) => a.length - b.length);
    }
    const [representativePath, ...identicalPaths] = paths;
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject(result) ? void 0 : result;
  }
}
var walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = /* @__PURE__ */ new Map()) => {
  const primitive = isPrimitive(object);
  if (!primitive) {
    addIdentity(object, path, identities);
    const seen = seenObjects.get(object);
    if (seen) {
      return dedupe ? {
        transformedValue: null
      } : seen;
    }
  }
  if (!isDeep(object, superJson)) {
    const transformed2 = transformValue(object, superJson);
    const result2 = transformed2 ? {
      transformedValue: transformed2.value,
      annotations: [transformed2.type]
    } : {
      transformedValue: object
    };
    if (!primitive) {
      seenObjects.set(object, result2);
    }
    return result2;
  }
  if (includes(objectsInThisPath, object)) {
    return {
      transformedValue: null
    };
  }
  const transformationResult = transformValue(object, superJson);
  const transformed = transformationResult?.value ?? object;
  const transformedValue = isArray(transformed) ? [] : {};
  const innerAnnotations = {};
  forEach(transformed, (value, index) => {
    if (index === "__proto__" || index === "constructor" || index === "prototype") {
      throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
    }
    const recursiveResult = walker(value, identities, superJson, dedupe, [...path, index], [...objectsInThisPath, object], seenObjects);
    transformedValue[index] = recursiveResult.transformedValue;
    if (isArray(recursiveResult.annotations)) {
      innerAnnotations[index] = recursiveResult.annotations;
    } else if (isPlainObject(recursiveResult.annotations)) {
      forEach(recursiveResult.annotations, (tree, key) => {
        innerAnnotations[escapeKey(index) + "." + key] = tree;
      });
    }
  });
  const result = isEmptyObject(innerAnnotations) ? {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type] : void 0
  } : {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
  };
  if (!primitive) {
    seenObjects.set(object, result);
  }
  return result;
};

// ../../node_modules/.pnpm/copy-anything@3.0.5/node_modules/copy-anything/dist/index.js
var import_dist37 = __toESM(require_dist());
var import_dist38 = __toESM(require_dist2());
var import_dist39 = __toESM(require_dist3());

// ../../node_modules/.pnpm/is-what@4.1.16/node_modules/is-what/dist/index.js
var import_dist34 = __toESM(require_dist());
var import_dist35 = __toESM(require_dist2());
var import_dist36 = __toESM(require_dist3());
function getType2(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
function isArray2(payload) {
  return getType2(payload) === "Array";
}
function isPlainObject2(payload) {
  if (getType2(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
function isNull2(payload) {
  return getType2(payload) === "Null";
}
function isOneOf(a, b, c, d, e) {
  return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
}
function isUndefined2(payload) {
  return getType2(payload) === "Undefined";
}
var isNullOrUndefined = isOneOf(isNull2, isUndefined2);

// ../../node_modules/.pnpm/copy-anything@3.0.5/node_modules/copy-anything/dist/index.js
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function copy(target, options = {}) {
  if (isArray2(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!isPlainObject2(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [...props, ...symbols].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.js
var SuperJSON = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe = false } = {}) {
    this.classRegistry = new ClassRegistry();
    this.symbolRegistry = new Registry((s) => s.description ?? "");
    this.customTransformerRegistry = new CustomTransformerRegistry();
    this.allowedErrorProps = [];
    this.dedupe = dedupe;
  }
  serialize(object) {
    const identities = /* @__PURE__ */ new Map();
    const output = walker(object, identities, this, this.dedupe);
    const res = {
      json: output.transformedValue
    };
    if (output.annotations) {
      res.meta = {
        ...res.meta,
        values: output.annotations
      };
    }
    const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
    if (equalityAnnotations) {
      res.meta = {
        ...res.meta,
        referentialEqualities: equalityAnnotations
      };
    }
    return res;
  }
  deserialize(payload) {
    const { json, meta } = payload;
    let result = copy(json);
    if (meta?.values) {
      result = applyValueAnnotations(result, meta.values, this);
    }
    if (meta?.referentialEqualities) {
      result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
  }
  stringify(object) {
    return JSON.stringify(this.serialize(object));
  }
  parse(string) {
    return this.deserialize(JSON.parse(string));
  }
  registerClass(v, options) {
    this.classRegistry.register(v, options);
  }
  registerSymbol(v, identifier) {
    this.symbolRegistry.register(v, identifier);
  }
  registerCustom(transformer, name) {
    this.customTransformerRegistry.register({
      name,
      ...transformer
    });
  }
  allowErrorProps(...props) {
    this.allowedErrorProps.push(...props);
  }
};
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
var serialize = SuperJSON.serialize;
var deserialize = SuperJSON.deserialize;
var stringify = SuperJSON.stringify;
var parse = SuperJSON.parse;
var registerClass = SuperJSON.registerClass;
var registerCustom = SuperJSON.registerCustom;
var registerSymbol = SuperJSON.registerSymbol;
var allowErrorProps = SuperJSON.allowErrorProps;

// ../../node_modules/.pnpm/@midnight-ntwrk+midnight-js-level-private-state-provider@2.0.2/node_modules/@midnight-ntwrk/midnight-js-level-private-state-provider/dist/index.mjs
var MN_LDB_DEFAULT_DB_NAME = "midnight-level-db";
var MN_LDB_DEFAULT_PRIS_STORE_NAME = "private-states";
var MN_LDB_DEFAULT_KEY_STORE_NAME = "signing-keys";
var DEFAULT_CONFIG = {
  /**
   * The name of the database.
   */
  midnightDbName: MN_LDB_DEFAULT_DB_NAME,
  /**
   * The name of the "level" on which to store private state.
   */
  privateStateStoreName: MN_LDB_DEFAULT_PRIS_STORE_NAME,
  /**
   * The name of the "level" on which to store signing keys.
   */
  signingKeyStoreName: MN_LDB_DEFAULT_KEY_STORE_NAME
};
registerCustom({
  isApplicable: (v) => v instanceof Buffer$1,
  serialize: (v) => v.toString("hex"),
  deserialize: (v) => Buffer$1.from(v, "hex")
}, "buffer");
var withSubLevel = async (dbName, levelName, thunk) => {
  const level = new import_level.Level(dbName, {
    createIfMissing: true
  });
  const subLevel = level.sublevel(levelName, {
    valueEncoding: {
      encode: stringify,
      decode: parse,
      name: "super-json-values"
    }
  });
  try {
    await level.open();
    await subLevel.open();
    return await thunk(subLevel);
  } finally {
    await subLevel.close();
    await level.close();
  }
};
var subLevelMaybeGet = (dbName, levelName, key) => {
  return withSubLevel(dbName, levelName, async (subLevel) => {
    const value = await subLevel.get(key);
    if (value === void 0) {
      return null;
    }
    return value;
  });
};
var levelPrivateStateProvider = (partialConfig = {}) => {
  const config = import_lodash.default.defaults(partialConfig, DEFAULT_CONFIG);
  return {
    get(privateStateId) {
      return subLevelMaybeGet(config.midnightDbName, config.privateStateStoreName, privateStateId);
    },
    remove(privateStateId) {
      return withSubLevel(config.midnightDbName, config.privateStateStoreName, (subLevel) => subLevel.del(privateStateId));
    },
    set(privateStateId, state) {
      return withSubLevel(config.midnightDbName, config.privateStateStoreName, (subLevel) => subLevel.put(privateStateId, state));
    },
    clear() {
      return withSubLevel(config.midnightDbName, config.privateStateStoreName, (subLevel) => subLevel.clear());
    },
    getSigningKey(address) {
      return subLevelMaybeGet(config.midnightDbName, config.signingKeyStoreName, address);
    },
    removeSigningKey(address) {
      return withSubLevel(config.midnightDbName, config.signingKeyStoreName, (subLevel) => subLevel.del(address));
    },
    setSigningKey(address, signingKey) {
      return withSubLevel(config.midnightDbName, config.signingKeyStoreName, (subLevel) => subLevel.put(address, signingKey));
    },
    clearSigningKeys() {
      return withSubLevel(config.midnightDbName, config.signingKeyStoreName, (subLevel) => subLevel.clear());
    }
  };
};
export {
  DEFAULT_CONFIG,
  levelPrivateStateProvider
};
/*! Bundled license information:

vite-plugin-node-polyfills/shims/buffer/dist/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
//# sourceMappingURL=@midnight-ntwrk_midnight-js-level-private-state-provider.js.map
