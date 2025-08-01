import React, { createContext, useContext, useReducer, useEffect } from 'react';
import supabaseService from '../services/supabaseService';
import type { MenuItem, Sale, Expense, Inventory } from '../lib/supabase';

interface GlobalState {
  sales: Sale[];
  expenses: Expense[];
  menuItems: MenuItem[];
  inventory: {
    chickenStock: number;
  };
  language: 'en' | 'ta';
  prices: {
    boneless100g: number;
    boneless20g: number;
    pakoda100g: number;
  };
  message: { message: string; type: 'success' | 'error' } | null;
  loading: boolean;
}

interface GlobalContextType {
  state: GlobalState;
  showMessage: (message: string, type?: 'success' | 'error') => void;
  addSale: (sale: Omit<Sale, 'id' | 'created_at'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'created_at'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleLanguage: () => void;
  getTotalRevenue: () => number;
  getTotalExpenses: () => number;
  getTotalProfit: () => number;
  getDailyData: () => any[];
  loadData: () => Promise<void>;
}

const initialState: GlobalState = {
  sales: [],
  expenses: [],
  menuItems: [],
  inventory: {
    chickenStock: 0
  },
  language: 'en',
  prices: {
    boneless100g: 120,
    boneless20g: 25,
    pakoda100g: 80
  },
  message: null,
  loading: false
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'SET_INVENTORY'; payload: { chickenStock: number } }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: string }
  | { type: 'TOGGLE_LANGUAGE' }
  | { type: 'SHOW_MESSAGE'; payload: { message: string; type: 'success' | 'error' } }
  | { type: 'HIDE_MESSAGE' };

const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'ADD_SALE':
      return { ...state, sales: [action.payload, ...state.sales] };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [action.payload, ...state.menuItems] };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.filter(item => item.id !== action.payload)
      };
    case 'TOGGLE_LANGUAGE':
      return { ...state, language: state.language === 'en' ? 'ta' : 'en' };
    case 'SHOW_MESSAGE':
      return { ...state, message: action.payload };
    case 'HIDE_MESSAGE':
      return { ...state, message: null };
    default:
      return state;
  }
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [sales, expenses, menuItems, inventory] = await Promise.all([
        supabaseService.getSales(),
        supabaseService.getExpenses(),
        supabaseService.getMenuItems(),
        supabaseService.getInventory()
      ]);

      dispatch({ type: 'SET_SALES', payload: sales });
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
      dispatch({ type: 'SET_MENU_ITEMS', payload: menuItems });
      dispatch({ type: 'SET_INVENTORY', payload: { chickenStock: inventory?.chicken_stock || 0 } });
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('Failed to load data from database', 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addSale = async (sale: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      const newSale = await supabaseService.addSale(sale);
      dispatch({ type: 'ADD_SALE', payload: newSale });
      showMessage('Sale added successfully!', 'success');
    } catch (error) {
      console.error('Error adding sale:', error);
      showMessage('Failed to add sale', 'error');
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
    try {
      const newExpense = await supabaseService.addExpense(expense);
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      
      // Update inventory in state
      const currentStock = state.inventory.chickenStock;
      dispatch({ type: 'SET_INVENTORY', payload: { chickenStock: currentStock + expense.chicken_weight } });
      
      showMessage('Expense added successfully!', 'success');
    } catch (error) {
      console.error('Error adding expense:', error);
      showMessage('Failed to add expense', 'error');
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>) => {
    try {
      const newItem = await supabaseService.addMenuItem(item);
      dispatch({ type: 'ADD_MENU_ITEM', payload: newItem });
      showMessage('Menu item added successfully!', 'success');
    } catch (error) {
      console.error('Error adding menu item:', error);
      showMessage('Failed to add menu item', 'error');
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const updatedItem = await supabaseService.updateMenuItem(id, updates);
      dispatch({ type: 'UPDATE_MENU_ITEM', payload: updatedItem });
      showMessage('Menu item updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating menu item:', error);
      showMessage('Failed to update menu item', 'error');
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await supabaseService.deleteMenuItem(id);
      dispatch({ type: 'DELETE_MENU_ITEM', payload: id });
      showMessage('Menu item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      showMessage('Failed to delete menu item', 'error');
    }
  };

  const toggleLanguage = () => {
    dispatch({ type: 'TOGGLE_LANGUAGE' });
  };

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    dispatch({ type: 'SHOW_MESSAGE', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'HIDE_MESSAGE' });
    }, 3000);
  };

  const getTotalRevenue = () => {
    return state.sales.reduce((total, sale) => total + sale.total, 0);
  };

  const getTotalExpenses = () => {
    return state.expenses.reduce((total, expense) => total + expense.total, 0);
  };

  const getTotalProfit = () => {
    return getTotalRevenue() - getTotalExpenses();
  };

  const getDailyData = () => {
    const dailyData: { [key: string]: { revenue: number; expenses: number; profit: number } } = {};
    
    state.sales.forEach(sale => {
      if (!dailyData[sale.date]) {
        dailyData[sale.date] = { revenue: 0, expenses: 0, profit: 0 };
      }
      dailyData[sale.date].revenue += sale.total;
    });

    state.expenses.forEach(expense => {
      if (!dailyData[expense.date]) {
        dailyData[expense.date] = { revenue: 0, expenses: 0, profit: 0 };
      }
      dailyData[expense.date].expenses += expense.total;
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.revenue - data.expenses
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <GlobalContext.Provider value={{
      state,
      showMessage,
      addSale,
      addExpense,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleLanguage,
      getTotalRevenue,
      getTotalExpenses,
      getTotalProfit,
      getDailyData,
      loadData
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};