import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastNotification } from '@/context/ToastContext';

interface KeyboardShortcut {
  key: string;
  label: string;
  description: string;
  handler: () => void;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const toast = useToastNotification();

  const shortcuts: Record<string, KeyboardShortcut> = {
    f1: {
      key: 'F1',
      label: 'Help',
      description: 'Show keyboard shortcuts',
      handler: () => {
        toast.info('Keyboard Shortcuts', 'Use F1-F8 to navigate quickly between sections');
      },
    },
    f2: {
      key: 'F2',
      label: 'Dashboard',
      description: 'Go to Dashboard',
      handler: () => {
        navigate('/dashboard');
        toast.info('Dashboard', 'Navigated to Dashboard');
      },
    },
    f3: {
      key: 'F3',
      label: 'POS',
      description: 'Go to Point of Sale',
      handler: () => {
        navigate('/pos');
        toast.info('POS System', 'Navigated to Point of Sale');
      },
    },
    f4: {
      key: 'F4',
      label: 'Products',
      description: 'Go to Products',
      handler: () => {
        navigate('/products');
        toast.info('Products', 'Navigated to Products');
      },
    },
    f5: {
      key: 'F5',
      label: 'Inventory',
      description: 'Go to Inventory',
      handler: () => {
        navigate('/inventory');
        toast.info('Inventory', 'Navigated to Inventory');
      },
    },
    f6: {
      key: 'F6',
      label: 'Customers',
      description: 'Go to Customers',
      handler: () => {
        navigate('/customers');
        toast.info('Customers', 'Navigated to Customers');
      },
    },
    f7: {
      key: 'F7',
      label: 'Transactions',
      description: 'Go to Transactions',
      handler: () => {
        navigate('/transactions');
        toast.info('Transactions', 'Navigated to Transactions');
      },
    },
    f8: {
      key: 'F8',
      label: 'Settings',
      description: 'Go to Settings',
      handler: () => {
        navigate('/settings');
        toast.info('Settings', 'Navigated to Settings');
      },
    },
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const shortcut = shortcuts[key];

      if (shortcut && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        shortcut.handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, navigate, toast]);

  return shortcuts;
}

export function getShortcutsList() {
  return [
    { key: 'F1', action: 'Help & Shortcuts' },
    { key: 'F2', action: 'Dashboard' },
    { key: 'F3', action: 'POS System' },
    { key: 'F4', action: 'Products' },
    { key: 'F5', action: 'Inventory' },
    { key: 'F6', action: 'Customers' },
    { key: 'F7', action: 'Transactions' },
    { key: 'F8', action: 'Settings' },
  ];
}
