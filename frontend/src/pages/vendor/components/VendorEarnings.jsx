import { TrendingUp, DollarSign, Wallet, CreditCard, Download, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VendorEarnings = ({ stats }) => {
    // Derived Financial Metrics (Mock Logic for Demo)
    const todaySales = Number(stats?.todaySales || 0);
    const monthlyRevenue = Number(stats?.monthlyRevenue || 0);
    
    // Simulating lifetime stats based on monthly (MULTIPLIER FOR DEMO)
    // In real app, this would come from backend
    const totalLifetimeEarnings = monthlyRevenue * 1.5 + 12500; 
    const commissionRate = 0.05; // 5% Platform Fee
    
    const platformCommission = totalLifetimeEarnings * commissionRate;
    const withdrawableBalance = totalLifetimeEarnings - platformCommission - 4500; // Subtracting mock already paid out

    const handleWithdraw = () => {
        toast.success("Withdrawal request sent to admin!");
    };

    const handleDownloadInvoice = () => {
        toast.success("Downloading Invoice PDF...");
    };

    // Mock Payout History
    const payoutHistory = [
        { id: 'PAY-8832', date: '2024-02-15', amount: 4500, status: 'Completed', account: '**** 4432' },
        { id: 'PAY-8833', date: '2024-02-01', amount: 3200, status: 'Completed', account: '**** 4432' },
        { id: 'PAY-8834', date: '2024-01-15', amount: 2800, status: 'Pending', account: '**** 4432' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
                <div className="flex gap-3">
                    <button 
                        onClick={handleDownloadInvoice}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <Download size={18} /> Invoices
                    </button>
                    <button 
                        onClick={handleWithdraw}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm shadow-green-200"
                    >
                        <ArrowUpRight size={18} /> Request Payout
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Total Earnings */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-500 font-medium text-sm">Total Earnings</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">₹{totalLifetimeEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                        <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                            <TrendingUp size={14} /> +12% Lifetime
                        </div>
                    </div>
                     <div className="absolute right-0 top-0 p-6 opacity-10">
                        <DollarSign size={64} className="text-blue-600"/>
                    </div>
                </div>

                {/* Withdrawable Balance */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-gray-500 font-medium text-sm">Available Balance</p>
                        <h3 className="text-2xl font-bold text-green-600 mt-2">₹{withdrawableBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                        <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                            Ready to withdraw
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 p-6 opacity-10">
                        <Wallet size={64} className="text-green-600"/>
                    </div>
                </div>

                 {/* Platform Commission */}
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                         <div>
                            <p className="text-gray-500 font-medium text-sm">Platform Fee (5%)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">- ₹{platformCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                         </div>
                         <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                             <CreditCard size={20} />
                         </div>
                    </div>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                        <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                </div>

                 {/* Pending Payout */}
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <div className="flex justify-between items-start">
                         <div>
                            <p className="text-gray-500 font-medium text-sm">Pending Payout</p>
                            <h3 className="text-2xl font-bold text-orange-500 mt-2">₹2,800</h3>
                         </div>
                         <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                             <Clock size={20} />
                         </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        Scheduled for: Feb 28, 2024
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Snapshot */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-gray-400"/> Monthly Snapshot
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 text-sm">Today's Sales</span>
                            <span className="font-bold text-gray-900">₹{todaySales.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                            <span className="text-blue-700 text-sm">Monthly Revenue</span>
                            <span className="font-bold text-blue-700">₹{monthlyRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payout History Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Payout History</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payoutHistory.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{payout.id}</td>
                                        <td className="px-6 py-4 text-gray-500">{payout.date}</td>
                                        <td className="px-6 py-4 text-gray-900 font-bold">₹{payout.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                payout.status === 'Completed' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {payout.status === 'Completed' && <CheckCircle size={12}/>}
                                                {payout.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorEarnings;
