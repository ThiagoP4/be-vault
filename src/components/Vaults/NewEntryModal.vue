<script setup lang="ts">
    import { Eye, EyeOff, Sparkles } from '@lucide/vue';
    import { ref } from 'vue';
    import PasswordGenerator from '../Shared/PasswordGenerator.vue';
    import { addEncryptedVaultItem } from '../../services/vault.ts';
    import { useVaultStore } from '../../stores/vaultStore.ts'

    const showGen = ref(false);
    const reveal = ref(false);
    const password = ref('');
    const serviceName = ref('');
    const identity = ref('');
    const category = ref('login');
    
    const emit = defineEmits(['close']);
    const vaultStore = useVaultStore();

    const handleSave = async () => {
        if(!serviceName.value || !identity.value || !password.value) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const novoItem = await addEncryptedVaultItem(
                serviceName.value,
                identity.value,
                password.value
            );
        
            vaultStore.addItem(novoItem);
            emit('close');
        }
        catch (error) {
            console.error(error);
            alert("Erro ao salvar senha no supabase;")
        }
    }

</script>


<template>
    <div class="modal-overlay">
        <div class="modal-box">
            <header class="modal-header">
                <h2>NEW ENTRY</h2>
                <div class="header-right">
                    <span class="watermark">PROVISION</span>
                    <button class="btn-close"></button>
                </div>
            </header>
            <div class="modal-body">
               <form id="entryForm" class="entry-form" @submit.prevent="handleSave">
                <div class="input-group">
                    <div class="label-row">
                        <label for="category" class="eyebrow">CATEGORY</label>
                    </div>
                    <div class="category-wrapper">
                        <button type="button" class="category btn" :class="{ active: category === 'login' }" @click="category = 'login'">
                            LOGIN
                        </button>
                        <button type="button" class="category btn" :class="{ active: category === 'card' }" @click="category = 'card'">
                            CARD
                        </button>
                        <button type="button" class="category btn" :class="{ active: category === 'note' }" @click="category = 'note'">
                            NOTE
                        </button>
                    </div>
                </div>
                <div class="input-group">
                    <div class="label-row">
                        <label for="service-name" class="eyebrow">SERVICE NAME</label>
                    </div>
                    <input id="service-name" type="text" placeholder="e.g. GitHub" v-model="serviceName">
                </div>
                <div class="input-group">
                    <div class="label-row">
                        <label for="identity" class="eyebrow">IDENTITY</label>
                    </div>
                    <input id="identity" type="email" placeholder="@bevault.io" v-model="identity">
                </div>
                <div class="input-group">
                    <div class="label-row">
                        <label for="Passphrase" class="eyebrow">PASSPHRASE</label>
                        <button class="pass-generator" @click="showGen = !showGen">
                            <Sparkles :size="12" />
                            {{ showGen ? 'HIDE GENERATOR' : 'GENERATE' }}
                        </button>
                    </div>
                    <div class="input-with-icon">
                        <input 
                            id="Passphrase" 
                            :type="reveal ? 'text' : 'password'" 
                            v-model="password"
                            placeholder="••••••••••••••••"
                        >
                        <button type="button" class="icon-btn" @click="reveal = !reveal">
                            <EyeOff v-if="reveal" :size="16" />
                            <Eye v-else :size="16" />
                        </button>
                    </div>
                    
                    <PasswordGenerator v-if="showGen" @password-generated="password = $event" />
                </div>
               </form> 
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="$emit('close')">CANCEL</button>
                <button type="submit" class="btn-seal" form="entryForm">SEAL ENTRY</button>
            </div>
        </div>
    </div>

</template>
<style scoped>

    .modal-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.75); 
    }
    
    .modal-box {    
        background-color: var(--bg-app);
        border: 1px solid var(--border);
        width: 100%;
        max-width: 512px;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid var(--border);
    }

    .modal-header h2 {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: var(--text-primary);
        margin: 0;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .watemark {
        font-family: var(--font-mono);
        font-size: 10px;
        letter-spacing: 0.2em;
        color: var(--text-muted);
    }

    .btn-close {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: 14px;
        cursor: pointer;
        transition: color 0.2s;
    }

    .btn-close:hover {
        color: var(--text-primary);
    }

    .entry-form {
        display: flex;
        flex-direction: column;
        padding: 1.5rem 2rem;
    }

    .input-group {
        margin-bottom: 2rem;
    }

    .label-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .entry-form input {
        width: 100%;
        height: 2.75rem;
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--border);
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 300;
        padding: 0;
        outline: none;
        transition: border-color 0.2s;
    }

    .entry-form .eyebrow {
        font-family: inherit;
        font-size: 12px; 
        font-weight: 500;
        letter-spacing: 0.15em;
    }

    .entry-form input:focus {
        border-bottom-color: var(--text-primary);
    }

    .entry-form input::placeholder {
        color: oklch(0.704 0.04 256.788 / 0.4);
    }

    .input-with-icon {
    position: relative;
    display: flex;
    align-items: center;
}

    .input-with-icon input {
        padding-right: 2.5rem; 
    }

    .icon-btn {
        position: absolute;
        right: 0;
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
    }
    .icon-btn:hover {
        color: var(--text-primary);
    }

    .pass-generator {
        background: transparent;
        border: none;
        font-family: var(--font-mono);
        font-size: 9px;
        letter-spacing: 0.2em;
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--text-muted);
        cursor: pointer;
    }

    .pass-generator:hover {
        color: var(--text-primary);
    }

    .category-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1px;
        border: 1px solid var(--border);
        background-color: var(--border);
    }

    .category.btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.15em;
        padding: 1rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .category.btn.active {
        background-color: var(--text-primary);
        color: var(--bg-app);
    }

    /* --- ESTILOS DO RODAPÉ (FOOTER) --- */
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 1.5rem 2rem;
        border-top: 1px solid var(--border);
        gap: 1rem;
        background-color: var(--bg-panel-left);
    }

    .btn-cancel {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.15em;
        cursor: pointer;
        padding: 0.5rem 1rem;
    }
    .btn-cancel:hover { color: var(--text-primary); }

    .btn-seal {
        background: var(--text-primary);
        color: var(--background);
        border: none;
        padding: 0.75rem 1.5rem;
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.15em;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .btn-seal:hover {
        background: oklch(0.9 0.003 247.858); 
    }

</style>