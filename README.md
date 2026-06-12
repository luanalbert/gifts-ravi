# Cantinho do Ravi 💛

Site de lista de presentes do bebê Ravi — clean, premium e com Pix integrado.

## Quickstart

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## Configuração do Pix

Edite o arquivo `/src/lib/pix-config.ts` com seus dados reais:

```ts
export const PIX_CONFIG = {
  key: "seu-email@exemplo.com",  // sua chave Pix
  receiverName: "Cantinho do Ravi",  // máx 25 chars
  city: "Fortaleza",  // máx 15 chars
};
```

---

## Gerenciando os Presentes

### Fluxo de atualização

1. Edite o arquivo `data/presentes.xlsx` (ou `presentes.csv`)
2. Execute o script de sincronização:

```bash
npm run sync-gifts
```

3. Isso gera automaticamente `/public/data/gifts.json`

### Colunas do Excel

| Coluna | Tipo | Exemplo |
|---|---|---|
| id | number | 1 |
| nome | string | Banheira |
| valor_sugerido | number | 180 |
| categoria | string | banho |
| prioridade | boolean | true |
| imagem | string | banheira.webp |
| descricao | string | Hora do banho do Ravi |

### Categorias válidas
- `quartinho`
- `banho`
- `alimentacao`
- `roupinhas`
- `mimos`
- `outros`

### Imagens
Coloque as imagens em `/public/images/` no formato `.webp` (preferido) ou `.jpg`.

---

## Deploy na Vercel

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

Ou conecte o repositório GitHub diretamente na dashboard da Vercel.

---

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Zustand** (estado global)
- **Framer Motion** (animações)
- **qrcode** (geração do QR Code Pix)
- **xlsx** (leitura do Excel no script)

---

## Estrutura

```
src/
  app/
    page.tsx          # Página principal
    layout.tsx        # Layout raiz
    globals.css       # Estilos globais
  components/
    hero/             # Seção hero
    gifts/            # Cards e grid de presentes
    filters/          # Filtros de categoria
    modal/            # Modal de contribuição + Pix
    ui/               # QRCode, Footer
  store/
    gift-store.ts     # Estado global (Zustand)
  types/
    gift.ts           # Tipos TypeScript
  lib/
    pix.ts            # Gerador de payload Pix (EMV)
    pix-config.ts     # Configuração da chave Pix ← EDITE AQUI
    utils.ts          # Utilitários

scripts/
  sync-gifts.ts       # Excel → JSON

public/
  images/             # Imagens dos presentes
  data/
    gifts.json        # Dados gerados pelo script

data/
  presentes.xlsx      # Planilha de presentes ← EDITE AQUI
```
