import React, { useState } from 'react';
import { CreditCard, Banknote, Filter, Download } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Sales: React.FC = () => {
  const { state } = useGlobalContext();
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Filter sales by date range
  const filteredSales = state.sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const startDate = new Date(dateFilter.startDate);
    const endDate = new Date(dateFilter.endDate);
    return saleDate >= startDate && saleDate <= endDate;
  });

  // Calculate filtered totals
  const filteredTotalSales = filteredSales.reduce((total, sale) => total + sale.total, 0);
  const filteredTotalCash = filteredSales.reduce((total, sale) => total + sale.cash, 0);
  const filteredTotalUPI = filteredSales.reduce((total, sale) => total + sale.upi, 0);
  const filteredExpenses = state.expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      return expenseDate >= startDate && expenseDate <= endDate;
    })
    .reduce((total, expense) => total + expense.total, 0);
  const netProfit = filteredTotalSales - filteredExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-400">
          {state.language === 'en' ? 'Sales' : 'விற்பனை'}
        </h1>
        <Button variant="success" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>{state.language === 'en' ? 'Export' : 'ஏற்றுமதி'}</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">
            {state.language === 'en' ? 'Filter by Date' : 'தேதி வாரியாக வடிகட்டவும்'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {state.language === 'en' ? 'Start Date' : 'தொடக்க தேதி'}
            </label>
            <Input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {state.language === 'en' ? 'End Date' : 'முடிவு தேதி'}
            </label>
            <Input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {state.language === 'en' ? 'Total Sales' : 'மொத்த விற்பனை'}
            </h3>
            <p className="text-3xl font-bold text-green-400">₹{filteredTotalSales}</p>
            <p className="text-sm text-gray-400 mt-1">
              {filteredSales.length} {state.language === 'en' ? 'transactions' : 'பரிவர்த்தனைகள்'}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {state.language === 'en' ? 'Total Expenses' : 'மொத்த செலவுகள்'}
            </h3>
            <p className="text-3xl font-bold text-red-400">₹{filteredExpenses}</p>
            <p className="text-sm text-gray-400 mt-1">
              {state.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                const startDate = new Date(dateFilter.startDate);
                const endDate = new Date(dateFilter.endDate);
                return expenseDate >= startDate && expenseDate <= endDate;
              }).length} {state.language === 'en' ? 'expenses' : 'செலவுகள்'}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {state.language === 'en' ? 'Net Profit' : 'நிகர லாபம்'}
            </h3>
            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₹{netProfit}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {filteredTotalSales > 0 ? ((netProfit / filteredTotalSales) * 100).toFixed(1) : '0.0'}% {state.language === 'en' ? 'margin' : 'விளிம்பு'}
            </p>
          </div>
        </Card>
      </div>

      {/* Payment Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          {state.language === 'en' ? 'Payment Breakdown' : 'பணம் பிரிவு'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">
                {state.language === 'en' ? 'UPI Revenue' : 'UPI வருமானம்'}
              </h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{filteredTotalUPI}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Banknote className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">
                {state.language === 'en' ? 'Cash Revenue' : 'ரொக்க வருமானம்'}
              </h4>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{filteredTotalCash}</p>
          </div>
        </div>
      </Card>

      {/* Sales Transactions */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          {state.language === 'en' ? 'Sales Transactions' : 'விற்பனை பரிவர்த்தனைகள்'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left p-3 text-gray-300 font-medium">
                  {state.language === 'en' ? 'DATE & TIME' : 'தேதி & நேரம்'}
                </th>
                <th className="text-left p-3 text-gray-300 font-medium">
                  {state.language === 'en' ? 'CUSTOMER' : 'வாடிக்கையாளர்'}
                </th>
                <th className="text-left p-3 text-gray-300 font-medium">
                  {state.language === 'en' ? 'ITEMS' : 'பொருட்கள்'}
                </th>
                <th className="text-left p-3 text-gray-300 font-medium">
                  {state.language === 'en' ? 'PAYMENT' : 'பணம்'}
                </th>
                <th className="text-right p-3 text-gray-300 font-medium">
                  {state.language === 'en' ? 'TOTAL' : 'மொத்தம்'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    {state.language === 'en' ? 'No transactions found for the selected date range' : 'தேர்ந்தெடுக்கப்பட்ட தேதி வரம்பிற்கு பரிவர்த்தனைகள் இல்லை'}
                  </td>
                </tr>
              ) : (
                filteredSales.slice().reverse().map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-white">{sale.date}</div>
                        <div className="text-xs text-gray-400">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-400">-</td>
                    <td className="p-3">
                      <div className="text-xs space-y-1">
                        {sale.items.boneless100g > 0 && (
                          <div className="text-white">
                            {state.language === 'en' ? 'Boneless 100g' : 'எலும்பு இல்லாத 100g'}: {sale.items.boneless100g}
                          </div>
                        )}
                        {sale.items.boneless20g > 0 && (
                          <div className="text-white">
                            {state.language === 'en' ? 'Boneless 20g' : 'எலும்பு இல்லாத 20g'}: {sale.items.boneless20g}
                          </div>
                        )}
                        {sale.items.pakoda100g > 0 && (
                          <div className="text-white">
                            {state.language === 'en' ? 'Pakoda 100g' : 'பக்கோடா 100g'}: {sale.items.pakoda100g}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs space-y-1">
                        {sale.cash > 0 && (
                          <div className="flex items-center space-x-1">
                            <Banknote className="w-3 h-3 text-green-400" />
                            <span className="text-white">₹{sale.cash}</span>
                          </div>
                        )}
                        {sale.upi > 0 && (
                          <div className="flex items-center space-x-1">
                            <CreditCard className="w-3 h-3 text-blue-400" />
                            <span className="text-white">₹{sale.upi}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-semibold text-green-400">₹{sale.total}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Sales;