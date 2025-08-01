import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  created_at: string;
}

export interface Sale {
  id: string;
  date: string;
  customer_name: string;
  customer_mobile: string;
  items: {
    boneless100g: number;
    boneless20g: number;
    pakoda100g: number;
    other: string;
  };
  cash: number;
  upi: number;
  total: number;
  payment_type: string;
  created_at: string;
}

export interface Expense {
  id: string;
  date: string;
  chicken_weight: number;
  chicken_cost: number;
  masala: number;
  oil: number;
  gas: number;
  tea_cups: number;
  breading: number;
  total: number;
  created_at: string;
}

export interface Inventory {
  id: string;
  chicken_stock: number;
  updated_at: string;
}