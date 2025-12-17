# Modern POS System

A complete, production-ready Point of Sale (POS) application built with React, TypeScript, and Vite. This enterprise-grade application provides comprehensive retail management including sales processing, inventory tracking, customer relationship management, and advanced analytics.

## ✨ Features

### Core POS Functionality ✅
- Point of Sale checkout system
- Barcode scanning support
- Multiple payment methods (Cash, Card, Mobile, Split)
- Receipt generation and printing
- Transaction history and management

### Inventory Management ✅
- Product catalog with categories
- Stock monitoring and alerts
- Reorder point management
- Supplier management
- Stock adjustment interface
- Inventory history logging

### Customer Management ✅
- Customer profile management
- Purchase history tracking
- Loyalty rewards program
- Customer analytics and insights
- Customer segmentation

### Business Analytics ✅
- Real-time sales dashboard
- Revenue tracking and forecasting
- Product performance analysis
- Customer analytics
- Stock valuation reports
- Data export capabilities

### System Features ✅
- **Authentication & Security**: Role-based access control (Admin, Manager, Cashier)
- **Keyboard Shortcuts**: F1-F8 for quick navigation
- **Toast Notifications**: Real-time user feedback
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Smooth loading indicators
- **Print Functionality**: Receipt and report printing
- **Mobile Responsive**: Works on all devices
- **Performance Optimized**: Code splitting, lazy loading, memoization
- **Data Management**: Backup/restore functionality
- **Theme Support**: Light/dark mode toggle

## 📊 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 19 with TypeScript 5 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router v6 |
| **State Management** | Zustand |
| **UI Components** | Lucide React, custom components |
| **Forms** | React Hook Form |
| **Validation** | Zod |
| **Charts** | Recharts |
| **Tables** | TanStack React Table |
| **Utilities** | date-fns |

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/mzi070/pos-new.git
cd pos-new
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production with optimization
npm run build

# Preview production build locally
npm run preview

# Lint TypeScript and code
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Shared components (ErrorBoundary, Loading, Tooltip, HelpModal)
│   ├── features/         # Feature components (20+ specialized components)
│   ├── layout/           # Layout components (Header, Sidebar, Layout)
│   └── ui/               # UI components (tabs, etc.)
├── pages/                # Page components (9 main pages)
├── stores/               # Zustand stores (9 stores with persistence)
├── hooks/                # Custom hooks (useAuth, useKeyboardShortcuts)
├── context/              # Context providers (ToastContext)
├── services/             # Business logic
├── types/                # TypeScript interfaces
├── utils/                # Utility functions (analytics, backup, print, etc.)
├── constants/            # Application constants
├── App.tsx               # Root app component
└── main.tsx              # Entry point
```

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- System settings
- Data backup/restore

### Manager
- Access to all features except user management
- Product management
- Inventory control
- Customer management
- Transaction history
- Analytics

### Cashier
- POS access
- Dashboard (read-only)
- Limited product viewing
- Transaction history (own transactions)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| F1 | Help & Keyboard Shortcuts |
| F2 | Dashboard |
| F3 | POS System |
| F4 | Products |
| F5 | Inventory |
| F6 | Customers |
| F7 | Transactions |
| F8 | Settings |

## 🎯 Quick Start Guide

### 1. Login
- Default credentials available in Login page hints
- 3 user roles to explore

### 2. Dashboard
- Real-time sales metrics
- Revenue tracking
- Top products
- Customer insights

### 3. POS System (Cashier)
- Scan barcodes or search products
- Add items to cart
- Apply discounts
- Process payment
- Print receipt

### 4. Products (Manager)
- View/add/edit products
- Organize by categories
- Bulk import/export
- Manage pricing

### 5. Inventory (Manager)
- Monitor stock levels
- Set reorder points
- Track supplier information
- View stock history

### 6. Customers (Manager)
- Search customer database
- View purchase history
- Manage loyalty rewards
- Analyze customer behavior

### 7. Transactions
- View transaction history
- Export reports
- Print receipts
- Track payment methods

### 8. Settings
- Store configuration
- Theme settings
- Tax rate configuration
- Data backup/restore

## 📊 Performance Metrics

- **Initial Load**: ~190KB gzipped
- **Main Bundle**: ~206KB (gzipped: 64KB)
- **Code Splitting**: 10+ chunks
- **First Contentful Paint**: < 1.5s
- **Lighthouse Score**: 85+

## 🧪 Testing Features

### Test Users
```
Manager:
- Username: manager@pos.com
- Password: Test@123

Cashier:
- Username: cashier@pos.com
- Password: Test@123

Admin:
- Username: admin@pos.com
- Password: Test@123
```

### Sample Data
- 50+ products across multiple categories
- 20+ customers with purchase history
- Sample transactions and inventory

## 🛠️ Development Guide

### Adding New Features

1. Create component in appropriate `src/components/` folder
2. Create types in `src/types/index.ts`
3. Add store in `src/stores/` if needed
4. Use hooks like `useToastNotification()` for feedback
5. Use `<Tooltip>` for help text
6. Test on mobile using DevTools

### Using Toast Notifications

```tsx
import { useToastNotification } from '@/context/ToastContext';

const toast = useToastNotification();
toast.success('Success!', 'Item saved');
toast.error('Error!', 'Failed to save');
```

### Adding Keyboard Shortcuts

Edit `src/hooks/useKeyboardShortcuts.ts` to add new shortcuts

### Print Functionality

```tsx
import { printReceipt, printReport } from '@/utils/print';
printReceipt(receiptData);
printReport('Title', '<html>content</html>');
```

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly buttons (min 44px)
- Collapsible sidebar on mobile
- Optimized forms
- Mobile-friendly tables

## 🔒 Security Features

- Role-based access control (RBAC)
- Session persistence with localStorage
- Type-safe operations with TypeScript
- Input validation with Zod
- Error handling with boundaries

## 📈 Scalability Features

- Code splitting for faster initial load
- Lazy loading of pages
- Memoization to prevent unnecessary re-renders
- Efficient state management with Zustand
- LocalStorage persistence

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 5174
```

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### State Persistence Issues
- Check DevTools → Application → LocalStorage
- Clear and reload if corrupted

## 📚 Documentation

- [Step-by-Step Implementation Guide](./STEP10_FINALIZATION.md)
- [Component Documentation](./src/components/README.md)
- [Store Documentation](./src/stores/README.md)
- [API Reference](./API_REFERENCE.md)

## 🔗 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT - See LICENSE file for details

## 🎓 Learning Outcomes

This project demonstrates:
- Modern React patterns (Hooks, Context, Suspense)
- State management best practices
- TypeScript type safety
- Component composition and reusability
- Performance optimization techniques
- Responsive design patterns
- Error handling strategies
- Accessibility considerations

## 📞 Support

For issues or questions:
- Open GitHub issue
- Check existing documentation
- Review example code in components

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: 2024

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
