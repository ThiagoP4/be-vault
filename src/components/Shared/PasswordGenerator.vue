<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw } from '@lucide/vue';

const emit = defineEmits(['password-generated']);

const genLength = ref(20);
const useUpper = ref(true);
const useNumbers = ref(true);
const useSymbols = ref(true);
const genPassword = ref('');

const generate = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    if (useUpper.value) {
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (useNumbers.value) {
        charset += '0123456789';
    }
    if (useSymbols.value) {
        charset += '!@#$%^&*()_+~|}{[]:;?><,./-=';
    }
    
    for (let i = 0; i < genLength.value; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }

    genPassword.value = result;
    emit('password-generated', result);
}
</script>

<template>
    <div class="generator-panel">
        <div class="generator-header">
            <span class="eyebrow">GENERATOR</span>
            <button type="button" class="btn-text" @click="generate">
                <RefreshCw :size="12" /> ROLL
            </button>
        </div>

        <div class="generated-password-box">
            {{ genPassword }}
        </div>

        <div class="generator-controls">
            <div class="length-row">
                <span class="eyebrow">Length</span>
                <span class="length-val">{{ genLength }}</span>
            </div>
            <input type="range" min="8" max="64" class="length-slider" v-model="genLength" @input="generate">
            
            <div class="toggles-grid">
                <label class="toggle-box">
                    <span class="eyebrow">A-Z</span>
                    <input type="checkbox" class="toggle-input" v-model="useUpper" @change="generate">
                </label>
                
                <label class="toggle-box">
                    <span class="eyebrow">0-9</span>
                    <input type="checkbox" class="toggle-input" v-model="useNumbers" @change="generate">
                </label>
                
                <label class="toggle-box">
                    <span class="eyebrow">!@#</span>
                    <input type="checkbox" class="toggle-input" v-model="useSymbols" @change="generate">
                </label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.generator-panel {
    margin-top: 1rem;
    padding: 1.5rem;
    background-color: var(--bg-panel-right);
    border: 1px solid var(--border);
}

.generator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.btn-text {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
}
.btn-text:hover { color: var(--text-primary); }

.generated-password-box {
    font-family: var(--font-mono);
    font-size: 16px;
    color: var(--neon);
    padding: 1rem;
    background: var(--background);
    border: 1px solid var(--border);
    text-align: center;
    margin-bottom: 1.5rem;
    letter-spacing: 0.1em;
    word-break: break-all;
}

.generator-controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.length-row {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.length-slider {
    width: 100%;
    cursor: pointer;
}

.toggles-grid {
    display: flex;
    gap: 2rem;
}

.toggle-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
}

.toggle-input {
    cursor: pointer;
    transform: scale(0.75);
    transform-origin: left center;
    accent-color: var(--text-primary);
}
</style>
