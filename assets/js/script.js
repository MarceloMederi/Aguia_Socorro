// Número de telefone para onde a mensagem será enviada (formato internacional)
const WHATSAPP_NUMBER = "553491791955"; 

document.getElementById('formGuincho').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const feedbackMessage = document.getElementById('feedback-message');
    const btnEnviar = document.getElementById('btnEnviar');

    // 1. Coletar os dados do formulário
    const nome = formData.get('Nome');
    const endereco = formData.get('Endereço');
    const bairro = formData.get('Bairro');
    const cidade = formData.get('Cidade');
    
    // 2. Montar a mensagem pré-preenchida (URL-Encoded para ser seguro na URL)
    const message = encodeURIComponent(
        `🚨 NOVA SOLICITAÇÃO DE GUINCHO - ÁGUIA 24H 🚨\n\n` +
        `👤 Nome do Cliente: ${nome}\n` +
        `📍 Endereço: ${endereco}\n` +
        `🏘️ Bairro: ${bairro}\n` +
        `🏙️ Cidade: ${cidade}\n\n` +
        `*** Por favor, entre em contato imediatamente. ***`
    );

    // 3. Montar a URL completa do WhatsApp
    const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;

    // Desabilita o botão e mostra o loading
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Abrindo WhatsApp...';
    
    // 4. Abrir a nova janela/aba do WhatsApp
    window.open(whatsappURL, '_blank');
    
    // 5. Feedback para o usuário na landing page
    feedbackMessage.classList.remove('d-none', 'alert-danger');
    feedbackMessage.classList.add('alert-success');
    feedbackMessage.innerHTML = '<strong>Redirecionando!</strong> Abra a conversa no WhatsApp para enviar sua solicitação.';
    
    // 6. Restaura o botão e limpa o formulário (após um pequeno atraso)
    setTimeout(() => {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<i class="bi bi-whatsapp me-2"></i> ENVIAR SOLICITAÇÃO VIA WHATSAPP';
        form.reset();
    }, 4000); 
});