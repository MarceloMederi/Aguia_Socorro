// Número de telefone para onde a mensagem será enviada
const WHATSAPP_NUMBER = "553491791955"; 

// ==========================================================
// FUNÇÃO 1: BUSCAR ENDEREÇO POR CEP (ViaCEP)
// É chamada pelo atributo onblur do campo CEP no HTML
// ==========================================================
function buscarEndereco() {
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const feedback = document.getElementById('cep-feedback');

    // Limpa o feedback anterior
    feedback.classList.add('d-none');
    
    // Remove qualquer formatação (deixa apenas dígitos)
    let cep = cepInput.value.replace(/\D/g, ''); 

    // Limpa os campos enquanto a busca é feita
    enderecoInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';

    if (cep.length != 8) {
        return; // Sai se o CEP não tiver 8 dígitos
    }
    
    // Indica a busca
    enderecoInput.placeholder = "Buscando endereço...";
    
    // Consulta a API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                // CEP não encontrado
                feedback.classList.remove('d-none');
                enderecoInput.placeholder = "Preencha manualmente...";
            } else {
                // Preenche os campos
                enderecoInput.value = data.logradouro || '';
                bairroInput.value = data.bairro || '';
                cidadeInput.value = `${data.localidade} / ${data.uf}` || '';
                
                // Remove o placeholder de busca e foca no campo NÚMERO
                enderecoInput.placeholder = "";
                document.getElementById('numero').focus(); 
            }
        })
        .catch(error => {
            feedback.classList.remove('d-none');
            enderecoInput.placeholder = "Erro na busca. Preencha manualmente.";
            console.error("Erro na busca de CEP:", error);
        });
}

// ==========================================================
// FUNÇÃO 2: ENVIAR DADOS PARA WHATSAPP
// ==========================================================
document.getElementById('formGuincho').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const form = event.target;
    const formData = new FormData(form);
    const feedbackMessage = document.getElementById('feedback-message');
    const btnEnviar = document.getElementById('btnEnviar');

    // 1. Coletar os dados (agora com CEP e Número)
    const nome = formData.get('Nome');
    const cep = formData.get('CEP');
    const rua = formData.get('Rua'); // Nome do campo alterado
    const numero = formData.get('Número'); 
    const bairro = formData.get('Bairro');
    const cidade = formData.get('Cidade');
    
    // 2. Montar a mensagem pré-preenchida
    const message = encodeURIComponent(
        `🚨 NOVA SOLICITAÇÃO DE GUINCHO - ÁGUIA 24H 🚨\n\n` +
        `👤 Nome do Cliente: ${nome}\n` +
        `🔑 CEP: ${cep}\n` +
        `📍 Local: ${rua}, Nº ${numero}\n` +
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
    
    // 6. Restaura o botão e limpa o formulário
    setTimeout(() => {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<i class="bi bi-whatsapp me-2"></i> ENVIAR SOLICITAÇÃO VIA WHATSAPP';
        form.reset();
    }, 4000); 
});