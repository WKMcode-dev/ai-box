# Configuração do assistente Gemini
O assistente usa a Gemini API por meio de um Cloudflare Worker. A chave não é exposta ao navegador nem armazenada no repositório.

## Ativação única
1. Crie uma conta Cloudflare e um API Token com permissão de editar Workers.
2. Crie uma chave Gemini API no Google AI Studio.
3. No GitHub, em Settings → Secrets and variables → Actions, adicione CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID e GEMINI_API_KEY.
4. Faça deploy do workflow Publicar assistente Gemini.
5. Copie a URL workers.dev e salve em Settings → Secrets and variables → Actions → Variables como VITE_ASSISTANT_API_URL.
6. Execute novamente os workflows GitHub Pages e Aplicativo Windows.

O Worker consulta o catálogo publicado, seleciona ferramentas relevantes e envia apenas esse contexto ao Gemini. Perguntas fora do escopo são recusadas. CORS, limite de caracteres e tratamento de cotas estão ativos.

## Custos e privacidade
Cloudflare Workers Free e Gemini API possuem cotas e limites que podem mudar. Na modalidade gratuita Gemini, dados enviados podem ser usados para melhoria dos produtos Google. Não envie dados pessoais ou sensíveis.
