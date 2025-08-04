// billing.tsx
// This file is part of the Billing page in a React application.
// It handles the billing process, including adding items, managing customer details, and generating bills.
import React, { useState } from 'react';
import { ShoppingCart, User, Phone, CreditCard, Banknote, Plus } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

interface BillItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
}

const Billing: React.FC = () => {
  const { state, showMessage, addSale } = useGlobalContext();
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [paymentType, setPaymentType] = useState<'cash' | 'upi'>('cash');

  const addItem = (menuItem: any) => {
    const existingItem = billItems.find(item => item.id === menuItem.id);
    
    if (existingItem) {
      setBillItems(billItems.map(item => 
        item.id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setBillItems([...billItems, {
        id: menuItem.id,
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        quantity: 1,
        total: menuItem.price
      }]);
    }
  };

  const removeItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setBillItems(billItems.map(item => 
      item.id === id 
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  };

  const getTotalAmount = () => {
    return billItems.reduce((total, item) => total + item.total, 0);
  };

  const getTotalItems = () => {
    return billItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleGenerateBill = async () => {
    if (billItems.length === 0) {
      showMessage('Please add items to generate bill', 'error');
      return;
    }

    // Create structured items object
    const items = {
      boneless100g: 0,
      boneless20g: 0,
      pakoda100g: 0,
      other: billItems.map(item => `${item.name} x${item.quantity}`).join(', ')
    };
    
    // Create sale object
    const sale = {
      date: new Date().toISOString().split('T')[0],
      customer_name: customerName || '',
      customer_mobile: customerMobile || '',
      items,
      cash: paymentType === 'cash' ? getTotalAmount() : 0,
      upi: paymentType === 'upi' ? getTotalAmount() : 0,
      total: getTotalAmount(),
      payment_type: paymentType
    };
    
    // Add sale using context
    await addSale(sale);
    
    // Clear the bill after generation
    setBillItems([]);
    setCustomerName('');
    setCustomerMobile('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-400">
          {state.language === 'en' ? 'Billing' : 'பில்லிங்'}
        </h1>
        <div className="flex items-center space-x-2 text-gray-400">
          <ShoppingCart className="w-5 h-5" />
          <span>{getTotalItems()} {state.language === 'en' ? 'items' : 'பொருட்கள்'}</span>
        </div>
      </div>

      {/* Customer Details */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          {state.language === 'en' ? 'Customer Details' : 'வாடிக்கையாளர் விவரங்கள்'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <User className="w-4 h-4 mr-2" />
              {state.language === 'en' ? 'Name' : 'பெயர்'}
            </label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={state.language === 'en' ? 'Customer Name (Optional)' : 'வாடிக்கையாளர் பெயர் (விருப்பமானது)'}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              {state.language === 'en' ? 'Mobile' : 'மொபைல்'}
            </label>
            <Input
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              placeholder={state.language === 'en' ? 'Mobile Number (Optional)' : 'மொபைல் எண் (விருப்பமானது)'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            {state.language === 'en' ? 'Payment Type' : 'பணம் செலுத்தும் வகை'}
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="cash"
                checked={paymentType === 'cash'}
                onChange={(e) => setPaymentType(e.target.value as 'cash' | 'upi')}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500"
              />
              <Banknote className="w-4 h-4 text-green-400" />
              <span className="text-white">{state.language === 'en' ? 'Cash' : 'ரொக்கம்'}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="upi"
                checked={paymentType === 'upi'}
                onChange={(e) => setPaymentType(e.target.value as 'cash' | 'upi')}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500"
              />
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="text-white">{state.language === 'en' ? 'UPI' : 'UPI'}</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Menu Items */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          {state.language === 'en' ? 'Menu Items' : 'மெனு பொருட்கள்'}
        </h3>
        {state.loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading menu items...</p>
          </div>
        ) : state.menuItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {state.language === 'en' 
                ? 'No menu items available. Please add items in Configure page.' 
                : 'மெனு பொருட்கள் இல்லை. கட்டமைப்பு பக்கத்தில் பொருட்களை சேர்க்கவும்.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div>
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-orange-400">₹{item.price}</span>
                  <Button onClick={() => addItem(item)} size="sm" className="flex items-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>{state.language === 'en' ? 'Add' : 'சேர்க்கவும்'}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Current Bill Summary */}
      {billItems.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            {state.language === 'en' ? 'Current Bill' : 'தற்போதைய பில்'}
          </h3>
          <div className="space-y-3">
            {billItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.name}</h4>
                  <p className="text-sm text-gray-400">₹{item.price} each</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-green-400 w-20 text-right">₹{item.total}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-600 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-white">
                {state.language === 'en' ? 'Total Amount' : 'மொத்த தொகை'}:
              </span>
              <span className="text-3xl font-bold text-orange-400">₹{getTotalAmount()}</span>
            </div>
            
            <Button onClick={handleGenerateBill} className="w-full" size="lg">
              {state.language === 'en' ? 'Generate Bill' : 'பில் உருவாக்கவும்'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Billing;