<script setup lang="ts">
    import EntryForm from '../Shared/EntryForm.vue';
    import { updateEncryptedVaultItem } from '../../services/vault';
    import { useVaultStore } from '../../stores/vaultStore'
    import type { VaultItem } from '../../stores/vaultStore';

    const props = defineProps<{
        item: VaultItem
    }>();

    const emit = defineEmits(['close']);
    const vaultStore = useVaultStore();

    const handleUpdate = async (data: any) => {
        if(!data.serviceName || !data.identity) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            await updateEncryptedVaultItem(
                props.item.id_vault,
                data.serviceName,
                data.identity,
                data.password // If it's empty, the backend ignores it
            );
        
            vaultStore.updateItem({
                ...props.item,
                service_name: data.serviceName,
                username: data.identity,
                password: data.password || props.item.password,
            });
            emit('close');
        }
        catch (error) {
            console.error(error);
            alert("Erro ao atualizar senha no supabase;")
        }
    }
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-box">
            <header class="modal-header">
                <h2>EDIT ENTRY</h2>
                <div class="header-right">
                    <span class="watermark">PROVISION</span>
                    <button class="btn-close" @click="$emit('close')"></button>
                </div>
            </header>
            <div class="modal-body">
               <EntryForm :initialData="props.item" @submit="handleUpdate" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="$emit('close')">CANCEL</button>
                <button type="submit" class="btn-seal" form="entryForm">UPDATE ENTRY</button>
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
