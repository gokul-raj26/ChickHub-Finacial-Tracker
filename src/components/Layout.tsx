import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, ShoppingCart, Package, FileText, BarChart3, Languages, Settings, LogOut } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  const { state, toggleLanguage } = useGlobalContext();

  const navItems = [
    { to: '/', icon: Home, label: state.language === 'en' ? 'Home' : 'முகப்பு' },
    { to: '/sales', icon: ShoppingCart, label: state.language === 'en' ? 'Sales' : 'விற்பனை' },
    { to: '/inventory', icon: Package, label: state.language === 'en' ? 'Inventory' : 'இருப்பு' },
    { to: '/billing', icon: FileText, label: state.language === 'en' ? 'Billing' : 'பில்லிங்' },
    { to: '/reports', icon: BarChart3, label: state.language === 'en' ? 'Reports' : 'அறிக்கைகள்' },
    { to: '/configure', icon: Settings, label: state.language === 'en' ? 'Configure' : 'கட்டமைப்பு' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-lg">
                CH
              </div>
              <h1 className="text-2xl font-bold text-orange-400">ChickHub</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Languages className="w-4 h-4" />
                <span className="text-sm">{state.language === 'en' ? 'த' : 'EN'}</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;