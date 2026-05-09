export interface TitheRecord {
  id: string;
  amount: number;
  income: number;
  bonusPercentage: number;
  bonusAmount: number;
  date: string;
  description: string;
}

export type TabType = 'calculator' | 'dashboard' | 'history';
