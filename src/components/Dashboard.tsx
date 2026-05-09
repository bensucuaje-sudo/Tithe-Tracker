import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { TitheRecord } from '../types';
import { format, startOfMonth, parseISO, isSameMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, TrendingUp, PhilippinePeso } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  records: TitheRecord[];
}

export default function Dashboard({ records }: DashboardProps) {
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; amount: number }> = {};
    
    // Sort records by date to ensure chart is chronological
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedRecords.forEach(record => {
      const date = parseISO(record.date);
      const monthKey = format(date, 'MMM yy');
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, amount: 0 };
      }
      monthlyData[monthKey].amount += record.amount;
    });

    return Object.values(monthlyData).slice(-6); // Last 6 months
  }, [records]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthRecords = records.filter(r => isSameMonth(parseISO(r.date), now));
    const currentMonthTotal = currentMonthRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalTithe = records.reduce((sum, r) => sum + r.amount, 0);
    
    return {
      currentMonthTotal,
      totalTithe,
      count: records.length
    };
  }, [records]);

  return (
    <div className="space-y-6 pt-6 px-4 pb-24 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Performance Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                Current Month
              </div>
              <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">₱{stats.currentMonthTotal.toLocaleString()}</p>
            </CardContent>
            <div className="h-1 bg-blue-500 w-full opacity-20"></div>
          </Card>
          <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <PhilippinePeso className="w-3 h-3 text-emerald-500" />
                YTD Contributions
              </div>
              <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">₱{stats.totalTithe.toLocaleString()}</p>
            </CardContent>
            <div className="h-1 bg-emerald-500 w-full opacity-20"></div>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Monthly Progress</CardTitle>
                <CardDescription className="text-xs text-slate-400">Giving history for the last 6 months.</CardDescription>
              </div>
              <LayoutDashboard className="w-5 h-5 text-slate-200" />
            </div>
          </CardHeader>
          <CardContent className="p-2 pt-6 pr-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  tick={{ fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  tick={{ fill: '#94a3b8', fontWeight: 600 }}
                  tickFormatter={(val) => `₱${val}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }} 
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? '#2563eb' : '#cbd5e1'} 
                      className={index === chartData.length - 1 ? 'drop-shadow-[0_-4px_8px_rgba(37,99,235,0.3)]' : ''}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {records.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto border border-slate-200">
            <CalcIcon className="w-8 h-8 text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-sm italic font-serif">"Commit your work to the Lord..."</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No data records currently available</p>
          </div>
        </div>
      ) : (
        <div className="px-1">
           <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
             <span>Annual Target Progress</span>
             <span className="text-blue-600">Dynamic Estimation</span>
           </div>
           <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-blue-500" 
               initial={{ width: 0 }}
               animate={{ width: '45%' }}
               transition={{ duration: 1, ease: "easeOut" }}
             />
           </div>
        </div>
      )}
    </div>
  );
}

// Re-using icon for empty state
import { Calculator as CalcIcon } from 'lucide-react';
