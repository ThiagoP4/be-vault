import { ref } from 'vue'

export const activeCryptoKey = ref<CryptoKey | null>(null)

export function setCryptoKey(key: CryptoKey) {
    activeCryptoKey.value = key
}

export function clearCryptoKey() {
    activeCryptoKey.value = null
}