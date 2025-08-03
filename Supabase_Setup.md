# 🚀 ChickHub - Supabase Database Setup Guide

## 📋 Overview
This guide will help you connect your ChickHub application to a Supabase database. Follow these steps carefully to set up your database connection.

## 🔑 Step 1: Get Your Supabase Credentials

### Create a Supabase Project:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project name: "ChickHub Database"
5. Enter a strong database password
6. Select your region
7. Click "Create new project"

### Get Your API Keys:
Once your project is created, go to **Settings** → **API**

You'll need these 3 values:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (starts with eyJ)
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (starts with eyJ)

## 📁 Step 2: Files You Need to Modify

### File 1: `.env` (Create this file in root directory)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Replace:**
- `your-project-id` with your actual Supabase project ID
- `your-anon-key-here` with your actual anon key
- `your-service-role-key-here` with your actual service role key

### File 2: `src/lib/supabase.ts` (Update connection)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.from('menu_items').select('count').limit(1)
  .then(({ error }) => {
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  });
```

## 🗄️ Step 3: Create Database Tables

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy and paste this SQL:

```sql
-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  customer_name text DEFAULT '',
  customer_mobile text DEFAULT '',
  items jsonb NOT NULL DEFAULT '{}',
  cash numeric NOT NULL DEFAULT 0,
  upi numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  payment_type text NOT NULL DEFAULT 'cash',
  created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  chicken_weight integer NOT NULL DEFAULT 0,
  chicken_cost numeric NOT NULL DEFAULT 0,
  masala numeric NOT NULL DEFAULT 0,
  oil numeric NOT NULL DEFAULT 0,
  gas numeric NOT NULL DEFAULT 0,
  tea_cups numeric NOT NULL DEFAULT 0,
  breading numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chicken_stock integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (single-user app)
CREATE POLICY "Public access for menu_items" ON menu_items FOR ALL USING (true);
CREATE POLICY "Public access for sales" ON sales FOR ALL USING (true);
CREATE POLICY "Public access for expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Public access for inventory" ON inventory FOR ALL USING (true);

-- Insert initial inventory record
INSERT INTO inventory (chicken_stock) VALUES (0)
ON CONFLICT DO NOTHING;
```

5. Click **"Run"** to execute the SQL
6. You should see "Success. No rows returned" message

### Option B: Using Migration File
Create file: `supabase/migrations/setup_database.sql` with the above SQL content.

## 🧪 Step 4: Test Your Connection

1. Start your app: `npm run dev`
2. Go to **Configure** page
3. Click **"Test Connection"** button
4. You should see: ✅ "Supabase connection successful!"

## 🔧 Step 5: Verify Database Tables

In your Supabase Dashboard:
1. Go to **Table Editor**
2. You should see 4 tables:
   - `menu_items` (empty)
   - `sales` (empty)
   - `expenses` (empty)
   - `inventory` (1 row with chicken_stock = 0)

## 🎯 Step 6: Test Full Functionality

1. **Add Menu Items**: Go to Configure → Add menu items
2. **Generate Bills**: Go to Billing → Create bills
3. **Track Expenses**: Go to Inventory → Add expenses
4. **View Reports**: Go to Reports → See analytics

## 🚨 Troubleshooting

### Common Issues:

#### ❌ "Missing Supabase environment variables"
- Check your `.env` file exists in root directory
- Verify all 3 environment variables are set
- Restart your development server: `npm run dev`

#### ❌ "Failed to fetch" or CORS errors
- Check your Supabase URL is correct
- Verify your anon key is correct
- Make sure your Supabase project is active

#### ❌ "relation does not exist" errors
- Run the SQL script in Supabase Dashboard
- Check all 4 tables were created successfully
- Verify table names match exactly

#### ❌ "RLS policy violation" errors
- Make sure you ran the policy creation SQL
- Check that RLS policies are created for all tables

### Debug Steps:
1. Open browser console (F12)
2. Look for connection messages
3. Check Network tab for failed requests
4. Verify environment variables: `console.log(import.meta.env)`

## 📊 Database Schema

### Tables Created:
- **menu_items**: Store menu items (id, name, category, price)
- **sales**: Store all sales transactions
- **expenses**: Store daily business expenses
- **inventory**: Track chicken stock levels

### Features:
- ✅ Real-time data sync
- ✅ Type-safe operations
- ✅ Automatic timestamps
- ✅ UUID primary keys
- ✅ Row Level Security

## 🔒 Security Notes

- Keep your service role key secure (don't commit to git)
- Use environment variables for all credentials
- RLS policies are set for public access (single-user app)
- For multi-user apps, implement proper authentication

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your Supabase project is active
3. Test the SQL queries directly in Supabase Dashboard
4. Make sure all environment variables are correct

---

**🎉 Once setup is complete, your ChickHub app will have a professional PostgreSQL database with real-time sync!**


🎯 Quick Summary - What You Need to Do:
Create .env file in root directory with your Supabase credentials:


VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
Run SQL script in your Supabase Dashboard (SQL Editor)

Restart your app: npm run dev

🔑 Keys You Need from Supabase:
Project URL (from Settings → API)
Anon Key (from Settings → API)
Service Role Key (from Settings → API)
Everything else is already configured in your app! Just follow the README files and you'll be connected to Supabase in minutes. 🚀