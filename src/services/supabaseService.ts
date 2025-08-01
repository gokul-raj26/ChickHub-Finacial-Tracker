import { supabase } from '../lib/supabase';
import type { MenuItem, Sale, Expense, Inventory } from '../lib/supabase';

class SupabaseService {
  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    return data || [];
  }

  async addMenuItem(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
    
    return data;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    return data;
  }

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
    
    return data || [];
  }

  async addSale(sale: Omit<Sale, 'id' | 'created_at'>): Promise<Sale> {
    const { data, error } = await supabase
      .from('sales')
      .insert([sale])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
    
    return data;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
    
    return data || [];
  }

  async addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding expense:', error);
      throw error;
    }

    // Update inventory
    await this.updateInventoryStock(expense.chicken_weight);
    
    return data;
  }

  // Inventory
  async getInventory(): Promise<Inventory | null> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching inventory:', error);
      return null;
    }
    
    return data;
  }

  async updateInventoryStock(chickenWeight: number): Promise<void> {
    // Get current inventory
    const inventory = await this.getInventory();
    const currentStock = inventory?.chicken_stock || 0;
    const newStock = currentStock + chickenWeight;

    if (inventory) {
      // Update existing inventory
      const { error } = await supabase
        .from('inventory')
        .update({ 
          chicken_stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', inventory.id);
      
      if (error) {
        console.error('Error updating inventory:', error);
        throw error;
      }
    } else {
      // Create new inventory record
      const { error } = await supabase
        .from('inventory')
        .insert([{ 
          chicken_stock: newStock,
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error creating inventory:', error);
        throw error;
      }
    }
  }

  // Analytics
  async getDailyData() {
    const [sales, expenses] = await Promise.all([
      this.getSales(),
      this.getExpenses()
    ]);

    const dailyData: { [key: string]: { revenue: number; expenses: number; profit: number } } = {};
    
    sales.forEach(sale => {
      if (!dailyData[sale.date]) {
        dailyData[sale.date] = { revenue: 0, expenses: 0, profit: 0 };
      }
      dailyData[sale.date].revenue += sale.total;
    });

    expenses.forEach(expense => {
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
  }
}

export default new SupabaseService();