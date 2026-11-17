# Cibersegurança — seleção Windows e WSL

Revisão: 17/11/2026. Esta seleção foi construída a partir do [índice oficial de todas as ferramentas do Kali Linux](https://www.kali.org/tools/all-tools/) e da documentação dos [metapacotes Kali](https://www.kali.org/docs/general-use/metapackages/). O Kali reúne centenas de pacotes; este catálogo é uma curadoria de ferramentas com caminho de uso no Windows ou no WSL, não uma cópia integral do sistema.

## Como interpretar a compatibilidade

- **Windows:** instalador, binário ou suporte oficial para Windows. Não exige Linux.
- **WSL 2:** requer WSL 2 e uma distribuição Linux instalada (Ubuntu, Debian ou Kali). A ferramenta não roda como executável nativo do Windows.
- WSL 2 ainda não está instalado neste computador segundo a última verificação compartilhada. Portanto, as ferramentas marcadas WSL só ficarão disponíveis depois de instalar e configurar o subsistema.

## Ferramentas adicionadas

| Ferramenta | Uso principal | Compatibilidade | Observações |
| --- | --- | --- | --- |
| mitmproxy | Proxy para inspecionar tráfego HTTP/HTTPS | Windows | Open source; certificado de interceptação precisa ser configurado no ambiente de teste |
| Wireshark | Captura e análise de protocolos | Windows | Captura ao vivo usa Npcap |
| Ghidra | Desmontagem e descompilação de binários | Windows | Requer JDK 25 de 64 bits na versão atual |
| x64dbg | Depuração e engenharia reversa | Windows | x32dbg para 32 bits e x64dbg para 64 bits |
| FakeNet-NG | Simulação de serviços de rede para análise dinâmica | Windows | Modo SingleHost; executar em VM/laboratório isolado |
| tcpdump | Captura de pacotes via libpcap | WSL 2 | Não substitui captura nativa do Windows via Npcap |
| Burp Suite | Proxy e testes de segurança web | Windows | Community Edition gratuita; Professional paga |
| Nmap | Descoberta de hosts, portas e serviços | Windows | Instalador oficial inclui Ncat e Zenmap |
| OWASP ZAP | Proxy e scanner de segurança web | Windows | Requer Java 17 ou superior |
| sqlmap | Testes de injeção SQL | Windows / WSL | Requer Python 3 |
| ffuf | Fuzzing de caminhos e parâmetros HTTP | Windows | Binários Windows nas releases oficiais |
| Gobuster | Descoberta de diretórios, subdomínios e hosts | WSL 2 | Caminho recomendado via distribuição Linux |
| Hashcat | Auditoria de hashes com CPU/GPU | Windows | Drivers e runtimes de GPU influenciam o desempenho |
| John the Ripper | Auditoria e recuperação de senhas | Windows / WSL | Edição Community Jumbo |
| Autopsy | Forense digital e análise de imagens de disco | Windows | Instalador MSI 64-bit |
| JADX | Descompilação de APK/DEX | Windows | Requer Java compatível |
| Apktool | Inspeção e reconstrução de recursos APK | Windows | Requer Java |
| YARA | Identificação de padrões por regras | Windows | Binários Windows disponíveis |
| ExifTool | Leitura e edição de metadados | Windows | Prefira cópias ao alterar metadados |
| TestDisk & PhotoRec | Recuperação de partições e arquivos | Windows | Evite gravar no disco de origem |
| Impacket | Bibliotecas e utilitários de protocolos SMB/MSRPC | WSL 2 | Projeto Python; WSL facilita dependências |
| enum4linux-ng | Enumeração SMB/Samba | WSL 2 | Requer Python, Impacket e utilitários Samba |
| Nikto | Verificação de configuração de servidores web | WSL 2 | Requer Perl; gera requisições ativas |
| WhatWeb | Identificação de tecnologias web | WSL 2 | Requer Ruby |
| WAFW00F | Identificação de firewalls de aplicações web | WSL 2 | Requer Python |

## Por que algumas ferramentas Kali ficaram de fora

A lista oficial também inclui ferramentas para Wi-Fi em modo monitor/injeção, Bluetooth, RFID, SDR, hardware especializado e funções que dependem de drivers ou interfaces físicas Linux. Não foram adicionadas nesta rodada porque o WSL não oferece acesso direto e universal a essas capacidades. O encaminhamento USB via usbipd-win existe, mas exige configuração adicional e não garante suporte a todos os adaptadores ou modos de operação.

A captura de tráfego também merece distinção: tcpdump dentro do WSL observa as interfaces visíveis para o ambiente Linux; para capturar diretamente nas interfaces do Windows, a opção recomendada é o Wireshark com Npcap.

## Uso responsável

Scanners, proxies e ferramentas de auditoria podem gerar tráfego ativo, alterar configurações locais ou acessar dados sensíveis. Use somente em equipamentos, redes, aplicações e arquivos próprios ou com autorização explícita. FakeNet-NG deve ser usado em laboratório isolado/VM; ferramentas de recuperação forense devem operar sobre cópias sempre que possível.

## Fontes oficiais de referência

- [Kali — All Tools](https://www.kali.org/tools/all-tools/)
- [Kali — Metapackages](https://www.kali.org/docs/general-use/metapackages/)
- [Kali — WSL](https://www.kali.org/docs/wsl/wsl-preparations/)
- [Microsoft — Conectar dispositivos USB ao WSL](https://learn.microsoft.com/pt-br/windows/wsl/connect-usb)
- [mitmproxy — instalação Windows e WSL](https://docs.mitmproxy.org/stable/overview/installation/)
- [Wireshark — instalação Windows](https://www.wireshark.org/docs/wsug_html_chunked/ChBuildInstallWinInstall.html)
- [Ghidra — requisitos](https://github.com/NationalSecurityAgency/ghidra/blob/master/GhidraDocs/GettingStarted.md)
- [FakeNet-NG — documentação](https://github.com/mandiant/flare-fakenet-ng)
- [Burp Suite — download e instalação](https://portswigger.net/burp/documentation/desktop/getting-started/download-and-install)
- [Nmap — download Windows](https://nmap.org/download.html)
- [OWASP ZAP — download Windows](https://www.zaproxy.org/download/)
- [YARA — suporte Windows](https://yara.readthedocs.io/en/latest/gettingstarted.html)
- [Autopsy — download Windows](https://www.autopsy.com/download/)
- [TestDisk — binários Windows](https://www.cgsecurity.org/wiki/TestDisk_Download)
