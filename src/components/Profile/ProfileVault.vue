<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setCryptoKey, activeCryptoKey } from '../../stores/keyStore'
import { exportCryptoKey, deriveKey } from '../../utils/crypto'
import RotateKeyModal from '../Profile/RotateKeyModal.vue'
import { rotateVaultKey } from '../../services/vault'
import { useVaultStore } from '../../stores/vaultStore'
import { getSecretKey, updateAuthPassword } from '../../services/auth'

const vaultStore = useVaultStore()

const fingerprint = ref('CARREGANDO...')
const showAdvanced = ref(false)
const rotateEntry = ref(false)

const isRotating = ref(false)
const rotationProgress = ref(0)

const handleRotate = async (currentPass: string, newPass: string) => {
    try {
        isRotating.value = true;
        rotationProgress.value = 0;

        const secretKey = getSecretKey() || ''
        
        const checkKey = await deriveKey(currentPass, secretKey)
        
        const currentExported = await exportCryptoKey(activeCryptoKey.value!)
        const checkExported = await exportCryptoKey(checkKey)

        if (currentExported !== checkExported) {
            alert("Senha atual incorreta! Acesso negado.")
            isRotating.value = false;
            return
        }

        const newCryptoKey = await deriveKey(newPass, secretKey)

        await rotateVaultKey(vaultStore.items, newCryptoKey, (perc) => {
            rotationProgress.value = perc;
        })

        // Atualiza a senha no Supabase Auth para que o próximo login funcione com a nova senha
        await updateAuthPassword(newPass)

        await setCryptoKey(newCryptoKey)
        
        alert("Chave Mestre rotacionada com sucesso!")
        rotateEntry.value = false 
        
        window.location.reload()

    } catch (error) {
        console.error("Erro fatal ao rotacionar a chave", error)
        alert("Ocorreu um erro ao rotacionar a chave.")
    } finally {
        isRotating.value = false;
    }
}

onMounted(async () => {
    if(activeCryptoKey.value) {
        try {
            const exportedKey = await exportCryptoKey(activeCryptoKey.value);
            const chunk1 = exportedKey.slice(0, 8);
            const chunk2 = exportedKey.slice(8, 16);
            const chunk3 = exportedKey.slice(16, 24);

            fingerprint.value = `BV-${chunk1}-${chunk2}-${chunk3}`.toUpperCase();
        } catch (error) {
            console.error("Erro ao gerar fingerprint", error);
            fingerprint.value = 'ERRO-AO-LER-CHAVE';
        }
    } 
})

</script>

<template>
    <div class="profile-container">
        <header class="profile-header">
            <h2>OPERATOR PROFILE</h2>
            <span class="header-eyebrow">IDENTITY & MASTER KEY</span>
        </header>

        <!-- SEÇÃO 01: IDENTITY -->
        <section class="bv-card section-card">
            <div class="section-header-row top-aligned">
                <div class="title-block">
                    <span class="eyebrow"><span class="number">01 &middot;</span> IDENTITY</span>
                    <h2 class="bv-card-title">Thiago Silva</h2>
                    <p class="bv-card-subtitle">thiago@bevault.io</p>
                </div>
                <div class="avatar-box">TS</div>
            </div>
            
            <div class="section-body row-inputs">
                <div class="input-group">
                    <label class="eyebrow">DISPLAY NAME</label>
                    <input type="text" value="Thiago Silva" disabled>
                </div>
                <div class="input-group">
                    <label class="eyebrow">ACCOUNT EMAIL</label>
                    <input type="email" value="thiago@bevault.io" disabled />
                </div>
            </div>
        </section>

        <!-- SEÇÃO 02: MASTER KEY -->
        <section class="bv-card section-card">
            <div class="section-header-row top-aligned">
                <div class="title-block">
                    <span class="eyebrow"><span class="number">02 &middot;</span> MASTER KEY</span>
                    <h2 class="bv-card-title">Vault integrity</h2>
                    <p class="bv-card-subtitle">Derived from the strength and uniqueness of every sealed entry.</p>
                </div>
                <div class="score">95<span>/100</span></div>
            </div>

            <hr class="divider" />

            <div class="stats-row">
                <div class="stat-box">
                    <span class="eyebrow">ENTRIES</span>
                    <strong>08</strong>
                </div>
                <div class="stat-box">
                    <span class="eyebrow">WEAK KEYS</span>
                    <strong>00</strong>
                </div>
                <div class="stat-box">
                    <span class="eyebrow">REUSED</span>
                    <strong>00</strong>
                </div>
            </div>

            <div class="advanced-toggle">
                <button class="btn-text" @click="showAdvanced = !showAdvanced">
                    {{ showAdvanced ? '< HIDE' : '> SHOW' }} ADVANCED TECHNICAL DETAILS
                </button>
            </div>

            <div class="fingerprint-box" v-if="showAdvanced">
                <span class="eyebrow">ACTIVE KEY FINGERPRINT</span>
                <div class="fingerprint-value">
                    <span>{{ fingerprint }}</span>
                    <span class="status-active">ACTIVE</span>
                </div>
            </div>

            <div class="action-footer">
                <button class="btn-rotate" @click="rotateEntry = true">ALTER MASTER PASSWORD</button>
                <RotateKeyModal 
                    v-if="rotateEntry" 
                    :isRotating="isRotating" 
                    :progress="rotationProgress"
                    @close="rotateEntry = false" 
                    @rotate="handleRotate" 
                />
            </div>
        </section>

        <!-- SEÇÃO 03: SESSION -->
        <section class="bv-card section-card">
            <div class="section-header-row top-aligned">
                <div class="title-block">
                    <span class="eyebrow"><span class="number">03 &middot;</span> SESSION</span>
                    <h2 class="bv-card-title">Auto-lock window</h2>
                    <p class="bv-card-subtitle">Vault seals itself after this period of inactivity.</p>
                </div>
            </div>
            <div class="segment-control">
                <button class="segment-btn">5 MIN</button>
                <button class="segment-btn active">15 MIN</button>
                <button class="segment-btn">30 MIN</button>
                <button class="segment-btn">60 MIN</button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.profile-container {
    width: 100%;
}

.profile-header {
    margin-bottom: 1rem;
}

.profile-header h2 {
    font-size: 1.25rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.header-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--text-muted);
}

.section-card {
    margin-bottom: 1rem;
    padding: 1.25rem;
}

.section-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1rem;
}
.top-aligned {
    align-items: flex-start;
}

.avatar-box {
    width: 48px;
    height: 48px;
    background-color: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-primary);
}

.title-block {
    display: flex;
    flex-direction: column;
}

.eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--text-muted);
    text-transform: uppercase;
}

.number {
    color: var(--text-muted);
    opacity: 0.7;
}

.row-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.input-group input {
    width: 100%;
    background-color: rgba(0,0,0,0.2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    margin-top: 0.5rem;
    font-family: var(--font-mono);
    font-size: 12px;
}

.score {
    margin-left: auto;
    font-size: 24px;
    font-weight: 600;
}
.score span {
    font-size: 12px;
    color: var(--text-muted);
}

.divider {
    border: none;
    border-top: 2px solid var(--text-primary);
    margin: 1rem 0;
    opacity: 0.9;
}

.stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 1.25rem;
}

.stat-box strong {
    display: block;
    font-size: 18px;
    margin-top: 4px;
    font-family: var(--font-mono);
}

.advanced-toggle {
    margin-bottom: 1rem;
}

.btn-text {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: color 0.2s;
}
.btn-text:hover {
    color: var(--text-primary);
}

.fingerprint-box {
    background-color: rgba(0,0,0,0.2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1.25rem;
}

.fingerprint-value {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.15em;
}

.status-active {
    color: var(--neon);
    font-weight: 600;
}

.action-footer {
    display: flex;
}

.btn-rotate {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem 1.5rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
}
.btn-rotate:hover { 
    color: var(--text-primary);
    border-color: var(--text-primary);
    background-color: rgba(255,255,255,0.05);
}

.segment-control {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
}
.segment-btn {
    background: transparent;
    border: none;
    border-right: 1px solid var(--border);
    padding: 0.75rem 1rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    cursor: pointer;
}
.segment-btn:last-child { border-right: none; }
.segment-btn.active {
    background-color: var(--text-primary);
    color: var(--bg-app);
}

</style>