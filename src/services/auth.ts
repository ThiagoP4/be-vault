import { supabase } from './supabase'
import { arrayBufferToBase64 } from '../utils/crypto'

export async function signUpWithEmail(email: string, password: string) {
 
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
};

export async function signInWithEmail(email: string, password: string){

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;

};

export function generateSecretKey(): string {
    const randomBytes = new Uint8Array(32);

    window.crypto.getRandomValues(randomBytes);

    return arrayBufferToBase64(randomBytes.buffer);
};

export function saveSecretKey(key: string) {
    localStorage.setItem('be_vault_secret_key', key);
}

export function getSecretKey(): string | null {
    return localStorage.getItem('be_vault_secret_key');
}
