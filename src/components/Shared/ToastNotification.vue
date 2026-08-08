<script setup lang="ts">
import { useUiStore } from '../../stores/uiStore'
import { AlertCircle, CheckCircle, Info } from '@lucide/vue'

const uiStore = useUiStore()
</script>

<template>
    <Transition name="toast">
        <div v-if="uiStore.isToastVisible" class="toast-wrapper" :class="uiStore.toastType">
            <div class="toast-icon">
                <CheckCircle v-if="uiStore.toastType === 'success'" :size="18" />
                <AlertCircle v-else-if="uiStore.toastType === 'error'" :size="18" />
                <Info v-else :size="18" />
            </div>
            <div class="toast-content">
                <span class="toast-message">{{ uiStore.toastMessage }}</span>
            </div>
            <button class="toast-close" @click="uiStore.isToastVisible = false">×</button>
        </div>
    </Transition>
</template>

<style scoped>
.toast-wrapper {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: var(--bg-panel-left);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    min-width: 300px;
}

/* Tipos de Toast */
.toast-wrapper.success {
    border-left: 3px solid var(--neon);
}
.toast-wrapper.success .toast-icon {
    color: var(--neon);
}

.toast-wrapper.error {
    border-left: 3px solid var(--destructive);
}
.toast-wrapper.error .toast-icon {
    color: var(--destructive);
}

.toast-wrapper.warning {
    border-left: 3px solid #facc15;
}
.toast-wrapper.warning .toast-icon {
    color: #facc15;
}

.toast-content {
    flex: 1;
}

.toast-message {
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 300;
}

.toast-close {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    margin-left: 1rem;
}
.toast-close:hover {
    color: var(--text-primary);
}

/* Transições (Vue Transition) */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateY(100%);
}
</style>
