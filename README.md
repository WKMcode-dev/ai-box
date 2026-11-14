# A.I BOX

[Site público](https://WKMcode-dev.github.io/ai-box/) · [Downloads para Windows](https://github.com/WKMcode-dev/ai-box/releases)

## Windows e GitHub Pages

A partir da versão 1.1.0, a edição instalada avisa quando há uma nova versão e permite baixar, reiniciar e instalar pelo próprio aplicativo. Quem usa 1.0.0 precisa instalar a nova edição uma vez. A versão portátil usa atualização manual.

O projeto inclui aplicativo Electron em janela própria e edição estática para GitHub Pages. `npm run desktop` abre a edição desktop; `npm run dist:desktop` gera instalador e portátil; `npm run build:pages` prepara o site estático. As instruções de lançamento estão em [docs/publishing.md](docs/publishing.md).

Catálogo público de IAs em português, sem login. React + TypeScript + Vite no Front-End e Node.js + TypeScript no Back-End. Dados em JSON, sem banco.

## Iniciar desenvolvimento

Requisitos: Node.js 22.12+ (recomendado: Node 24 LTS) e npm.

Na pasta principal do projeto:

```sh
npm install
npm run dev
```

O comando inicia os dois serviços: interface em http://127.0.0.1:5173 e API em http://127.0.0.1:3001. Abra a interface. `Ctrl+C` encerra os processos. Se a porta 5173 estiver ocupada, use o endereço informado pelo Vite. A API usa a porta 3001 por padrão; o proxy do Front-End deve apontar para a mesma porta se você alterá-la.

## Build, testes e produção

```sh
npm run check
npm test
npm run build
npm start
```

`npm start` serve **a interface compilada e a API juntas** em http://127.0.0.1:3001. Execute o build antes. O catálogo permanece em `backend/data/catalog.json`, lido pelo servidor; alterações no JSON não exigem banco nem recompilação. No desenvolvimento, o Front-End busca `/api/tools` usando o proxy do Vite.

Para distribuição, mantenha `backend/dist`, `backend/data` e `frontend/dist` nas posições originais. O Back-End usa módulos nativos do Node, sem dependências externas de execução. Configure `PORT` e `HOST` no ambiente se necessário. O padrão local é `127.0.0.1`; não há publicação automática. Para hospedagem separada, configure um proxy `/api` para o Back-End.

## Organização

```text
frontend/
  public/logos/         SVGs das marcas e atribuições
  src/
    components/         layout, hero e elementos de interface
    features/catalog/
      api/              chamadas HTTP
      components/       cards, filtros, modal e estados da tela
      config/           categorias e modalidades
      hooks/            carregamento e estado do catálogo
      utils/            busca, filtros e ordenação
    styles/             estilos separados por responsabilidade
  tests/                testes de busca e filtros
backend/
  data/catalog.json     fonte única das ferramentas
  src/
    http/               rotas, respostas e arquivos estáticos
    services/           casos de uso do catálogo
    repositories/       leitura e validação do JSON
    server.ts           inicialização do servidor
  tests/                contrato dos dados, API e arquivos estáticos
shared/src/             contratos TypeScript e categorias compartilhadas
scripts/dev.mjs         inicialização dos serviços
scripts/package.mjs     geração do ZIP sem dependências e caches
docs/                   arquitetura e fontes da pesquisa
```

`App.tsx` apenas compõe a página. O Front-End não importa o JSON do Back-End e acessa os dados por HTTP. Os tipos compartilhados são compilados antes dos demais pacotes.

## Catálogo e gratuidade

118 entradas em sete categorias: aplicativos, modelos e frameworks. Inclui ChatGPT, Claude, Gemini, Copilot, ferramentas de mídia, programação, produtividade e pesquisa, além de projetos e modelos locais. É uma seleção ampla com fontes documentadas, não uma promessa de conter todas as IAs existentes.

Os cards distinguem `free` (gratuito na modalidade indicada) de `freemium` (acesso/plano gratuito com limites e oferta paga opcional). O filtro de gratuidade permite separá-los. Nenhuma entrada é classificada como exclusivamente paga. Créditos de cadastro finitos, limites de geração, necessidade de conta e condições de uso são informados no modal, com um link de evidência oficial. Planos e disponibilidade podem mudar.

As formas de acesso são: site/aplicativo online, aplicativo com nuvem, execução local, hospedagem própria e processamento no navegador. "No navegador" indica processamento no dispositivo; um site que processa na nuvem é classificado como online. Modelos e frameworks locais exigem configuração e hardware compatíveis; não são todos chats prontos para usar.

As logos são símbolos das marcas/projetos com origem documentada. Sem SVG próprio verificado, mostramos o nome do projeto em texto; não inventamos uma logo nem usamos a imagem de outra IA. Whisper tem identificação textual e ChatGPT tem sua própria entrada com o símbolo correspondente. Os nomes de fabricantes continuam informados separadamente.

Fontes: [docs/catalog-sources.md](docs/catalog-sources.md). Cobertura e candidatos pendentes: [docs/catalog-coverage.md](docs/catalog-coverage.md). Logos: [frontend/public/logos/ATTRIBUTION.md](frontend/public/logos/ATTRIBUTION.md).

## Editar e ampliar

Edite `backend/data/catalog.json`. Cada item tem ID único, categoria, descrição, URL oficial, logo local, tags, destaque editorial, modalidade, tipo, nota de uso gratuito, fonte e data de revisão. `pricing` deve ser `free` ou `freemium`; registre a evidência em `pricingSourceUrl`. O Back-End valida os dados. Para identificação textual, use `logoKind: "text"` e `logo: null`. Adicione o SVG e registre a origem em `ATTRIBUTION.md`. Categorias e contrato ficam em `shared/src/index.ts`. Ao mudar contratos, execute o build e reinicie o desenvolvimento.

A busca ignora acentos e capitalização e combina categoria, modalidade, gratuidade e texto. O modal usa `dialog` nativo, suporta Escape e foco contido. Há estados de carregamento, falha com nova tentativa e busca vazia.

As fontes DM Sans e Manrope usam Google Fonts com alternativas locais. O catálogo não exige contas na BOX, não inclui analytics e não instala nem executa as IAs de terceiros.

### Desktop 1.2.0

A barra superior reúne logo, catálogo, atualizações e os controles da janela.
O instalador Windows tem painéis próprios em grafite e verde, idioma português
e a mesma logo da aplicação no executável e nos atalhos.

O feed de atualização é o manifesto da release estável em
`https://github.com/WKMcode-dev/ai-box/releases/latest/download/latest.yml`.
Falhas mostram o código e oferecem o instalador manual; o diagnóstico fica em
`%APPDATA%/A.I BOX/logs/updates.log`. Se o atualizador da 1.1.0 falhar, instale
a 1.2.0 uma vez pelo instalador. A edição portátil usa atualização manual.

O pipeline Windows verifica o manifesto, SHA-512 e a logo embutida no executável
antes de publicar. Consulte [as notas da versão](docs/releases/v1.2.0.md).
