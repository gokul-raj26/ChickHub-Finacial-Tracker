import React, { useState } from 'react';
import { Package, Plus, Calculator } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Inventory: React.FC = () => {
  const { state, addExpense, showMessage } = useGlobalContext();
  const [expenseForm, setExpenseForm] = useState({
    chickenWeight: '',
    chickenCost: '',
    masala: '',
    oil: '',
    gas: '',
    teaCups: '',
    breading: ''
  });

  const handleInputChange = (field: string, value: number) => {
    setExpenseForm(prev => ({ ...prev, [field]: value.toString() }));
  };

  const calculateTotal = () => {
    const { chickenCost, masala, oil, gas, teaCups, breading } = expenseForm;
    const cost = Number(chickenCost) || 0;
    const masalaVal = Number(masala) || 0;
    const oilVal = Number(oil) || 0;
    const gasVal = Number(gas) || 0;
    const cupsVal = Number(teaCups) || 0;
    const breadingVal = Number(breading) || 0;
    return cost + masalaVal + oilVal + gasVal + (cupsVal * 1.5) + breadingVal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseForm.chickenWeight || !expenseForm.chickenCost) {
      showMessage('Please enter chicken weight and cost', 'error');
      return;
    }
    
    const total = calculateTotal();
    
    addExpense({
      date: new Date().toISOString().split('T')[0],
      chicken_weight: Number(expenseForm.chickenWeight),
      chicken_cost: Number(expenseForm.chickenCost),
      masala: Number(expenseForm.masala) || 0,
      oil: Number(expenseForm.oil) || 0,
      gas: Number(expenseForm.gas) || 0,
      tea_cups: Number(expenseForm.teaCups) * 1.5 || 0,
      breading: Number(expenseForm.breading) || 0,
      total
    });

    // Reset form
    setExpenseForm({
      chickenWeight: '',
      chickenCost: '',
      masala: '',
      oil: '',
      gas: '',
      teaCups: '',
      breading: ''
    });
  };

  const calculatePackSuggestions = () => {
    const availableChicken = state.inventory.chickenStock;
    return {
      packs100g: Math.floor(availableChicken / 100),
      packs20g: Math.floor(availableChicken / 20),
      packs75g: Math.floor(availableChicken / 75),
      mixed: {
        packs100g: Math.floor(availableChicken / 200),
        packs20g: Math.floor((availableChicken % 200) / 20)
      }
    };
  };

  const suggestions = calculatePackSuggestions();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          {state.language === 'en' ? 'Inventory Management' : 'இருப்பு மேலாண்மை'}
        </h1>
        <p className="text-gray-400">
          {state.language === 'en' 
            ? 'Track your stock and manage expenses'
            : 'உங்கள் சரக்கு மற்றும் செலவுகளை கண்காணிக்கவும்'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={state.language === 'en' ? 'Add Expense' : 'செலவு சேர்க்கவும்'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={state.language === 'en' ? 'Chicken Weight (grams)' : 'கோழி எடை (கிராம்)'}
                type="number"
                value={expenseForm.chickenWeight}
                onChange={(e) => handleInputChange('chickenWeight', e.target.value)}
                placeholder="1500"
              />
              <Input
                label={state.language === 'en' ? 'Chicken Cost (₹)' : 'கோழி விலை (₹)'}
                type="number"
                value={expenseForm.chickenCost}
                onChange={(e) => handleInputChange('chickenCost', e.target.value)}
                placeholder="290"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={state.language === 'en' ? 'Masala (₹)' : 'மசாலா (₹)'}
                type="number"
                value={expenseForm.masala}
                onChange={(e) => handleInputChange('masala', Number(e.target.value))}
                placeholder="Enter masala cost"
                min="0"
              />
              <Input
                label={state.language === 'en' ? 'Oil (₹)' : 'எண்ணெய் (₹)'}
                type="number"
                value={expenseForm.oil}
                onChange={(e) => handleInputChange('oil', Number(e.target.value))}
                placeholder="Enter oil cost"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={state.language === 'en' ? 'Gas (₹)' : 'கேஸ் (₹)'}
                type="number"
                value={expenseForm.gas}
                onChange={(e) => handleInputChange('gas', Number(e.target.value))}
                placeholder="Enter gas cost"
                min="0"
              />
              <Input
                label={state.language === 'en' ? 'Tea Cups (quantity)' : 'டீ கப்கள் (எண்ணிக்கை)'}
                type="number"
                value={expenseForm.teaCups}
                onChange={(e) => handleInputChange('teaCups', e.target.value)}
                placeholder="20"
              />
            </div>

            <Input
              label={state.language === 'en' ? 'Breading (₹)' : 'பிரேடிங் (₹)'}
              type="number"
              value={expenseForm.breading}
              onChange={(e) => handleInputChange('breading', Number(e.target.value))}
              placeholder="Enter breading cost"
              min="0"
            />

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">
                  {state.language === 'en' ? 'Total Cost' : 'மொத்த செலவு'}:
                </span>
                <span className="text-2xl font-bold text-red-400">
                  {calculateTotal() > 0 ? `₹${calculateTotal()}` : '₹0'}
                </span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Plus className="w-5 h-5" />
              {state.language === 'en' ? 'Add Expense' : 'செலவு சேர்க்கவும்'}
            </Button>
          </form>
        </Card>

        <Card title={state.language === 'en' ? 'Stock Calculator' : 'சரக்கு கால்குலேட்டர்'}>
          <div className="space-y-4">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-blue-400 mb-2" />
              <h3 className="text-xl font-bold text-blue-400">
                {state.language === 'en' ? 'Available Stock' : 'கிடைக்கும் சரக்கு'}
              </h3>
              <p className="text-3xl font-bold text-white">
                {(state.inventory.chickenStock / 1000).toFixed(1)}kg
              </p>
              <p className="text-gray-400">({state.inventory.chickenStock}g)</p>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                {state.language === 'en' ? 'Pack Suggestions' : 'பேக் பரிந்துரைகள்'}
              </h4>
              
              <div className="space-y-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    {state.language === 'en' ? 'All 100g packs' : 'எல்லா 100g பேக்குகள்'}
                  </p>
                  <p className="text-lg font-bold text-green-400">
                    {suggestions.packs100g} {state.language === 'en' ? 'packs' : 'பேக்குகள்'}
                  </p>
                </div>

                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    {state.language === 'en' ? 'All 20g packs' : 'எல்லா 20g பேக்குகள்'}
                  </p>
                  <p className="text-lg font-bold text-green-400">
                    {suggestions.packs20g} {state.language === 'en' ? 'packs' : 'பேக்குகள்'}
                  </p>
                </div>

                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    {state.language === 'en' ? 'All 75g packs' : 'எல்லா 75g பேக்குகள்'}
                  </p>
                  <p className="text-lg font-bold text-green-400">
                    {suggestions.packs75g} {state.language === 'en' ? 'packs' : 'பேக்குகள்'}
                  </p>
                </div>

                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">
                    {state.language === 'en' ? 'Mixed (100g + 20g)' : 'கலவை (100g + 20g)'}
                  </p>
                  <p className="text-lg font-bold text-orange-400">
                    {suggestions.mixed.packs100g} × 100g + {suggestions.mixed.packs20g} × 20g
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title={state.language === 'en' ? 'Recent Expenses' : 'சமீபத்திய செலவுகள்'}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left p-3">{state.language === 'en' ? 'Date' : 'தேதி'}</th>
                <th className="text-left p-3">{state.language === 'en' ? 'Chicken' : 'கோழி'}</th>
                <th className="text-left p-3">{state.language === 'en' ? 'Masala' : 'மசாலா'}</th>
                <th className="text-left p-3">{state.language === 'en' ? 'Oil' : 'எண்ணெய்'}</th>
                <th className="text-left p-3">{state.language === 'en' ? 'Other' : 'மற்றவை'}</th>
                <th className="text-left p-3">{state.language === 'en' ? 'Total' : 'மொத்தம்'}</th>
              </tr>
            </thead>
            <tbody>
              {state.expenses.slice(-10).reverse().map((expense) => (
                <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{expense.date}</td>
                  <td className="p-3">
                    <div className="text-xs">
                      <div>{expense.chicken.weight}g</div>
                      <div className="text-gray-400">₹{expense.chicken.cost}</div>
                    </div>
                  </td>
                  <td className="p-3">₹{expense.masala}</td>
                  <td className="p-3">₹{expense.oil}</td>
                  <td className="p-3">₹{expense.gas + expense.teaCups + expense.breading}</td>
                  <td className="p-3 font-semibold text-red-400">₹{expense.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Inventory;