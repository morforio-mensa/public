# Teste Técnico — First Answer

Esta aplicação é uma solução de monitoramento e extração de menções a marcas em respostas geradas por IA. Ela foi projetada com foco em performance, modularidade e controle de custos de tokens.

---

## Como rodar

Você pode executar o projeto de três formas diferentes: localmente com Node.js, empacotado via Docker Compose, ou de forma visual no Portainer.

### ⚙️ Configuração das Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo a URL de produção do seu webhook do n8n:
```env
PORT=3000
N8N_WEBHOOK_URL=https://n8n.niuai.com.br/webhook/firstAnswer
```

---

### 🚀 Opção 1: Execução Local (Node.js)
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor em ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra **[http://localhost:3000](http://localhost:3000)** no seu navegador.

---

### 🐳 Opção 2: Execução via Docker Compose
Para rodar a aplicação em um container isolado:
1. Suba o container com o comando:
   ```bash
   docker-compose up -d --build
   ```
2. Acesse a aplicação na porta 3000 (**`http://localhost:3000`**).

---

### 🕸️ Opção 3: Execução via Portainer (Sem Terminal)
1. Crie uma nova Stack selecionando o método de build **Repository**.
2. Insira a URL do seu repositório GitHub.
3. Adicione as variáveis de ambiente `PORT` e `N8N_WEBHOOK_URL` na interface visual do Portainer.
4. Clique em **Deploy the stack**.

---

## Abordagem escolhida

Optamos por uma **arquitetura híbrida baseada em Database-First com Fallback de LLM** pelas seguintes razões:

1. **Eficiência e Custo Zero de LLM (~90% dos casos):** A primeira etapa do fluxo realiza uma busca por similaridade fonética e ortográfica de trigramas no banco de dados (Supabase/PostgreSQL com `pg_trgm`) contra uma base semente de **2.456 marcas registradas**. Se a marca monitorada for encontrada de forma confiável pelo banco local, o fluxo retorna imediatamente (Custo de LLM = $0 e latência de milissegundos).
2. **Fallback Inteligente (GPT):** A API do LLM é acionada apenas como retaguarda (fallback) caso a marca monitorada não seja identificada no banco local ou se houver forte ambiguidade no texto. Isso protege a cota de requisições diárias e diminui drasticamente a latência média da aplicação.
3. **Desacoplamento e Segurança:** O frontend e o backend local Express atuam apenas como proxy e interface do usuário, não expondo credenciais confidenciais do Supabase ou da API do GPT ao navegador.

---

## Como usou ferramentas de IA

Utilizei o assistente de codificação inteligente **Antigravity** integrado à IDE para estruturar e refatorar o projeto.

* **Pontos positivos (onde ajudou muito):**
  * **Aceleração do CSS/Design:** Auxiliou a estruturar rapidamente o visual Dark/Glassmorphic premium em CSS puro, sem necessidade de inflar o projeto com frameworks pesados.
  * **Consolidação de Parsing:** Criou uma lógica robusta no frontend (`app.js`) para parsear de forma transparente arrays JSON ou strings serializadas retornadas pelo n8n, evitando quebras visuais no navegador.
* **Pontos negativos (onde atrapalhou/errou):**
  * **Configuração Incorreta do Git:** O assistente anterior havia inicializado o repositório Git incorretamente dentro da subpasta `/public`, o que deixaria de fora do commit arquivos cruciais da raiz (como `src/`, `Dockerfile` e `tsconfig.json`). Foi necessário realizar a movimentação e reestruturação manual do Git para a raiz.
  * **Overengineering no Prompt:** O assistente anterior sugeriu um prompt excessivamente longo e redundante para o nó do LLM. Simplificamos o prompt em 60% sem perder qualidade na extração, reduzindo o tempo de resposta e consumo de tokens.

---

## Onde isso quebra

Sendo transparentes com as limitações técnicas da solução:

1. **Ambiguidade Extrema de Termos Comuns:** Marcas baseadas em palavras comuns (como "CAL", "Segment", "Intel" ou "First Answer") podem enganar o modelo se usadas em sentido estritamente literal no texto (ex: *"Esta foi a first answer do entrevistado"*). O prompt foi refinado com regras contextuais para mitigar isso, mas modelos menores de LLM ainda podem falhar nesse tipo de desambiguação fina.
2. **Latência Acumulada no Fallback:** Quando o banco de dados falha em encontrar a marca e o fluxo precisa ir até o GPT, a latência total aumenta para cerca de 1,5 a 3 segundos (devido ao tempo de inferência do modelo da OpenAI), o que pode ser perceptível pelo usuário final.
3. **Instabilidade do Webhook ou LLM:** Se a API da OpenAI apresentar instabilidade ou o n8n ficar inativo no servidor, o fluxo de fallback quebrará e o site retornará um erro ao tentar processar menções que exijam o LLM.

---

## Outputs

Abaixo estão os outputs em JSON estrito gerados a partir do processamento dos 3 casos de teste:

### 🔵 Caso 1 (Marca Monitorada: `Nubank`)
```json
{
  "own_brand_mentioned": true,
  "other_brands": [
    "Banco Inter",
    "C6 Bank",
    "BTG Pactual"
  ]
}
```

### 🔴 Caso 2 (Marca Monitorada: `Nike`)
```json
{
  "own_brand_mentioned": false,
  "other_brands": [
    "Olympikus",
    "Asics",
    "Mizuno",
    "New Balance"
  ]
}
```

### 🟡 Caso 3 (Marca Monitorada: `First Answer`)
```json
{
  "own_brand_mentioned": true,
  "other_brands": [
    "Profound",
    "Brandlight",
    "Peec AI",
    "AthenaHQ",
    "ChatGPT",
    "Gemini",
    "Claude",
    "Perplexity",
    "Copilot"
  ]
}
```
