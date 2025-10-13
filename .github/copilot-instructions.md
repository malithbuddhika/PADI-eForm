# Copilot Instructions for padi-eform

## Project Overview
- **Framework:** React 19 + Vite
- **CSS:** TailwindCSS 4.x (custom runner via `tailwind-run.js`)
- **Linting:** ESLint (custom config in `eslint.config.js`)
- **Entry Point:** `src/main.jsx` renders `App.jsx`
- **Assets:** SVGs in `src/assets/` and `public/`

## Architecture & Patterns
- All React code is in `src/`, with `App.jsx` as the main component.
- CSS is split between `App.css` and `index.css`.
- SVG assets are imported directly into components.
- No global state management; local state via React hooks.
- No TypeScript or backend integration by default.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (uses Vite)
- **Build for Production:** `npm run build`
- **Preview Build:** `npm run preview`
- **Lint:** `npm run lint` (uses custom ESLint config)
- **TailwindCSS:**
  - Init config: `npm run tw:init`
  - Check version: `npm run tw:version`
  - Build CSS: `npm run build:css` (watches `src/input.css`, outputs to `dist/output.css`)

## Conventions & Custom Rules
- ESLint ignores `dist/` and enforces no unused vars unless prefixed with uppercase or underscore.
- React hooks and Fast Refresh linting are enabled.
- Use ESM imports everywhere.
- All source files should be in `src/`.
- For new assets, place SVGs in `src/assets/`.

## Integration Points
- TailwindCSS is run via a custom Node script (`tailwind-run.js`), not directly via CLI.
- Vite plugins for React are configured in `vite.config.js`.
- No API or external service integration by default.

## Examples
- Import SVG: `import logo from './assets/react.svg'`
- Use Tailwind utility classes in JSX: `<div className="bg-blue-500">...`

## How to Enable Features
- To enable TypeScript, see Vite's [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).
- To enable React Compiler, follow [React docs](https://react.dev/learn/react-compiler/installation).

---
**Enable: "Enable GPT-5 mini for all clients"**

> All AI agents should use GPT-5 mini for code suggestions and completions in this repository.

---

_If any section is unclear or missing, please provide feedback for improvement._
