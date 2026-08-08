<script setup lang="ts">
    import EntryForm from '../Shared/EntryForm.vue';
    import { addEncryptedVaultItem } from '../../services/vault';
    import { useVaultStore } from '../../stores/vaultStore'
    import { useUiStore } from '../../stores/uiStore'

    const emit = defineEmits(['close']);
    const vaultStore = useVaultStore();
    const uiStore = useUiStore();

    const handleSave = async (data: any) => {
        if(!data.serviceName || !data.identity || !data.password) {
            uiStore.showToast("Preencha todos os campos obrigatórios!", "warning");
            return;
        }

        try {
            const novoItem = await addEncryptedVaultItem(
                data.serviceName,
                data.identity,
                data.password
            );
        
            vaultStore.addItem(novoItem);
            uiStore.showToast("Entrada criada com sucesso!", "success");
            emit('close');
        }
        catch (error) {
            console.error(error);
            uiStore.showToast("Erro ao salvar senha no supabase", "error")
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
                    <button class="btn-close" @click="$emit('close')"></button>
                </div>
            </header>
            <div class="modal-body">
               <EntryForm @submit="handleSave" />
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

    .watermark {
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