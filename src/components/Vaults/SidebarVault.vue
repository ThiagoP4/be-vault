<script setup lang="ts">
    import AppLogo from '../AppLogo.vue' // Ajuste o caminho se a Sidebar estiver dentro da pasta Vaults
    import { Lock } from '@lucide/vue'
</script>
<template>

 <aside class="sidebar">
    <div class="brand"><AppLogo /></div>
    <nav class="menu-section">
        <span class="eyebrow">Storage</span>
        <ul>
            <li class="active">All items</li>
            <li>Logins</li>
            <li>Cards</li>
            <li>Notes</li>
        </ul>
    </nav>
    <div class="sidebar-footer">
        <div class="master-key-card">
            <div class="mk-header">
                <span class="eyebrow">MASTER KEY</span>
                <span class="status-active">ACTIVE</span>
            </div>
            <div class="mk-bar">
                <div class="mk-progress"></div>
            </div>
        </div>
        <button class="btn-lock">
            <span class="eyebrow">LOCK VAULT</span>
            <Lock :size="14" />
        </button>
    </div>
</aside>

</template>

<style scoped>

.sidebar {
    background-color: var(--bg-panel-left);
    border-right: 1px solid var(--border);
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}


.menu-section ul {
    list-style: none;
    padding: 0;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.menu-section li {
    font-size: 0.875rem;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: color 0.2s;
}

.menu-section li:hover {
    color: var(--text-primary);
}

.menu-section li::before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border: 1px solid var(--text-muted);
    transition: all 0.2s;
}

.menu-section li.active {
    color: var(--text-primary);
}

.menu-section li.active::before {
    background-color: var(--text-primary);
    border-color: var(--text-primary);
}

.sidebar-footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Cartão Preto do Master Key */
.master-key-card {
    background-color: oklch(0.05 0 0); /* Um preto/fundo super escuro */
    padding: 1rem;
    border: 1px solid var(--border);
}
.mk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.status-active {
    color: var(--neon); /* Aquele verde neon da sua paleta! */
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
}
/* A barrinha de progresso / tempo */
.mk-bar {
    height: 2px;
    background-color: var(--border);
    width: 100%;
}
.mk-progress {
    height: 100%;
    width: 60%; /* Depois você pode fazer isso diminuir com JS! */
    background-color: var(--text-primary);
}
/* Botão de Lock */
.btn-lock {
    background: transparent;
    border: 1px solid var(--border);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
}
.btn-lock:hover {
    color: var(--text-primary);
    background-color: var(--destructive);
}
/* Força o texto eyebrow dentro do botão a herdar a cor do botão no hover */
.btn-lock .eyebrow {
    color: inherit;
    margin: 0;
}

</style>