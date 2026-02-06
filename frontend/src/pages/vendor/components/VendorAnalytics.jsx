// import { useMemo } from 'react';
// import { 
//   LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
// } from 'recharts';
// import { TrendingUp, ShoppingBag, DollarSign, Clock } from 'lucide-react';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// const VendorAnalytics = ({ stats, orders, products }) => {

//     // 1. Sales Trends (Daily Sales for last 7 days)
//     const salesInteractions = useMemo(() => {
//         const last7Days = [...Array(7)].map((_, i) => {
//             const d = new Date();
//             d.setDate(d.getDate() - i);
//             return d.toISOString().split('T')[0]; // YYYY-MM-DD
//         }).reverse();

//         return last7Days.map(date => {
//             const dailyOrders = orders.filter(o => {
//                 // Use robust date checking
//                 const orderDate = new Date(o.createdAt).toISOString().split('T')[0]; 
//                 // Note: ideally use deliveredAt for revenue, but createdAt for 'sales activity'
//                 return orderDate === date && o.isDelivered;
//             });
            
//             const revenue = dailyOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
//             return {
//                 date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
//                 revenue: revenue
//             };
//         });
//     }, [orders]);

//     // 2. Best Selling Products
//     const bestSellers = useMemo(() => {
//         const productMap = {};
//         orders.forEach(order => {
//              if (!order.isDelivered) return;
//              order.orderItems.forEach(item => {
//                  const id = item.product._id || item.product;
//                  // Assuming item.name is available, if not need lookup from products array
//                  if (!productMap[id]) productMap[id] = { name: item.name, sales: 0 };
//                  productMap[id].sales += Number(item.qty);
//              });
//         });

//         return Object.values(productMap)
//             .sort((a, b) => b.sales - a.sales)
//             .slice(0, 5); // Top 5
//     }, [orders]);


//     // 3. Category Distribution
//     const categoryData = useMemo(() => {
//         const catMap = {};
//         products.forEach(p => {
//             if (!catMap[p.category]) catMap[p.category] = 0;
//             catMap[p.category] += 1;
//         });
//         return Object.keys(catMap).map((key, index) => ({
//             name: key,
//             value: catMap[key]
//         }));
//     }, [products]);


//     return (
//         <div className="space-y-8">
//             <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>

//             {/* Key Metrics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                     <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
//                     <h3 className="text-2xl font-bold text-gray-900 mt-2">${stats.monthlyRevenue.toLocaleString()}</h3>
//                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1"><TrendingUp size={14}/> +12.5% vs last month</div>
//                 </div>
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                      <p className="text-gray-500 text-sm font-medium">Total Orders</p>
//                     <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</h3>
//                     <div className="mt-2 text-xs text-blue-600 flex items-center gap-1"><ShoppingBag size={14}/> Lifetime Volume</div>
//                 </div>
//                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                      <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
//                      {/* Safe division */}
//                     <h3 className="text-2xl font-bold text-gray-900 mt-2">
//                         ${stats.deliveredOrders > 0 ? (stats.monthlyRevenue / stats.deliveredOrders).toFixed(2) : '0.00'}
//                     </h3>
//                     <div className="mt-2 text-xs text-purple-600 flex items-center gap-1"><DollarSign size={14}/> Revenue / Order</div>
//                 </div>
//                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                      <p className="text-gray-500 text-sm font-medium">Pending Processing</p>
//                     <h3 className="text-2xl font-bold text-orange-600 mt-2">{stats.pendingOrders}</h3>
//                      <div className="mt-2 text-xs text-orange-500 flex items-center gap-1"><Clock size={14}/> Needs Action</div>
//                 </div>
//             </div>

//             {/* Charts Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
//                 {/* Sales Over Time */}
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                     <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trends (Last 7 Days)</h3>
//                     <div className="h-64">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <LineChart data={salesInteractions}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
//                                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10}/>
//                                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `$${value}`}/>
//                                 <Tooltip 
//                                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//                                     cursor={{ stroke: '#EF4444', strokeWidth: 2 }}
//                                 />
//                                 <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 {/* Best Selling Products */}
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                      <h3 className="text-lg font-bold text-gray-800 mb-6">Best Selling Products</h3>
//                      <div className="h-64">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={bestSellers} layout="vertical" margin={{ left: 20 }}>
//                                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB"/>
//                                 <XAxis type="number" hide />
//                                 <YAxis type="category" dataKey="name" width={100} tick={{fill: '#4B5563', fontSize: 12}} />
//                                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
//                                 <Bar dataKey="sales" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                      </div>
//                 </div>

//                  {/* Category Distribution */}
//                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                      <h3 className="text-lg font-bold text-gray-800 mb-6">Product Category Distribution</h3>
//                      <div className="h-64 flex items-center justify-center">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={categoryData}
//                                     cx="50%"
//                                     cy="50%"
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={5}
//                                     dataKey="value"
//                                 >
//                                     {categoryData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip contentStyle={{ borderRadius: '8px' }} />
//                                 <Legend verticalAlign="bottom" height={36}/>
//                             </PieChart>
//                         </ResponsiveContainer>
//                      </div>
//                 </div>

//                  {/* Peak Hours (Mock Data for now as interaction data is limited) */}
//                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                      <h3 className="text-lg font-bold text-gray-800 mb-6">Peak Sales Hours</h3>
//                      <div className="flex items-end justify-between h-64 px-4">
//                          {[10, 45, 30, 70, 40, 60, 20].map((height, i) => (
//                              <div key={i} className="flex flex-col items-center gap-2 group">
//                                  <div 
//                                     className="w-8 bg-blue-100 rounded-t-lg group-hover:bg-blue-600 transition-colors relative" 
//                                     style={{ height: `${height}%` }}
//                                 >
//                                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
//                                         {height}% Activity
//                                     </div>
//                                 </div>
//                                  <span className="text-xs text-gray-500">{12 + i}:00</span>
//                              </div>
//                          ))}
//                      </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default VendorAnalytics;


import { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Clock } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const VendorAnalytics = ({ stats, orders = [], products = [] }) => {

  /* =========================
     1. Revenue Trends (7 Days)
     ========================= */
  const salesInteractions = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-CA'); // LOCAL YYYY-MM-DD
    }).reverse();

    return last7Days.map(date => {
      const dailyOrders = orders.filter(o => {
        if (!o?.createdAt || !o.isDelivered) return false;
        const orderDate = new Date(o.createdAt).toLocaleDateString('en-CA');
        return orderDate === date;
      });

      const revenue = dailyOrders.reduce(
        (sum, o) => sum + (Number(o.totalPrice) || 0),
        0
      );

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue
      };
    });
  }, [orders]);

  /* =========================
     2. Best Selling Products
     ========================= */
  const bestSellers = useMemo(() => {
    const productMap = {};

    orders.forEach(order => {
      if (!order?.isDelivered || !Array.isArray(order.orderItems)) return;

      order.orderItems.forEach(item => {
        const productId =
          typeof item.product === 'object'
            ? item.product._id
            : item.product;

        if (!productId) return;

        if (!productMap[productId]) {
          productMap[productId] = {
            name: item.name || 'Unknown Product',
            sales: 0
          };
        }

        productMap[productId].sales += Number(item.qty) || 0;
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [orders]);

  /* ==================================
     3. Inventory Distribution (NOT SALES)
     ================================== */
  const categoryData = useMemo(() => {
    const catMap = {};

    products.forEach(p => {
      if (!p?.category) return;
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    return Object.keys(catMap).map(key => ({
      name: key,
      value: catMap[key]
    }));
  }, [products]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>

      {/* =========================
         Key Metrics
         ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold mt-2">
            ${stats?.monthlyRevenue?.toLocaleString() || 0}
          </h3>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp size={14} /> Monthly performance
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Orders</p>
          <h3 className="text-2xl font-bold mt-2">
            {stats?.totalOrders || 0}
          </h3>
          <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
            <ShoppingBag size={14} /> Lifetime
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
          <h3 className="text-2xl font-bold mt-2">
            $
            {stats?.deliveredOrders > 0
              ? (stats.monthlyRevenue / stats.deliveredOrders).toFixed(2)
              : '0.00'}
          </h3>
          <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
            <DollarSign size={14} /> Revenue per order
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
          <h3 className="text-2xl font-bold text-orange-600 mt-2">
            {stats?.pendingOrders || 0}
          </h3>
          <div className="mt-2 text-xs text-orange-500 flex items-center gap-1">
            <Clock size={14} /> Needs action
          </div>
        </div>
      </div>

      {/* =========================
         Charts
         ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">
            Revenue Trends (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesInteractions}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Best Selling Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="sales" fill="#8B5CF6" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Distribution */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">
            Inventory Distribution by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours (Demo) */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">
            Peak Sales Hours (Sample Data)
          </h3>
          <div className="flex items-end justify-between h-64 px-4">
            {[10, 45, 30, 70, 40, 60, 20].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 bg-blue-200 rounded-t-lg"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-gray-500">{12 + i}:00</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorAnalytics;
