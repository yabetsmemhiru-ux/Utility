# Utility Management System (Frontend)

## Run locally

```bash
npm install
npm run dev
```

## Mock mode (no backend yet)

- Copy `.env.example` to `.env.local`
- Keep `VITE_USE_MOCKS=true`
- Sign in with:
  - Email: `demo@utility.app`
  - Password: `Demo@12345`

## Power BI embed

Set these values in `.env.local` (or paste them on the Analytics page):

- `VITE_PBI_EMBED_URL`
- `VITE_PBI_REPORT_ID`
- `VITE_PBI_ACCESS_TOKEN`

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
