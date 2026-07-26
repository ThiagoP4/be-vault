<script setup lang="ts">
import { ref } from 'vue';
import { Globe, Copy, Pencil, Trash } from '@lucide/vue'
import type { VaultItem } from '../../stores/vaultStore'

const isCopied = ref(false);

const props = defineProps<{
    data: VaultItem
}>()

const copyPassword = async () => {
    if(props.data.password) {
        await navigator.clipboard.writeText(props.data.password)
        isCopied.value = true

        setTimeout(() => {
            isCopied.value = false
        }, 2000)
    } else {
        alert("Não há senha salva para este item")
    }
}

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
    <div class="vault-card">
        <div class="card-top">
            <div class="icon-box">
                <Globe :size="16" />
            </div>
            <div class="meta-info">
                <span class="eyebrow">LOGIN</span>
                <span class="eyebrow">13D AGO</span>
            </div>
        </div>
        <div class="card-mid">
            <h3>{{ props.data.service_name }}</h3>
            <p>{{ props.data.username }}</p>
        </div>
        <div class="card-bottom">
            <span class="password-dots">.........</span>

            <div class="actions">
                <button class="action-btn" @click="copyPassword">
                    <Copy :size="12" />
                    {{ isCopied ? 'COPIED' : 'COPY KEY' }}
                </button>
                <button class="action-btn" @click="emit('edit', props.data)">
                    <Pencil :size="14" />
                </button>
                <button class="action-btn trash-btn" @click="emit('delete', props.data.id_vault)">
                    <Trash :size="14" />
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.vault-card {
    background-color: var(--bg-panel-left);
    padding: 1.5rem;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.icon-box {
    width: 32px;
    height: 32px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
}

.meta-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.card-mid h3 {
    font-size: 1rem;
    color: var(--text-primary);
    margin-bottom: 4px;
    font-weight: 500;
}

.card-mid p {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.password-dots {
    color: var(--text-muted);
    font-family: var(--font-mono);
    letter-spacing: 0.2em;
}
.actions {
    display: flex;
    align-items: center;
    gap: 12px;
}
.action-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    text-transform: uppercase;
    transition: color 0.2s;
}
.action-btn:hover {
    color: var(--text-primary);
}
</style>