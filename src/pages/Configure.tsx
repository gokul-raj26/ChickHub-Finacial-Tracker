import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, RefreshCw } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Configure: React.FC = () => {
  const { state, showMessage, addMenuItem, updateMenuItem, deleteMenuItem, loadData } = useGlobalContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Snacks',
    price: ''
  });

  const categories = ['Snacks', 'Main Course', 'Beverages', 'Sides', 'Desserts'];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = async () => {
    if (formData.name && Number(formData.price) > 0) {
      await addMenuItem({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price)
      });
      setFormData({ name: '', category: 'Snacks', price: '' });
      setShowAddForm(false);
    } else {
      showMessage('Please fill in all fields correctly', 'error');
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString()
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = async () => {
    if (editingItem && formData.name && Number(formData.price) > 0) {
      await updateMenuItem(editingItem.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price)
      });
      setEditingItem(null);
      setFormData({ name: '', category: 'Snacks', price: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(id);
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ name: '', category: 'Snacks', price: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-400">
          {state.language === 'en' ? 'Menu Configuration' : 'மெனு கட்டமைப்பு'}
        </h1>
        <div className="flex space-x-2">
          <Button 
            onClick={loadData}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{state.language === 'en' ? 'Refresh' : 'புதுப்பிக்கவும்'}</span>
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{state.language === 'en' ? 'Add Menu Item' : 'மெனு பொருள் சேர்க்கவும்'}</span>
          </Button>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingItem 
              ? (state.language === 'en' ? 'Edit Menu Item' : 'மெனு பொருளை திருத்தவும்')
              : (state.language === 'en' ? 'Add New Menu Item' : 'புதிய மெனு பொருள் சேர்க்கவும்')
            }
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label={state.language === 'en' ? 'Item Name' : 'பொருளின் பெயர்'}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={state.language === 'en' ? 'Enter item name' : 'பொருளின் பெயரை உள்ளிடவும்'}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {state.language === 'en' ? 'Category' : 'வகை'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <Input
              label={state.language === 'en' ? 'Price (₹)' : 'விலை (₹)'}
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={editingItem ? handleUpdateItem : handleAddItem}
              variant="success"
            >
              {editingItem 
                ? (state.language === 'en' ? 'Update Item' : 'பொருளை புதுப்பிக்கவும்')
                : (state.language === 'en' ? 'Add Item' : 'பொருள் சேர்க்கவும்')
              }
            </Button>
            <Button onClick={cancelForm} variant="secondary">
              {state.language === 'en' ? 'Cancel' : 'ரத்து செய்'}
            </Button>
          </div>
        </Card>
      )}

      {/* Database Status */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Database Status</h3>
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2">✅ Supabase Connected</h4>
          <p className="text-green-300 text-sm">
            Your app is now using Supabase as the database. All data is stored securely in PostgreSQL.
          </p>
          <div className="mt-2 text-xs text-green-400">
            <p>📊 Menu Items: {state.menuItems.length}</p>
            <p>💰 Sales Records: {state.sales.length}</p>
            <p>📝 Expense Records: {state.expenses.length}</p>
          </div>
        </div>
      </Card>

      {/* Menu Items */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">
            {state.language === 'en' ? 'Menu Items' : 'மெனு பொருட்கள்'}
          </h3>
        </div>
          
        {state.loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300 font-medium">
                    {state.language === 'en' ? 'NAME' : 'பெயர்'}
                  </th>
                  <th className="text-left p-3 text-gray-300 font-medium">
                    {state.language === 'en' ? 'CATEGORY' : 'வகை'}
                  </th>
                  <th className="text-left p-3 text-gray-300 font-medium">
                    {state.language === 'en' ? 'PRICE' : 'விலை'}
                  </th>
                  <th className="text-right p-3 text-gray-300 font-medium">
                    {state.language === 'en' ? 'ACTIONS' : 'செயல்கள்'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.menuItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">
                      {state.language === 'en' 
                        ? 'No menu items found. Add your first menu item!' 
                        : 'மெனு பொருட்கள் இல்லை. உங்கள் முதல் மெனு பொருளை சேர்க்கவும்!'
                      }
                    </td>
                  </tr>
                ) : (
                  state.menuItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3">
                        <span className="font-medium text-white">{item.name}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-300">{item.category}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-green-400">₹{item.price}</span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Configure;