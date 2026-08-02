<script setup lang="ts">
    import { ref } from 'vue'
    import AppLogo from '../AppLogo.vue'
    import { Lock, Menu, X } from '@lucide/vue'

    defineProps<{
        activeTab: string
    }>();

    const emit = defineEmits<{
        (e: 'changeTab', Tab: string): void
    }>();

    const isMenuOpen = ref(false)
</script>
<template>

 <aside class="sidebar">
    <div class="brand"><AppLogo /></div>
    <nav class="menu-section" :class="{ 'is-open': isMenuOpen }">
        <span class="eyebrow">Storage</span>
        <ul>
            <li :class="{ active: activeTab === 'all-items'}" @click="emit('changeTab', 'all-items')">All items</li>
            <li :class="{ active: activeTab === 'logins' }" @click="emit('changeTab', 'logins')">Logins</li>
            <li :class="{ active: activeTab === 'cards' }" @click="emit('changeTab', 'cards')">Cards</li>
            <li :class="{ active: activeTab === 'notes' }" @click="emit('changeTab', 'notes')">Notes</li>
        <span class="eyebrow" style="margin-top: 2rem; display: block;">Security</span>
        <ul>
            <li :class="{ active: activeTab === 'emergency-kit' }" @click="emit('changeTab', 'emergency-kit')">Emergency Kit</li>
            <li :class="{ active: activeTab === 'profile' }" @click="emit('changeTab', 'profile')">Profile</li>
        </ul>
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
        <div class="mobile-actions">
            <button class="btn-lock">
                <span class="eyebrow">LOCK VAULT</span>
                <Lock :size="14" />
            </button>
            <button class="btn-burger" @click="isMenuOpen = !isMenuOpen">
                <Menu v-if="!isMenuOpen" :size="20" />
                <X v-else :size="20" />
            </button>
        </div>
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

.mobile-actions {
    display: flex;
    gap: 0.5rem;
    width: 100%;
}

.btn-burger {
    display: none; /* Escondido no desktop */
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-burger:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
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
    width: 100%; /* Faz o botão esticar no PC */
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

/* =========================================
   RESPONSIVIDADE (MOBILE)
   ========================================= */
@media (max-width: 768px) {
    .sidebar {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-areas: 
            "logo actions"
            "menu menu";
        gap: 1.25rem;
        padding: 1.25rem 1.25rem 0 1.25rem;
        border-right: none;
        border-bottom: 1px solid var(--border);
    }

    .brand { grid-area: logo; align-self: center; }
    
    .sidebar-footer { 
        grid-area: actions; 
        margin-top: 0;
        align-self: center;
    }
    
    .menu-section { 
        grid-area: menu; 
        display: none; /* Escondido por padrão no mobile */
    }
    .menu-section.is-open {
        display: block; /* Mostra quando clica no menu burguer */
    }
    
    .menu-section .eyebrow { display: none; }
    
    .menu-section ul {
        flex-direction: row;
        gap: 0.75rem;
        margin-top: 0;
        overflow-x: auto;
        padding-bottom: 1rem; /* espaço para scroll */
    }
    
    /* Estilo "Pill" moderno e escuro */
    .menu-section li {
        white-space: nowrap;
        padding: 0.4rem 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        font-size: 11px;
        font-family: var(--font-mono);
        color: var(--text-muted);
    }

    .menu-section li::before {
        display: none; /* Tira o quadradinho */
    }

    .menu-section li.active {
        background: rgba(255, 255, 255, 0.1); /* Um cinza translúcido chique */
        border-color: rgba(255, 255, 255, 0.15);
        color: var(--text-primary);
    }

    .master-key-card { display: none; }
    
    .btn-lock { 
        padding: 0.5rem 0.75rem; 
        border-radius: 6px;
        gap: 0.5rem; 
    }

    .btn-burger {
        display: flex; /* Mostra no mobile */
        padding: 0.5rem;
        border-radius: 6px;
    }
    
    .mobile-actions {
        gap: 0.75rem;
    }
}


</style>