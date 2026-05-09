import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator as CalcIcon, PlusCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculatorProps {
  onAdd: (data: { income: number; amount: number; description: string; date: string }) => void;
}

export default function Calculator({ onAdd }: CalculatorProps) {
  const [income, setIncome] = useState<string>('');
  const [bonusPercent, setBonusPercent] = useState<string>('0');
  const [description, setDescription] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  const parsedIncome = income ? parseFloat(income) : 0;
  const baseTithe = parsedIncome * 0.1;
  const bonusAmount = parsedIncome * (parseFloat(bonusPercent || '0') / 100);
  const totalAmount = baseTithe + bonusAmount;

  const handleSave = () => {
    if (!income || isNaN(parseFloat(income))) return;
    
    onAdd({
      income: parseFloat(income),
      amount: totalAmount,
      bonusPercentage: parseFloat(bonusPercent || '0'),
      bonusAmount: bonusAmount,
      description: description || 'Monthly Tithe',
      date: new Date().toISOString()
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIncome('');
      setBonusPercent('0');
      setDescription('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pt-6 px-4 pb-20 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
          <CardHeader className="pb-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tithe Calculator</h2>
            <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
              <CalcIcon className="w-5 h-5 text-blue-600" />
              Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income" className="text-xs font-bold text-slate-600 uppercase tracking-tight">Income (₱)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg">₱</span>
                <Input
                  id="income"
                  type="number"
                  placeholder="0.00"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="pl-8 h-12 bg-slate-50 border-slate-200 text-lg font-mono focus-visible:ring-blue-500 text-slate-800 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bonus" className="text-xs font-bold text-slate-600 uppercase tracking-tight">Combined Offering Plan (%)</Label>
                <div className="relative">
                  <Input
                    id="bonus"
                    type="number"
                    placeholder="0"
                    value={bonusPercent}
                    onChange={(e) => setBonusPercent(e.target.value)}
                    className="h-12 bg-slate-50 border-slate-200 font-mono focus-visible:ring-blue-500 text-slate-700 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-tight opacity-50">Base Tithe</Label>
                <div className="h-12 flex items-center px-3 bg-slate-100/50 rounded-lg border border-slate-100 text-slate-400 font-mono text-sm">
                  ₱{baseTithe.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold text-slate-600 uppercase tracking-tight">Reference Description</Label>
              <Input
                id="description"
                placeholder="e.g. Salary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-slate-700"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {income && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <Card className="bg-white border-slate-200 overflow-hidden shadow-sm rounded-xl">
              <CardContent className="p-8 text-center space-y-3">
                <p className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Total Contribution</p>
                <h2 className="text-5xl font-bold tracking-tighter text-blue-600 font-mono">
                  ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                {parseFloat(bonusPercent || '0') > 0 && (
                  <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-100">
                    Includes ₱{bonusAmount.toLocaleString()} offering plan
                  </p>
                )}
                <div className="w-12 h-1 bg-blue-100 mx-auto rounded-full"></div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  onClick={handleSave}
                  disabled={isSaved}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-md font-bold rounded-lg shadow-md disabled:bg-emerald-500"
                >
                  {isSaved ? (
                     <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Contribution Logged</span>
                  ) : (
                    <span className="flex items-center gap-2">Log Contribution</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
