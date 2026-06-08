-- Script de Carga Inicial (Dicionário Semente)
-- Execute este script no SQL Editor do seu Supabase para popular a tabela de marcas.
-- IMPORTANTE: Ajuste o nome da tabela (ex: 'marcas', 'brands') e da coluna (ex: 'nome', 'name') para corresponder à sua estrutura no Supabase.

INSERT INTO marcas (nome) VALUES
-- Marcas do Caso de Teste 1 (Bancos e Cartões)
('Nubank'),
('Banco Inter'),
('C6 Bank'),
('BTG Pactual'),

-- Marcas do Caso de Teste 2 (Tênis e Corrida)
('Olympikus'),
('Asics'),
('Mizuno'),
('New Balance'),
('Nike'),
('Adidas'),
('Puma'),

-- Marcas do Caso de Teste 3 (Plataformas de GEO / Monitoramento de IA)
('Profound'),
('Brandlight'),
('Peec AI'),
('AthenaHQ'),
('First Answer'),

-- Modelos de IA e Chatbots (Citados no Caso 3)
('ChatGPT'),
('Gemini'),
('Claude'),
('Perplexity'),
('Copilot'),

-- Outras Marcas Grandes de Tecnologia e Finanças (Para Robustez do Teste)
('Apple'),
('Samsung'),
('Microsoft'),
('Google'),
('Amazon'),
('Meta'),
('OpenAI'),
('Anthropic'),
('Itaú'),
('Bradesco'),
('Santander'),
('XP Investimentos');
