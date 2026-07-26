import { ref } from 'vue'
import { exportCryptoKey, importCryptoKey } from '../utils/crypto'

export const activeCryptoKey = ref<CryptoKey | null>(null)

export async function setCryptoKey(key: CryptoKey) {
    activeCryptoKey.value = key
    const exported = await exportCryptoKey(key)
    localStorage.setItem('be_vault_session_key', exported)

    const expirationTime = Date.now() + 86400000;
    localStorage.setItem('be_vault_key_expiry', expirationTime.toString());
}

export async function restoreCryptoKey() {
    if (activeCryptoKey.value) return;

    const now = Date.now();
    const expiryStr = localStorage.getItem('be_vault_key_expiry');
    

    if (expiryStr && now > parseInt(expiryStr)) {
        console.log("Sessão expirada. Trancando cofre...");
        clearCryptoKey(); // Apaga do localStorage
        return; 
    }

    const exported = localStorage.getItem('be_vault_session_key')

    if (exported) {
        try {
            activeCryptoKey.value = await importCryptoKey(exported)
            const newExpirationTime = Date.now() + 43200000;
            if(newExpirationTime > parseInt(expiryStr || '0')) {
                localStorage.setItem('be_vault_key_expiry', newExpirationTime.toString());
            }
        } catch (e) {
            console.error('Failed to restore crypto key from session', e)
        }
    }
}

export function clearCryptoKey() {
    activeCryptoKey.value = null
    localStorage.removeItem('be_vault_session_key')
    localStorage.removeItem('be_vault_key_expiry')
}
