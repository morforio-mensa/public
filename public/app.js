// ==========================================
// CONFIGURATION (n8n Webhook URL)
// ==========================================
// Cole aqui a URL de produção do Webhook do seu n8n.
// Exemplo: "https://n8n.niuai.com.br/webhook/first-answer"
// Se mantiver vazia "", o script tentará fazer a requisição para a rota do servidor local.
const N8N_WEBHOOK_URL = "https://n8n.niuai.com.br/webhook/firstAnswer";

// ==========================================
// PRE-DEFINED TEST CASES DATA
// ==========================================
const testCases = {
    1: {
        brand: "Nubank",
        text: `Não existe um único “melhor” cartão de crédito para todo mundo. O melhor depende do que você valoriza: cashback, milhas, ausência de anuidade ou benefícios de viagem.

Com base nas opções mais populares do mercado brasileiro, estas são algumas boas alternativas:

- Nubank: ideal para quem busca simplicidade, aplicativo fácil de usar e geralmente sem anuidade.
- Banco Inter: boa opção para quem quer cashback sem pagar anuidade.
- Nubank Ultravioleta: indicado para quem tem gastos mais elevados e deseja cashback em todas as compras.
- C6 Bank: interessante para quem quer acumular pontos e milhas.
- BTG Pactual Black: recomendado para quem viaja com frequência e valoriza benefícios premium, como acesso a salas VIP.

Sugestões por perfil:

- Se você está começando a usar cartão de crédito: Nubank.
- Se quer cashback sem anuidade: Banco Inter.
- Se gasta mais de R$ 5.000 por mês e busca maior retorno: Nubank Ultravioleta.
- Se o foco é acumular milhas para viajar: C6 Bank ou cartões Black de bancos tradicionais.

Se você informar sua idade, quanto costuma gastar por mês no cartão e se prefere cashback ou milhas, posso indicar a opção mais adequada para o seu perfil.`
    },
    2: {
        brand: "Nike",
        text: `Para a maioria das pessoas que está começando a correr, a melhor escolha é um tênis de treino diário, com bom amortecimento e conforto, sem necessidade de investir em modelos de competição.

**Melhor custo-benefício: Olympikus Corre 4**

- Marca brasileira muito bem avaliada.
- Leve, confortável e versátil.
- Excelente para quem pretende evoluir dos 5 km para distâncias maiores.

**Melhor para quem busca conforto: Olympikus Corre Max**

- Mais amortecido.
- Ótimo para iniciantes, pessoas mais pesadas ou quem sente mais o impacto da corrida.

**Melhor opção de entrada: Asics Gel-Excite 10**

- Geralmente encontrado por menos de R$ 400.
- Muito confortável para os primeiros meses de corrida.

**Melhor compra sem erro: Mizuno Wave Rider 29**

- Durável, confortável e confiável.
- Frequentemente recomendado por corredores experientes.
- Funciona bem para diferentes tipos de corredores.

**Melhor conforto premium: New Balance Fresh Foam X 1080 v14**

- Um dos tênis mais confortáveis do mercado.
- Excelente para treinos leves e corridas mais longas.
- Custa mais caro, mas entrega uma experiência superior.

Se eu tivesse que indicar apenas um modelo para a maioria dos iniciantes hoje, seria o **Olympikus Corre 4**, por oferecer uma combinação difícil de superar entre conforto, desempenho e preço.

Minha ordem de recomendação para quem está começando seria:

1. Olympikus Corre 4
2. Mizuno Wave Rider 29
3. Asics Gel-Excite 10
4. Olympikus Corre Max
5. New Balance Fresh Foam X 1080 v14

Se você me informar seu peso, orçamento e se pretende correr principalmente na rua ou na esteira, consigo indicar o modelo mais adequado para o seu caso.`
    },
    3: {
        brand: "First Answer",
        text: `Se o objetivo é monitorar a visibilidade de uma marca em plataformas como ChatGPT, Gemini, Claude, Perplexity e Copilot, algumas soluções se destacam no mercado em 2026.

A Profound é atualmente considerada por muitos a referência do setor. A plataforma oferece monitoramento de presença em diferentes mecanismos de IA, análise de share of voice, inteligência competitiva e identificação dos prompts que geram menções à marca. É uma solução voltada principalmente para empresas de médio e grande porte que desejam estruturar uma estratégia robusta de visibilidade em IA.

A Brandlight tem um foco diferente. Além de medir presença, ela busca entender como a marca está sendo representada pelas IAs. A plataforma analisa narrativa, sentimento, precisão das respostas e possíveis distorções de posicionamento, sendo especialmente interessante para empresas preocupadas com reputação e branding.

A Peec AI vem ganhando espaço como uma alternativa com excelente custo-benefício. Oferece recursos de share of voice, benchmarking de concorrentes, análise das fontes utilizadas pelas IAs e suporte multilíngue, sendo bastante utilizada por startups, scale-ups e agências.

A AthenaHQ é uma solução mais voltada para grandes organizações que precisam segmentar análises por região, público ou unidade de negócio, oferecendo recursos avançados de governança e relatórios executivos.

Já a First Answer possui uma proposta focada na qualidade das respostas geradas pelas IAs. Em vez de apenas medir menções, a plataforma avalia se a marca está sendo apresentada corretamente, se seus diferenciais estão sendo compreendidos pelos modelos e se o posicionamento desejado está sendo refletido nas respostas.

De forma geral, cada plataforma atende a uma necessidade diferente. A Profound se destaca para monitoramento de presença e share of voice. A Brandlight é forte em reputação e narrativa. A Peec AI oferece uma excelente relação custo-benefício. A AthenaHQ atende demandas corporativas mais complexas. E a First Answer se diferencia por analisar a qualidade e a fidelidade da representação da marca pelas IAs.

Para empresas que estão investindo em GEO (Generative Engine Optimization), otimização para LLMs e gestão de percepção de marca em IA, a combinação entre monitoramento de presença, análise de narrativa e avaliação da qualidade das respostas tende a gerar a visão mais completa do mercado.`
    }
};

let currentAnalysisResult = null;

// ==========================================
// TEST CASES INTERACTION
// ==========================================
function loadTestCase(id) {
    const testCase = testCases[id];
    if (!testCase) return;

    // Populate fields
    document.getElementById("input-monitored-brand").value = testCase.brand;
    document.getElementById("input-text").value = testCase.text;

    // Highlight active test case button
    document.querySelectorAll(".case-select-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById(`btn-case-${id}`).classList.add("active");

    // Smooth scroll down to panel
    document.getElementById("analyzer-card").scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// FILE UPLOAD & DRAG/DROP
// ==========================================
const dropZone = document.getElementById("drop-zone");

if (dropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("input-text").value = e.target.result;
    };
    reader.readAsText(file);
}

// ==========================================
// FORM SUBMISSION & API CALL
// ==========================================
async function handleAnalyze(event) {
    event.preventDefault();

    const brand = document.getElementById("input-monitored-brand").value.trim();
    const text = document.getElementById("input-text").value.trim();
    const submitBtn = document.getElementById("btn-analyze");

    if (!brand || !text) return;

    // Show loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
        const url = N8N_WEBHOOK_URL || "/api/analyze";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ brand, text })
        });

        if (!response.ok) {
            throw new Error(`Erro no processamento: ${response.statusText}`);
        }

        const result = await response.json();
        currentAnalysisResult = result;
        displayResults(brand, result);
    } catch (error) {
        console.error(error);
        alert("Erro ao realizar análise. Certifique-se de que a URL do webhook do n8n está configurada no arquivo app.js ou que o servidor local está rodando.");
    } finally {
        // Remove loading state
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
    }
}

// ==========================================
// RESULTS DISPLAY
// ==========================================
function displayResults(brandName, result) {
    const resultsCard = document.getElementById("results-card");
    const ownBrandCard = document.getElementById("own-brand-card");
    const statusIconContainer = document.getElementById("own-brand-status-icon");
    const resultOwnBrandName = document.getElementById("result-own-brand-name");
    const resultOwnBrandBadge = document.getElementById("result-own-brand-badge");
    const otherBrandsContainer = document.getElementById("other-brands-container");
    const resultsTimestamp = document.getElementById("results-timestamp");

    // 1. Set timestamp
    const now = new Date();
    resultsTimestamp.innerText = `Análise concluída em: ${now.toLocaleTimeString()} às ${now.toLocaleDateString()}`;

    // 2. Set own brand result
    resultOwnBrandName.innerText = result.own_brand_corrected || brandName;
    
    // Clear previous classes
    ownBrandCard.className = "result-status-card";
    
    if (result.own_brand_mentioned) {
        ownBrandCard.classList.add("found");
        statusIconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
        resultOwnBrandBadge.innerText = "Mencionada";
        resultOwnBrandBadge.className = "status-badge"; // resets
    } else {
        ownBrandCard.classList.add("not-found");
        statusIconContainer.innerHTML = '<i class="fas fa-times-circle"></i>';
        resultOwnBrandBadge.innerText = "Não Mencionada";
        resultOwnBrandBadge.className = "status-badge"; // resets
    }

    // 3. Set other brands
    otherBrandsContainer.innerHTML = "";
    let brandsList = [];
    if (Array.isArray(result.other_brands)) {
        brandsList = result.other_brands;
    } else if (typeof result.other_brands === "string") {
        const trimmed = result.other_brands.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
                brandsList = JSON.parse(trimmed);
            } catch (e) {
                brandsList = trimmed.replace(/[\[\]"']/g, "").split(",").map(s => s.trim()).filter(Boolean);
            }
        } else {
            brandsList = trimmed.split(",").map(s => s.trim()).filter(Boolean);
        }
    }

    // Limpeza de segurança para remover aspas sobressalentes de cada marca
    brandsList = brandsList.map(b => typeof b === "string" ? b.replace(/['"]/g, "").trim() : b).filter(Boolean);

    if (brandsList.length > 0) {
        brandsList.forEach(otherBrand => {
            const chip = document.createElement("span");
            chip.className = "brand-chip";
            chip.innerHTML = `<i class="fas fa-tag"></i> ${otherBrand}`;
            otherBrandsContainer.appendChild(chip);
        });
    } else {
        const noBrandsMsg = document.createElement("span");
        noBrandsMsg.className = "no-brands-msg";
        noBrandsMsg.innerText = "Nenhuma outra marca mencionada no texto.";
        otherBrandsContainer.appendChild(noBrandsMsg);
    }

    // 4. Show Results Card
    resultsCard.style.display = "block";
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
