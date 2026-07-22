<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useVaultStore } from '../stores/vaultStore'
    import { activeCryptoKey, restoreCryptoKey } from '../stores/keyStore'
    import { fetchAndDecryptVaultItems } from '../services/vault'
    import SideBar from '../components/Vaults/SidebarVault.vue'
    import HeaderVault from '../components/Vaults/HeaderVault.vue'
    import CardsVault from '../components/Vaults/CardVault.vue'

    const vaultStore = useVaultStore()
    const router = useRouter()

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
                    :data="item" />
            </div>
        </div>
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


</style>