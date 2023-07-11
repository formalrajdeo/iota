import * as CryptoJS from 'crypto-js';
import { AES_SECRET_KEY } from '@/config/config';

export function aesEncrypt({ data }: any) {
    const encrypted = CryptoJS.AES.encrypt(data, AES_SECRET_KEY);
    return encrypted.toString()
}

export function aesDecrypt({ data }: any) {
    const decrypted = CryptoJS.AES.decrypt(data.toString(), AES_SECRET_KEY);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}