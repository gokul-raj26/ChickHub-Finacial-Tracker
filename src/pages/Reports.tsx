import React from 'react';
import { TrendingUp, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useGlobalContext } from '../context/GlobalContext';
import Card from '../components/Card';

const Reports: React.FC = () => {
  const { state, getTotalRevenue, getTotalExpenses, getTotalProfit, getDailyData } = useGlobalContext();

  const dailyData = getDailyData();
  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const totalProfit = getTotalProfit();

  const itemSales = {
    boneless100g: state.sales.reduce((total, sale) => total + sale.items.boneless100g, 0),
    boneless20g: state.sales.reduce((total, sale) => total + sale.items.boneless20g, 0),
    pakoda100g: state.sales.reduce((total, sale) => total + sale.items.pakoda100g, 0)
  };

  const chartData = dailyData.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString()
  }));

  const itemChartData = [
    { name: state.language === 'en' ? 'Boneless 100g' : 'எலும்பு இல்லாத 100g', value: itemSales.boneless100g, revenue: itemSales.boneless100g * state.prices.boneless100g },
    { name: state.language === 'en' ? 'Boneless 20g' : 'எலும்பு இல்லாத 20g', value: itemSales.boneless20g, revenue: itemSales.boneless20g * state.prices.boneless20g },
    { name: state.language === 'en' ? 'Pakoda 100g' : 'பக்கோடா 100g', value: itemSales.pakoda100g, revenue: itemSales.pakoda100g * state.prices.pakoda100g }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          {state.language === 'en' ? 'Reports & Analytics' : 'அறிக்கைகள் & பகுப்பாய்வு'}
        </h1>
        <p className="text-gray-400">
          {state.language === 'en' 
            ? 'Track your business performance and trends'
            : 'உங்கள் வணிக செயல்திறன் மற்றும் போக்குகளை கண்காணிக்கவும்'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                {state.language === 'en' ? 'Total Revenue' : 'மொத்த வருமானம்'}
              </p>
              <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                {state.language === 'en' ? 'Total Expenses' : 'மொத்த செலவுகள்'}
              </p>
              <p className="text-2xl font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-400 rotate-180" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                {state.language === 'en' ? 'Net Profit' : 'நிகர லாபம்'}
              </p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{totalProfit.toLocaleString()}
              </p>
            </div>
            <DollarSign className={`w-8 h-8 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                {state.language === 'en' ? 'Profit Margin' : 'லாப விளிம்பு'}
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={state.language === 'en' ? 'Daily Profit Trend' : 'தினசரி லாப போக்கு'}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="profit" stroke="#F97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title={state.language === 'en' ? 'Revenue vs Expenses' : 'வருமானம் vs செலவுகள்'}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#10B981" />
              <Bar dataKey="expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={state.language === 'en' ? 'Item Sales Summary' : 'பொருள் விற்பனை சுருக்கம்'}>
          <div className="space-y-4">
            {itemChartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    {state.language === 'en' ? 'Quantity sold' : 'விற்பனை அளவு'}: {item.value}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">₹{item.revenue}</p>
                  <p className="text-sm text-gray-400">
                    {((item.revenue / totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={state.language === 'en' ? 'Transaction Summary' : 'பரிவர்த்தனை சுருக்கம்'}>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">
                {state.language === 'en' ? 'Total Sales Transactions' : 'மொத்த விற்பனை பரிவர்த்தனைகள்'}
              </span>
              <span className="text-lg font-bold text-orange-400">{state.sales.length}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">
                {state.language === 'en' ? 'Total Expense Entries' : 'மொத்த செலவு உள்ளீடுகள்'}
              </span>
              <span className="text-lg font-bold text-orange-400">{state.expenses.length}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">
                {state.language === 'en' ? 'Average Sale Amount' : 'சராசரி விற்பனை தொகை'}
              </span>
              <span className="text-lg font-bold text-green-400">
                ₹{state.sales.length > 0 ? (totalRevenue / state.sales.length).toFixed(0) : '0'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">
                {state.language === 'en' ? 'Items Sold Today' : 'இன்று விற்பனை செய்யப்பட்ட பொருட்கள்'}
              </span>
              <span className="text-lg font-bold text-blue-400">
                {state.sales.filter(sale => sale.date === new Date().toISOString().split('T')[0])
                  .reduce((total, sale) => total + sale.items.boneless100g + sale.items.boneless20g + sale.items.pakoda100g, 0)
                }
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card title={state.language === 'en' ? 'Daily Transaction History' : 'தினசரி பரிவர்த்தனை வரலாறு'}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left p-3">{state.language === 'en' ? 'Date' : 'தேதி'}</th>
                <th className="text-right p-3">{state.language === 'en' ? 'Revenue' : 'வருமானம்'}</th>
                <th className="text-right p-3">{state.language === 'en' ? 'Expenses' : 'செலவுகள்'}</th>
                <th className="text-right p-3">{state.language === 'en' ? 'Profit' : 'லாபம்'}</th>
                <th className="text-right p-3">{state.language === 'en' ? 'Margin' : 'விளிம்பு'}</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.slice(-10).reverse().map((day, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{new Date(day.date).toLocaleDateString()}</td>
                  <td className="p-3 text-right text-green-400">₹{day.revenue}</td>
                  <td className="p-3 text-right text-red-400">₹{day.expenses}</td>
                  <td className={`p-3 text-right font-semibold ${day.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{day.profit}
                  </td>
                  <td className="p-3 text-right text-blue-400">
                    {day.revenue > 0 ? ((day.profit / day.revenue) * 100).toFixed(1) : '0.0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;