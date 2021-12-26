/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 08, 2020 by Jay Liu
 */


/**
 * A util class to convert between the raw binary data ArrayBuffer and the typed counter-part.
 */
export const bufferUtils = {

    /**
     * Converts arraybuffer to 32-bit unsigned integer
     * @param {ArrayBuffer} buffer
     * @returns {number}
     */
    bufferToInt: (buffer) => {
        const dv = new DataView(buffer);
        return dv.getUint32(0);
    },

    /**
     * Converts 32-bit unsigned integer to arraybuffer
     * @param {number} num
     * @returns {ArrayBuffer}
     */
    intToBuffer: (num) => {
        const buffer = new ArrayBuffer(4);
        const dv = new DataView(buffer);

        dv.setUint32(0, num, false);

        return buffer;
    },

    /**
     * Converts arraybuffer to string
     * @param {ArrayBuffer} buffer
     * @returns {string}
     */
    bufferToString: (buffer) => {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    },

    /**
     * Converts string to arraybuffer
     * @param {string} str
     * @param {number} [strByteLength] - Optional
     */
    stringToBuffer: (str, strByteLength) => {
        if (!strByteLength) {
            strByteLength = Buffer.byteLength(str);
        }

        const buffer = Buffer.alloc(strByteLength);
        buffer.write(str);

        return buffer;
    },

    /**
     * Merges the given arraybuffers
     * @param {ArrayBuffer} buffer1
     * @param {ArrayBuffer} buffer2
     * @returns {ArrayBuffer}
     */
    mergeBuffers: (buffer1, buffer2) => {
        const result = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        result.set(new Uint8Array(buffer1), 0);
        result.set(new Uint8Array(buffer2), buffer1.byteLength);
        return result.buffer;
    },
};
