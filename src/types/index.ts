export interface Appliance {
  id: string;
  name: string;
  category: string;
  wattage: number;
  hoursPerDay: number;
  daysPerMonth: number;
  costPerKwh?: number;
}

export interface BillCalculation {
  totalKwh: number;
  monthlyBill: number;
  yearlyBill: number;
  dailyAverage: number;
  applianceBreakdown: ApplianceUsage[];
  categoryBreakdown: CategoryUsage[];
}

export interface ApplianceUsage {
  appliance: Appliance;
  monthlyKwh: number;
  monthlyCost: number;
  percentage: number;
}

export interface CategoryUsage {
  category: string;
  monthlyKwh: number;
  monthlyCost: number;
  percentage: number;
  color: string;
}

export interface EnergyTip {
  title: string;
  description: string;
  potentialSavings: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface BillSettings {
  region: string;
  useTimeOfUse: boolean;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  homeSize: 'small' | 'medium' | 'large';
  efficiencyRating: 'poor' | 'average' | 'good' | 'excellent';
}