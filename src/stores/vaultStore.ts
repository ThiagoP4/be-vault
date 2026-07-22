import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface VaultItem {
    id_vault: string;
    service_name: string;
    username: string;
    password?: string;
    created_at: string;
}

export const useVaultStore = defineStore('vault', () => {
    const items = ref<VaultItem[]>([])
    
    function setItems(newItems: VaultItem[]) {
        items.value = newItems;
    }
    
    function clearVault() {
        items.value = []
    }
    return { items, setItems, clearVault }
})