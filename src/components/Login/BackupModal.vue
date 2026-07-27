<script setup lang="ts">
import { ref, computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import jsPDF from 'jspdf';
import { ArrowLeft } from '@lucide/vue';

// Recebemos do LoginView a chave e se o modal deve aparecer
const props = defineProps<{
    show: boolean;
    secretKey: string;
    email: string;
}>();

const emit = defineEmits<{
    (e: 'proceed'): void;
    (e: 'close'): void;
}>();

const hasConfirmedBackup = ref(false);

const qrCodeUrl = computed(() => {
    // Monta a URL completa do site passando a chave secreta e o email pela query string
    return `${window.location.origin}?secret=${encodeURIComponent(props.secretKey)}&email=${encodeURIComponent(props.email)}`;
});

function copyKey(){
    navigator.clipboard.writeText(props.secretKey);
    alert('Chave copiada para a área de transferência!');
}

function downloadTxt() {
    const element = document.createElement('a');
    const content = `Be-Vault Emergency Kit\n\nSecret Key:\n${props.secretKey}\n\nGuarde este arquivo em um local seguro. Ele é a única forma de recuperar seu acesso.`;
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "be-vault-recovery.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadEmergencyKit(){
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // Fundo da página inteira (opcional, para dar um contraste legal)
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 297, 'F');

    // Fundo do Cartão (.emergency-kit)
    doc.setFillColor(26, 26, 26); // #1a1a1a
    doc.setDrawColor(51, 51, 51); // #333333
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0); // Borda tracejada
    doc.rect(15, 15, 180, 200, 'FD'); // Fill e Draw (Pinta e faz a borda)

    // Reseta o tracejado
    doc.setLineDashPattern([], 0);

    // Título
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("BE-VAULT EMERGENCY KIT", 25, 30);

    // Rótulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Secret Key:", 25, 50);

    // Caixa da chave (.key-box)
    doc.setFillColor(0, 0, 0); // Fundo preto
    doc.setDrawColor(51, 51, 51); // Borda sólida #333
    doc.setLineWidth(0.3);
    doc.rect(25, 55, 160, 45, 'FD');

    // Chave secreta
    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    
    // Divide o texto automaticamente para caber na caixinha
    const splitKey = doc.splitTextToSize(props.secretKey, 150);
    // A altura de início do texto na caixinha
    doc.text(splitKey, 30, 65);

    // Texto da seção QR Code
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(163, 163, 163); // #a3a3a3
    doc.text("Você pode escanear o QR Code abaixo para acesso rápido em dispositivos móveis:", 105, 120, { align: "center" });

    // Fundo branco pro QR Code (.qr-code-wrapper)
    doc.setFillColor(255, 255, 255);
    doc.rect(75, 130, 60, 60, 'F');

    // Pega a imagem do QR Code renderizado no canvas
    const canvas = document.querySelector('.qr-code-wrapper canvas') as HTMLCanvasElement;
    if (canvas) {
        const qrDataUrl = canvas.toDataURL("image/png");
        // Centraliza o QR Code com um pequeno "padding" branco (2mm de cada lado)
        doc.addImage(qrDataUrl, "PNG", 77, 132, 56, 56);
    }
    
    doc.save("be-vault-emergency-kit.pdf");
}
</script>

<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-top">
                    <button class="back-btn" @click="emit('close')" title="Voltar">
                        <ArrowLeft :size="20" />
                    </button>
                    <h2>ZERO-KNOWLEDGE BACKUP</h2>
                </div>
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
                    <qrcode-vue :value="qrCodeUrl" :size="150" level="M" render-as="canvas"/>
                </div>
            </div>
        </div>

        <div class="modal-actions">
            <button type="button" class="btn-outline" @click="copyKey">
                Copiar
            </button>
            <button type="button" class="btn-outline" @click="downloadTxt">
                Baixar TXT
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
    background-color: rgba(0, 0, 0, 0.95); /* Fundo mais escuro no lugar do blur */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
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
.header-top {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}
.header-top h2 {
    color: var(--destructive);
    font-size: 1.25rem;
    margin-bottom: 0;
    letter-spacing: 0.05em;
}
.back-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: color 0.2s;
}
.back-btn:hover {
    color: var(--text-primary);
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
