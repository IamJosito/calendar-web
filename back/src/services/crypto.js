const CryptoJS = require("crypto-js");

function encryptData(data, key) {
  let encryptedString;
  if (typeof data == "string") {
    data = data.slice();
    encryptedString = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Base64.parse(key),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  } else {
    encryptedString = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: CryptoJS.enc.Base64.parse(key),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  }
  return encryptedString.toString();
}
function decryptData(encrypted, key) {
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: CryptoJS.enc.Base64.parse(key),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = {encryptData, decryptData};
