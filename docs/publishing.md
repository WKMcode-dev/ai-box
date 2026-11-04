# Publicação e aplicativo Windows

## GitHub Pages

`npm run build:pages` valida o catálogo original e gera `frontend/dist-pages`, com JSON estático e caminhos sob `/ai-box/`. Não há dependência de `/api/tools` nessa edição. Para outro nome de repositório, defina `PAGES_BASE_PATH` durante o build.

O workflow `pages.yml` instala dependências, testa, compila e publica a cada push em `main`. A opção Settings → Pages → Source deve ser GitHub Actions. O arquivo de catálogo continua sendo `backend/data/catalog.json`; o build copia os dados validados para a versão estática, evitando duas fontes de edição.

## Windows em janela própria

- `npm run desktop`: compila o catálogo e abre uma janela Electron.
- `npm run dist:desktop`: gera o instalador e a edição portátil em `desktop/release`.

Requisitos de desenvolvimento: Windows 64 bits, Node.js 24 e npm. O usuário do executável final não precisa instalar Node.js ou iniciar um servidor.

A interface é carregada de conteúdo local usando o protocolo `aibox://box`. Não há integração Node no navegador da janela; isolamento de contexto e proteção de processos estão habilitados. Links oficiais HTTPS abrem no navegador padrão. O catálogo é incluído na instalação e só muda com uma nova compilação do aplicativo; o site atualiza a cada publicação.

A criação de uma tag `v1.0.0` dispara o workflow Windows. Ele testa, compila instalador/portátil e publica os executáveis na Release correspondente. Execuções manuais também publicam uma Release: abra Actions → Aplicativo Windows → Run workflow e informe a versão (por exemplo, `v1.0.0`). Se a Release já existir, os executáveis serão atualizados. A primeira edição é distribuída sem certificado comercial de assinatura digital.

## Adicionar IAs depois

Edite o JSON original, adicione a logo quando houver um símbolo próprio verificado e atualize as fontes. Publique a mudança em `main` para atualizar o site. Para distribuir o catálogo novo no Windows, aumente `desktop/package.json` e crie uma nova tag de versão.

