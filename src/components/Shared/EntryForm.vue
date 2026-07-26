<script setup lang="ts">
import { ref } from 'vue';
import { Eye, EyeOff, Sparkles } from '@lucide/vue';
import PasswordGenerator from './PasswordGenerator.vue';

const props = defineProps<{
    initialData?: {
        service_name?: string;
        username?: string;
        password?: string;
        category?: string;
    }
}>();

const emit = defineEmits(['submit']);

const showGen = ref(false);
const reveal = ref(false);

const password = ref(props.initialData?.password || '');
const serviceName = ref(props.initialData?.service_name || '');
const identity = ref(props.initialData?.username || '');
const category = ref(props.initialData?.category || 'login');

const handleSubmit = () => {
    emit('submit', {
        serviceName: serviceName.value,
        identity: identity.value,
        password: password.value,
        category: category.value
    });
};
</script>

<template>
   <form id="entryForm" class="entry-form" @submit.prevent="handleSubmit">
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
            <button type="button" class="pass-generator" @click="showGen = !showGen">
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
</template>

<style scoped>
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
</style>
