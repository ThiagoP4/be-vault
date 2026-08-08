<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'

defineProps<{
    itemName?: string
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
    <div class="modal-overlay" @mousedown.self="$emit('close')">
        <div class="modal-box">
            <header class="modal-header">
                <h2>DELETE ENTRY</h2>
                <div class="header-right">
                    <span class="watermark warning">WARNING</span>
                    <button class="btn-close" @click="$emit('close')"></button>
                </div>
            </header>
            
            <div class="modal-body delete-body">
                <AlertTriangle :size="48" class="warning-icon" />
                <h3>Are you sure you want to delete this entry?</h3>
                <p>You are about to permanently delete <strong v-if="itemName">{{ itemName }}</strong><span v-else>this entry</span>. This action cannot be undone, and the key will be purged from the vault.</p>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="$emit('close')">CANCEL</button>
                <button type="button" class="btn-seal danger" @click="$emit('confirm')">DELETE</button>
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
    background-color: rgba(0, 0, 0, 0.85); 
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.modal-box {
    background-color: var(--bg-panel-right);
    border: 1px solid var(--border);
    border-radius: 4px;
    width: 420px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
}

.modal-header h2 {
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: var(--text-primary);
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
.watermark.warning {
    color: var(--destructive);
}

.btn-close {
    width: 16px;
    height: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    position: relative;
    opacity: 0.6;
    transition: opacity 0.2s;
}
.btn-close:hover { opacity: 1; }
.btn-close::before, .btn-close::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--text-primary);
}
.btn-close::before { transform: rotate(45deg); }
.btn-close::after { transform: rotate(-45deg); }

.delete-body {
    padding: 2rem 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.warning-icon {
    color: var(--destructive);
}

.delete-body h3 {
    font-size: 1.1rem;
    color: var(--text-primary);
    font-weight: 500;
}

.delete-body p {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
}
.delete-body strong {
    color: var(--text-primary);
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-top: 1px solid var(--border);
    background-color: rgba(0,0,0,0.2);
}

.btn-cancel {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: color 0.2s;
}
.btn-cancel:hover { color: var(--text-primary); }

.btn-seal {
    background-color: var(--neon);
    color: var(--bg-app);
    border: none;
    border-radius: 2px;
    padding: 0.75rem 1.5rem;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all 0.2s;
}
.btn-seal.danger {
    background-color: var(--destructive);
    color: #fff;
}
.btn-seal.danger:hover {
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
}
</style>
