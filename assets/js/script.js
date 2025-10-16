// Número de telefone para onde a mensagem será enviada
const WHATSAPP_NUMBER = "553491791955"; 
let typingTimer;              
const doneTypingInterval = 500; 
const cepInput = document.getElementById('cep');

// ==========================================================
// FUNÇÃO 1: FORMATAR CEP e DEBOUNCING (BUSCA AUTOMÁTICA)
// ==========================================================

// 1. Evento para formatar o CEP (00000-000) enquanto o usuário digita
cepInput.addEventListener('input', function() {
    let cep = cepInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    
    // Aplica a máscara: 5 dígitos e um hífen, se houver mais de 5
    if (cep.length > 5) {
        cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    } else {
        cepInput.value = cep;
    }

    // Inicia o Debouncing (espera o usuário parar de digitar para buscar)
    buscarEndereco();
});


function buscarEndereco() {
    clearTimeout(typingTimer);
    // Só busca se o campo for preenchido com 9 caracteres (5 + '-' + 3)
    if (cepInput.value.length === 9) {
        typingTimer = setTimeout(performSearch, doneTypingInterval);
    }
}


function performSearch() {
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const feedback = document.getElementById('cep-feedback');

    // Remove formatação para enviar para a API (8 dígitos puros)
    let cep = cepInput.value.replace(/\D/g, ''); 

    // Limpeza e preparação dos campos
    enderecoInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    feedback.classList.add('d-none');
    enderecoInput.placeholder = "Buscando endereço...";
    cepInput.classList.remove('is-invalid'); // Limpa a classe de erro do Bootstrap

    // Verifica se o CEP tem 8 dígitos para realizar a busca
    if (cep.length !== 8) {
        enderecoInput.placeholder = "Aguardando preenchimento automático...";
        return; 
    }
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro || !data.logradouro) {
                // CEP inválido ou não encontrado
                feedback.textContent = 'CEP inválido, não encontrado ou sem endereço. Preencha manualmente.';
                feedback.classList.remove('d-none');
                enderecoInput.placeholder = "CEP não encontrado. Preencha manualmente.";
                // Libera os campos para preenchimento manual
                enderecoInput.readOnly = false;
                bairroInput.readOnly = false;
                cidadeInput.readOnly = false;
            } else {
                enderecoInput.value = data.logradouro || '';
                bairroInput.value = data.bairro || '';
                cidadeInput.value = `${data.localidade} / ${data.uf}` || '';
                
                // Bloqueia os campos após o preenchimento automático
                enderecoInput.readOnly = true;
                bairroInput.readOnly = true;
                cidadeInput.readOnly = true;

                enderecoInput.placeholder = "";
                document.getElementById('numero').focus(); 
            }
        })
        .catch(error => {
            // Erro na requisição (falha de rede)
            feedback.textContent = 'Erro ao conectar com o servidor de CEP. Preencha manualmente.';
            feedback.classList.remove('d-none');
            enderecoInput.placeholder = "Erro na busca. Preencha manualmente.";
            enderecoInput.readOnly = false;
            bairroInput.readOnly = false;
            cidadeInput.readOnly = false;
            console.error("Erro na busca de CEP:", error);
        });
}

// ==========================================================
// FUNÇÃO 2: VALIDAR FORMULÁRIO
// ==========================================================
function validarFormulario(form) {
    let isValid = true;
    const cep = cepInput.value.replace(/\D/g, ''); 
    const cepFeedback = document.getElementById('cep-feedback');
    
    // 1. Validação do CEP: Deve ter exatamente 8 dígitos.
    if (cep.length !== 8) {
        cepInput.classList.add('is-invalid');
        cepFeedback.textContent = 'O CEP deve ter 8 dígitos numéricos.';
        cepFeedback.classList.remove('d-none');
        isValid = false;
    } else {
        cepInput.classList.remove('is-invalid');
        cepFeedback.classList.add('d-none');
    }
    
    // 2. Validação de campos obrigatórios do HTML5/Bootstrap
    if (!form.checkValidity()) {
        form.classList.add('was-validated'); 
        isValid = false;
    } 

    return isValid;
}


// ==========================================================
// FUNÇÃO 3: ENVIAR DADOS PARA WHATSAPP
// ==========================================================
document.getElementById('formGuincho').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const form = event.target;
    const feedbackMessage = document.getElementById('feedback-message');
    const btnEnviar = document.getElementById('btnEnviar');
    
    // EXECUTAR VALIDAÇÃO
    if (!validarFormulario(form)) {
        // Rola a página até o formulário em caso de erro de validação
        document.getElementById('contato').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        feedbackMessage.classList.remove('alert-success', 'd-none');
        feedbackMessage.classList.add('alert-danger');
        feedbackMessage.innerHTML = '<strong>Atenção!</strong> Por favor, preencha os campos obrigatórios corretamente.';
        return; // Interrompe o envio
    }

    // Se a validação passou, coleta os dados e envia
    const formData = new FormData(form);
    const nome = formData.get('Nome');
    const cep = formData.get('CEP');
    const rua = formData.get('Rua'); 
    const numero = formData.get('Número'); 
    const referencia = formData.get('Referência'); 
    const bairro = formData.get('Bairro');
    const cidade = formData.get('Cidade');
    
    let localMessage = `📍 Local: ${rua}, Nº ${numero}\n`;
    if (referencia) {
        localMessage += `📌 Ref: ${referencia}\n`;
    }

    const message = encodeURIComponent(
        `🚨 NOVA SOLICITAÇÃO DE GUINCHO - ÁGUIA 24H 🚨\n\n` +
        `👤 Nome do Cliente: ${nome}\n` +
        `🔑 CEP: ${cep}\n` +
        localMessage +
        `🏘️ Bairro: ${bairro}\n` +
        `🏙️ Cidade: ${cidade}\n\n` +
        `*** Por favor, entre em contato imediatamente. ***`
    );

    const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;

    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Abrindo WhatsApp...';
    
    window.open(whatsappURL, '_blank');
    
    // Feedback de sucesso
    feedbackMessage.classList.remove('d-none', 'alert-danger');
    feedbackMessage.classList.add('alert-success');
    feedbackMessage.innerHTML = '<strong>Redirecionando!</strong> Abra a conversa no WhatsApp para enviar sua solicitação.';
    
    // Reseta o formulário após 4 segundos
    setTimeout(() => {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<i class="bi bi-whatsapp me-2"></i> ENVIAR SOLICITAÇÃO VIA WHATSAPP';
        form.reset();
        form.classList.remove('was-validated');
        feedbackMessage.classList.add('d-none');
        // Rebloqueia os campos de endereço
        document.getElementById('endereco').readOnly = true;
        document.getElementById('bairro').readOnly = true;
        document.getElementById('cidade').readOnly = true;
        document.getElementById('endereco').placeholder = "Aguardando preenchimento automático...";
    }, 4000); 
});