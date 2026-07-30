import jsPDF from 'jspdf';

export function getQrCodeUrl(secretKey: string, email: string): string {
    return `${window.location.origin}?secret=${encodeURIComponent(secretKey)}&email=${encodeURIComponent(email)}`;
}

export function generateTxt(secretKey: string) {
    const element = document.createElement('a');
    const content = `Be-Vault Emergency Kit\n\nSecret Key:\n${secretKey}\n\nGuarde este arquivo em um local seguro. Ele é a única forma de recuperar seu acesso em um novo dispositivo.`;
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "be-vault-recovery.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export function generatePdf(secretKey: string) {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });
    // Fundo da página
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Fundo do Cartão
    doc.setFillColor(26, 26, 26); 
    doc.setDrawColor(51, 51, 51); 
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0); 
    doc.rect(15, 15, 180, 200, 'FD'); 
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
    // Caixa da chave
    doc.setFillColor(0, 0, 0); 
    doc.setDrawColor(51, 51, 51); 
    doc.setLineWidth(0.3);
    doc.rect(25, 55, 160, 45, 'FD');
    // Chave
    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    
    const splitKey = doc.splitTextToSize(secretKey, 150);
    doc.text(splitKey, 30, 65);
    // Lógica do QR Code: como a função agora é global, ela tenta achar o canvas na tela. 
    // Se não achar, o PDF é gerado sem o QR Code (o que não quebra nada).
    const canvas = document.querySelector('.qr-code-wrapper canvas') as HTMLCanvasElement;
    if (canvas) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(163, 163, 163);
        doc.text("Você pode escanear o QR Code abaixo para acesso rápido em dispositivos móveis:", 105, 120, { align: "center" });
        doc.setFillColor(255, 255, 255);
        doc.rect(75, 130, 60, 60, 'F');
        const qrDataUrl = canvas.toDataURL("image/png");
        doc.addImage(qrDataUrl, "PNG", 77, 132, 56, 56);
    }
    doc.save("be-vault-emergency-kit.pdf");
}
