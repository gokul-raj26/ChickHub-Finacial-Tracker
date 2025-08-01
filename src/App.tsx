import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import Toast from './components/Toast';
import { useGlobalContext } from './context/GlobalContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Home from './pages/Home';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Configure from './pages/Configure';

const AppContent: React.FC = () => {
  const { state, showMessage } = useGlobalContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const authStatus = localStorage.getItem('chickhub_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('chickhub_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('chickhub_auth');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout onLogout={handleLogout} />}>
            <Route index element={<Home />} />
            <Route path="sales" element={<Sales />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="billing" element={<Billing />} />
            <Route path="reports" element={<Reports />} />
            <Route path="configure" element={<Configure />} />
          </Route>
        </Routes>
      </Router>
      
      {state.message && (
        <Toast
          message={state.message.message}
          type={state.message.type}
          onClose={() => showMessage('', 'success')}
        />
      )}
    </>
  );
};

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;