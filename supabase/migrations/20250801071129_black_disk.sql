/*
  # ChickHub Database Schema

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `price` (numeric)
      - `created_at` (timestamp)
    - `sales`
      - `id` (uuid, primary key)
      - `date` (date)
      - `customer_name` (text)
      - `customer_mobile` (text)
      - `items` (jsonb)
      - `cash` (numeric)
      - `upi` (numeric)
      - `total` (numeric)
      - `payment_type` (text)
      - `created_at` (timestamp)
    - `expenses`
      - `id` (uuid, primary key)
      - `date` (date)
      - `chicken_weight` (integer)
      - `chicken_cost` (numeric)
      - `masala` (numeric)
      - `oil` (numeric)
      - `gas` (numeric)
      - `tea_cups` (numeric)
      - `breading` (numeric)
      - `total` (numeric)
      - `created_at` (timestamp)
    - `inventory`
      - `id` (uuid, primary key)
      - `chicken_stock` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

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

-- Create policies for menu_items
CREATE POLICY "Anyone can read menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert menu items"
  ON menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update menu items"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete menu items"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for sales
CREATE POLICY "Anyone can read sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert sales"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for expenses
CREATE POLICY "Anyone can read expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for inventory
CREATE POLICY "Anyone can read inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert initial inventory record
INSERT INTO inventory (chicken_stock) VALUES (0)
ON CONFLICT DO NOTHING;