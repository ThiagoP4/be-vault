<script setup lang="ts">
    import AppLogo from '../AppLogo.vue' // Ajuste o caminho se a Sidebar estiver dentro da pasta Vaults
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

</style>