import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import Card from '../components/Card';

const Home: React.FC = () => {
  const { state, getTotalRevenue, getTotalExpenses, getTotalProfit } = useGlobalContext();

  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const totalProfit = getTotalProfit();

  const stats = [
    {
      title: state.language === 'en' ? 'Total Revenue' : 'மொத்த வருமானம்',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: state.language === 'en' ? 'Total Expenses' : 'மொத்த செலவுகள்',
      value: `₹${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-400'
    },
    {
      title: state.language === 'en' ? 'Total Profit' : 'மொத்த லாபம்',
      value: `₹${totalProfit.toLocaleString()}`,
      icon: DollarSign,
      color: totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      title: state.language === 'en' ? 'Chicken Stock' : 'கோழி இருப்பு',
      value: `${(state.inventory.chickenStock / 1000).toFixed(1)}kg`,
      icon: Package,
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          {state.language === 'en' ? 'Welcome to ChickHub' : 'ChickHub-க்கு வரவேற்கிறோம்'}
        </h1>
        <p className="text-gray-400">
          {state.language === 'en' 
            ? 'Your complete financial tracking solution for chicken business'
            : 'கோழி வணிகத்திற்கான உங்கள் முழுமையான நிதி கண்காணிப்பு தீர்வு'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={state.language === 'en' ? 'Recent Sales' : 'சமீபத்திய விற்பனை'}>
          <div className="space-y-4">
            {state.sales.slice(-5).reverse().map((sale) => (
              <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">{sale.date}</p>
                  <p className="font-semibold">
                    {state.language === 'en' ? 'Items sold' : 'விற்பனை செய்யப்பட்டது'}: {
                      sale.items.boneless100g + sale.items.boneless20g + sale.items.pakoda100g
                    }
                  </p>
                </div>
                <p className="text-green-400 font-bold">₹{sale.total}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title={state.language === 'en' ? 'Recent Expenses' : 'சமீபத்திய செலவுகள்'}>
          <div className="space-y-4">
            {state.expenses.slice(-5).reverse().map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">{expense.date}</p>
                  <p className="font-semibold">
                    {state.language === 'en' ? 'Chicken' : 'கோழி'}: {expense.chicken.weight}g
                  </p>
                </div>
                <p className="text-red-400 font-bold">₹{expense.total}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title={state.language === 'en' ? 'Quick Stats' : 'விரைவு புள்ளிவிவரங்கள்'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {state.language === 'en' ? 'Profit per gram' : 'கிராமுக்கு லாபம்'}
            </p>
            <p className="text-xl font-bold text-orange-400">
              ₹{totalRevenue > 0 ? (totalProfit / (state.expenses.reduce((total, exp) => total + exp.chicken_weight, 0) || 1)).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {state.language === 'en' ? 'Avg Sale per Day' : 'நாளுக்கு சராசரி விற்பனை'}
            </p>
            <p className="text-xl font-bold text-green-400">
              ₹{state.sales.length > 0 ? (totalRevenue / state.sales.length).toFixed(0) : '0'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {state.language === 'en' ? 'Profit Margin' : 'லாப விளிம்பு'}
            </p>
            <p className="text-xl font-bold text-blue-400">
              {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;