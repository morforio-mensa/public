import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// API Proxy Route to forward analysis requests to n8n
app.post('/api/analyze', async (req, res) => {
    const { brand, text } = req.body;

    if (!brand || !text) {
        return res.status(400).json({ error: 'Os campos "brand" e "text" são obrigatórios.' });
    }

    if (!N8N_WEBHOOK_URL) {
        console.warn('Alerta: N8N_WEBHOOK_URL não está configurada no backend.');
        return res.status(500).json({
            error: 'Servidor local ativo, mas a URL do webhook do n8n não está configurada no backend. Configure N8N_WEBHOOK_URL no arquivo .env ou defina a URL diretamente no frontend (public/app.js).'
        });
    }

    try {
        console.log(`[Proxy] Enviando dados de análise para o n8n: Marca: "${brand}"`);
        
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brand, text })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Proxy] Erro de processamento no n8n: ${response.status} - ${errorText}`);
            return res.status(response.status).json({
                error: `Erro no n8n: ${response.statusText}`,
                details: errorText
            });
        }

        const data = await response.json();
        console.log(`[Proxy] Resposta recebida do n8n com sucesso.`);
        return res.json(data);
    } catch (error: any) {
        console.error('[Proxy] Erro ao conectar com o n8n:', error.message);
        return res.status(502).json({
            error: 'Erro de comunicação ao conectar com o webhook do n8n.',
            details: error.message
        });
    }
});

// Fallback to index.html for single page layout
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`📍 Servindo arquivos estáticos de: public/`);
    console.log(`⚙️  Status do Proxy N8N: ${N8N_WEBHOOK_URL ? 'Configurado' : 'Não configurado (Usar via app.js ou .env)'}`);
    if (N8N_WEBHOOK_URL) {
        console.log(`🔗 Webhook N8N: ${N8N_WEBHOOK_URL}`);
    }
    console.log(`==================================================`);
});
