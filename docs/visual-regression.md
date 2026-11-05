# Correção da regressão visual

Base analisada: `336ddcd9968c200fd50d6d7302a4ff029b813334`.
A primeira correção foi integrada à main e publicada após autorização do usuário.
Este documento registra também os ajustes seguintes de acabamento e recorte adaptativo.

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
- O card mantém o SVG proporcional com largura de 114 unidades. O recorte usa
  somente as etiquetas reais: com uma ou duas, fica mais estreito e alinhado à
  direita; acima de três, ganha linhas e altura no SVG. Nenhuma etiqueta é
  removida por limite de quantidade. Sem etiquetas, não há recorte vazio.
- A etiqueta da categoria é um retângulo SVG arredondado completo, sem recorte
  lateral ou clip-path. As bordas vetoriais foram afinadas de 0,5 para 0,32 unidade.
- O hover altera somente o brilho, sem deslocar o card. Gradientes e brilho usam
  a cor definida para cada ferramenta (mint, peach, purple, blue, pink e yellow).
- Os textos usam posições verticais na escala do próprio SVG para que aumentar
  a altura do recorte não desloque logo, título, categoria ou status superior.
- Cada gradiente e referência de brilho recebe identificador React único.
  Os detalhes completos continuam no modal; a arte permanece em SVG, com CSS
  para posição, tipografia e intensidade do brilho.
- O SVG Group 45 original fornecido pelo usuário substitui a aproximação. Rotação,
  cubo e grade ficam no próprio painel; contador tem tipografia com limites e
  painel empilhado em telas pequenas.
- A grade usa colunas automáticas, preserva o tamanho após uma busca com um único
  resultado e limita cards grandes a 460 px.

### Referências conferidas

O SVG Shift-Card-A.I completo foi fornecido pelo usuário após a primeira revisão.
A fixture em `frontend/tests/fixtures/shift-card-ai.svg` preserva os seis caminhos
originais (metadados do editor omitidos). Com três etiquetas, o corpo, círculo e
cápsulas mantêm essa geometria. Com outras quantidades, somente o recorte e as
cápsulas inferiores são gerados conforme a quantidade. O retângulo arredondado da
categoria é desenhado no mesmo SVG. Não se usa clip-path para produzir os contornos.

O teste compara o caso de três etiquetas com o SVG do usuário e confere os limites
dos textos em relação aos vetores. Os casos 0, 1, 2, 4 e 7 são exercitados em
navegador em 320 e 1440 px; os testes unitários cobrem também 3 e 10 etiquetas.
O acabamento mantém vidro grafite, borda metálica, filete e brilho por ferramenta.

Group 45 continua usando o arquivo original recuperado, confinado ao seu painel.

### Revisão do enquadramento

A captura posterior do usuário ainda mostrava o selo junto ao título. Na branch,
o selo já estava ancorado ao caminho superior direito. A nova revisão inclui
coroa no selo Freemium (estrela em Grátis), título com maior destaque, descrição
com filete proporcional e categoria com ícone e faixa dentro da base inferior.
A geometria original é mantida no caso de três etiquetas. O selo usa tipografia e ícone
que cabem na cápsula original, inclusive com 288 px de largura útil no celular.
O teste de layout também confere se o texto do status está integralmente dentro
da cápsula e se título, descrição e categoria não se sobrepõem.

### Mecanismo horizontal e abertura por peças

O Group 45 deixa de ser uma imagem inteira girando com rotateX/rotateZ.
Seus 106 paths originais estão preservados e distribuídos uma única vez entre
cinco conjuntos: base, suporte, arruela, engrenagem e tampa. Cada conjunto é
desprojetado, gira em seu plano e volta à mesma projeção horizontal (escala Y 0,32).
Assim o giro não coloca os anéis em pé na tela.

As quatro camadas superiores sobem gradualmente em sequência, com deslocamentos
independentes; a base permanece apoiada. A tampa e as laterais do núcleo SVG
isométrico também se elevam separadamente. O ciclo de 14 segundos abre, mantém
as peças suspensas e fecha novamente; os giros têm períodos e sentidos próprios.
A animação usa animateTransform nativo em cada grupo SVG, sem trocar os paths
por imagens ou aplicar uma rotação tridimensional à arte inteira.

O SVG inclui espaço para a vista desmontada. O teste de navegador amostra 0, 3,
7, 11, 14, 22 e 31 segundos, verifica os limites de todas as camadas, a projeção
horizontal e a elevação da tampa. O teste unitário compara os 106 paths com o
arquivo original. Com movimento reduzido, os elementos de animação são removidos
e o mecanismo fica montado e estático. O painel, cards e contador não mudam de layout.

## Validação

- `npm run check`: aprovado.
- O repositório não tem script nem configuração de lint. Prettier dos arquivos
  alterados e `git diff --check`: aprovados.
- `npm test`: o launcher tsx falhou no IPC do ambiente antes dos testes.
  Executadas as mesmas suítes via `node --import tsx --test frontend/tests/*.test.ts backend/tests/*.test.ts`
  (12 testes aprovados) e `node --test desktop/tests/*.test.mjs` (4 aprovados).
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

O fluxo Pages publica pushes na main ou execução manual. A publicação para avaliação
foi autorizada pelo usuário; o deploy é acompanhado até confirmar a versão pública.
