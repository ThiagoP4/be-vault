<script setup lang="ts">
import { ref } from 'vue';
import { Eye, EyeOff } from '@lucide/vue';

const props = defineProps<{
    isRotating: boolean;
    progress: number;
}>();

const emit = defineEmits(['close', 'rotate'])

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPasswords = ref(false)

const handleSubmit = () => {
    if(newPassword.value !== confirmPassword.value) {
        alert("A nova senha e a confirmação não batem!")
        return
    }
    if(!currentPassword.value || !newPassword.value) {
        alert("Preencha todos os campos!")
        return
    }
    emit('rotate', currentPassword.value, newPassword.value)
}
</script>

<template>
    <div class="modal-overlay" @mousedown.self="!isRotating && $emit('close')">
        <div class="modal-box">
            
            <header class="modal-header">
                <h2>ALTER MASTER PASSWORD</h2>
                <div class="header-right">
                    <span class="watermark">SECURITY</span>
                    <button class="btn-close" @click="$emit('close')" :disabled="isRotating"></button>
                </div>
            </header>

            <form id="rotateForm" class="rotate-form" @submit.prevent="handleSubmit">
                <div class="modal-body">
                    
                    <div class="input-group">
                        <div class="label-row">
                            <label class="eyebrow">CURRENT MASTER PASSWORD</label>
                        </div>
                        <div class="input-with-icon">
                            <input :type="showPasswords ? 'text' : 'password'" v-model="currentPassword" placeholder="••••••••••••••••" :disabled="isRotating">
                            <button type="button" class="icon-btn" @click="showPasswords = !showPasswords">
                                <EyeOff v-if="showPasswords" :size="16" />
                                <Eye v-else :size="16" />
                            </button>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <div class="label-row">
                            <label class="eyebrow">NEW MASTER PASSWORD</label>
                        </div>
                        <div class="input-with-icon">
                            <input :type="showPasswords ? 'text' : 'password'" v-model="newPassword" placeholder="••••••••••••••••" :disabled="isRotating" />
                            <button type="button" class="icon-btn" @click="showPasswords = !showPasswords">
                                <EyeOff v-if="showPasswords" :size="16" />
                                <Eye v-else :size="16" />
                            </button>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <div class="label-row">
                            <label class="eyebrow">CONFIRM NEW PASSWORD</label>
                        </div>
                        <div class="input-with-icon">
                            <input :type="showPasswords ? 'text' : 'password'" v-model="confirmPassword" placeholder="••••••••••••••••" :disabled="isRotating" />
                            <button type="button" class="icon-btn" @click="showPasswords = !showPasswords">
                                <EyeOff v-if="showPasswords" :size="16" />
                                <Eye v-else :size="16" />
                            </button>
                        </div>
                    </div>

                    <!-- BARRA DE PROGRESSO (Só aparece quando estiver rotacionando) -->
                    <div class="progress-container" v-if="isRotating">
                        <div class="label-row">
                            <label class="eyebrow">RE-ENCRYPTING VAULT...</label>
                            <span class="eyebrow">{{ progress }}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                        </div>
                    </div>
                    
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-cancel" @click="$emit('close')" :disabled="isRotating">CANCEL</button>
                    <button type="submit" class="btn-danger" :disabled="isRotating">
                        {{ isRotating ? 'ROTATING...' : 'CONFIRM ROTATION' }}
                    </button>
                </div>
            </form>
            
        </div>
    </div>
</template>

<style scoped>
/* MESMO OVERLAY DO EDIT ENTRY */
.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 999;
}

/* MESMA CAIXA DO EDIT ENTRY */
.modal-box {
    background-color: var(--bg-app);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 512px;
}

/* MESMO HEADER DO EDIT ENTRY */
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
.btn-close:hover { color: var(--text-primary); }
.btn-close:disabled { opacity: 0.5; cursor: not-allowed; }

/* CORPO DO MODAL IDÊNTICO AO ENTRY FORM */
.modal-body {
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

.eyebrow {
    font-family: var(--font-mono);
    font-size: 12px; 
    font-weight: 500;
    letter-spacing: 0.15em;
    color: var(--text-muted);
}

.rotate-form input {
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

.rotate-form input:focus {
    border-bottom-color: var(--text-primary);
}

.rotate-form input::placeholder {
    color: oklch(0.704 0.04 256.788 / 0.4);
}

.rotate-form input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* PROGRESS BAR STYLES */
.progress-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.progress-track {
    width: 100%;
    height: 4px;
    background-color: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    background-color: var(--neon);
    transition: width 0.3s ease;
}

/* MESMO FOOTER DO EDIT ENTRY */
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
.btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-danger {
    background: var(--destructive);
    color: var(--destructive-foreground);
    border: none;
    padding: 0.75rem 1.5rem;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: opacity 0.2s;
}
.btn-danger:hover {
    opacity: 0.8;
}
.btn-danger:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>