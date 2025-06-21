import { BoltChatBot } from './components/BoltChatBot';
import React, { useState, useEffect } from 'react';
import { Calculator, Zap, Home, TrendingUp, Lightbulb, Settings as SettingsIcon } from 'lucide-react';
import ApplianceForm from './components/ApplianceForm';
import BillPredictor from './components/BillPredictor';
import EnergyTips from './components/EnergyTips';
import BillSettings from './components/BillSettings';
import { Appliance, BillCalculation, BillSettings as BillSettingsType } from './types';
import { calculateBill } from './utils/calculations';

function App() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [billData, setBillData] = useState<BillCalculation | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'settings' | 'results' | 'tips'>('input');
  const [billSettings, setBillSettings] = useState<BillSettingsType>({
    region: 'National Average',
    useTimeOfUse: false,
    season: 'summer',
    homeSize: 'medium',
    efficiencyRating: 'average'
  });

  useEffect(() => {
    if (appliances.length > 0) {
      const calculation = calculateBill(appliances, billSettings);
      setBillData(calculation);
    } else {
      setBillData(null);
    }
  }, [appliances, billSettings]);

  const addAppliance = (appliance: Appliance) => {
    setAppliances(prev => [...prev, { ...appliance, id: Date.now().toString() }]);
  };

  const removeAppliance = (id: string) => {
    setAppliances(prev => prev.filter(a => a.id !== id));
  };

  const updateAppliance = (id: string, updatedAppliance: Partial<Appliance>) => {
    setAppliances(prev => prev.map(a => 
      a.id === id ? { ...a, ...updatedAppliance } : a
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PowerPredict</h1>
                <p className="text-sm text-gray-600">Smart electricity bill prediction</p>
              </div>
            </div>
            
            {billData && (
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{billData.totalKwh.toFixed(1)} kWh</p>
                  <p className="text-gray-500">Monthly Usage</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-2xl text-green-600">${billData.monthlyBill.toFixed(2)}</p>
                  <p className="text-gray-500">Estimated Bill</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'input'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Your Appliances</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'results'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            disabled={!billData}
          >
            <Calculator className="h-4 w-4" />
            <span>Bill Prediction</span>
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'tips'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Energy Tips</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {activeTab === 'input' && (
          <ApplianceForm 
            appliances={appliances}
            onAddAppliance={addAppliance}
            onRemoveAppliance={removeAppliance}
            onUpdateAppliance={updateAppliance}
          />
        )}
        
        {activeTab === 'settings' && (
          <BillSettings 
            settings={billSettings}
            onSettingsChange={setBillSettings}
          />
        )}
        
        {activeTab === 'results' && billData && (
          <BillPredictor billData={billData} appliances={appliances} />
        )}
        
        {activeTab === 'tips' && (
          <EnergyTips billData={billData} />
        )}
      </main>
      {billData && (
  <BoltChatBot
    prediction={{
      usageLevel: billData.monthlyBill > 1500 ? 'high' : 'medium',
      currentMonth: billData.monthlyBill,
      potentialSavings: billData.monthlyBill * 0.25,
    }}
  />
)}
    </div>
  );
}

export default App;
