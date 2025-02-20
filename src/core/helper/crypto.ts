import * as CryptoJS from 'crypto-js';

export function encryptPayload(payload: any, secretKey: string): string {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
  return encrypted;
}

export function decryptPayload(encryptedPayload: string, secretKey: string): any {
  const bytes = CryptoJS.AES.decrypt(encryptedPayload, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}