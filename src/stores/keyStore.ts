import { ref } from 'vue'
import { exportCryptoKey, importCryptoKey } from '../utils/crypto'

export const activeCryptoKey = ref<CryptoKey | null>(null)

export async function setCryptoKey(key: CryptoKey) {
    activeCryptoKey.value = key
    const exported = await exportCryptoKey(key)
    sessionStorage.setItem('be_vault_session_key', exported)
}

export async function restoreCryptoKey() {
    if (activeCryptoKey.value) return; // already in memory
    const exported = sessionStorage.getItem('be_vault_session_key')
    if (exported) {
        try {
            activeCryptoKey.value = await importCryptoKey(exported)
        } catch (e) {
            console.error('Failed to restore crypto key from session', e)
        }
    }
}

export function clearCryptoKey() {
    activeCryptoKey.value = null
    sessionStorage.removeItem('be_vault_session_key')
}
