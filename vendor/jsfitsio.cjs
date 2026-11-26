/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 611
(module) {

module.exports = require("http");

/***/ },

/***/ 692
(module) {

module.exports = require("https");

/***/ },

/***/ 455
(module) {

module.exports = require("node:fs/promises");

/***/ },

/***/ 876
(module) {

module.exports = require("punycode");

/***/ },

/***/ 203
(module) {

module.exports = require("stream");

/***/ },

/***/ 16
(module) {

module.exports = require("url");

/***/ },

/***/ 106
(module) {

module.exports = require("zlib");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".jsfitsio.cjs";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		const installedChunks = {
/******/ 			792: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		const installChunk = (chunk) => {
/******/ 			const moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					const installedChunk = require("./" + __webpack_require__.u(chunkId));
/******/ 					if (!installedChunks[chunkId]) {
/******/ 						installChunk(installedChunk);
/******/ 					}
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AsciiTableHDU: () => (/* reexport */ AsciiTableHDU),
  BinaryTableHDU: () => (/* reexport */ BinaryTableHDU),
  FITSFile: () => (/* reexport */ FITSFile),
  FITSHDU: () => (/* reexport */ FITSHDU),
  FITSHeaderItem: () => (/* reexport */ FITSHeaderItem),
  FITSHeaderManager: () => (/* reexport */ FITSHeaderManager),
  FITSParser: () => (/* reexport */ FITSParser),
  FITSWriter: () => (/* reexport */ FITSWriter),
  ImageHDU: () => (/* reexport */ ImageHDU),
  ParseHeader: () => (/* reexport */ ParseHeader),
  ParsePayload: () => (/* reexport */ ParsePayload),
  PrimaryHDU: () => (/* reexport */ PrimaryHDU)
});

;// ./src/model/FITSHeaderItem.ts
/**
 * Summary. (bla bla bla)
 *
 * Description. (bla bla bla)
 *
 * @link   github https://github.com/fab77/FITSParser
 * @author Fabrizio Giordano <fabriziogiordano77@gmail.com>
 */
class FITSHeaderItem {
    _key = "";
    _value = "";
    _comment = "";
    constructor(key, value, comment) {
        this._key = key;
        this._value = value;
        this._comment = comment;
    }
    get key() {
        return this._key;
    }
    get comment() {
        return this._comment;
    }
    get value() {
        return this._value;
    }
}

;// ./src/model/FITSHeaderManager.ts

class FITSHeaderManager {
    static SIMPLE = "SIMPLE";
    static BITPIX = "BITPIX";
    static BZERO = "BZERO";
    static BSCALE = "BSCALE";
    static BLANK = "BLANK";
    static NAXIS = "NAXIS";
    static NAXIS1 = "NAXIS1";
    static NAXIS2 = "NAXIS2";
    static DATAMIN = "DATAMIN";
    static DATAMAX = "DATAMAX";
    static CRVAL1 = "CRVAL1";
    static CRVAL2 = "CRVAL2";
    static CTYPE1 = "CTYPE1";
    static CTYPE2 = "CTYPE2";
    static CRPIX1 = "CRPIX1";
    static CRPIX2 = "CRPIX2";
    static ORIGIN = "ORIGIN";
    static COMMENT = "COMMENT";
    static XTENSION = "XTENSION";
    static PCOUNT = "PCOUNT";
    static GCOUNT = "GCOUNT";
    static TFIELDS = "TFIELDS";
    static TFORM = "TFORM";
    static TTYPE = "TTYPE";
    static TUNIT = "TUNIT";
    static TSCAL = "TSCAL";
    static TZERO = "TZERO";
    static TNULL = "TNULL";
    static TBCOL = "TBCOL";
    items = [];
    constructor(initializeDefaults = true) {
        if (!initializeDefaults) {
            return;
        }
        this.items[0] = new FITSHeaderItem(FITSHeaderManager.SIMPLE, "T", "");
        this.items[1] = new FITSHeaderItem(FITSHeaderManager.BITPIX, "", "");
        this.items[2] = new FITSHeaderItem(FITSHeaderManager.NAXIS, 2, "");
        this.items[3] = new FITSHeaderItem(FITSHeaderManager.NAXIS1, "", "");
        this.items[4] = new FITSHeaderItem(FITSHeaderManager.NAXIS2, "", "");
    }
    // insert(item: FITSHeaderItem, position?: number): void {
    insert(item) {
        if (item.key === FITSHeaderManager.SIMPLE) {
            // this.items.splice(0, 0, item);
            this.items[0] = item;
        }
        else if (item.key === FITSHeaderManager.BITPIX) {
            // this.items.splice(1, 0, item);
            this.items[1] = item;
        }
        else if (item.key === FITSHeaderManager.NAXIS) {
            // this.items.splice(2, 0, item);
            this.items[2] = item;
        }
        else if (item.key === FITSHeaderManager.NAXIS1) {
            // this.items.splice(3, 0, item);
            this.items[3] = item;
        }
        else if (item.key === FITSHeaderManager.NAXIS2) {
            // this.items.splice(4, 0, item);
            this.items[4] = item;
        }
        else {
            this.items.push(item);
        }
        // if (position !== undefined && position >= 0 && position <= this.items.length) {
        //     this.items.splice(position, 0, item);
        // } else {
        //     this.items.push(item);
        // }
    }
    getItems() {
        return this.items;
    }
    remove(key) {
        this.items = this.items.filter((item) => item.key !== key);
    }
    findById(key) {
        const item = this.items.find((item) => item.key === key);
        if (!item) {
            return null;
        }
        return item;
    }
    static tableFieldKey(prefix, index) {
        if (!Number.isInteger(index) || index < 1) {
            throw new RangeError(`FITS table field index must be >= 1, received ${index}.`);
        }
        return `${prefix}${index}`;
    }
    static naxisKey(axis) {
        if (!Number.isInteger(axis) || axis < 1) {
            throw new RangeError(`FITS axis must be a positive integer, received ${axis}.`);
        }
        return `NAXIS${axis}`;
    }
    static getFITSItemStringValue(header, key) {
        const item = header.findById(key);
        if (!item) {
            return null;
        }
        return String(item.value).trim().replace(/^'/, "").replace(/'$/, "").trim();
    }
}

;// external "fs"
const external_fs_namespaceObject = require("fs");
;// ./src/FITSHeaderWriter.ts
class FITSHeaderWriter {
    static BLOCK_SIZE = 2880;
    static CARD_SIZE = 80;
    static INTEGER_KEYWORDS = new Set([
        "BITPIX",
        "NAXIS",
        "PCOUNT",
        "GCOUNT",
    ]);
    static LOGICAL_KEYWORDS = new Set(["SIMPLE", "EXTEND"]);
    static serialize(header, primary) {
        const items = header.getItems();
        const map = new Map(items.map((item) => [item.key.toUpperCase(), item]));
        const cards = [];
        FITSHeaderWriter.appendMandatoryCards(cards, map, primary);
        FITSHeaderWriter.appendRemainingCards(cards, items);
        cards.push(FITSHeaderWriter.card80("END"));
        return FITSHeaderWriter.encodeAndPad(cards);
    }
    static appendMandatoryCards(cards, map, primary) {
        if (primary) {
            const simple = map.get("SIMPLE");
            if (!simple) {
                throw new Error("Missing mandatory SIMPLE card in Primary HDU");
            }
            cards.push(...FITSHeaderWriter.makeKeywordWithComment("SIMPLE", simple.value, simple.comment));
        }
        else {
            const xtension = map.get("XTENSION");
            if (!xtension) {
                throw new Error("Missing mandatory XTENSION card in extension HDU");
            }
            cards.push(...FITSHeaderWriter.makeKeywordWithComment("XTENSION", xtension.value, xtension.comment));
        }
        const bitpix = map.get("BITPIX");
        if (!bitpix) {
            throw new Error("Missing mandatory BITPIX card");
        }
        cards.push(...FITSHeaderWriter.makeKeywordWithComment("BITPIX", bitpix.value, bitpix.comment));
        const naxis = map.get("NAXIS");
        if (!naxis) {
            throw new Error("Missing mandatory NAXIS card");
        }
        const nAxes = Number(naxis.value);
        if (!Number.isInteger(nAxes) || nAxes < 0) {
            throw new Error(`Invalid NAXIS value: ${naxis.value}`);
        }
        cards.push(...FITSHeaderWriter.makeKeywordWithComment("NAXIS", nAxes, naxis.comment));
        for (let axis = 1; axis <= nAxes; axis++) {
            const key = `NAXIS${axis}`;
            const item = map.get(key);
            if (!item) {
                throw new Error(`Missing mandatory ${key} card`);
            }
            cards.push(...FITSHeaderWriter.makeKeywordWithComment(key, item.value, item.comment));
        }
        if (!primary) {
            const pcount = map.get("PCOUNT");
            const gcount = map.get("GCOUNT");
            if (!pcount) {
                throw new Error("Missing mandatory PCOUNT card in extension HDU");
            }
            if (!gcount) {
                throw new Error("Missing mandatory GCOUNT card in extension HDU");
            }
            cards.push(...FITSHeaderWriter.makeKeywordWithComment("PCOUNT", pcount.value, pcount.comment));
            cards.push(...FITSHeaderWriter.makeKeywordWithComment("GCOUNT", gcount.value, gcount.comment));
        }
        if (primary) {
            const extend = map.get("EXTEND");
            if (extend) {
                cards.push(...FITSHeaderWriter.makeKeywordWithComment("EXTEND", extend.value, extend.comment));
            }
        }
    }
    static appendRemainingCards(cards, items) {
        for (const item of items) {
            const key = item.key.toUpperCase();
            if (key === "SIMPLE" ||
                key === "XTENSION" ||
                key === "BITPIX" ||
                key === "NAXIS" ||
                /^NAXIS\d+$/.test(key) ||
                key === "PCOUNT" ||
                key === "GCOUNT" ||
                key === "EXTEND" ||
                key === "END") {
                continue;
            }
            cards.push(...FITSHeaderWriter.makeKeywordWithComment(item.key, item.value, item.comment));
        }
    }
    static makeKeywordWithComment(key, value, comment) {
        const normalized = key.toUpperCase();
        if (normalized === "END") {
            return [FITSHeaderWriter.card80("END")];
        }
        if (normalized === "COMMENT" || normalized === "HISTORY") {
            return FITSHeaderWriter.makeCommentCards(normalized, String(value ?? comment ?? ""));
        }
        let base = FITSHeaderWriter.keyword(normalized) +
            FITSHeaderWriter.valueField20(normalized, value);
        if (!comment || comment.length === 0) {
            return [FITSHeaderWriter.card80(base)];
        }
        const addition = ` / ${comment}`;
        const spaceLeft = FITSHeaderWriter.CARD_SIZE - base.length;
        if (spaceLeft <= 0) {
            return [
                FITSHeaderWriter.card80(base),
                ...FITSHeaderWriter.makeCommentCards("COMMENT", comment),
            ];
        }
        base += addition.slice(0, spaceLeft);
        const overflow = addition.slice(spaceLeft).replace(/^\s*\/\s*/, "");
        if (overflow.length === 0) {
            return [FITSHeaderWriter.card80(base)];
        }
        return [
            FITSHeaderWriter.card80(base),
            ...FITSHeaderWriter.makeCommentCards("COMMENT", overflow),
        ];
    }
    static makeCommentCards(kind, text) {
        const prefix = FITSHeaderWriter.keyword(kind);
        const width = FITSHeaderWriter.CARD_SIZE - prefix.length;
        const value = String(text ?? "");
        if (value.length === 0) {
            return [FITSHeaderWriter.card80(prefix)];
        }
        const cards = [];
        for (let offset = 0; offset < value.length; offset += width) {
            cards.push(FITSHeaderWriter.card80(prefix + value.slice(offset, offset + width)));
        }
        return cards;
    }
    static valueField20(key, value) {
        if (FITSHeaderWriter.LOGICAL_KEYWORDS.has(key)) {
            const logical = value === true || value === "T" || value === "t" ? "T" : "F";
            return `= ${logical.padStart(20, " ")}`;
        }
        if (FITSHeaderWriter.INTEGER_KEYWORDS.has(key) || /^NAXIS\d+$/.test(key)) {
            const number = Number(value);
            if (!Number.isFinite(number) || !Number.isInteger(number)) {
                throw new Error(`FITS header: ${key} must be an integer, got ${value}`);
            }
            return `= ${String(number).padStart(20, " ")}`;
        }
        if (typeof value === "number") {
            let encoded = Number.isInteger(value)
                ? String(value)
                : value.toExponential(10).replace("e", "E");
            if (encoded.length > 20) {
                encoded = value.toExponential(8).replace("e", "E");
            }
            return `= ${encoded.padStart(20, " ")}`;
        }
        if (typeof value === "string") {
            return `= ${FITSHeaderWriter.quoteFitsString(value)}`;
        }
        return "";
    }
    static quoteFitsString(value) {
        const unquoted = value.replace(/^'+|'+$/g, "");
        const escaped = unquoted.replace(/'/g, "''");
        return `'${escaped}'`;
    }
    static keyword(value) {
        return (value ?? "").toUpperCase().padEnd(8, " ").slice(0, 8);
    }
    static card80(value) {
        if (value.length >= FITSHeaderWriter.CARD_SIZE) {
            return value.slice(0, FITSHeaderWriter.CARD_SIZE);
        }
        return value.padEnd(FITSHeaderWriter.CARD_SIZE, " ");
    }
    static encodeAndPad(cards) {
        let header = cards.join("");
        const remainder = header.length % FITSHeaderWriter.BLOCK_SIZE;
        if (remainder !== 0) {
            header += " ".repeat(FITSHeaderWriter.BLOCK_SIZE - remainder);
        }
        return new TextEncoder().encode(header);
    }
}

;// ./src/FITSWriter.ts
/**
 * FITS serialization and file writing support.
 *
 * FITSWriter provides two serialization APIs:
 *
 * - The jsfitsio 3.x API serializes the FITSFile/HDU data model,
 *   including PrimaryHDU, ImageHDU, BinaryTableHDU and AsciiTableHDU.
 *
 * - The legacy API serializes the former FITSParsed representation
 *   and is retained for backward compatibility with jsfitsio 2.x
 *   consumers.
 *
 * FITS headers are serialized according to the FITS 80-character
 * card format and padded to 2880-byte FITS logical blocks.
 * HDU payloads are likewise padded to 2880-byte boundaries.
 *
 * New code should use FITSFile together with createFITSFile() and
 * writeFITSFileModel().
 *
 * @see https://fits.gsfc.nasa.gov/
 */


class FITSWriter {
    /**
     * Serializes the legacy FITSParsed representation.
     *
     * @deprecated Use createFITSFile() with the FITSFile/HDU model.
     * This method is retained for backward compatibility with jsfitsio 2.x.
     */
    static createFITS(fitsParsed) {
        const headerBytes = FITSHeaderWriter.serialize(fitsParsed.header, true);
        const dataBytes = this.createData(fitsParsed.data, fitsParsed.header);
        const fitsFile = new Uint8Array(headerBytes.length + dataBytes.length);
        fitsFile.set(headerBytes, 0);
        fitsFile.set(dataBytes, headerBytes.length);
        return fitsFile;
    }
    static createHDU(hdu, primary) {
        const headerBytes = FITSHeaderWriter.serialize(hdu.header, primary);
        const rawData = hdu.rawData ?? new Uint8Array(0);
        if (rawData.byteLength !== hdu.dataByteLength) {
            throw new Error(`HDU payload length mismatch: ` +
                `rawData contains ${rawData.byteLength} bytes, ` +
                `but dataByteLength=${hdu.dataByteLength}.`);
        }
        const dataBytes = FITSWriter.padData(rawData);
        const result = new Uint8Array(headerBytes.byteLength + dataBytes.byteLength);
        result.set(headerBytes, 0);
        result.set(dataBytes, headerBytes.byteLength);
        return result;
    }
    static padData(data) {
        const BLOCK = 2880;
        if (data.byteLength === 0) {
            return new Uint8Array(0);
        }
        const remainder = data.byteLength % BLOCK;
        if (remainder === 0) {
            return data.slice();
        }
        const padded = new Uint8Array(data.byteLength + (BLOCK - remainder));
        padded.set(data);
        return padded;
    }
    static createData(data, header) {
        // concat
        const totalLength = data.reduce((s, c) => s + c.length, 0);
        // OPTIONAL: verify size from BITPIX/NAXIS
        const bitpix = Math.abs(Number(header.findById("BITPIX")?.value ?? 0));
        const naxis = Number(header.findById("NAXIS")?.value ?? 0);
        let elems = 1;
        for (let k = 1; k <= naxis; k++) {
            elems *= Number(header.findById(`NAXIS${k}`)?.value ?? 0);
        }
        const bytesPerElem = bitpix / 8;
        const expectedUnpadded = naxis > 0 ? elems * bytesPerElem : 0;
        if (expectedUnpadded && expectedUnpadded !== totalLength) {
            throw new Error(`Data length ${totalLength} does not match header expectation ${expectedUnpadded} (BITPIX=${bitpix}, NAXIS=${naxis})`);
        }
        // build and pad
        let dataBytes = new Uint8Array(totalLength);
        let off = 0;
        for (const chunk of data) {
            dataBytes.set(chunk, off);
            off += chunk.length;
        }
        return FITSWriter.padData(dataBytes);
    }
    /**
     * Serializes a jsfitsio 3.x FITSFile, including all contained HDUs.
     */
    static createFITSFile(fitsFile) {
        if (fitsFile.length === 0) {
            throw new Error("Cannot write an empty FITSFile.");
        }
        if (fitsFile.primaryHDU === null) {
            throw new Error("FITSFile must start with a PrimaryHDU.");
        }
        const serializedHDUs = fitsFile.hdus.map((hdu, index) => FITSWriter.createHDU(hdu, index === 0));
        const totalLength = serializedHDUs.reduce((sum, hdu) => sum + hdu.byteLength, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const hdu of serializedHDUs) {
            result.set(hdu, offset);
            offset += hdu.byteLength;
        }
        return result;
    }
    /**
     * Serializes a jsfitsio 3.x FITSFile and writes it to the local filesystem.
     */
    static writeFITSFileModel(fitsFile, filePath) {
        const data = FITSWriter.createFITSFile(fitsFile);
        external_fs_namespaceObject.writeFileSync(filePath, data);
    }
    /**
     * Writes the legacy FITSParsed representation to a local file.
     *
     * @deprecated Use writeFITSFileModel() with FITSFile instead.
     * This method is retained for backward compatibility with jsfitsio 2.x.
     */
    static writeFITSFile(fitsParsed, filePath) {
        const fitsFile = FITSWriter.createFITS(fitsParsed);
        external_fs_namespaceObject.writeFileSync(filePath, fitsFile);
    }
}

;// ./src/ParseHeader.ts
// import { FITSHeader } from "./model/FITSHeader.js";


/**
 * Summary. (bla bla bla)
 *
 * Description. (bla bla bla)
 *
 * @link   github https://github.com/fab77/FITSParser
 * @author Fabrizio Giordano <fabriziogiordano77@gmail.com>
 */
class ParseHeader {
    static CARD_SIZE = 80;
    static BLOCK_SIZE = 2880;
    static getFITSItemStringValue(header, key) {
        const item = header.findById(key);
        if (!item) {
            return null;
        }
        return String(item.value).trim().replace(/^'/, "").replace(/'$/, "").trim();
    }
    static getFITSItemValue(header, key) {
        const item = header.findById(key);
        if (!item) {
            return null;
        }
        const value = Number(item.value);
        return Number.isNaN(value) ? null : value;
    }
    /**
     * Returns the complete FITS header size, including padding
     * up to the next 2880-byte boundary.
     */
    static getHeaderByteLength(rawData, startOffset = 0) {
        const decoder = new TextDecoder("ascii");
        for (let offset = startOffset; offset + ParseHeader.CARD_SIZE <= rawData.byteLength; offset += ParseHeader.CARD_SIZE) {
            const key = decoder.decode(rawData.subarray(offset, offset + 8)).trim();
            if (key === "END") {
                const consumed = offset + ParseHeader.CARD_SIZE - startOffset;
                return (Math.ceil(consumed / ParseHeader.BLOCK_SIZE) * ParseHeader.BLOCK_SIZE);
            }
        }
        throw new Error("Invalid FITS header: END card not found.");
    }
    static parse(rawData, startOffset = 0) {
        const decoder = new TextDecoder("ascii");
        const headerLength = ParseHeader.getHeaderByteLength(rawData, startOffset);
        const header = new FITSHeaderManager(false);
        for (let offset = startOffset; offset < startOffset + headerLength; offset += ParseHeader.CARD_SIZE) {
            const line = decoder.decode(rawData.subarray(offset, offset + ParseHeader.CARD_SIZE));
            const key = line.slice(0, 8).trim();
            if (key === "END") {
                break;
            }
            if (!key) {
                continue;
            }
            let value;
            let comment = "";
            const rawValue = line.slice(10).trim().split("/")[0].trim();
            if (Number.isNaN(Number(rawValue))) {
                value = rawValue;
            }
            else {
                value = Number(rawValue);
            }
            if (line.includes("/")) {
                comment = line.slice(10).trim().split("/")[1]?.trim() ?? "";
            }
            header.insert(new FITSHeaderItem(key, value, comment));
        }
        return header;
    }
}

;// ./src/FITSImageUtils.ts


class FITSImageUtils {
    static getShape(header) {
        const naxis = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS);
        if (naxis === null) {
            throw new Error("NAXIS not defined.");
        }
        if (!Number.isInteger(naxis) || naxis < 0) {
            throw new Error(`Invalid FITS NAXIS value: ${naxis}`);
        }
        const shape = [];
        for (let axis = 1; axis <= naxis; axis++) {
            const size = ParseHeader.getFITSItemValue(header, FITSHeaderManager.naxisKey(axis));
            if (size === null) {
                throw new Error(`NAXIS${axis} not defined.`);
            }
            shape.push(size);
        }
        return shape;
    }
    static getElementCount(shape) {
        if (shape.length === 0) {
            return 0;
        }
        return shape.reduce((total, dimension) => total * dimension, 1);
    }
}

;// ./src/ParsePayload.ts
// "use strict";
/**
 * Summary. (bla bla bla)
 *
 * Description. (bla bla bla)
 *
 * @link   github https://github.com/fab77/FITSParser
 * @author Fabrizio Giordano <fabriziogiordano77@gmail.com>
 */




class ParsePayload {
    static SUPPORTED_BITPIX = new Set([8, 16, 32, 64, -32, -64]);
    static assertSupportedBITPIX(bitpix) {
        if (!ParsePayload.SUPPORTED_BITPIX.has(bitpix)) {
            throw new Error(`Unsupported FITS BITPIX value: ${bitpix}`);
        }
    }
    static extractPixelFromView(view, offset, bitpix) {
        switch (bitpix) {
            case 8:
                return view.getUint8(offset);
            case 16:
                return view.getInt16(offset, false);
            case 32:
                return view.getInt32(offset, false);
            case -32:
                return view.getFloat32(offset, false);
            case -64:
                return view.getFloat64(offset, false);
            case 64: {
                const value = view.getBigInt64(offset, false);
                const numeric = Number(value);
                if (!Number.isSafeInteger(numeric)) {
                    throw new RangeError(`BITPIX=64 value ${value} cannot be represented ` +
                        `exactly as a JavaScript number.`);
                }
                return numeric;
            }
            default:
                throw new Error(`Unsupported FITS BITPIX value: ${bitpix}`);
        }
    }
    static computePhysicalMinAndMax(header, payload) {
        const bitpix = ParseHeader.getFITSItemValue(header, FITSHeaderManager.BITPIX);
        if (bitpix === null) {
            return null;
        }
        ParsePayload.assertSupportedBITPIX(bitpix);
        const shape = FITSImageUtils.getShape(header);
        /*
         * NAXIS=0 is a valid FITS HDU.
         */
        if (shape.length === 0 || payload.byteLength === 0) {
            return header;
        }
        const dataMinItem = header.findById(FITSHeaderManager.DATAMIN);
        const dataMaxItem = header.findById(FITSHeaderManager.DATAMAX);
        if (dataMinItem === null || dataMaxItem === null) {
            try {
                const [min, max] = ParsePayload.computePhysicalValues(payload, header);
                if (dataMinItem === null && min !== null) {
                    header.insert(new FITSHeaderItem(FITSHeaderManager.DATAMIN, min, "computed by jsfitsio"));
                }
                if (dataMaxItem === null && max !== null) {
                    header.insert(new FITSHeaderItem(FITSHeaderManager.DATAMAX, max, "computed by jsfitsio"));
                }
            }
            catch (error) {
                if (bitpix === 64 && error instanceof RangeError) {
                    return header;
                }
                throw error;
            }
        }
        return header;
    }
    static createTypedArray(rawData, bitpix) {
        ParsePayload.assertSupportedBITPIX(bitpix);
        const bytesPerElement = Math.abs(bitpix) / 8;
        if (rawData.byteLength % bytesPerElement !== 0) {
            throw new Error(`Payload byte length ${rawData.byteLength} ` +
                `is not aligned with BITPIX=${bitpix}.`);
        }
        const count = rawData.byteLength / bytesPerElement;
        const view = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
        switch (bitpix) {
            case 8: {
                /*
                 * For 8-bit FITS, byte order is irrelevant.
                 *
                 * Use slice() so typedData has its own correctly
                 * sized backing store.
                 */
                return rawData.slice();
            }
            case 16: {
                const result = new Int16Array(count);
                for (let i = 0; i < count; i++) {
                    result[i] = view.getInt16(i * 2, false);
                }
                return result;
            }
            case 32: {
                const result = new Int32Array(count);
                for (let i = 0; i < count; i++) {
                    result[i] = view.getInt32(i * 4, false);
                }
                return result;
            }
            case 64: {
                const result = new BigInt64Array(count);
                for (let i = 0; i < count; i++) {
                    result[i] = view.getBigInt64(i * 8, false);
                }
                return result;
            }
            case -32: {
                const result = new Float32Array(count);
                for (let i = 0; i < count; i++) {
                    result[i] = view.getFloat32(i * 4, false);
                }
                return result;
            }
            case -64: {
                const result = new Float64Array(count);
                for (let i = 0; i < count; i++) {
                    result[i] = view.getFloat64(i * 8, false);
                }
                return result;
            }
            default:
                throw new Error(`Unsupported FITS BITPIX value: ${bitpix}`);
        }
    }
    static computePhysicalValues(rawData, header) {
        const bitpix = ParseHeader.getFITSItemValue(header, FITSHeaderManager.BITPIX);
        if (bitpix === null) {
            return [null, null];
        }
        ParsePayload.assertSupportedBITPIX(bitpix);
        const shape = FITSImageUtils.getShape(header);
        const pixelCount = FITSImageUtils.getElementCount(shape);
        if (pixelCount === 0) {
            return [null, null];
        }
        const blank = ParseHeader.getFITSItemValue(header, FITSHeaderManager.BLANK);
        const bzero = ParseHeader.getFITSItemValue(header, FITSHeaderManager.BZERO) ?? 0;
        const bscale = ParseHeader.getFITSItemValue(header, FITSHeaderManager.BSCALE) ?? 1;
        const bytesPerElement = Math.abs(bitpix) / 8;
        const requiredBytes = pixelCount * bytesPerElement;
        if (rawData.byteLength < requiredBytes) {
            throw new Error(`FITS payload is too short: expected ${requiredBytes} bytes, ` +
                `received ${rawData.byteLength}.`);
        }
        const view = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
        let min = null;
        let max = null;
        for (let i = 0; i < pixelCount; i++) {
            const rawValue = ParsePayload.extractPixelFromView(view, i * bytesPerElement, bitpix);
            // BLANK applies to integer FITS image data.
            if (bitpix > 0 && blank !== null && rawValue === blank) {
                continue;
            }
            const physicalValue = ParsePayload.pixel2physicalValue(rawValue, bscale, bzero);
            // Floating-point FITS images may contain NaN.
            if (Number.isNaN(physicalValue)) {
                continue;
            }
            if (min === null || physicalValue < min) {
                min = physicalValue;
            }
            if (max === null || physicalValue > max) {
                max = physicalValue;
            }
        }
        return [min, max];
    }
    static pixel2physicalValue(pxval, BSCALE, BZERO) {
        if (BZERO === null || BSCALE === null) {
            throw new Error("Either BZERO or BSCALE is null");
        }
        return BZERO + BSCALE * pxval;
    }
    static extractPixelValue(rawData, offset, bitpix) {
        ParsePayload.assertSupportedBITPIX(bitpix);
        const view = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
        return ParsePayload.extractPixelFromView(view, offset, bitpix);
    }
}

;// ./src/model/FITSHDU.ts
class FITSHDU {
    header;
    rawData;
    dataOffset;
    dataByteLength;
    constructor(header, rawData, dataOffset, dataByteLength) {
        this.header = header;
        this.rawData = rawData;
        this.dataOffset = dataOffset;
        this.dataByteLength = dataByteLength;
    }
}

;// ./src/model/ImageHDU.ts

class ImageHDU extends FITSHDU {
    bitpix;
    shape;
    typedData;
    type = "IMAGE";
    constructor(header, rawData, dataOffset, dataByteLength, bitpix, shape, typedData) {
        super(header, rawData, dataOffset, dataByteLength);
        this.bitpix = bitpix;
        this.shape = shape;
        this.typedData = typedData;
    }
    get naxis() {
        return this.shape.length;
    }
    get elementCount() {
        if (this.shape.length === 0) {
            return 0;
        }
        return this.shape.reduce((accumulator, dimension) => accumulator * dimension, 1);
    }
}

;// ./src/model/PrimaryHDU.ts

class PrimaryHDU extends ImageHDU {
    type = "PRIMARY";
    constructor(header, rawData, dataOffset, dataByteLength, bitpix, shape, typedData) {
        super(header, rawData, dataOffset, dataByteLength, bitpix, shape, typedData);
    }
}

;// ./src/model/FITSFile.ts

class FITSFile {
    _hdus;
    constructor(hdus = []) {
        this._hdus = [...hdus];
    }
    get hdus() {
        return this._hdus;
    }
    get length() {
        return this._hdus.length;
    }
    get primaryHDU() {
        const hdu = this._hdus[0];
        if (hdu instanceof PrimaryHDU) {
            return hdu;
        }
        return null;
    }
    getHDU(index) {
        return this._hdus[index] ?? null;
    }
    addHDU(hdu) {
        this._hdus.push(hdu);
    }
}

;// ./src/model/BinaryTableHDU.ts

class BinaryTableHDU extends FITSHDU {
    rowByteLength;
    rowCount;
    columns;
    type = "BINTABLE";
    constructor(header, rawData, dataOffset, dataByteLength, rowByteLength, rowCount, columns) {
        super(header, rawData, dataOffset, dataByteLength);
        this.rowByteLength = rowByteLength;
        this.rowCount = rowCount;
        this.columns = columns;
    }
    get columnCount() {
        return this.columns.length;
    }
    getRowView(rowIndex) {
        if (rowIndex < 0 || rowIndex >= this.rowCount) {
            throw new RangeError(`Invalid row index ${rowIndex}.`);
        }
        const offset = rowIndex * this.rowByteLength;
        return new DataView(this.rawData.buffer, this.rawData.byteOffset + offset, this.rowByteLength);
    }
    getRow(rowIndex) {
        return this.columns.map((_, columnIndex) => this.getCell(rowIndex, columnIndex));
    }
    getCell(rowIndex, column) {
        const columnDefinition = this.resolveColumn(column);
        const row = this.getRowView(rowIndex);
        const offset = columnDefinition.byteOffset;
        const repeat = columnDefinition.repeat;
        switch (columnDefinition.type) {
            case "CHAR": {
                const bytes = new Uint8Array(row.buffer, row.byteOffset + offset, columnDefinition.byteWidth);
                return new TextDecoder("ascii").decode(bytes).replace(/\s+$/, "");
            }
            case "LOGICAL": {
                const values = [];
                for (let i = 0; i < repeat; i++) {
                    const value = String.fromCharCode(row.getUint8(offset + i));
                    values.push(value === "T");
                }
                return repeat === 1 ? values[0] : values;
            }
            case "UINT8": {
                const values = [];
                for (let i = 0; i < repeat; i++) {
                    const raw = row.getUint8(offset + i);
                    values.push(this.applyNumericScaling(raw, columnDefinition.scale, columnDefinition.zero));
                }
                return repeat === 1 ? values[0] : values;
            }
            case "INT16":
                return this.readNumericColumn(row, offset, repeat, 2, (view, position) => view.getInt16(position, false), columnDefinition.scale, columnDefinition.zero, columnDefinition.nullValue);
            case "INT32":
                return this.readNumericColumn(row, offset, repeat, 4, (view, position) => view.getInt32(position, false), columnDefinition.scale, columnDefinition.zero, columnDefinition.nullValue);
            case "INT64": {
                const values = [];
                for (let i = 0; i < repeat; i++) {
                    const raw = row.getBigInt64(offset + i * 8, false);
                    /*
                     * Preserve exact 64-bit integers.
                     *
                     * Do not silently convert bigint to number.
                     */
                    values.push(raw);
                }
                return repeat === 1 ? values[0] : values;
            }
            case "FLOAT32":
                return this.readNumericColumn(row, offset, repeat, 4, (view, position) => view.getFloat32(position, false), columnDefinition.scale, columnDefinition.zero, null);
            case "FLOAT64":
                return this.readNumericColumn(row, offset, repeat, 8, (view, position) => view.getFloat64(position, false), columnDefinition.scale, columnDefinition.zero, null);
            case "COMPLEX64": {
                const values = [];
                for (let i = 0; i < repeat; i++) {
                    const position = offset + i * 8;
                    values.push({
                        real: row.getFloat32(position, false),
                        imaginary: row.getFloat32(position + 4, false),
                    });
                }
                return repeat === 1 ? values[0] : values;
            }
            case "COMPLEX128": {
                const values = [];
                for (let i = 0; i < repeat; i++) {
                    const position = offset + i * 16;
                    values.push({
                        real: row.getFloat64(position, false),
                        imaginary: row.getFloat64(position + 8, false),
                    });
                }
                return repeat === 1 ? values[0] : values;
            }
            case "BIT":
                /*
                 * I'd defer bit-array decoding for the moment.
                 * The raw bytes remain available.
                 */
                return new Uint8Array(row.buffer, row.byteOffset + offset, columnDefinition.byteWidth).slice();
            default:
                throw new Error(`Unsupported BINTABLE column type: ${columnDefinition.type}`);
        }
    }
    readNumericColumn(view, offset, repeat, bytesPerElement, reader, scale, zero, nullValue) {
        const values = [];
        for (let i = 0; i < repeat; i++) {
            const raw = reader(view, offset + i * bytesPerElement);
            if (nullValue !== null && raw === nullValue) {
                values.push(null);
                continue;
            }
            values.push(this.applyNumericScaling(raw, scale, zero));
        }
        if (repeat === 1) {
            return values[0];
        }
        /*
         * Because repeated integer fields may contain NULL,
         * we cannot represent every case as number[].
         *
         * For now return a generic value array.
         */
        return values;
    }
    applyNumericScaling(raw, scale, zero) {
        return zero + scale * raw;
    }
    resolveColumn(column) {
        if (typeof column === "number") {
            if (!Number.isInteger(column) ||
                column < 0 ||
                column >= this.columns.length) {
                throw new RangeError(`Invalid column index ${column}.`);
            }
            return this.columns[column];
        }
        const found = this.columns.find((candidate) => candidate.name === column);
        if (!found) {
            throw new Error(`BINTABLE column '${column}' not found.`);
        }
        return found;
    }
}

;// ./src/FITSBinaryTableUtils.ts
class FITSBinaryTableUtils {
    static parseTFORM(format) {
        const normalized = format
            .trim()
            .replace(/^'/, "")
            .replace(/'$/, "")
            .trim()
            .toUpperCase();
        const match = normalized.match(/^(\d*)([LXBIJKAEDCM])$/);
        if (!match) {
            throw new Error(`Unsupported FITS TFORM value: ${format}`);
        }
        const repeat = match[1] ? Number(match[1]) : 1;
        const code = match[2];
        const bytesPerElement = FITSBinaryTableUtils.bytesPerType(code);
        return {
            repeat,
            code,
            byteWidth: code === "X" ? Math.ceil(repeat / 8) : repeat * bytesPerElement,
        };
    }
    static bytesPerType(code) {
        switch (code) {
            case "L":
            case "B":
            case "A":
                return 1;
            case "I":
                return 2;
            case "J":
            case "E":
                return 4;
            case "K":
            case "D":
                return 8;
            case "C":
                return 8;
            case "M":
                return 16;
            case "X":
                return 0;
            default:
                throw new Error(`Unsupported FITS binary table type: ${code}`);
        }
    }
}

;// ./src/model/AsciiTableHDU.ts

class AsciiTableHDU extends FITSHDU {
    rowByteLength;
    rowCount;
    columns;
    type = "TABLE";
    constructor(header, rawData, dataOffset, dataByteLength, rowByteLength, rowCount, columns) {
        super(header, rawData, dataOffset, dataByteLength);
        this.rowByteLength = rowByteLength;
        this.rowCount = rowCount;
        this.columns = columns;
    }
    get columnCount() {
        return this.columns.length;
    }
    getRowView(rowIndex) {
        if (!Number.isInteger(rowIndex) ||
            rowIndex < 0 ||
            rowIndex >= this.rowCount) {
            throw new RangeError(`Invalid row index ${rowIndex}.`);
        }
        const start = rowIndex * this.rowByteLength;
        return this.rawData.subarray(start, start + this.rowByteLength);
    }
    getRowText(rowIndex) {
        return new TextDecoder("ascii").decode(this.getRowView(rowIndex));
    }
    resolveColumn(column) {
        if (typeof column === "number") {
            if (!Number.isInteger(column) ||
                column < 0 ||
                column >= this.columns.length) {
                throw new RangeError(`Invalid column index ${column}.`);
            }
            return this.columns[column];
        }
        const found = this.columns.find((candidate) => candidate.name === column);
        if (!found) {
            throw new Error(`ASCII TABLE column '${column}' not found.`);
        }
        return found;
    }
    getCell(rowIndex, column) {
        const definition = this.resolveColumn(column);
        const row = this.getRowView(rowIndex);
        const bytes = row.subarray(definition.byteOffset, definition.byteOffset + definition.width);
        const raw = new TextDecoder("ascii").decode(bytes);
        const trimmed = raw.trim();
        /*
         * Blank numeric fields are treated as null.
         */
        if (trimmed.length === 0) {
            return definition.type === "CHAR" ? "" : null;
        }
        switch (definition.type) {
            case "CHAR":
                return raw.replace(/\s+$/, "");
            case "INTEGER": {
                const value = Number.parseInt(trimmed, 10);
                if (Number.isNaN(value)) {
                    return null;
                }
                return value;
            }
            case "FLOAT":
            case "EXPONENTIAL":
            case "DOUBLE": {
                /*
                 * FITS ASCII tables may use D exponent notation.
                 * JavaScript expects E.
                 */
                const normalized = trimmed.replace(/[dD]/, "E");
                const value = Number.parseFloat(normalized);
                if (Number.isNaN(value)) {
                    return null;
                }
                return value;
            }
            default:
                throw new Error(`Unsupported ASCII TABLE column type: ${definition.type}`);
        }
    }
    getRow(rowIndex) {
        return this.columns.map((_, columnIndex) => this.getCell(rowIndex, columnIndex));
    }
}

;// ./src/FITSAsciiTableUtils.ts
class FITSAsciiTableUtils {
    static parseTFORM(format) {
        const normalized = format
            .trim()
            .replace(/^'/, "")
            .replace(/'$/, "")
            .trim()
            .toUpperCase();
        /*
         * FITS ASCII table formats:
         *
         *   Aw
         *   Iw
         *   Fw.d
         *   Ew.d
         *   Dw.d
         */
        const match = normalized.match(/^([AIFED])(\d+)(?:\.(\d+))?$/);
        if (!match) {
            throw new Error(`Unsupported FITS ASCII table TFORM value: ${format}`);
        }
        const code = match[1];
        const width = Number(match[2]);
        const decimals = match[3] !== undefined
            ? Number(match[3])
            : null;
        if (!Number.isInteger(width) ||
            width <= 0) {
            throw new Error(`Invalid FITS ASCII table field width: ${width}`);
        }
        if (code === "A" ||
            code === "I") {
            if (decimals !== null) {
                throw new Error(`TFORM ${format} must not specify decimal places.`);
            }
        }
        else if (decimals === null) {
            throw new Error(`TFORM ${format} requires decimal places.`);
        }
        return {
            code,
            width,
            decimals,
        };
    }
}

;// ./src/FITSParser.ts












class FITSParser {
    /**
     * @deprecated Use loadFITSFile() instead.
     *
     * This legacy API supports only 2-dimensional image FITS files
     * and returns the former FITSParsed structure.
     */
    static async loadFITS(path, options = {}) {
        const fitsFile = await FITSParser.loadFITSFile(path, options);
        if (fitsFile === null) {
            return null;
        }
        const primary = fitsFile.primaryHDU;
        if (primary === null || primary.rawData === null) {
            return null;
        }
        const shape = FITSImageUtils.getShape(primary.header);
        if (shape.length !== 2) {
            throw new Error("Legacy loadFITS() supports only 2D FITS images. " +
                "Use loadFITSFile() for N-dimensional images.");
        }
        return {
            header: primary.header,
            data: FITSParser.createMatrix(primary.rawData, primary.header),
        };
    }
    static async loadFITSFile(path, options = {}) {
        const rawData = await FITSParser.getFile(path);
        if (rawData.byteLength === 0) {
            return null;
        }
        return FITSParser.processFITSFile(rawData, options);
    }
    static processFITSFile(rawData, options) {
        const fitsFile = new FITSFile();
        let offset = 0;
        let hduIndex = 0;
        while (offset < rawData.byteLength) {
            /*
             * Ignore trailing zero/space padding.
             */
            if (FITSParser.isPaddingOnly(rawData, offset)) {
                break;
            }
            const header = ParseHeader.parse(rawData, offset);
            const headerByteLength = ParseHeader.getHeaderByteLength(rawData, offset);
            const dataOffset = offset + headerByteLength;
            const hduType = FITSParser.getHDUType(header, hduIndex);
            switch (hduType) {
                case "PRIMARY":
                case "IMAGE": {
                    const dataByteLength = FITSParser.getImagePayloadByteLength(header);
                    if (dataOffset + dataByteLength > rawData.byteLength) {
                        throw new Error(`Invalid FITS HDU ${hduIndex}: ` +
                            `expected ${dataByteLength} payload bytes ` +
                            `at offset ${dataOffset}, but only ` +
                            `${rawData.byteLength - dataOffset} remain.`);
                    }
                    const rawPayload = rawData.subarray(dataOffset, dataOffset + dataByteLength);
                    const hdu = FITSParser.createImageHDU(header, rawPayload, dataOffset, dataByteLength, hduIndex === 0, options);
                    fitsFile.addHDU(hdu);
                    const paddedPayloadLength = FITSParser.getPaddedByteLength(dataByteLength);
                    offset = dataOffset + paddedPayloadLength;
                    break;
                }
                case "BINTABLE": {
                    const dataByteLength = FITSParser.getBinaryTablePayloadByteLength(header);
                    if (dataOffset + dataByteLength > rawData.byteLength) {
                        throw new Error(`Invalid BINTABLE HDU ${hduIndex}.`);
                    }
                    const rawPayload = rawData.subarray(dataOffset, dataOffset + dataByteLength);
                    const hdu = FITSParser.createBinaryTableHDU(header, rawPayload, dataOffset, dataByteLength);
                    fitsFile.addHDU(hdu);
                    offset = dataOffset + FITSParser.getPaddedByteLength(dataByteLength);
                    break;
                }
                case "TABLE": {
                    const dataByteLength = FITSParser.getAsciiTablePayloadByteLength(header);
                    if (dataOffset + dataByteLength > rawData.byteLength) {
                        throw new Error(`Invalid ASCII TABLE HDU ${hduIndex}: ` +
                            `expected ${dataByteLength} payload bytes ` +
                            `at offset ${dataOffset}, but only ` +
                            `${rawData.byteLength - dataOffset} remain.`);
                    }
                    const rawPayload = rawData.subarray(dataOffset, dataOffset + dataByteLength);
                    const hdu = FITSParser.createAsciiTableHDU(header, rawPayload, dataOffset, dataByteLength);
                    fitsFile.addHDU(hdu);
                    offset = dataOffset + FITSParser.getPaddedByteLength(dataByteLength);
                    break;
                }
                default:
                    throw new Error(`Unsupported FITS HDU type at index ${hduIndex}.`);
            }
            hduIndex++;
        }
        return fitsFile;
    }
    static getPaddedByteLength(byteLength) {
        if (byteLength === 0) {
            return 0;
        }
        return (Math.ceil(byteLength / ParseHeader.BLOCK_SIZE) * ParseHeader.BLOCK_SIZE);
    }
    static isPaddingOnly(rawData, offset) {
        for (let i = offset; i < rawData.byteLength; i++) {
            const value = rawData[i];
            if (value !== 0x00 && value !== 0x20) {
                return false;
            }
        }
        return true;
    }
    static getHDUType(header, index) {
        if (index === 0) {
            return "PRIMARY";
        }
        const xtension = ParseHeader.getFITSItemStringValue(header, FITSHeaderManager.XTENSION);
        if (xtension === null) {
            return "UNKNOWN";
        }
        switch (xtension.toUpperCase()) {
            case "IMAGE":
                return "IMAGE";
            case "BINTABLE":
                return "BINTABLE";
            case "TABLE":
                return "TABLE";
            default:
                return "UNKNOWN";
        }
    }
    static createImageHDU(header, rawPayload, dataOffset, dataByteLength, primary, options) {
        const finalHeader = options.computeDataMinMax
            ? (ParsePayload.computePhysicalMinAndMax(header, rawPayload) ?? header)
            : header;
        const bitpix = ParseHeader.getFITSItemValue(finalHeader, FITSHeaderManager.BITPIX);
        if (bitpix === null) {
            throw new Error("BITPIX not defined.");
        }
        const shape = FITSImageUtils.getShape(finalHeader);
        const typedData = ParsePayload.createTypedArray(rawPayload, bitpix);
        if (primary) {
            return new PrimaryHDU(finalHeader, rawPayload, dataOffset, dataByteLength, bitpix, shape, typedData);
        }
        return new ImageHDU(finalHeader, rawPayload, dataOffset, dataByteLength, bitpix, shape, typedData);
    }
    static getImagePayloadByteLength(header) {
        const bitpix = ParseHeader.getFITSItemValue(header, FITSHeaderManager.BITPIX);
        if (bitpix === null) {
            throw new Error("BITPIX not defined.");
        }
        ParsePayload.assertSupportedBITPIX(bitpix);
        const shape = FITSImageUtils.getShape(header);
        if (shape.length === 0) {
            return 0;
        }
        const elementCount = shape.reduce((total, dimension) => total * dimension, 1);
        const bytesPerElement = Math.abs(bitpix) / 8;
        return elementCount * bytesPerElement;
    }
    static getBinaryTablePayloadByteLength(header) {
        const rowByteLength = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS1);
        const rowCount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS2);
        const pcount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.PCOUNT) ?? 0;
        if (rowByteLength === null || rowCount === null) {
            throw new Error("BINTABLE requires NAXIS1 and NAXIS2.");
        }
        return rowByteLength * rowCount + pcount;
    }
    static getBinaryTableColumns(header) {
        const fieldCount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.TFIELDS);
        if (fieldCount === null) {
            throw new Error("BINTABLE requires TFIELDS.");
        }
        const columns = [];
        let byteOffset = 0;
        for (let index = 1; index <= fieldCount; index++) {
            const tform = ParseHeader.getFITSItemStringValue(header, FITSHeaderManager.tableFieldKey("TFORM", index));
            if (tform === null) {
                throw new Error(`Missing TFORM${index}.`);
            }
            const parsed = FITSBinaryTableUtils.parseTFORM(tform);
            const name = ParseHeader.getFITSItemStringValue(header, FITSHeaderManager.tableFieldKey("TTYPE", index));
            const unit = ParseHeader.getFITSItemStringValue(header, FITSHeaderManager.tableFieldKey("TUNIT", index));
            columns.push({
                index,
                name,
                format: tform,
                type: FITSParser.mapBinaryType(parsed.code),
                repeat: parsed.repeat,
                byteOffset,
                byteWidth: parsed.byteWidth,
                unit,
                scale: ParseHeader.getFITSItemValue(header, FITSHeaderManager.tableFieldKey("TSCAL", index)) ?? 1,
                zero: ParseHeader.getFITSItemValue(header, FITSHeaderManager.tableFieldKey("TZERO", index)) ?? 0,
                nullValue: ParseHeader.getFITSItemValue(header, FITSHeaderManager.tableFieldKey("TNULL", index)),
            });
            byteOffset += parsed.byteWidth;
        }
        return columns;
    }
    static mapBinaryType(code) {
        switch (code.toUpperCase()) {
            case "L":
                return "LOGICAL";
            case "X":
                return "BIT";
            case "B":
                return "UINT8";
            case "I":
                return "INT16";
            case "J":
                return "INT32";
            case "K":
                return "INT64";
            case "A":
                return "CHAR";
            case "E":
                return "FLOAT32";
            case "D":
                return "FLOAT64";
            case "C":
                return "COMPLEX64";
            case "M":
                return "COMPLEX128";
            default:
                return "UNKNOWN";
        }
    }
    static createBinaryTableHDU(header, rawPayload, dataOffset, dataByteLength) {
        const rowByteLength = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS1);
        const rowCount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS2);
        if (rowByteLength === null || rowCount === null) {
            throw new Error("Invalid BINTABLE header.");
        }
        const columns = FITSParser.getBinaryTableColumns(header);
        const columnsByteWidth = columns.reduce((sum, column) => sum + column.byteWidth, 0);
        if (columnsByteWidth !== rowByteLength) {
            throw new Error(`BINTABLE columns occupy ${columnsByteWidth} bytes per row, ` +
                `but NAXIS1=${rowByteLength}.`);
        }
        return new BinaryTableHDU(header, rawPayload, dataOffset, dataByteLength, rowByteLength, rowCount, columns);
    }
    static getAsciiTablePayloadByteLength(header) {
        const rowByteLength = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS1);
        const rowCount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS2);
        if (rowByteLength === null || rowCount === null) {
            throw new Error("ASCII TABLE requires NAXIS1 and NAXIS2.");
        }
        if (!Number.isInteger(rowByteLength) || rowByteLength < 0) {
            throw new Error(`Invalid ASCII TABLE NAXIS1=${rowByteLength}.`);
        }
        if (!Number.isInteger(rowCount) || rowCount < 0) {
            throw new Error(`Invalid ASCII TABLE NAXIS2=${rowCount}.`);
        }
        const pcount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.PCOUNT) ?? 0;
        if (pcount !== 0) {
            throw new Error(`ASCII TABLE requires PCOUNT=0, received ${pcount}.`);
        }
        return rowByteLength * rowCount;
    }
    static mapAsciiType(code) {
        switch (code.toUpperCase()) {
            case "A":
                return "CHAR";
            case "I":
                return "INTEGER";
            case "F":
                return "FLOAT";
            case "E":
                return "EXPONENTIAL";
            case "D":
                return "DOUBLE";
            default:
                return "UNKNOWN";
        }
    }
    static getAsciiTableColumns(header) {
        const fieldCount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.TFIELDS);
        if (fieldCount === null) {
            throw new Error("ASCII TABLE requires TFIELDS.");
        }
        if (!Number.isInteger(fieldCount) || fieldCount < 0) {
            throw new Error(`Invalid ASCII TABLE TFIELDS=${fieldCount}.`);
        }
        const columns = [];
        for (let index = 1; index <= fieldCount; index++) {
            const tform = ParseHeader.getFITSItemStringValue(header, FITSHeaderManager.tableFieldKey("TFORM", index));
            if (tform === null) {
                throw new Error(`Missing TFORM${index}.`);
            }
            const tbcol = ParseHeader.getFITSItemValue(header, FITSHeaderManager.tableFieldKey("TBCOL", index));
            if (tbcol === null) {
                throw new Error(`Missing TBCOL${index}.`);
            }
            if (!Number.isInteger(tbcol) || tbcol < 1) {
                throw new Error(`Invalid TBCOL${index}=${tbcol}.`);
            }
            const parsed = FITSAsciiTableUtils.parseTFORM(tform);
            const name = ParseHeader.getFITSItemStringValue(header, FITSHeaderManager.tableFieldKey("TTYPE", index));
            const unit = ParseHeader.getFITSItemStringValue(header, FITSHeaderManager.tableFieldKey("TUNIT", index));
            columns.push({
                index,
                name,
                format: tform,
                type: FITSParser.mapAsciiType(parsed.code),
                startColumn: tbcol,
                /*
                 * FITS TBCOL is 1-based.
                 * JavaScript offsets are 0-based.
                 */
                byteOffset: tbcol - 1,
                width: parsed.width,
                decimals: parsed.decimals,
                unit,
            });
        }
        return columns;
    }
    static validateAsciiTableColumns(columns, rowByteLength) {
        for (const column of columns) {
            const endOffset = column.byteOffset + column.width;
            if (endOffset > rowByteLength) {
                throw new Error(`ASCII TABLE column ${column.index} ` +
                    `extends to byte ${endOffset}, ` +
                    `but NAXIS1=${rowByteLength}.`);
            }
        }
    }
    static createAsciiTableHDU(header, rawPayload, dataOffset, dataByteLength) {
        const rowByteLength = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS1);
        const rowCount = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS2);
        if (rowByteLength === null || rowCount === null) {
            throw new Error("Invalid ASCII TABLE header.");
        }
        const columns = FITSParser.getAsciiTableColumns(header);
        FITSParser.validateAsciiTableColumns(columns, rowByteLength);
        return new AsciiTableHDU(header, rawPayload, dataOffset, dataByteLength, rowByteLength, rowCount, columns);
    }
    static createMatrix(payload, header) {
        const NAXIS1 = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS1);
        if (NAXIS1 === null) {
            throw new Error("NAXIS1 not defined.");
        }
        const NAXIS2 = ParseHeader.getFITSItemValue(header, FITSHeaderManager.NAXIS2);
        if (NAXIS2 === null) {
            throw new Error("NAXIS2 not defined.");
        }
        const BITPIX = ParseHeader.getFITSItemValue(header, FITSHeaderManager.BITPIX);
        if (BITPIX === null) {
            throw new Error("BITPIX not defined.");
        }
        const bytesXelem = Math.abs(BITPIX / 8);
        // if (payload.length !== NAXIS1 * NAXIS2 * bytesXelem) {
        //   throw new Error("Payload size does not match the expected matrix dimensions.");
        // }
        // const matrix: Array<Uint8Array> = [];
        const matrix = [];
        for (let i = 0; i < NAXIS2; i++) {
            matrix.push(payload.slice(i * NAXIS1 * bytesXelem, (i + 1) * NAXIS1 * bytesXelem));
        }
        return matrix;
    }
    /**
     * @deprecated Legacy FITSParsed writer API.
     */
    static saveFITSLocally(fitsParsed, path) {
        return FITSWriter.writeFITSFile(fitsParsed, path);
    }
    static async getFile(uri) {
        if (!uri.substring(0, 5).toLowerCase().includes("http")) {
            const p = await __webpack_require__.e(/* import() */ 483).then(__webpack_require__.bind(__webpack_require__, 483));
            const rawData = await p.getLocalFile(uri);
            if (rawData?.length) {
                const uint8 = new Uint8Array(rawData);
                return uint8;
            }
            return new Uint8Array(0);
        }
        else {
            const p = await __webpack_require__.e(/* import() */ 646).then(__webpack_require__.bind(__webpack_require__, 646));
            const rawData = await p.getFile(uri);
            if (rawData?.byteLength) {
                const uint8 = new Uint8Array(rawData);
                return uint8;
            }
            return new Uint8Array(0);
        }
    }
}
// const url = "http://skies.esac.esa.int/Herschel/normalized/PACS_hips160//Norder8/Dir40000/Npix47180.fits"
// FITSParser.loadFITS(url).then((fits) => {
//   if (fits == null) {
//     return null
//   }
//   const path = "./fitsTest1.fits"
//   console.log(fits.header)
//   FITSParser.saveFITSLocally(fits, path)
//   console.log("finished")
// })
// // const file = "/Users/fabriziogiordano/Desktop/PhD/code/new/FITSParser/tests/inputs/empty.fits"
// const file = "/Users/fabriziogiordano/Desktop/PhD/code/new/FITSParser/tests/inputs/Npix43348.fits"
// FITSParser.loadFITS(file).then((fits) => {
//   if (fits == null) {
//     return null
//   }
//   const path = "./fitsTest2.fits"
//   console.log(fits.header)
//   FITSParser.saveFITSLocally(fits, path)
//   console.log("finished")
// })

;// ./src/index.ts













module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=jsfitsio.cjs.map