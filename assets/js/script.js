// Número de telefone para onde a mensagem será enviada
const WHATSAPP_NUMBER = "553491791955"; 
let typingTimer;               // Variável para armazenar o temporizador
const doneTypingInterval = 500; // Tempo em ms para esperar (0.5 segundo)

// ==========================================================
// FUNÇÃO 1: BUSCAR ENDEREÇO POR CEP (Debouncing)
// ==========================================================
function buscarEndereco() {
    clearTimeout(typingTimer); // Limpa o timer anterior (reseta a contagem)
    
    // Inicia um novo timer
    typingTimer = setTimeout(performSearch, doneTypingInterval);
}

// ==========================================================
// FUNÇÃO Auxiliar: Executa a busca real (com timer)
// ==========================================================
function performSearch() {
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const feedback = document.getElementById('cep-feedback');

    // Remove formatação (deixa apenas dígitos)
    let cep = cepInput.value.replace(/\D/g, ''); 

    // Limpeza dos campos (movida para o início para resetar assim que o CEP for inválido/apagado)
    enderecoInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    feedback.classList.add('d-none'); // Limpa o feedback de erro

    // SE O CEP FOR INVÁLIDO OU VAZIO, APENAS LIMPA E SAI.
    if (cep.length != 8) {
        // Formatação do CEP para 99999-999 (visual)
        if (cep.length > 5) {
            cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5);
        }
        enderecoInput.placeholder = "Aguardando preenchimento automático...";
        return; 
    }
    
    // Garante a formatação final
    cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5);

    // Indica a busca
    enderecoInput.placeholder = "Buscando endereço...";
    
    // Consulta a API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                // CEP não encontrado
                feedback.classList.remove('d-none');
                enderecoInput.placeholder = "CEP não encontrado. Preencha manualmente.";
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
// (Sem alteração, funciona com o novo fluxo de CEP)
// ==========================================================
document.getElementById('formGuincho').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const form = event.target;
    const formData = new FormData(form);
    const feedbackMessage = document.getElementById('feedback-message');
    const btnEnviar = document.getElementById('btnEnviar');

    // 1. Coletar os dados
    const nome = formData.get('Nome');
    const cep = formData.get('CEP');
    const rua = formData.get('Rua'); 
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