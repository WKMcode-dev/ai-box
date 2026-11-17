# Cibersegurança — catálogo ampliado Kali, Ubuntu e complementares

Revisão: 17/11/2026. O catálogo foi ampliado a partir do [índice oficial de todas as ferramentas do Kali Linux](https://www.kali.org/tools/all-tools/) e da [documentação dos metapacotes Kali](https://www.kali.org/docs/general-use/metapackages/). Foram incluídas também ferramentas complementares populares no ecossistema Ubuntu/Linux, com seus projetos upstream.

## Escopo e interpretação

- **Kali**: o pacote/projeto aparece no índice oficial de ferramentas do Kali consultado nesta revisão.
- **Complementar**: ferramenta relevante de segurança, defesa, cloud ou desenvolvimento seguro que não está sendo apresentada como pacote Kali nesta curadoria.
- **Ubuntu/Linux**: as ferramentas Linux podem ser instaladas em Ubuntu quando o projeto e suas dependências oferecem suporte; a disponibilidade de pacote varia por versão e repositório.
- A lista representa ferramentas de segurança e utilitários relevantes, não todos os pacotes de sistema, bibliotecas, dependências, comandos genéricos, metapacotes ou todos os executáveis listados no índice Kali. O índice é dinâmico e precisa de revisão periódica.
- Muitas ferramentas exigem Linux nativo, privilégios administrativos, drivers específicos, GPU, adaptador Wi-Fi em modo monitor, Bluetooth, SDR, RFID ou hardware dedicado. WSL 2 não substitui esses requisitos nem dá acesso irrestrito a todos os dispositivos.
- Ferramentas de uso dual devem ser utilizadas apenas em ativos próprios, laboratórios ou avaliações com autorização explícita. Algumas entradas são legadas/históricas e estão identificadas na descrição/nota.

## Organização

1. **Reconhecimento e OSINT**
2. **Enumeração de redes e serviços**
3. **Análise de vulnerabilidades**
4. **Segurança de aplicações web**
5. **Captura, análise e manipulação de tráfego**
6. **Auditoria de senhas e autenticação**
7. **Engenharia reversa e análise de binários**
8. **Análise de malware e resposta a incidentes**
9. **Forense digital e recuperação**
10. **Active Directory e ambientes Windows**
11. **Wireless, Bluetooth e RFID**
12. **Hardware, SDR e IoT**
13. **Fuzzing e teste de protocolos**
14. **Criptografia e esteganografia**
15. **Cloud, containers e Kubernetes**
16. **Monitoramento, defesa e hardening**
17. **VoIP e telecomunicações**
18. **Relatórios e gestão de pentest**

## Proveniência

O campo `sourceDistro` distingue Kali e projetos complementares. As ferramentas Kali apontam para o índice/página de pacote oficial; complementares apontam para o projeto upstream. A presença no catálogo não significa que cada ferramenta foi instalada e executada em todos os sistemas, nem que toda versão do Ubuntu oferece pacote pronto.
