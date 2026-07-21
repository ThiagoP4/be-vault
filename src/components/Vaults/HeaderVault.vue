<script setup lang="ts">
import { Search } from '@lucide/vue'
</script>

<template>
    <header class="topbar">
        <div class="search-box">
            <Search />
        <input type="text" placeholder="Search your passwords..." />
    </div>
    <button class="btn-new"> + NEW ENTRY </button>
    </header>

</template>

<style scoped>
.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2.5rem;
    border-bottom: 1px solid var(--border);
}

.search-box {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-muted);
    flex: 1;
}

.search-box input {
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    outline: none;
    width: 100%;
    max-width: 400px;
}

.search-box input::placeholder {
    color: oklch(0.704 0.04 256.788 / 0.4);
}

.btn-new {
     background-color: var(--text-primary); /* Fundo branco */
    color: var(--bg-app); /* Texto escuro */
    border: none;
    padding: 0.75rem 1.5rem;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s;
}
.btn-new:hover {
    opacity: 0.85; /* Dá um leve brilho ao passar o mouse */
}

</style>