# Teste Técnico — First Answer

Esta aplicação é uma solução de monitoramento e extração de menções a marcas em respostas geradas por IA. Ela foi projetada com foco em performance, modularidade e controle de custos de tokens.

---

## Como testar e executar

Você pode testar a aplicação em produção diretamente online ou executá-la no seu próprio ambiente:

🔗 **Link de Produção:** [https://niuai.com.br/3000](https://niuai.com.br/3000)

Se preferir rodar em seu próprio ambiente, você pode executar o projeto de três formas diferentes: localmente com Node.js, empacotado via Docker Compose ou de forma visual no Portainer.

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

### 🔗 Importando o Fluxo no n8n
O workflow completo do n8n está disponível na raiz do projeto como `workflow.json`. Para importá-lo no seu ambiente:
1. No painel do seu n8n, crie um novo workflow.
2. No canto superior direito, clique no menu de opções (três pontos) ➔ **Import from File**.
3. Selecione o arquivo `workflow.json` para carregar a topologia e as expressões de todos os nós automaticamente.

---

## Abordagem escolhida

Considerando recursos e tempo infinitos, seria tentador despejar toda a responsabilidade nas mãos de uma ou mais LLMs para que elas lidassem com tudo. Como a realidade é um pouco diferente, preferi pensar na velocidade, escalabilidade e economia de tokens.

Algo que foi alterado no meio da execução foi o gerenciamento dos dados. Optamos por construir um banco de dados composto pela Lista de Empresas Ativas da CVM, Startups de Tecnologia, Lista das empresas do S&P 500 e uma lista nascida de uma micro pesquisa de mercado. Consultei qual seria o público-alvo médio da First Answer, cheguei a um resultado dividido em 3 áreas, reuni então 100 nomes de cada área e montei uma lista com 300 empresas. Nosso banco de dados foi então alimentado pela união dessas 4 listas.

Optei por utilizar n8n para ter agilidade para elaborar a lógica do backend, afinal o tempo fornecido foi curto, além do fator de já ter um pouco de familiaridade com toda a infraestrutura na qual ele está inserido: VPS, Docker e PostgreSQL. Como são elementos valorizados no anúncio da vaga, acreditei ser de bom gosto aproveitar essa oportunidade de fornecer uma "comprovação" da capacidade de orquestrá-los em conjunto.

Analisei abordagens de NER. A limitação inicial de divisão em blocos simples me causou resistência, pois qualquer micro alteração seria descartada e, apesar de contarmos com a análise de textos gerados com LLMs, milhares de execuções poderiam levar a precisão para baixo. Foi então que descobri um novo conceito que irei apresentar no próximo tópico.

### Fuzzy Research
Um método de busca a ser implementado direto no banco de dados via SQL, que possibilita um relaxamento do resultado ao definir um percentual de semelhança sintática entre as palavras comparadas. O valor de 1 retorna apenas palavras exatamente iguais e 0% qualquer uma. Como adotar índices de semelhança mais baixos iria resultar em uma quantidade de palavras recuperadas inevitavelmente sempre muito grande, o esforço de realizar uma nova filtragem (que certamente ocorreria através de um LLM) poderia retirar o bônus do método, afinal, ele é extremamente rápido e gratuito. Consideramos um coeficiente de 0.7 para o nosso caso.

Caso a marca-alvo fosse recuperada pelo Fuzzy Research, o processo era considerado finalizado e as informações enviadas em resposta. Caso a marca-alvo não fosse recuperada, o fluxo era desviado para uma LLM que tinha como objetivo identificar as empresas contidas no texto e responder à demanda do software. Considerando que conseguimos elaborar um prompt pequeno e direto, não destinando muita demanda cognitiva para o modelo, o custo naturalmente baixo se torna ainda menor devido à restrição imposta acerca de sua atuação, pois sua função só é executada mediante uma resposta negativa do primeiro método de pesquisa.

Outro detalhe interessante dessa abordagem foi o nível de segurança, pois não houve necessidade de expor APIs.

---

## Como usou ferramentas de IA

Utilizei o Antigravity, IDE com IA da Google, para me auxiliar nesse processo. Forneci o link da página da First Answer e instruções sobre como queria o layout. Pedi para que tudo fosse feito de forma simples e já fui criando o webhook e fornecendo o endpoint para que fossem associados aos botões. Por vezes, então, estava fazendo minhas tarefas enquanto passava atividades para ele, acelerando um pouco o processo. Além de tudo, o agente auxilia com boa assertividade a configurar e resolver problemas que venham a aparecer em algumas instâncias, como abertura de portas na VPS e solução de impasses ocorridos durante a criação do container do Docker.

O pesadelo inerente do trabalho com IA é a poluição de contexto que escala exponencialmente. A partir de certo momento, a cognição do modelo se torna tão prejudicial à execução de instruções que, além do tempo perdido causado, acaba causando frustração (Vamos morrer por isso? Não). Por vezes ele começa a te fornecer uma ajuda e no meio do processo começa a dar errado, deixando uma sensação de vulnerabilidade grande, pois é difícil dizer se o momento do início das execuções precárias coincide com o momento em que foi possível perceber o mau funcionamento. A questão é manter as boas práticas de lapidar, instruir e possuir clareza nas instruções e objetivos.

---

## Onde isso quebra

Criar um sistema para filtrar e analisar as palavras recuperadas pela Fuzzy Research que não possuíam um score de 1, no cenário onde a marca-alvo não era encontrada inicialmente, seria mais um trabalho que, haja vista a quantidade grande de ações que me propus a fazer, resolvi aceitar como deficiência de precisão em nome de fornecer o projeto como um todo. Então pode ser comum (e não realizei experimentações e testagens em batches no Langsmith para elaborar sobre) que, nos cenários onde o método inicial de busca tenha êxito em encontrar a marca-alvo, algumas marcas não presentes no texto ou ligeiramente diferentes apareçam. A solução fácil seria através de LLM (eliminando a razão de ser do método) ou uma expansão do banco de dados, acrescentando uma coluna informando a área de atuação da empresa, possibilitando sugerir que, se houvesse um contraste razoável entre a quantidade de palavras de score 1 e as de score < 1, e essa diferença também fosse acompanhada de uma falta de isonomia entre as áreas desses dois grupos, os grupos de nota inferior teriam maiores chances de serem palavras não relacionadas.

Utilizar uma abordagem menos purista, carregada de containers, instâncias e codependências, naturalmente, expõe a aplicação a uma chance maior de passar por momentos de inatividade.

Textos que não possuem a marca-alvo em seu corpo, inevitavelmente, serão mais assertivos do que aqueles que possuem.
