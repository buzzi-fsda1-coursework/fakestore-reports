# Fake Store Reports

Due report JSON sui dati di [Fake Store API](https://fakestoreapi.com/):

- **top-products**: i 3 prodotti più venduti per unità;
- **top-customers**: i 3 clienti con la spesa totale più alta.
- **due classifiche**: all time e ultimo mese.

Progetto TypeScript + Vite, senza dipendenze.

## Installazione

Serve Node.js (una versione LTS recente) con npm.

```bash
npm install

npm run dev
```

Apri l'indirizzo mostrato nel terminale (di solito `http://localhost:5173`). Il programma gira nel browser: all'apertura della pagina scarica i dati dall'API e stampa i due report in JSON **nella console dei DevTools** (F12 → Console). Gli stessi JSON compaiono anche nella pagina.

In alternativa, la versione compilata:

```bash
npm run build
npm run preview
```

## Periodo «ultimo mese»

L'ultimo mese va da un mese di calendario prima dell'ordine più recente presente nei dati fino al giorno di quell'ordine, estremi inclusi, con date confrontate in UTC: con i dati attuali, dal 2020-02-02 al 2020-03-02. Il periodo è ancorato ai dati e non alla data di esecuzione, perché i carrelli risalgono al 2020. Se il giorno di partenza non esiste nel mese precedente, si usa l'ultimo giorno di quel mese (31 marzo → 29 febbraio).

## Classifiche e tie-break

Un tiebreak non è esplicitamente specificato, quindi le regole scelte sono:

- **prodotti**: unità vendute ↓, poi fatturato ↓, poi id prodotto ↑
- **clienti**: spesa totale ↓, poi pezzi acquistati ↓, poi id utente ↑

L'id come ultimo criterio rende la classifica deterministica. I criteri sono dichiarati anche nel JSON, nel campo `rankedBy`. Ogni classifica contiene *fino a* tre elementi: se nel periodo ci sono meno prodotti o clienti, la lista è più corta.

Importi arrotondati a due decimali; la spesa dei clienti viene arrotondata una sola volta, dopo la somma.

## Dati mancanti

Si scarta quello che non si può prezzare, si tiene quello che non si può nominare: le righe di carrello con un prodotto assente dal catalogo vengono escluse da entrambi i report (il carrello conta comunque come ordine), mentre un utente assente dall'anagrafica resta in classifica con `username`, `fullName` ed `email` a `null`. Gli id mancanti vengono segnalati una volta in console con un warning.

Senza carrelli il programma produce report validi con classifiche vuote e ancoraggio `null`. Se una richiesta all'API fallisce, l'errore viene mostrato in console e nella pagina.

## Forma del JSON

```json
{
  "report": "top-products",
  "generatedAt": "2026-11-09T09:00:00.000Z",
  "rankedBy": ["unitsSold desc", "revenue desc", "productId asc"],
  "lastMonthAnchor": "2020-03-02T00:00:00.000Z",
  "periods": {
    "allTime": { "interval": null, "ranking": [] },
    "lastMonth": {
      "interval": { "start": "2020-02-02", "end": "2020-03-02" },
      "ranking": []
    }
  }
}
```

`interval` è `null` per l'all time (il periodo non ha limiti). Ogni elemento di `ranking` contiene:

- **prodotti**: `rank`, `productId`, `title`, `category`, `unitPrice`, `unitsSold`, `revenue`
- **clienti**: `rank`, `userId`, `username`, `fullName`, `email`, `orders`, `items`, `totalSpent`

## Struttura

```
src/
  main.ts             avvio, warning, stampa dei report
  api.ts              chiamate all'API
  types.ts            tipi di prodotti, carrelli, utenti
  period.ts           ancoraggio e calcolo dell'ultimo mese
  context.ts          dati comuni ai due report
  integrity.ts        id presenti nei carrelli ma assenti da catalogo/anagrafica
  report.ts           forma comune dei report
  productsReport.ts   classifica prodotti
  customersReport.ts  classifica clienti
  utils.ts            arrotondamento
```

## Limiti noti

Le risposte dell'API non vengono validate a runtime: i tipi TypeScript descrivono la forma attesa ma non la verificano. Una data di carrello non valida, per esempio, interromperebbe il programma.
