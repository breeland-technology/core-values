# core-values

An open-source web tool for clarifying and reflecting on personal values, inspired by Acceptance and Commitment Therapy (ACT).

## Status: v0 / experimental

This project is in early development. Expect rough edges and breaking changes.

## How to run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

- **Production build:** `npm run build`
- **Start production server:** `npm start`

## Tech

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop (group step)
- **localStorage** for persistence (no backend or accounts in v1)

## Flow

1. **Select** — Swipe or click Yes/No on value cards; add custom values.
2. **Group** — Drag selected cards into piles and name each pile.
3. **Prioritize** — Choose your top 3–5 piles.
4. **Result** — View summary, export JSON, or copy text.

Back and Reset are available on each step without losing state (except Reset, which clears and returns to the start).
