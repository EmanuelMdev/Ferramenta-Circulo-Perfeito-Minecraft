# Círculos no Minecraft

Ferramenta web para planejar círculos em Minecraft. Você escolhe o diâmetro (ou o raio) e ela mostra:

- o **raio** e o **total de blocos** (com a conta em packs de 64);
- o **molde em escala 1 por 1**, com linhas e colunas numeradas e o centro marcado;
- o **passo a passo linha por linha**: quantos blocos colocar e quantos espaços pular;
- uma **tabela de tamanhos** do diâmetro 1 ao 100, com raio e total de blocos.

Funciona com círculo só na borda (espessura ajustável) ou preenchido, e muda sozinho entre tema claro e escuro.

## Como usar

Não precisa instalar nada. Abra o `index.html` no navegador.

## Abrir numa janela própria (Windows)

A ferramenta pode abrir como um mini aplicativo, numa janela sem barra de endereço nem abas. Funciona com o Edge (já vem no Windows) ou com o Chrome.

**Clicando:** dê dois cliques no `abrir.bat`.

**Pelo PowerShell**, dentro da pasta do projeto:

```powershell
.\abrir.ps1
```

**Atalho na Área de Trabalho** (rode uma vez e depois é só clicar no atalho):

```powershell
.\abrir.ps1 -CriarAtalho
```

**Direto da versão publicada no GitHub Pages**, de qualquer pasta, sem baixar nada:

```powershell
Start-Process msedge "--app=https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/ --window-size=1100,820"
```

Se preferir o Chrome, troque `msedge` por `chrome`. Para abrir o script com outro endereço ou outro tamanho: `.\abrir.ps1 -Url "https://..." -Largura 1000 -Altura 700`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos.
2. Vá em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)`.
4. Salve. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Estrutura

```
index.html   página e estrutura
style.css    estilos (tema claro e escuro)
script.js    geração do círculo, molde em canvas, passo a passo e tabela
abrir.ps1    abre a ferramenta numa janela própria (PowerShell)
abrir.bat    o mesmo, com dois cliques
```

## Como o círculo é calculado

Cada bloco vira um quadrado de 1 por 1. Ele entra no círculo se o centro dele estiver a uma distância do centro do círculo menor ou igual ao raio (diâmetro ÷ 2). No modo "só a borda", a ferramenta tira os blocos que cabem num círculo menor, de raio igual ao raio original menos a espessura.

## Aviso

Projeto de fã. Não é um produto oficial do Minecraft e não é aprovado nem associado à Mojang ou à Microsoft.
