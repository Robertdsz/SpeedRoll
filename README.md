# ⚡ SpeedRoll — Controle de Velocidade para Crunchyroll

Extensão para Google Chrome que adiciona controle de velocidade estendido ao player da Crunchyroll, permitindo assistir animes em velocidades além do padrão oferecido pela plataforma.

---

## 🎯 Motivação

A Crunchyroll oferece apenas as opções 0.5x, 0.75x e 1x de velocidade. Para quem quer maratonar séries longas como One Piece, isso é limitante. Essa extensão resolve esse problema adicionando velocidades de até 2x diretamente no player.

---

## ✨ Funcionalidades

- Velocidades disponíveis: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x e 2x
- Painel visual flutuante com botão ativo destacado
- Velocidade mantida ao pular partes do episódio
- Painel aparece apenas nas páginas de episódio
- Botão para minimizar o painel
- Compatível com navegação entre episódios sem precisar recarregar a página

---

## 🚀 Como instalar

1. Baixe ou clone este repositório
   ```bash
   git clone https://github.com/seu-usuario/crunchyspeed.git
   ```

2. Acesse `chrome://extensions` no Google Chrome

3. Ative o **Modo do desenvolvedor** no canto superior direito

4. Clique em **"Carregar sem compactação"** e selecione a pasta do projeto

5. Acesse a Crunchyroll e abra qualquer episódio — o painel aparecerá automaticamente

---

## 🖥️ Como usar

- O painel aparece no canto inferior direito da tela durante a reprodução de episódios
- Clique no botão da velocidade desejada
- Clique em **—** para minimizar o painel e em **+** para expandir

---

## 🛠️ Tecnologias

- JavaScript (Vanilla)
- CSS3
- Chrome Extensions API (Manifest V3)
- HTML5 Video API (`playbackRate`)

---

## 📁 Estrutura do projeto

```
crunchyspeed/
├── manifest.json   # Configuração da extensão
├── content.js      # Lógica principal injetada na página
├── style.css       # Estilo do painel flutuante
└── icon.png        # Ícone da extensão
```

---

## 📌 Observações

- A extensão funciona apenas em páginas de episódio (`/watch/`)
- Compatível com a navegação SPA da Crunchyroll
- Não requer permissões sensíveis — acessa apenas o domínio `crunchyroll.com`

---

## 📄 Licença

MIT License — sinta-se livre para usar, modificar e distribuir.