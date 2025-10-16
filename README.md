# 🦅 Auto Socorro Águia 24h - Landing Page

Este é o repositório da Landing Page moderna e responsiva do serviço de Auto Socorro Águia 24h, desenvolvida para captar leads e fornecer informações rápidas sobre os serviços de guincho e assistência veicular.

O projeto foi construído utilizando **HTML5** e **Bootstrap 5** para garantir um layout responsivo, limpo e focado na conversão de clientes em emergências.

---

## 🚀 Tecnologias Utilizadas

* **HTML5:** Estrutura base da página.
* **CSS3:** Estilização customizada (arquivo `style.css`).
* **Bootstrap 5:** Framework CSS para responsividade e componentes pré-estilizados.
* **Google Fonts:** Fontes utilizadas no design.
* **Font Awesome:** Ícones de serviço.

---

## 📋 Funcionalidades Principais

* **Hero (Cabeçalho):** Área de alta visibilidade com chamada de emergência clara e imagem de fundo (parallax desabilitado em mobile para otimização de performance).
* **Seção de Serviços:** Cards visuais para os principais serviços (Guincho Leve/Médio, Carga de Bateria, etc.).
* **Galeria de Ação:** Seção de fotos com cards para demonstrar a frota e a agilidade.
* **Formulário de Contato/Localização:** Formulário simples para solicitação de serviço (idealmente com integração WhatsApp/API de CEP).
* **Responsividade:** Otimizada para funcionar perfeitamente em desktops, tablets e smartphones (foco especial nos modelos Android/iOS).

---

## 📁 Estrutura do Projeto

A estrutura de pastas segue uma convenção comum em projetos web para facilitar a organização dos ativos:
```plaintext
AGUIA_SOCORRO/ 
├── assets/ 
│ ├── css/ 
│ │ └── style.css # Estilos customizados e media queries 
│ ├── images/ │ │ ├── guincho-acao-1.jpg │ 
│ ├── guincho-acao-2.jpg │ 
│ └── guincho-fundo.jpg 
│ └── js/ 
│ └── script.js # Arquivo para scripts JavaScript customizados (ainda não implementado) 
└── index.html # Arquivo principal da Landing Page 
└── README.md # Este arquivo de documentação
```

## 🛠 Como Rodar Localmente

1.  **Clone ou Baixe o Repositório:**
    ```bash
    git clone 
    [https://github.com/MarceloMederi/Aguia_Socorro.git]
    
    cd AGUIA_SOCORRO
    ```

2.  **Abra no Navegador:**
    Abra o arquivo `index.html` diretamente no seu navegador.
    *Recomendação:* Use uma extensão de servidor local (como o **Live Server** no VS Code) para garantir que todos os caminhos de arquivos e estilos sejam carregados corretamente (ex: `http://127.0.0.1:5500/index.html`).

---

## ✅ Otimização e Responsividade

O arquivo `style.css` foi configurado com as seguintes otimizações:

* **Background do Hero:** Utiliza `background-image` e `linear-gradient` para aplicar um filtro de cor sobre a foto de fundo, garantindo contraste para o texto.
* **Mobile-First:** Uso de **Media Queries** para ajustar o tamanho do título (`h1`) e garantir que os badges de serviço (`24 Horas`, `Rápido`, `Preço Justo`) não sejam cortados em telas de smartphones.
* **Imagens:** As imagens dos cards na seção "Guincho em Ação" utilizam `object-fit: cover` com altura fixa (`250px` no desktop, `200px` no mobile) para manter o alinhamento dos cards.

---

## 📧 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato.