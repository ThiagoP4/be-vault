<script setup lang = ts>
import { ref, onMounted, computed } from 'vue';
import { getSecretKey, getUserEmail } from '../../services/auth'
import { generateTxt, generatePdf, getQrCodeUrl} from '../../utils/backupGenerator';
import { Download, Printer, Copy } from '@lucide/vue'
import QrcodeVue from 'qrcode.vue';

const secretKey = ref('')
const email = ref('')

const qrUrl = computed(() => {
    return getQrCodeUrl(secretKey.value, email.value);
});

onMounted(() => {
    secretKey.value = getSecretKey() || 'CHAVE NÃO ENCONTRADA NESTE DISPOSITIVO';
    email.value = getUserEmail() || ''; 
});

function exportVault() {
    alert("em breve");
}

function copyKey() {
    navigator.clipboard.writeText(secretKey.value);
    alert('Chave copiada para a área de transferência!');
}
</script>

<template>
    <div class="emergency-wrapper">
        <div class="content-header">
            <h2>EMERGENCY KIT</h2>
            <span class="eyebrow">RECOVERY & EXPORT</span>
        </div>
        <div class="bv-card">
            <div class="bv-card-info">
                <span class="eyebrow">01 · EXPORT</span>
                <h3 class="bv-card-title">Vault ledger</h3>
                <p class="bv-card-subtitle">Encrypted JSON backup of all entries. Requires your master passphrase to decrypt.</p>
            </div>
            <div class="card-actions">
                <button class="btn-outline" @click="exportVault">
                    <Download :size="14" />
                    EXPORT ENCRYPTED JSON
                </button>
            </div>
        </div>
        <div class="bv-card">
            <div class="bv-card-info card-info-split" style="border-bottom: none;">
                <div class="card-info-text">
                    <span class="eyebrow">02 · SECRET KEY</span>
                    <h3 class="bv-card-title">Emergency recovery key</h3>
                    <p class="bv-card-subtitle">Combined with your master passphrase to unseal the vault on a new device.</p>
                </div>
                <!-- Movido para o lado do título, com tamanho reduzido para ficar elegante -->
                <div class="qr-code-wrapper" title="Scan for mobile access">
                    <qrcode-vue :value="qrUrl" :size="100" level="M" render-as="canvas"></qrcode-vue>
                </div>
            </div>
            <div class="secret-box">
                <div class="secret-header">
                    <span class="eyebrow">SECRET KEY</span>
                    <div class="header-actions">
                        <span class="badge-sealed">SEALED</span>
                        <button class="btn-icon" @click="copyKey" title="Copiar chave">
                            <Copy :size="14" />
                        </button>
                    </div>
                </div>
                <code>{{ secretKey }}</code>
            </div>

            <div class="warning-box">
                <p>⚠️ <strong>Print this Emergency Kit.</strong> If lost, your data cannot be recovered — Be-Vault does not store this key.</p>
            </div>
            <div class="card-actions bottom-actions">
                <button class="btn-outline" @click="generatePdf(secretKey)">
                   <Printer :size="14" />
                    PRINT KIT (PDF)
                </button>
                <button class="btn-outline" @click="generateTxt(secretKey)">
                    <Download :size="14" />
                    DOWNLOAD TXT
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped>
.emergency-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.content-header h2 {
    font-size: 1.25rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
}

.card-actions {
    padding: 1rem 1.5rem;
    background-color: oklch(0.1 0 0 / 20%);
    display: flex;
    gap: 1rem;
}

.secret-box {
    margin: 0 1.5rem;
    background-color: oklch(0.05 0 0);
    border: 1px solid var(--border);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.secret-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.btn-icon {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    padding: 0;
}

.btn-icon:hover {
    color: var(--text-primary);
}

.card-info-split {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.card-info-text {
    display: flex;
    flex-direction: column;
}

.qr-code-wrapper {
    background-color: white; 
    padding: 0.25rem; /* Margem branca mínima obrigatória (Quiet Zone) para a câmera conseguir ler */
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.badge-sealed {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--neon);
}
.secret-box code {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    letter-spacing: 0.2em;
    word-break: break-all;
    color: var(--text-primary);
}

.warning-box {
    margin: 1rem 1.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid oklch(0.4 0.15 22.216 / 50%);
    background-color: oklch(0.2 0.1 22 / 10%);
}
.warning-box p {
    font-size: 0.85rem;
    color: oklch(0.8 0.1 22.216);
    margin: 0;
}
.btn-outline {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 0.75rem 1.5rem;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-outline:hover {
    background: rgba(255, 255, 255, 0.05);
}

.bottom-actions {
    border-top: 1px solid var(--border);
    margin-top: 0;
}
</style>