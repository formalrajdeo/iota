import * as CryptoJS from 'crypto-js';

export function aesEncrypt({ data }: any) {
    const encrypted = CryptoJS.AES.encrypt(data, "my-secret");
    return encrypted.toString()
}

export function aesDecrypt({ data }: any) {
    const decrypted = CryptoJS.AES.decrypt(data.toString(), "my-secret");
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8)
    return decryptedData ? JSON.parse(decryptedData) : "";
}