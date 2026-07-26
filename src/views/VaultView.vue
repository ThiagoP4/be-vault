<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useVaultStore } from '../stores/vaultStore'
    import { activeCryptoKey, restoreCryptoKey } from '../stores/keyStore'
    import { fetchAndDecryptVaultItems, deleteVaultItem } from '../services/vault'
    import SideBar from '../components/Vaults/SidebarVault.vue'
    import HeaderVault from '../components/Vaults/HeaderVault.vue'
    import CardsVault from '../components/Vaults/CardVault.vue'
    import EditEntryModal from '../components/Vaults/EditEntryModal.vue'
    import { ref } from 'vue'
    import type { VaultItem } from '../stores/vaultStore'

    const vaultStore = useVaultStore()
    const router = useRouter()
    
    const editingItem = ref<VaultItem | null>(null)
    const isEditModalOpen = ref(false)

    const handleDelete = async (id: string) => {
        if(confirm("Tem certeza que deseja deletar esta senha?")) {
            try {
                await deleteVaultItem(id)
                vaultStore.removeItem(id)
            } catch (error) {
                console.error("Erro ao deletar:", error)
                alert("Erro ao deletar a senha.")
            }
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
            router.push('/login')
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
        <SideBar />
        <main class="main-area">
        <HeaderVault />
        <div class="content-wrapper">
            <div class="content-header">
                <h2>PRIMARY VAULT</h2>
                <span>ENTRIES FOUND</span>
            </div>
            <div class="cards-grid">
                <CardsVault
                    v-for="item in vaultStore.items"
                    :key="item.id_vault"
                    :data="item"
                    @edit="handleEdit"
                    @delete="handleDelete" />
            </div>
        </div>
        <EditEntryModal 
            v-if="isEditModalOpen && editingItem" 
            :item="editingItem" 
            @close="isEditModalOpen = false" 
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
    margin-top: 2rem;
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