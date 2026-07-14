# Klientská aplikace 24-7 Solutions

Klientská část prezentačního webu společnosti 24-7 Solutions. Aplikace představuje nabízené služby, cenové plány, postup spolupráce a realizované projekty.

## Použité technologie

- React 19;
- React Router 7;
- Vite 8;
- Tailwind CSS 4;
- ESLint.

## Instalace a spuštění

V adresáři `client` spusťte:

```bash
npm install
npm run dev
```

Vývojový server standardně používá adresu `http://localhost:5173`. Požadavky směřující na `/api` jsou ve vývojovém režimu předávány serveru na adrese `http://localhost:5000`.

## Dostupné příkazy

| Příkaz | Popis |
| --- | --- |
| `npm run dev` | Spustí vývojový server s automatickou aktualizací stránky. |
| `npm run build` | Vytvoří produkční sestavení v adresáři `dist`. |
| `npm run lint` | Zkontroluje zdrojový kód pomocí ESLintu. |
| `npm run preview` | Spustí místní náhled produkčního sestavení. |

## Struktura zdrojového kódu

```text
src/
├── components/   # Sdílené prvky rozhraní
├── pages/        # Jednotlivé stránky aplikace
├── App.jsx       # Definice směrování
├── index.css     # Globální styly a konfigurace Tailwind CSS
└── main.jsx      # Vstupní bod aplikace
```

## Produkční sestavení

```bash
npm run build
npm run preview
```

Před odevzdáním změn se doporučuje spustit také příkaz `npm run lint`.
