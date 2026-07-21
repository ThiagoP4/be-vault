<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { signInWithEmail, signUpWithEmail, saveSecretKey, getSecretKey, generateSecretKey } from '../services/auth'
    import { deriveKey } from '../utils/crypto';
    import { setCryptoKey } from '../stores/keyStore'
    import BackupModal from '../components/Login/BackupModal.vue';
    import AppLogo from '../components/AppLogo.vue'


    const router = useRouter();
    const route = useRoute();

    const email = ref('');
    const masterPassword = ref('');
    const secretKey = ref('');
    const isRegistering = ref(false);
    const errorMessage = ref('');
    const showBackupModal = ref(false);
    const currentKey = ref(''); 

    onMounted(() => {
        if (route.query.secret) {
            secretKey.value = route.query.secret as string;
            // Se o usuário veio pelo link, mudamos para a aba de "Access" e já preenchemos a chave!
            isRegistering.value = false;
        }
    }); 

    async function handleAccess(){
        errorMessage.value = ''
        try {
            if(isRegistering.value) {
               await signUpWithEmail(email.value, masterPassword.value);
               const key = generateSecretKey();
               saveSecretKey(key);

               currentKey.value = key;
               showBackupModal.value = true;
               
            } else {
                await signInWithEmail(email.value, masterPassword.value);
                let storedKey = getSecretKey();
                
                if(!storedKey && !secretKey.value) {
                    throw new Error('Secret Key não encontrada');
                };

                if(!storedKey && secretKey.value) {
                    saveSecretKey(secretKey.value);
                    storedKey = secretKey.value;
                };

                const saveKey = await deriveKey(masterPassword.value, storedKey!);
                setCryptoKey(saveKey);
                router.push('/')

                
            }
        } catch (error: any){
            errorMessage.value = error.message
        }
    }

    async function proceedToVault() {
        const saveKey = await deriveKey(masterPassword.value, currentKey.value);
        setCryptoKey(saveKey);
        router.push('/');
    }

</script>


<template>
    <div class="login-wrapper">
        <div class="split-layout">
            <div class="left-pane">
                <div class="login-b-header">
                    <AppLogo />
                </div>

                <div class="hero-content">
                    <h1 class="hero-title">A single<br><i>obsidian</i> ledger<br>for every key.</h1>
                    <p class="hero-desc">
                        Zero-knowledge storage for credentials, cards and notes. Sealed with AES-256-GCM and an Argon2id-derived master key.
                    </p>
                </div>

                <div class="features-grid">
                    <div class="feature-card">
                        <span class="feat-num">01</span>
                        <p>AES-256-GCM</p>
                    </div>
                    <div class="feature-card">
                        <div class="feat-num">02</div>
                        <p>Argon2id KDF</p>
                    </div>
                    <div class="feature-card">
                        <div class="feat-num">03</div>
                        <p>Zero-knowledge</p>
                    </div>
                    <div class="feature-card">
                        <div class="feat-num">04</div>
                        <p>Local-First</p>
                    </div>
                </div>
            </div>
            <div class="right-pane">
                <div class="right-pane-header">
                    <span class="eyebrow">
                        {{ isRegistering ? 'Create Vault' : 'Authenticate Session' }}
                    </span>
                    <span class="status-indicator">
                        <span class="dot"></span>
                        Channel secure
                    </span>
                </div>
                <div class="auth-titles">
                    <h2>{{ isRegistering ? 'Create your vault.' : 'Welcome back.' }}</h2>
                    <p>{{ isRegistering ? 'Only you hold the keys. Not us. Not anyone.' : 'Enter your master credentials to unseal the ledger.' }}</p>
                </div>

                <form @submit.prevent="handleAccess" class="auth-form">
                    <div class="input-group">
                        <div class="label-row">
                            <label for="email" class="eyebrow">Identity</label>
                        </div>
                        <input id="email" type="email" v-model="email" placeholder="you@bevault.io" required />
                    </div>
                    <div class="input-group">
                        <div class="label-row">
                            <label for="master" class="eyebrow">Master Passphrase</label>
                        </div>
                        <input id="master" type="password" v-model="masterPassword" placeholder="••••••••••••" required />
                    </div>
                    <div class="input-group" v-if="!isRegistering">
                        <div class="label-row">
                            <label for="secret" class="eyebrow">Secret Key</label>
                            <span class="hint">Required on new devices</span>
                        </div>
                        <div class="input-with-icon">
                            <svg class="key-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
                            <input id="secret" type="text" v-model="secretKey" placeholder="BV-XXXXXX-XXXXXX-XXXXXXXX" />
                        </div>
                    </div>

                <div class="form-actions">
                    <button type="button" class="mode-switch" @click="isRegistering = !isRegistering">
                        {{ isRegistering ? '→ Sign into existing' : '→ Create new vault' }}
                    </button>
                     <button type="submit" class="btn-submit">
                        {{ isRegistering ? 'Create' : 'Open' }}
                        <!-- Ícone de seta apontando pra direita -->
                        <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                </div>
            </form>
                
                <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

                <footer class="right-pane-footer">
                    <span>AES-256-GCM · Argon2id</span>
                    <span>End-to-end</span>
                </footer>
            </div>
        </div>
    </div>
    <BackupModal 
    :show="showBackupModal" 
    :secretKey="currentKey"
    @proceed="proceedToVault"
    @close="showBackupModal = false"
    />
</template>

<style scoped>
.login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-app);
    padding: 2rem;
}

.split-layout {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    width: 100%;
    max-width: 1024px; /* max-w-5xl */
    /* Removemos o min-height: 650px para ele abraçar o conteúdo igual ao original! */
    background: var(--bg-panel-right);
    border: 1px solid rgba(255, 255, 255, 0.2); 
}

.left-pane {
    background: var(--bg-panel-left);
    padding: 2.5rem; /* p-10 = 2.5rem = 40px */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid var(--border);
}

.login-b-header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo-square {
    width: 40px; /* h-10 w-10 */
    height: 40px;
    border: 1px solid var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-inner {
    width: 16px; /* h-4 w-4 */
    height: 16px;
    background-color: var(--text-primary);
    transition: transform 0.5s;
}

.logo-square:hover .logo-inner {
    transform: rotate(45deg);
}

.brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
}

.brand-text h2 {
    font-size: 0.875rem; /* text-sm */
    letter-spacing: 0.3em; /* caps-title */
    font-weight: 300;
    text-transform: uppercase;
    margin: 0;
    color: var(--text-primary);
}

.brand-text span { 
    margin-top: 0.375rem; /* mt-1.5 */
    font-size: 10px; /* text-[10px] */
    color: oklch(0.704 0.04 256.788 / 0.6); /* text-muted-foreground/60 */
    font-family: var(--font-mono);
}

/* Estilos do Texto Hero (Meio da tela) */
.hero-content {
    margin: 3rem 0; /* my-12 space-y-8 */
}

.hero-title {
    font-size: 44px; /* text-[44px] */
    line-height: 1.05; /* leading-[1.05] */
    font-weight: 200; /* font-extralight */
    letter-spacing: -0.025em; /* tracking-tight */
    margin-bottom: 2rem; 
    color: var(--text-primary);
}

.hero-title i {
    font-style: italic;
    color: var(--text-muted);
}

.hero-desc {
    color: var(--text-muted);
    font-size: 0.875rem; /* text-sm */
    line-height: 1.625; /* leading-relaxed */
    max-width: 320px; /* max-w-xs */
}


.features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--bg-feature-grid);
    border: 1px solid var(--bg-feature-grid);
}

.feature-card {
    background: var(--bg-feature-card);
    padding: 1rem; /* p-4 */
    display: flex;
    flex-direction: column;
}

.feat-num {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em; /* eyebrow */
    text-transform: uppercase;
    color: oklch(0.35 0 0);
}

.feature-card p { 
    margin-top: 0.5rem; /* mt-2 */
    font-size: 0.875rem; /* text-sm */
    font-weight: 400; 
    color: var(--text-primary); 
}

.right-pane {
    background: var(--bg-panel-right);
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
}

.right-pane-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--neon);
    box-shadow: 0 0 6px var(--neon);
}

.auth-titles {
    margin-bottom: 2.5rem;
}

.auth-titles h2 {
    font-size: 1.875rem;
    font-weight: 300;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.auth-titles p {
    font-size: 0.875rem; /* equivalente a text-sm */
    color: var(--text-muted);
    margin: 0;
}

.auth-form {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.input-group {
    margin-bottom: 1.5rem;
}

.label-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.hint {
    font-family: var(--font-mono);
    font-size:  9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: oklch(0.704 0.04 256.788 / 0.5); /* cinza com 50% de transparência */
}

/* Estilo base dos inputs minimalistas */
.auth-form input {
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

.auth-form input:focus {
    border-bottom-color: var(--text-primary);
}

.auth-form input::placeholder {
    color: oklch(0.704 0.04 256.788 / 0.4);
}

#master, #secret {
    font-family: var(--font-mono);
}

.input-with-icon {
    position: relative;
}

.key-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
}
.input-with-icon input {
    padding-left: 1.5rem;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
}

/* Botões do formulário */
.form-actions {
    margin-top: auto;
    padding-top: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}
/* Botão em formato de texto para trocar o modo (Login/Registro) */
.mode-switch {
    background: transparent;
    border: none;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
    padding: 0;
}
.mode-switch:hover {
    color: var(--text-primary);
}
/* Botão principal de Unseal/Provision */
.btn-submit {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 2.75rem;
    background: var(--text-primary);
    color: var(--background); /* Texto da cor de fundo para ficar escuro */
    border: none;
    padding: 0 1.5rem;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.2s;
}
.btn-submit:hover {
    /* Cor um pouquinho mais escura no hover pra dar o efeito clicável */
    background: oklch(0.9 0.003 247.858); 
}
/* Animação da setinha do botão */
.arrow-icon {
    transition: transform 0.2s;
}
.btn-submit:hover .arrow-icon {
    transform: translateX(4px);
}

.error-msg {
    color: var(--destructive); /* Vermelho do tema */
    font-size: 11px;
    font-family: var(--font-mono);
    margin-top: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-align: center;
}

/* Rodapé do painel direito */
.right-pane-footer {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: oklch(0.704 0.04 256.788 / 0.6);
}

</style>