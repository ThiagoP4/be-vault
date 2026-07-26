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

    function addItem(newItem: VaultItem) {
        items.value.unshift(newItem);
    }
    
    function removeItem(id: string) {
        items.value = items.value.filter(item => item.id_vault !== id);
    }

    function updateItem(updatedItem: VaultItem) {
        const index = items.value.findIndex(item => item.id_vault === updatedItem.id_vault);
        if (index !== -1) {
            items.value[index] = updatedItem;
        }
    }
    
    function clearVault() {
        items.value = []
    }
    return { items, setItems, addItem, removeItem, updateItem, clearVault }
})