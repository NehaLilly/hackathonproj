import { BillCalculation, Appliance } from '../types';
import { findBestMatch, getRandomResponse, ENERGY_KNOWLEDGE_BASE } from '../services/energyKnowledgeBase';

export interface ChatResponse {
  response: string;
  suggestions?: string[];
}

export const generatePersonalizedResponse = (
  query: string,
  billData: BillCalculation | null,
  appliances: Appliance[]
): ChatResponse => {
  const lowerQuery = query.toLowerCase();
  
  // Check for bill-specific queries first
  if (billData && (lowerQuery.includes('bill') || lowerQuery.includes('cost') || lowerQuery.includes('reduce'))) {
    return generateBillSpecificResponse(billData, appliances);
  }

  // Find matching topic in knowledge base
  const matchedTopic = findBestMatch(query);
  
  if (matchedTopic) {
    return {
      response: getRandomResponse(matchedTopic.responses),
      suggestions: matchedTopic.suggestions.slice(0, 3)
    };
  }

  // Default personalized response
  return generateDefaultResponse(billData);
};

const generateBillSpecificResponse = (
  billData: BillCalculation,
  appliances: Appliance[]
): ChatResponse => {
  const topAppliances = billData.applianceBreakdown
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
    .slice(0, 3);

  if (topAppliances.length === 0) {
    return {
      response: "I'd love to help you reduce your bill! Add some appliances to get personalized recommendations.",
      suggestions: ["How to add appliances?", "Common household appliances", "Energy saving tips"]
    };
  }

  const topAppliance = topAppliances[0];
  const potentialSavings = calculatePotentialSavings(billData);

  const response = `Your monthly bill is $${billData.monthlyBill.toFixed(2)} with ${billData.totalKwh.toFixed(0)} kWh usage. Your top energy consumer is "${topAppliance.appliance.name}" at $${topAppliance.monthlyCost.toFixed(2)}/month. You could potentially save $${potentialSavings.toFixed(0)}-${(potentialSavings * 1.5).toFixed(0)}/month with targeted improvements!`;

  return {
    response,
    suggestions: getApplianceSpecificTips(topAppliance.appliance.category)
  };
};

const generateDefaultResponse = (billData: BillCalculation | null): ChatResponse => {
  let response = "I'm here to help you save energy and money! ";
  
  if (billData) {
    response += `With your current usage of ${billData.totalKwh.toFixed(0)} kWh/month, there are several optimization opportunities. `;
  }
  
  response += "What would you like to focus on?";

  return {
    response,
    suggestions: [
      "Reduce heating/cooling costs",
      "Lower lighting bills", 
      "Appliance efficiency tips",
      "Eliminate phantom loads"
    ]
  };
};

const calculatePotentialSavings = (billData: BillCalculation): number => {
  // Conservative estimate: 15-25% savings potential
  return billData.monthlyBill * 0.2;
};

const getApplianceSpecificTips = (category: string): string[] => {
  const tipMap: Record<string, string[]> = {
    'Heating & Cooling': [
      "Adjust thermostat settings",
      "Improve insulation",
      "Use ceiling fans"
    ],
    'Lighting': [
      "Switch to LED bulbs",
      "Use natural light",
      "Install motion sensors"
    ],
    'Kitchen': [
      "Use energy-efficient settings",
      "Keep refrigerator optimal temp",
      "Run full dishwasher loads"
    ],
    'Electronics': [
      "Unplug when not in use",
      "Use power strips",
      "Enable power management"
    ],
    'Laundry': [
      "Wash in cold water",
      "Clean dryer lint filter",
      "Air dry when possible"
    ],
    'Water Heating': [
      "Lower water heater temp",
      "Fix leaks promptly",
      "Take shorter showers"
    ]
  };

  return tipMap[category] || [
    "Use energy-efficient settings",
    "Unplug when not in use", 
    "Consider ENERGY STAR upgrade"
  ];
};

export const getGreetingMessage = (): string => {
  const greetings = [
    "Hello! I'm your Energy Assistant. I can help you reduce your electricity bill and optimize your energy usage. What would you like to know?",
    "Hi there! I'm here to help you save energy and money. Ask me anything about your electricity usage!",
    "Welcome! I'm your personal energy advisor. How can I help you lower your power bill today?"
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
};

export const getQuickSuggestions = (): string[] => {
  return [
    "How to reduce my bill?",
    "LED vs incandescent bulbs", 
    "Best AC temperature?",
    "Phantom load devices",
    "Energy efficient appliances",
    "Solar panel benefits"
  ];
};