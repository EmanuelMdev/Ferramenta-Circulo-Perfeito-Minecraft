# Círculos no Minecraft

Ferramenta web para planejar círculos em Minecraft. Você escolhe o diâmetro (ou o raio) e ela mostra:

- o **raio** e o **total de blocos** (com a conta em packs de 64);
- o **molde em escala 1 por 1**, com linhas e colunas numeradas e o centro marcado;
- o **passo a passo linha por linha**: quantos blocos colocar e quantos espaços pular;
- uma **tabela de tamanhos** do diâmetro 1 ao 100, com raio e total de blocos.

Funciona com círculo só na borda (espessura ajustável) ou preenchido, e muda sozinho entre tema claro e escuro.

## Como usar

A ferramenta pode abrir como um mini aplicativo, numa janela sem barra de endereço nem abas.

**Clicando:** Dê dois cliques no `Minecircle.bat`.
**Diretamente no navegador:** Abra o arquivo diretamente em seu navegador pessoal.

### Aviso do Windows ao abrir

Se o Windows (SmartScreen) avisar que o arquivo é desconhecido, é porque ele veio da internet e não tem assinatura digital. Para tirar o aviso, clique com o botão direito no `.zip` baixado, vá em **Propriedades**, marque **Desbloquear** e só então extraia. Se já extraiu, rode na pasta: `Get-ChildItem -Recurse | Unblock-File`.

## Como o círculo é calculado

Cada bloco vira um quadrado de 1 por 1. Ele entra no círculo se o centro dele estiver a uma distância do centro do círculo menor ou igual ao raio (diâmetro ÷ 2). No modo "só a borda", a ferramenta tira os blocos que cabem num círculo menor, de raio igual ao raio original menos a espessura.

## Aviso

Projeto de fã. Não é um produto oficial do Minecraft e não é aprovado nem associado à Mojang ou à Microsoft.
