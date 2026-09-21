# CLAUDE.md

Guidelines for developing and extending the College Feedback Analysis Platform.

## Build and Dev Commands
- `npm run dev`: Launch the Vite development server on `http://localhost:5173`.
- `npm run build`: Compile and build optimized production assets in `dist/`.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint checks.

## Project Structure
- `base44/`: Backend entity definitions (`Feedback.jsonc`, `User.jsonc`, `config.jsonc`).
- `src/api/`: Base44 API client and fallback local storage service.
- `src/components/`: High-level feature components (Dashboard, Form, Hero, Terminal, etc.).
- `src/components/ui/`: Radix-based UI primitive components (Buttons, Inputs, Dialogs, Cards, etc.).
- `src/lib/`: Context providers, utilities, category definitions, and react-query client.
- `src/pages/`: Main application pages and auth flows.
