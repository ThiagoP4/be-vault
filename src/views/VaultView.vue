<script setup lang="ts">
    import SideBar from '../components/Vaults/SidebarVault.vue'
    import HeaderVault from '../components/Vaults/HeaderVault.vue'
    import CardsVault from '../components/Vaults/CardVault.vue'
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
                <CardsVault />
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