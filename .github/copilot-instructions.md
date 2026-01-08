# AI Coding Instructions for ai-vite-react-ts

## Project Overview
**Tech Stack:** React 19.2 + TypeScript + Vite + Material-UI (MUI)  
**Type:** Single-page application with component-based architecture  
**Key Features:** Fast Refresh (HMR), Type-safe React development, Storybook integration, Jest testing

## Architecture & Structure

### Directory Layout
```
src/
├── App.tsx          # Root application component
├── main.tsx         # React DOM entry point (createRoot)
├── index.css        # Global styles
├── App.css          # App component styles
└── assets/          # Static images and SVG imports
```

### Component Architecture
- **Root Entry:** `src/main.tsx` creates React root and renders `<App>` with `StrictMode`
- **App Component:** Located in `src/App.tsx`, manages state with React hooks
- **Styling:** CSS modules + inline styles (emotion/styled available via MUI)
- **Pattern Example:** [src/App.tsx](src/App.tsx#L1-L10) uses `useState` for simple state management

## Critical Developer Workflows

### Build & Development
- **Dev Mode:** `npm run dev` → Starts Vite dev server with Fast Refresh HMR
- **Production Build:** `npm run build` → Runs `tsc -b` (type check) then Vite build
- **Linting:** `npm run lint` → ESLint with flat config (eslint.config.js)
- **Preview:** `npm run preview` → Local preview of production build

### Testing & Storybook
- **Jest Testing:** `npm run test` (watch with `test:watch`)
- **Coverage:** `npm run test:coverage` → Coverage reports
- **Storybook:** `npm run storybook` → Component dev at port 6006

### Type Checking
TypeScript configuration uses project references:
- `tsconfig.app.json` → Application code
- `tsconfig.node.json` → Build/config code
- **IDE Warning:** Build always runs `tsc -b` before bundling; fix type errors first

## Code Patterns & Conventions

### React Patterns
1. **Functional Components:** All components are modern functional components with hooks
2. **State Management:** Use React's `useState` for simple state (see [App.tsx](src/App.tsx#L6))
3. **Hooks:** `useState`, `useEffect` are available; no Redux/Context setup yet
4. **Fast Refresh:** HMR works for JSX/CSS changes; avoid exporting constants from component files that update

### TypeScript Usage
- **Strict Mode:** Component type annotations required; use React.FC for typed components
- **Asset Imports:** Static assets imported as modules (e.g., `import viteLogo from '/vite.svg'`)
- **tsconfig.app.json:** Points to `src/` for all app code

### Styling Approach
- **CSS Files:** Standard CSS imported directly (e.g., `import './App.css'`)
- **MUI Available:** `@emotion/react`, `@emotion/styled`, `@mui/material` installed
- **CSS Modules:** Not configured; use className strings or MUI sx prop if using Material components

### ESLint Configuration
- **Scope:** [eslint.config.js](eslint.config.js) uses flat config format
- **Rules Active:** 
  - `@eslint/js` recommended
  - TypeScript ESLint recommended (not strict/stylistic)
  - React Hooks rules (`eslint-plugin-react-hooks`)
  - React Refresh rules (`eslint-plugin-react-refresh`)
- **Suggestion:** Production upgrades can enable `recommendedTypeChecked` or `strictTypeChecked`

## Integration Points & External Dependencies

### Core Dependencies
- **react/react-dom (19.2.0):** Main framework, uses modern APIs
- **@vitejs/plugin-react:** Babel-based Fast Refresh (SWC available as alternative)
- **@mui/material, @emotion/*:** Pre-installed for component UI (optional to use)

### Dev Tools
- **Storybook (v10.1.9):** Component documentation; vitest integration available
- **Testing Library:** React Testing Library + Jest for unit tests
- **Vite:** Build tool with fast dev server; no webpack config

### Git Integration
- **github-mcp-server:** Script available (`npm run git-server`) for AI integration with GitHub

## AI Agent Guidance

### Before Making Changes
1. Run `npm run build` to catch TypeScript errors early
2. Verify `npm run lint` passes before submitting code
3. Check that Hot Module Reload works for the component you modified

### Common Tasks

**Adding a New Component:**
```typescript
// src/components/MyComponent.tsx
import './MyComponent.css'

export function MyComponent() {
  return <div>Component content</div>
}
```
- Place in `src/` or create `src/components/` subdirectory
- Always export named functions (no default exports for better tree-shaking)
- Add corresponding `.css` file for local styles

**Using MUI Components:**
- Import from `@mui/material` (e.g., `import Button from '@mui/material/Button'`)
- Use `sx` prop for dynamic styling via Emotion
- Icons available from `@mui/icons-material`

**Running Tests:**
- Tests should be co-located or in `__tests__/` directories
- Use Testing Library queries (`getByRole`, `getByText`, etc.)
- Run `npm run test:watch` during development

### File Naming Conventions
- Components: PascalCase (e.g., `MyComponent.tsx`)
- Utilities/hooks: camelCase (e.g., `useCustomHook.ts`)
- Styles: Match component name (e.g., `MyComponent.css`)

## Troubleshooting Commands
- **Clear cache & reinstall:** `rm -r node_modules && npm install`
- **Type check only:** `tsc --noEmit`
- **Lint fix:** `npm run lint -- --fix`
- **Full build test:** `npm run build && npm run preview`
