<script setup lang="ts">
import { ref, computed } from 'vue';
import QrcodeVue from 'qrcode.vue';

// Recebemos do LoginView a chave e se o modal deve aparecer
const props = defineProps<{
    show: boolean;
    secretKey: string;
}>();

const emit = defineEmits<{
    (e: 'proceed'): void;
    (e: 'close'): void;
}>();

const hasConfirmedBackup = ref(false);

const qrCodeUrl = computed(() => {
    // Monta a URL completa do site passando a chave secreta pela query string
    return `${window.location.origin}?secret=${encodeURIComponent(props.secretKey)}`;
});

function copyKey(){
    navigator.clipboard.writeText(props.secretKey);
    alert('Chave copiada para a área de transferência!');
}

function downloadEmergencyKit(){
    // Dispara a janela de impressão nativa do navegador
    // O CSS @media print (no final deste arquivo) cuida de esconder o resto do app
    // e mostrar apenas o cartão na folha A4 em alta qualidade.
    window.print();
}
</script>

<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>ZERO-KNOWLEDGE BACKUP</h2>
                <p>Nós não armazenamos a sua Secret Key. Se você perdê-la, seus dados serão perdidos para sempre.</p>
            </div>
        <div id="emergency-kit-card" class="emergency-kit">
            <h3>Be-Vault Emergency Kit</h3>
            <p><strong>Secret Key:</strong></p>
            <div class="key-box">
                <code>{{ secretKey }}</code>
            </div>
            <div class="qr-section">
                <p>Você pode escanear o QR Code abaixo para acesso rápido em dispositivos móveis:</p>
                <div class="qr-code-wrapper">
                    <qrcode-vue :value="qrCodeUrl" :size="150" level="M" render-as="svg"/>
                </div>
            </div>
        </div>

        <div class="modal-actions">
            <button type="button" class="btn-outline" @click="emit('close')">
                Voltar
            </button>
            <button type="button" class="btn-outline" @click="copyKey">
                Copiar Chave
            </button>
            <button type="button" class="btn-outline" @click="downloadEmergencyKit">
                Baixar PDF
            </button>
        </div>
        <div class="confirmation-section">
            <label class="checkbox-label">
                <input type="checkbox" v-model="hasConfirmedBackup" />
                <span class="eyebrow">Eu salvei minha Secret Key em um local seguro. Entendo que o Be-Vault não pode recuperá-la.</span>
            </label>
        </div>
        <button 
            type="button" 
            class="btn-submit" 
            :disabled="!hasConfirmedBackup"
            @click="emit('proceed')"
        >
            Entrar no Cofre
        </button>
        </div>
    </div>
</template>

<style scoped>

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85); /* Fundo bem escuro pra destacar */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}
.modal-content {
    background-color: var(--bg-app);
    border: 1px solid var(--border);
    padding: 2.5rem;
    max-width: 500px;
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.modal-header h2 {
    color: var(--destructive);
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
}
.modal-header p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    line-height: 1.5;
}
.emergency-kit {
    background-color: #1a1a1a;
    padding: 1.5rem;
    border: 1px dashed #333333;
    color: #ffffff;
}
.emergency-kit h3 {
    font-family: var(--font-mono);
    font-size: 1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #ffffff;
}
.key-box {
    background-color: #000000;
    padding: 1rem;
    border: 1px solid #333333;
    word-break: break-all;
    font-family: var(--font-mono);
    color: #ffffff;
    margin-bottom: 1.5rem;
}
.qr-section {
    text-align: center;
}
.qr-section p {
    font-size: 0.8rem;
    color: #a3a3a3;
    margin-bottom: 1rem;
}
.qr-code-wrapper {
    background-color: white; /* O QR Code precisa de fundo branco para a câmera ler bem */
    padding: 1rem;
    display: inline-block;
}
.modal-actions {
    display: flex;
    gap: 1rem;
}
.btn-outline {
    flex: 1;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 0.75rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}
.btn-outline:hover {
    background: var(--bg-input);
}
.confirmation-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
}
.checkbox-label input[type="checkbox"] {
    margin-top: 0.2rem;
    width: 16px;
    height: 16px;
    accent-color: #f8f8fb;
}
.checkbox-label span {
    line-height: 1.4;
    text-transform: none;
    font-size: 0.8rem;
    color: var(--text-secondary);
}
.btn-submit {
    background: var(--text-primary);
    color: var(--bg-app);
    border: none;
    padding: 1rem;
    font-family: var(--font-mono);
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: opacity 0.2s;
}
.btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

</style>

<style>
/* 
  ESTILOS GLOBAIS DE IMPRESSÃO
*/
@media print {
    /* Esconde absolutamente tudo na tela */
    body * {
        visibility: hidden;
    }
    
    /* Remove margens da folha A4 e fundos padrão */
    @page {
        margin: 0;
    }

    /* Torna visível APENAS o nosso cartão e os filhos dele */
    #emergency-kit-card, #emergency-kit-card * {
        visibility: visible;
    }

    /* Posiciona o cartão no topo esquerdo da folha de impressão */
    #emergency-kit-card {
        position: absolute;
        left: 5%;
        top: 5%;
        width: 90%;
        margin: 0;
        padding: 2rem;
        /* Forçamos a impressão dos backgrounds (cores de fundo) */
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    /* Garante que o QR Code será impresso perfeitamente */
    .qr-code-wrapper {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
</style>