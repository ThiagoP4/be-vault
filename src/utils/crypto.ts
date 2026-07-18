export async function deriveKey(masterPassword: string, secretKey: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(masterPassword),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(secretKey), // O "sal" embaralha a senha
            iterations: 600000,
            hash: "SHA-256"
        },
        keyMaterial,
        {
            name: "AES-GCM", // O algoritmo final que queremos gerar
            length: 256
        },
        true, // extractable: true (apenas se quisermos inspecionar a chave depois, mas idealmente pode ser false na versão final)
        ["encrypt", "decrypt"]
    )
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++){
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64)// window.atob() é uma função nativa do navegador que pega um texto Base64 
    // e transforma de volta em uma string binária (onde cada caractere representa 1 byte).

    // Array vazio de bytes (Uint8Array = Array de Inteiros de 8 bits sem sinal)
    // do exato mesmo tamanho da nossa string binária.
    const bytes = new Uint8Array(binary.length);
    
    for (let i = 0; i < bytes.length; i++) {
        // Preenchemos nosso array de bytes. O charCodeAt(i) pega o número correspondente àquele caractere.
        bytes[i] = binary.charCodeAt(i);
    }
    
    return bytes.buffer
}

export async function encryptData(plainText: string, key: CryptoKey): Promise<string> {
    // A criptografia só aceita bytes. TextEncoder transforma nossa senha (ex: "minhaSenhaNetflix") em bytes.
    const enc = new TextEncoder();
    const data = enc.encode(plainText);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Aqui fazemos a encriptação de fato. O resultado é um ArrayBuffer (dados puros).
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv // Passamos o nosso tempero aleatório
        },
        key, // A chave de 256 bits que você derivou antes
        data // A senha da netflix em bytes
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const combinedPayload = new Uint8Array(iv.length + encryptedBytes.length);

    combinedPayload.set(iv)
    combinedPayload.set(encryptedBytes, iv.length);

    return arrayBufferToBase64(combinedPayload.buffer);
}

export async function decryptData(encryptedBase64: string, key: CryptoKey): Promise<string> {
    const combinedBuffer = base64ToArrayBuffer(encryptedBase64);
    const combinedBytes = new Uint8Array(combinedBuffer);

    const iv = combinedBytes.slice(0, 12);
    const encryptedData = combinedBytes.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
}