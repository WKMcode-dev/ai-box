# Arquitetura

A raiz é um workspace npm com três pacotes: Front-End, Back-End e contratos. A separação permite executar, testar e evoluir a interface e a API de forma independente, mantendo um único comando para desenvolvimento.

## Fluxo dos dados

`JSON → Repository → Service → HTTP /api/tools → catalogApi → useCatalog → componentes`

O repository lê e valida a estrutura e os campos do catálogo. O service define o caso de uso de obter as ferramentas. A camada HTTP cuida de métodos, códigos de resposta e serialização. O contrato compartilhado define as informações trocadas entre os pacotes. A API é somente leitura.

No Front-End, a feature de catálogo contém API, hooks, regras de busca e componentes específicos. Elementos genéricos e layout ficam fora da feature. Estilos são agrupados por responsabilidade com ajustes responsivos próximos às regras relacionadas. O estado da seleção de modal fica na composição; dados e filtros ficam no hook.

## Escolhas

- Node HTTP nativo: suficiente para a pequena API pública, sem adicionar um framework de servidor.
- JSON lido a cada consulta: edição simples e uma única fonte, sem sincronização com banco. Evoluir para cache ou banco apenas quando o volume ou a frequência de acesso justificar.
- Filtros no cliente: 108 entradas são pequenas; a interface responde imediatamente depois do carregamento.
- SVGs locais: evita falha de CDN em tempo de execução e permite rastrear a origem de cada marca.
- Produção em uma origem: o Back-End entrega `frontend/dist` e `/api`, evitando configuração de CORS. No desenvolvimento o proxy do Vite faz essa ligação.
- Gratuidade explícita: modelos locais e edições comunitárias são separados de serviços online com plano gratuito limitado. Só as modalidades `free` e `freemium` são aceitas pela API, com fonte de evidência.

## Verificação

Testes automatizados cobrem validação e integridade do catálogo, existência dos SVGs, contrato HTTP, status de erro, entrega de arquivos públicos e isolamento dos caminhos, busca sem acentos, combinação de filtros e ordenação sem mutação da fonte. A revisão visual verifica desktop, celular, modal, logos e carregamento real pela API.

O objetivo é manter arquivos com uma responsabilidade clara, sem criar camadas sem uso. O JSON pode ser maior por ser conteúdo; componentes e funções permanecem pequenos.
