import { TitheRecord } from '../types';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';
import { History as HistoryIcon, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface HistoryProps {
  records: TitheRecord[];
  onDelete: (id: string) => void;
}

export default function History({ records, onDelete }: HistoryProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Financial Reports</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contribution Audit Log</p>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          {records.length} TOTAL
        </span>
      </div>

      <ScrollArea className="flex-1 px-4 pb-24">
        {records.length > 0 ? (
          <div className="py-6 space-y-4">
            <AnimatePresence initial={false}>
              {[...records].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:bg-slate-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 text-sm">{record.description}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          {format(parseISO(record.date), 'MMM dd, yyyy • HH:mm')}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900 font-mono tracking-tighter">₱{record.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Logged Contribution</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                          Basis: <span className="text-slate-800 font-mono">₱{record.income.toLocaleString()}</span>
                        </p>
                        {record.bonusAmount > 0 && (
                          <p className="text-[9px] text-emerald-600 font-bold">
                            + ₱{record.bonusAmount.toLocaleString()} offering ({record.bonusPercentage}%)
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(record.id)}
                        className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 italic font-serif text-slate-200 text-3xl">
              †
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Archive empty</p>
              <p className="text-slate-300 text-xs">Awaiting primary financial contributions.</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
