# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Stack for App
1️⃣ Frontend

React + Tailwind CSS

Handles the form UI, mobile-friendly design, and PWA features.

Tailwind makes responsive layouts simple for both PC and smartphones.

2️⃣ Backend

Node.js + Express.js

Handles API requests from the frontend.

Can do form validation, authentication, email notifications, or other business logic.

Example API endpoints:

POST /api/forms → save a new dive form
GET /api/forms → list submitted forms for dive center

3️⃣ Database

MySQL

Stores all diver information, signatures (as base64 or file links), dive dates, etc.

Good for structured data and reporting (e.g., list of dives, dive centers, etc.)