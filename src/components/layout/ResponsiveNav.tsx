import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Show, Hidden } from './Responsive';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  role?: string[];
}

interface ResponsiveNavProps {
  items: NavItem[];
  onLogout?: () => void;
  logo?: string;
  title?: string;
}

/**
 * Responsive navigation component
 * Mobile: Bottom nav bar + hamburger menu
 * Tablet: Collapsible sidebar
 * Desktop: Full sidebar
 */
export function ResponsiveNav({ items, onLogout, logo, title }: ResponsiveNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <Show only="mobile">
        <div className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {logo && <img src={logo} alt="Logo" className="h-8 w-8" />}
            <span className="font-semibold text-slate-900 dark:text-white truncate">
              {title || 'POS'}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30 mt-14"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-14 left-0 right-0 bg-white dark:bg-slate-900 z-30 border-b border-slate-200 dark:border-slate-800 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <nav className="p-4 space-y-1">
                {items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 flex justify-around h-16">
          {items.slice(0, 4).map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center flex-1 gap-1 text-xs font-medium transition ${
                isActive(item.path)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title={item.label}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </Show>

      {/* Tablet Sidebar */}
      <Hidden below="md">
        <Hidden above="lg">
          <div className={`
            fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50
            transition-all duration-300 overflow-y-auto
            ${desktopSidebarCollapsed ? 'w-16' : 'w-56'}
          `}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              {!desktopSidebarCollapsed && (
                <div className="flex items-center gap-2 mb-4">
                  {logo && <img src={logo} alt="Logo" className="h-8 w-8" />}
                  <span className="font-bold text-slate-900 dark:text-white">{title || 'POS'}</span>
                </div>
              )}
              <button
                onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <Menu size={20} />
              </button>
            </div>

            <nav className="p-2 space-y-1">
              {items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${
                      isActive(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                  title={item.label}
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6">{item.icon}</span>
                  {!desktopSidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </nav>

            {!desktopSidebarCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </Hidden>
      </Hidden>

      {/* Desktop Sidebar */}
      <Hidden above="lg">
        <div className={`
          fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50
          transition-all duration-300 overflow-y-auto
          ${desktopSidebarCollapsed ? 'w-16' : 'w-64'}
        `}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {!desktopSidebarCollapsed && (
              <div className="flex items-center gap-2">
                {logo && <img src={logo} alt="Logo" className="h-8 w-8" />}
                <span className="font-bold text-slate-900 dark:text-white">{title || 'POS System'}</span>
              </div>
            )}
            <button
              onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <Menu size={20} />
            </button>
          </div>

          <nav className="p-2 space-y-1">
            {items.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
                title={item.label}
              >
                <span className="flex-shrink-0 flex items-center justify-center w-6">{item.icon}</span>
                {!desktopSidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <LogOut size={20} />
              {!desktopSidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </Hidden>
    </>
  );
}

export function NavPadding() {
  return (
    <>
      {/* Mobile padding for header + bottom nav */}
      <Show only="mobile">
        <div className="h-14" /> {/* Top header */}
        <div className="h-16" /> {/* Bottom nav */}
      </Show>

      {/* Tablet/Desktop padding for sidebar */}
      <Hidden below="md">
        <div className="md:ml-16 lg:ml-64" />
      </Hidden>
    </>
  );
}
