export const base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// Convert a byte array to big-endian 32-bit words
export const bytesToWords = function (bytes) {
    for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
    return words;
};

// Convert big-endian 32-bit words to a byte array
export const wordsToBytes = function (words) {
    for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
    return bytes;
};

// Convert a byte array to a hex string
export const bytesToHex = function (bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
};

// Convert a hex string to a byte array
export const hexToBytes = function (hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
};

// Convert a byte array to a base-64 string
export const bytesToBase64 = function (bytes) {

    // Use browser-native function if it exists
    if (typeof btoa == "function") return btoa(Binary.bytesToString(bytes));

    for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 <= bytes.length * 8)
                base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
            else base64.push("=");
        }
    }
    return base64.join("");

};

// Convert a base-64 string to a byte array
export const base64ToBytes = function (base64) {

    // Use browser-native function if it exists
    if (typeof atob == "function") return Binary.stringToBytes(atob(base64));

    // Remove non-base-64 characters
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

    for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
            (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
    }

    return bytes;

};

export const Binary = {

    // Convert a string to a byte array
    stringToBytes: function (str) {
        for (var bytes = [], i = 0; i < str.length; i++)
            bytes.push(str.charCodeAt(i) & 0xFF);
        return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function (bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
            str.push(String.fromCharCode(bytes[i]));
        return str.join("");
    }

};

export const sha1File = (settings, callback = null) => {
    var hash = [1732584193, -271733879, -1732584194, 271733878, -1009589776];
    var buffer = 1024 * 16 * 64;
    var sha1 = (block, hash) => {
        var words = [];
        var count_parts = 16;
        var h0 = hash[0],
            h1 = hash[1],
            h2 = hash[2],
            h3 = hash[3],
            h4 = hash[4];
        for (var i = 0; i < block.length; i += count_parts) {
            var th0 = h0,
                th1 = h1,
                th2 = h2,
                th3 = h3,
                th4 = h4;
            for (var j = 0; j < 80; j++) {
                if (j < count_parts)
                    words[j] = block[i + j] | 0;
                else {
                    var n = words[j - 3] ^ words[j - 8] ^ words[j - 14] ^ words[j - count_parts];
                    words[j] = (n << 1) | (n >>> 31);
                }
                var f, k;
                if (j < 20) {
                    f = (h1 & h2 | ~h1 & h3);
                    k = 1518500249;
                }
                else if (j < 40) {
                    f = (h1 ^ h2 ^ h3);
                    k = 1859775393;
                }
                else if (j < 60) {
                    f = (h1 & h2 | h1 & h3 | h2 & h3);
                    k = -1894007588;
                }
                else {
                    f = (h1 ^ h2 ^ h3);
                    k = -899497514;
                }

                var t = ((h0 << 5) | (h0 >>> 27)) + h4 + (words[j] >>> 0) + f + k;
                h4 = h3;
                h3 = h2;
                h2 = (h1 << 30) | (h1 >>> 2);
                h1 = h0;
                h0 = t;
            }
            h0 = (h0 + th0) | 0;
            h1 = (h1 + th1) | 0;
            h2 = (h2 + th2) | 0;
            h3 = (h3 + th3) | 0;
            h4 = (h4 + th4) | 0;
        }
        return [h0, h1, h2, h3, h4];
    };

    var run = (file, inStart, inEnd) => {
        var end = Math.min(inEnd, file.size);
        var start = inStart;
        var reader = new FileReader();
        reader.onload = (eee) => {
            file.sha1_progress = (end * 100 / file.size);
            var event = event || window.event || eee;
            var result = event.result || event.target.result;
            var block = bytesToWords(new Uint8Array(result));

            if (end === file.size) {
                var bTotal, bLeft, bTotalH, bTotalL;
                bTotal = file.size * 8;
                bLeft = (end - start) * 8;

                bTotalH = Math.floor(bTotal / 0x100000000);
                bTotalL = bTotal & 0xFFFFFFFF;

                // Padding
                block[bLeft >>> 5] |= 0x80 << (24 - bLeft % 32);
                block[((bLeft + 64 >>> 9) << 4) + 14] = bTotalH;
                block[((bLeft + 64 >>> 9) << 4) + 15] = bTotalL;

                hash = sha1(block, hash);
                file.sha1_hash = bytesToHex(wordsToBytes(hash));

                if (callback != null) {
                    callback(file.sha1_hash);
                }

            }
            else {
                hash = sha1(block, hash);
                start += buffer;
                end += buffer;
                run(file, start, end);
            }
        };
        var blob = file.slice(start, end);
        reader.readAsArrayBuffer(blob);
    };

    var checkApi = () => {
        if ((typeof File == 'undefined'))
            return false;

        if (!File.prototype.slice) {
            if (File.prototype.webkitSlice)
                File.prototype.slice = File.prototype.webkitSlice;
            else if (File.prototype.mozSlice)
                File.prototype.slice = File.prototype.mozSlice;
        }

        if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !File.prototype.slice)
            return false;

        return true;
    };

    if (checkApi()) {
        run(settings, 0, buffer);
    }
    else
        return false;
};


export const getExtension = (filename) => {
    if (filename == null) {
        return "";
    }
    const index = filename.lastIndexOf(".");
    if (index == -1) {
        return "";
    } else {
        return filename.substring(index + 1);
    }
};

export const isImgFile = (filename) => {
    return /jpg|jpeg|png|gif|bmp/.test(getExtension(filename));
};