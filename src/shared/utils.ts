export const encrypt = async (data: string, password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    await cryptoKeyFromPassword(password),
    { name: 'AES-CBC' },
    false,
    ['encrypt'],
  );

  const iv = new Uint8Array(16);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    encoder.encode(data),
  );

  return bufferToBase64(encryptedBuffer);
};

export const decrypt = async (encryptedData: string, password: string): Promise<string> => {
  const decoder = new TextDecoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    await cryptoKeyFromPassword(password),
    { name: 'AES-CBC' },
    false,
    ['decrypt'],
  );

  const iv = new Uint8Array(16);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    base64ToBuffer(encryptedData),
  );

  return decoder.decode(decryptedBuffer);
};

const cryptoKeyFromPassword = async (password: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const passwordKey = encoder.encode(password);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordKey,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const salt = new Uint8Array(16);
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );

  return window.crypto.subtle.exportKey('raw', key);
};

const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export function trimText(text: string | undefined, length: number): string {
  if (!text) {
    return '';
  }

  if (text.length < length) {
    return text;
  }

  return text.slice(0, length) + '...';
}
