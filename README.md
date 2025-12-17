# Modern POS System

A modern Point of Sale (POS) application built with React, TypeScript, and Vite. This application provides a complete solution for retail businesses to manage sales, inventory, products, and customers.

## Features

- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Fast build with Vite
- ✅ Type-safe with TypeScript
- ✅ Client-side routing with React Router
- ✅ State management with Zustand
- ✅ Icon library with Lucide React
- ✅ Form handling with React Hook Form
- ✅ Data validation with Zod
- ✅ Responsive design for mobile and desktop

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v6
- **State Management**: Zustand
- **UI Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Data Validation**: Zod
- **Date Utils**: date-fns

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn

### Setup

1. **Install dependencies**

```bash
npm install
# or
npm install --legacy-peer-deps  # If you encounter peer dependency issues
```

2. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (ESLint)
npm run lint
```

## Project Structure

The project is organized with a clean, scalable architecture:

- **src/components/** - Reusable React components (common, layout, features)
- **src/pages/** - Page-level components (Dashboard, POS, Products, etc.)
- **src/services/** - Business logic and API integration
- **src/stores/** - Zustand state management stores
- **src/types/** - TypeScript type definitions and interfaces
- **src/utils/** - Utility functions and helpers
- **src/hooks/** - Custom React hooks
- **src/constants/** - Application constants

See README.md for detailed folder structure explanation.

## Getting Started

1. Explore the types in `src/types/index.ts`
2. Check the layout in `src/components/layout/`
3. Review page components in `src/pages/`
4. Customize colors in `tailwind.config.js`

## License

MIT

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
