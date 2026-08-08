<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useVaultStore } from '../stores/vaultStore'
    import { activeCryptoKey, restoreCryptoKey } from '../stores/keyStore'
    import { fetchAndDecryptVaultItems, deleteVaultItem } from '../services/vault'
    import SideBar from '../components/Vaults/SidebarVault.vue'
    import HeaderVault from '../components/Vaults/HeaderVault.vue'
    import CardsVault from '../components/Vaults/CardVault.vue'
    import EmergencyKit from '../components/Vaults/EmergencyKit.vue'
    import EditEntryModal from '../components/Vaults/EditEntryModal.vue'
    import ProfileVault from '../components/Profile/ProfileVault.vue'
    import ConfirmDeleteModal from '../components/Vaults/ConfirmDeleteModal.vue'
    import { ref } from 'vue'
    import type { VaultItem } from '../stores/vaultStore'
    import { useUiStore } from '../stores/uiStore'

    const vaultStore = useVaultStore()
    const uiStore = useUiStore()
    const router = useRouter()
    const route = useRoute()
    
    const activeTab = ref('all-items')

    const editingItem = ref<VaultItem | null>(null)
    const isEditModalOpen = ref(false)
    
    const itemToDelete = ref<VaultItem | null>(null)
    const isDeleteModalOpen = ref(false)

    const requestDelete = (item: VaultItem) => {
        itemToDelete.value = item
        isDeleteModalOpen.value = true
    }

    const handleDeleteConfirm = async () => {
        if (!itemToDelete.value) return;
        
        try {
            await deleteVaultItem(itemToDelete.value.id_vault)
            vaultStore.removeItem(itemToDelete.value.id_vault)
            uiStore.showToast("Senha deletada com sucesso!", "success")
        } catch (error) {
            console.error("Erro ao deletar:", error)
            uiStore.showToast("Erro ao deletar a senha.", "error")
        } finally {
            isDeleteModalOpen.value = false
            itemToDelete.value = null
        }
    }

    const handleEdit = (item: VaultItem) => {
        editingItem.value = item
        isEditModalOpen.value = true
    }

    onMounted(async () => {
        await restoreCryptoKey(); // Tenta restaurar do SessionStorage primeiro

        // Se a chave não estiver na memória (ex: o usuário recarregou a página), volta pro login.
        if (!activeCryptoKey.value) {
            console.warn("Chave criptográfica não encontrada. Redirecionando para login...")
            router.push({ path: '/login', query: route.query })
            return
        }

        try {
            // Quando a tela carregar, busca e descriptografa tudo
            const items = await fetchAndDecryptVaultItems();
            // Salva na memória do Pinia
            vaultStore.setItems(items);
        } catch (error) {
            console.error("Erro ao carregar o cofre:", error);
        }
    })
</script>

<template>
    <div class="vault-layout">
        <SideBar :activeTab="activeTab" @changeTab="(tab) => activeTab = tab" />
        <main class="main-area">
        <HeaderVault v-if="activeTab === 'all-items'" />
        <div class="content-wrapper" v-if="activeTab === 'all-items'">
            <div class="content-header">
                <h2>PRIMARY VAULT</h2>
                <span class="eyebrow">ENTRIES FOUND</span>
            </div>
            <div class="cards-grid">
                <CardsVault
                    v-for="item in vaultStore.filteredItems"
                    :key="item.id_vault"
                    :data="item"
                    @edit="handleEdit(item)"
                    @delete="requestDelete(item)" />
            </div>
        </div>
        <div class="content-wrapper" v-else-if="activeTab === 'emergency-kit'">
            <EmergencyKit />
        </div>
        <div class="content-wrapper" v-else-if="activeTab === 'profile'">
            <ProfileVault />
        </div>
        <EditEntryModal 
            v-if="isEditModalOpen && editingItem" 
            :item="editingItem" 
            @close="isEditModalOpen = false" 
        />
        <ConfirmDeleteModal
            v-if="isDeleteModalOpen"
            :itemName="itemToDelete?.service_name"
            @close="isDeleteModalOpen = false"
            @confirm="handleDeleteConfirm"
        />
        </main>
    </div>

</template>

<style scoped>

.vault-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 100vh;
    background-color: var(--bg-app);
}

.content-wrapper {
    padding: 2.5rem;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(2,  1fr);
    gap: 1.5rem;
}

.content-header {
    margin-bottom: 2rem;
}

.content-header h2 {
    font-size: 1.25rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
}


/* =========================================
   RESPONSIVIDADE (TABLET)
   ========================================= */
@media (max-width: 1024px) {
    .cards-grid {
        grid-template-columns: 1fr; /* Força 1 coluna em tablets para não esmagar o card */
    }
}

/* =========================================
   RESPONSIVIDADE (MOBILE)
   ========================================= */
@media (max-width: 768px) {
    .vault-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }
    .content-wrapper {
        padding: 1.25rem; /* Menos margem morta nas pontas */
    }
    .cards-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 1.25rem;
    }
}


</style>