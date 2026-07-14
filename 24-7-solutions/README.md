# 24-7 Solutions

Plnohodnotná webová aplikace společnosti 24-7 Solutions. Klientská část představuje nabídku služeb a serverová část poskytuje rozhraní API.

## Architektura

- **Klient:** React 19, React Router, Vite 8 a Tailwind CSS 4.
- **Server:** Node.js, Express 5, CORS a dotenv.

Projekt je rozdělen do následujících adresářů:

```text
24-7-solutions/
├── client/   # Klientská aplikace React
└── server/   # Serverové rozhraní API
```

## Požadavky

Pro lokální vývoj je nutné mít nainstalované prostředí Node.js a správce balíčků npm.

## Instalace

Z kořenového adresáře `24-7-solutions` nainstalujte závislosti všech částí projektu:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## Spuštění ve vývojovém režimu

```bash
npm run dev
```

Příkaz souběžně spustí:

- klientskou aplikaci na adrese `http://localhost:5173` nebo na nejbližším volném portu;
- serverové API na adrese `http://localhost:5000`.

Jednotlivé části lze spustit také samostatně:

| Příkaz | Popis |
| --- | --- |
| `npm run dev:client` | Spustí pouze klientskou aplikaci. |
| `npm run dev:server` | Spustí pouze serverové API s automatickým restartem. |
| `npm run build` | Vytvoří produkční sestavení klientské aplikace. |

## Rozhraní API

| Metoda | Cesta | Popis |
| --- | --- | --- |
| `GET` | `/` | Vrátí základní informaci o serveru. |
| `GET` | `/api/health` | Ověří dostupnost serveru a vrátí čas odpovědi. |
| `GET` | `/api/example` | Ukázkový koncový bod určený pro budoucí moduly. |

Port serveru lze změnit pomocí proměnné prostředí `PORT`. Pokud není nastavena, použije se port `5000`.

## Produkční sestavení

```bash
npm run build
```

Výsledné statické soubory klientské aplikace se vytvoří v adresáři `client/dist`. Produkční server lze v adresáři `server` spustit příkazem `npm start`.

## Kontrola kvality kódu

Klientskou část lze zkontrolovat pomocí ESLintu:

```bash
npm run lint --prefix client
```
