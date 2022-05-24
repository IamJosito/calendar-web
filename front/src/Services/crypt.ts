import * as CryptoJS from "crypto-js"
function encryptData(data: string, key: string) {
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
function decryptData(encrypted: string, key: string) {
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: CryptoJS.enc.Base64.parse(key),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export {encryptData, decryptData};
