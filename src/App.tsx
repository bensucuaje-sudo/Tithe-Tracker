/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTitheData } from './hooks/useTitheData';
import { TabType } from './types';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import History from './components/History';
import { Calculator as CalcIcon, LayoutDashboard, History as HistoryIcon, Cross } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import logo from './assets/Symbol-Circle_47fb0582-4313-40f2-aee7-04d91cd8df01-1.png';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const { records, addRecord, deleteRecord } = useTitheData();

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <Calculator onAdd={addRecord} />;
      case 'dashboard':
        return <Dashboard records={records} />;
      case 'history':
        return <History records={records} onDelete={deleteRecord} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-slate-50 overflow-hidden selection:bg-blue-100">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between bg-slate-800 text-white shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#003057] rounded-full flex items-center justify-center shadow-lg overflow-hidden border border-white/30">
             <img 
               src={logo} 
               alt="SDA Logo" 
               className="w-full h-full p-1.5 object-contain"
               referrerPolicy="no-referrer"
             />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AdventistMedia</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.25em] -mt-0.5">Tithe Tracker</p>
          </div>
        </div>
        <div className="flex items-center text-[10px] space-x-2 bg-emerald-900/50 text-emerald-300 px-2 py-1 rounded border border-emerald-700/50">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="font-semibold uppercase tracking-wider">Offline</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="h-full overflow-y-auto overflow-x-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-white border-t border-slate-200 px-6 flex items-center justify-around pb-4 pt-2 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <NavButton 
          active={activeTab === 'calculator'} 
          icon={<CalcIcon className="w-5 h-5" />} 
          label="Calc" 
          onClick={() => setActiveTab('calculator')} 
        />
        <NavButton 
          active={activeTab === 'dashboard'} 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          label="Monthly" 
          onClick={() => setActiveTab('dashboard')} 
        />
        <NavButton 
          active={activeTab === 'history'} 
          icon={<HistoryIcon className="w-5 h-5" />} 
          label="Reports" 
          onClick={() => setActiveTab('history')} 
        />
      </nav>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function NavButton({ active, icon, label, onClick }: NavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-all relative py-2 px-4 rounded-xl",
        active ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute inset-0 bg-blue-50 rounded-xl -z-10 border border-blue-100/50"
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        />
      )}
      <div className={cn(
        "transition-transform",
        active ? "scale-110" : "scale-100"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-widest",
        active ? "opacity-100" : "opacity-70 text-slate-400"
      )}>
        {label}
      </span>
    </button>
  );
}

