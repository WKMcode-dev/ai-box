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


## Atualizações automáticas (a partir da 1.1.0)

A edição instalada (NSIS, Windows x64) usa electron-updater com o repositório público WKMcode-dev/ai-box. Verifica ao abrir (após dez segundos) e a cada quatro horas. O usuário autoriza o download e depois clica em Reiniciar e instalar. Não baixa nem instala ao fechar sem essa escolha. Falhas de rede mostram um aviso e permitem nova tentativa.

A edição portátil não substitui o próprio executável: use o instalador para receber atualizações automáticas. Quem tem 1.0.0 precisa instalar 1.1.0 manualmente uma vez, pois a edição antiga não contém o atualizador.

Para cada nova versão, aumente desktop/package.json, atualize o lockfile e crie docs/releases/vX.Y.Z.md. Publique a tag correspondente ou execute o workflow informando essa versão. A versão da tag deve corresponder ao pacote. Distribua o instalador, seu blockmap e latest.yml juntos: são necessários para a atualização. Não substitua os arquivos de uma versão já instalada; publique uma versão maior. O catálogo desktop vem no pacote: alterações de catálogo destinadas ao desktop também precisam de um lançamento.

O preload expõe somente consulta, download e instalação, sem acesso genérico ao IPC. O processo principal valida a origem da janela. A configuração de atualização fica no pacote, sem tokens no aplicativo. Os downloads são conferidos pelo checksum do manifesto; esta edição ainda não possui assinatura comercial.
