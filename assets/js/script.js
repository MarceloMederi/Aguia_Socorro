// Número de telefone para onde a mensagem será enviada
const WHATSAPP_NUMBER = "553491791955"; 
let typingTimer;               
const doneTypingInterval = 500; 

// ==========================================================
// FUNÇÃO 1: BUSCAR ENDEREÇO POR CEP (Debouncing)
// (Sem alteração)
// ==========================================================
function buscarEndereco() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(performSearch, doneTypingInterval);
}

function performSearch() {
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const feedback = document.getElementById('cep-feedback');

    let cep = cepInput.value.replace(/\D/g, ''); 

    // Limpeza dos campos
    enderecoInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    feedback.classList.add('d-none');

    // SE O CEP FOR INVÁLIDO OU VAZIO, APENAS LIMPA E SAI.
    if (cep.length !== 8) {
        if (cep.length > 5) {
            cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5);
        }
        enderecoInput.placeholder = "Aguardando preenchimento automático...";
        return; 
    }
    
    // Garante a formatação final
    cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5);

    enderecoInput.placeholder = "Buscando endereço...";
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                feedback.classList.remove('d-none');
                enderecoInput.placeholder = "CEP não encontrado. Preencha manualmente.";
            } else {
                enderecoInput.value = data.logradouro || '';
                bairroInput.value = data.bairro || '';
                cidadeInput.value = `${data.localidade} / ${data.uf}` || '';
                
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
// NOVA FUNÇÃO: VALIDAR FORMULÁRIO
// ==========================================================
function validarFormulario(form) {
    let isValid = true;

    // 1. Validação de campos vazios (Built-in do HTML5, mas checamos para ter certeza)
    if (!form.checkValidity()) {
        // Se o navegador encontrar campos obrigatórios vazios, ele já exibe a mensagem de erro padrão.
        form.classList.add('was-validated'); // Adiciona a classe para exibir o feedback do Bootstrap
        isValid = false;
    } else {
        form.classList.remove('was-validated');
    }

    // 2. Validação Específica: CEP DEVE CONTER SOMENTE NÚMEROS (8 dígitos após remover formatação)
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    const cepFeedback = document.getElementById('cep-feedback');

    if (cep.length !== 8 || isNaN(cep)) {
        // Se o CEP tiver menos de 8 dígitos ou não for número, marcamos como inválido
        cepInput.classList.add('is-invalid');
        cepFeedback.textContent = 'O CEP deve ter 8 dígitos numéricos.';
        cepFeedback.classList.remove('d-none');
        isValid = false;
    } else {
        cepInput.classList.remove('is-invalid');
    }
    
    // 3. Validação Específica: NÚMERO DE ENDEREÇO DEVE CONTER SOMENTE NÚMEROS
    const numeroInput = document.getElementById('numero');
    // Remove apenas espaços para permitir "S/N" ou números com letras (que podem ser válidos)
    const numeroValue = numeroInput.value.trim();

    // Se o valor não for vazio E não for apenas números
    if (numeroValue && !/^\d+$/.test(numeroValue)) {
        // Permite números e letras (para S/N ou Lote 12), mas valida se contém algo
        // O código anterior não validava o formato, apenas se estava preenchido.
        // Se você quiser que seja APENAS NÚMEROS, use: if (numeroValue && !/^\d+$/.test(numeroValue)) {
        
        // Vamos manter a validação mais flexível para o número da casa (permitindo letras como 'S/N'), 
        // mas marcamos como erro se estiver vazio e o HTML não pegar.
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
    
    // EXECUTAR VALIDAÇÃO PRIMEIRO
    if (!validarFormulario(form)) {
        feedbackMessage.classList.remove('alert-success');
        feedbackMessage.classList.add('alert-danger');
        feedbackMessage.innerHTML = '<strong>Atenção!</strong> Por favor, preencha os campos obrigatórios corretamente.';
        feedbackMessage.classList.remove('d-none');
        return; // Interrompe o envio
    }

    // Se a validação passou, coleta os dados e envia (código inalterado)
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
    
    setTimeout(() => {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<i class="bi bi-whatsapp me-2"></i> ENVIAR SOLICITAÇÃO VIA WHATSAPP';
        form.reset();
        form.classList.remove('was-validated');
    }, 4000); 
});