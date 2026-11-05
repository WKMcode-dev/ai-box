# Correção da regressão visual

Base analisada: `336ddcd9968c200fd50d6d7302a4ff029b813334`.
Branch: `fix/restore-shift-layout`. Sem alteração da main, release ou deploy.

## Histórico e causas

O último estado anterior à migração visual é `31101d2`. A estrutura de navegação,
paleta, catálogo, filtros e modal dessa base foi preservada; o código funcional
posterior (inclusive controles desktop e atualizações) não foi revertido.

| Commits                         | Evidência e efeito                                                                                                                                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `15a3f90`, `07bf67d`, `7f2c952` | Trocam Hero, HeroVisual e ToolCard antes de existir uma folha importada para as classes novas. O card mantém a classe antiga `card`; o visual mantém `hero-visual`. Os estados intermediários são incompatíveis com o CSS então ativo. |
| `6402f11`, `54bd030`            | Criam e depois ativam um segundo conjunto de regras para os mesmos elementos. Mantêm os estilos antigos importados, criam silhueta com polygon e dimensões absolutas de conteúdo.                                                      |
| `2532ec8`                       | Adiciona uma aproximação de 937 bytes do Group 45, em vez do SVG original de 20.411 bytes.                                                                                                                                             |
| `700786b`                       | Introduz os caminhos vetoriais do card, mas usa `preserveAspectRatio="none"` e repete `id="shift-glass"` em todos os cards.                                                                                                            |
| `336ddcd`                       | Acrescenta outro bloco de overrides com `!important`, razão 114/55 para um SVG 114/42 e altura vetorial de 76,3636%. Cria espaço vazio no card e uma segunda geometria para conteúdo e etiquetas.                                      |

Não foi reproduzido um vazamento do holograma em todas as fases no HEAD: já havia
`overflow:hidden`. A correção remove a dependência das classes antigas e acrescenta
contenção de pintura, isolamento e altura explícita para garantir o limite do painel.

## Implementação

- Os módulos base, sidebar, layout, catálogo e modal mantêm a identidade anterior.
- Hero e holograma deixam de usar classes do componente aposentado; seus dois CSS
  antigos não são mais importados. As regras dos cards antigos são removidas;
  estilos compartilhados de marcas e logos continuam disponíveis no modal.
- Uma regra por componente substitui o acúmulo de overrides. Não há `!important`
  na nova folha; a regra global existente de movimento reduzido continua funcionando.
- O card usa razão 114/42 e SVG com `xMidYMid meet`. Mantém sem alteração os dois
  caminhos da silhueta existentes em `700786b`, incluindo curva da logo e recorte
  inferior. Cada gradiente recebe um identificador React único. Textos ficam dentro
  das áreas úteis, descrição tem duas linhas e três etiquetas ficam no recorte.
  Os detalhes completos permanecem no modal. Acabamento de vidro grafite e iluminação verde conforme a referência visual posterior.
- O SVG Group 45 original fornecido pelo usuário substitui a aproximação. Rotação,
  cubo e grade ficam no próprio painel; contador tem tipografia com limites e
  painel empilhado em telas pequenas.
- A grade usa colunas automáticas, preserva o tamanho após uma busca com um único
  resultado e limita cards grandes a 460 px.

### Referências conferidas

O SVG Shift-Card-A.I completo foi fornecido pelo usuário após a primeira revisão.
Os seis caminhos foram conferidos e agora são reproduzidos integralmente: corpo,
círculo da logo, três cápsulas inferiores e cápsula superior. O viewBox 114×42,
o preenchimento par-ímpar, a junção miter, o limite 20 e a espessura 0,5 do SVG
são mantidos. A fixture em `frontend/tests/fixtures/shift-card-ai.svg` preserva
essa geometria; somente metadados do editor foram omitidos.

As três etiquetas e o selo superior usam exatamente os limites dos caminhos,
com validação de posição e dimensão em pixels no teste de navegador. O teste
compara os seis atributos d renderizados com a referência independente do usuário.

O acabamento segue a imagem enviada em seguida: vidro grafite, borda metálica,
pontos de iluminação verdes no círculo e no canto inferior esquerdo, descrição
com filete verde e cápsulas escuras. Um filtro isola a luz verde para manter
nítida a parte prateada da borda. Os logos mantêm suas cores originais. A arte
foi implementada em SVG/CSS, mantendo os contornos fornecidos.

Group 45 continua usando o arquivo original recuperado, confinado ao seu painel.

### Revisão do enquadramento

A captura posterior do usuário ainda mostrava o selo junto ao título. Na branch,
o selo já estava ancorado ao caminho superior direito. A nova revisão inclui
coroa no selo Freemium (estrela em Grátis), título com maior destaque, descrição
com filete proporcional e categoria com ícone e faixa dentro da base inferior.
A geometria dos seis caminhos continua inalterada. O selo usa tipografia e ícone
que cabem na cápsula original, inclusive com 288 px de largura útil no celular.
O teste de layout também confere se o texto do status está integralmente dentro
da cápsula e se título, descrição e categoria não se sobrepõem.

## Validação

- `npm run check`: aprovado.
- O repositório não tem script nem configuração de lint. Prettier dos arquivos
  alterados e `git diff --check`: aprovados.
- `npm test`: o launcher tsx falhou no IPC do ambiente antes dos testes.
  Executadas as mesmas suítes via `node --import tsx --test frontend/tests/*.test.ts backend/tests/*.test.ts`
  (9 testes aprovados) e `node --test desktop/tests/*.test.mjs` (4 aprovados).
- `npm run build`, `npm run build:pages`, `npm run build:desktop` e
  `node scripts/verify-static.mjs pages desktop`: aprovados. Catálogo: 109 itens.
- Chromium: 320, 390, 570, 760, 768, 1024, 1360, 1440 e 1920 px;
  API de barra desktop simulada em 390 e 1360 px. Sem overflow horizontal,
  cards antigos, IDs duplicados, proporções erradas ou conteúdo fora dos cards.
- Verificadas fases da animação, busca, resultado único, categoria, abertura e
  fechamento do modal, movimento reduzido e chamadas dos três controles desktop.
  Nenhum erro JavaScript. Inspeção das capturas em celular, tablet e desktop.
- O teste da barra desktop simula o preload em Chromium. Não é homologação do
  executável no Windows nem teste em dispositivo iOS/Safari real.

## Repetir a checagem visual

```sh
npm ci
npx playwright install chromium
npm run test:layout
```

O teste serve o build Pages localmente, verifica nove larguras web e duas desktop,
e fecha navegador e servidor. Para usar Chromium instalado, informe
`CHROMIUM_EXECUTABLE_PATH`. Capturas opcionais são habilitadas com
`QA_SCREENSHOTS=/caminho/temporario`. Não há publicação automática nessa rotina.

O fluxo Pages existente só publica push na main ou execução manual; esta branch
fica disponível para revisão. A geometria completa do SVG Shift foi conferida; a revisão visual do usuário
deve anteceder o merge.
