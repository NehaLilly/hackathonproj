export interface EnergyTopic {
  keywords: string[];
  responses: string[];
  suggestions: string[];
}

export const ENERGY_KNOWLEDGE_BASE: Record<string, EnergyTopic> = {
  lighting: {
    keywords: ['light', 'led', 'bulb', 'lamp', 'illuminate', 'brightness'],
    responses: [
      "LED bulbs are incredibly efficient! They use 75% less energy than incandescent bulbs and last 25 times longer. A typical LED bulb costs $2-4 but saves $80+ over its lifetime.",
      "Smart lighting can save even more energy. Motion sensors, dimmer switches, and smart bulbs that adjust based on natural light can reduce lighting costs by up to 60%.",
      "The best lighting strategy: Use natural light during the day, LED bulbs for artificial lighting, and turn off lights when leaving rooms. This simple approach can cut lighting costs in half."
    ],
    suggestions: [
      "LED vs CFL comparison",
      "Smart lighting benefits",
      "Best LED bulb types",
      "Lighting automation tips"
    ]
  },

  cooling: {
    keywords: ['ac', 'air condition', 'cool', 'temperature', 'thermostat', 'fan'],
    responses: [
      "Optimal AC settings: 78°F (26°C) when home, 85°F (29°C) when away. Each degree lower increases your bill by 6-8%. Use ceiling fans to feel comfortable at higher temperatures!",
      "AC efficiency tips: Clean filters monthly, seal air leaks, use programmable thermostats, and consider upgrading to ENERGY STAR models. These changes can reduce cooling costs by 20-30%.",
      "Smart cooling strategy: Use ceiling fans, close blinds during hot days, and set your AC to 'auto' mode rather than 'on'. This prevents overcooling and reduces energy waste."
    ],
    suggestions: [
      "Ceiling fan benefits",
      "AC maintenance checklist",
      "Smart thermostat options",
      "Heat pump vs AC"
    ]
  },

  heating: {
    keywords: ['heat', 'furnace', 'boiler', 'warm', 'winter', 'insulation'],
    responses: [
      "Heating efficiency: Lower your thermostat by 7-10°F when away to save up to 10% annually. Use a programmable thermostat for automatic temperature control.",
      "Insulation is key! Proper insulation in attics, walls, and basements can reduce heating costs by 15-30%. Seal air leaks around windows and doors for immediate savings.",
      "Heat pump systems are highly efficient for moderate climates, using 50% less energy than traditional heating. Consider upgrading if your system is over 15 years old."
    ],
    suggestions: [
      "Insulation types and costs",
      "Heat pump benefits",
      "Weatherization tips",
      "Programmable thermostat setup"
    ]
  },

  appliances: {
    keywords: ['appliance', 'refrigerator', 'washer', 'dryer', 'dishwasher', 'oven', 'microwave'],
    responses: [
      "ENERGY STAR appliances use 10-50% less energy than standard models. When replacing appliances, the energy savings often pay for the upgrade within 3-5 years.",
      "Appliance efficiency tips: Run full loads in dishwashers and washing machines, use cold water for laundry, keep refrigerator at 37-40°F, and unplug small appliances when not in use.",
      "Smart appliances can optimize energy use automatically. Smart water heaters, refrigerators, and washing machines can reduce energy consumption by 10-20% through intelligent scheduling."
    ],
    suggestions: [
      "ENERGY STAR savings calculator",
      "Appliance replacement guide",
      "Smart appliance benefits",
      "Maintenance schedules"
    ]
  },

  phantom: {
    keywords: ['phantom', 'standby', 'vampire', 'unplug', 'power strip', 'idle'],
    responses: [
      "Phantom loads account for 5-10% of your electricity bill! Common culprits: TVs, cable boxes, chargers, coffee makers, and computers. Use power strips to easily cut power to multiple devices.",
      "Smart power strips automatically cut standby power to devices when they're not in use. This can save $100-200 annually without any lifestyle changes.",
      "The biggest phantom load offenders: Entertainment centers (up to $165/year), home office equipment ($75/year), and kitchen appliances ($50/year). Unplugging these when not in use adds up!"
    ],
    suggestions: [
      "Smart power strip options",
      "Energy monitoring devices",
      "Phantom load calculator",
      "Automatic outlet timers"
    ]
  },

  solar: {
    keywords: ['solar', 'panel', 'renewable', 'grid', 'battery', 'inverter'],
    responses: [
      "Solar panels can eliminate 50-90% of your electricity bill! Average homes save $1,000-1,500 annually. With federal tax credits (30%) and local incentives, most systems pay for themselves in 6-10 years.",
      "Solar + battery storage provides energy independence and backup power. While batteries add cost, they maximize solar savings and provide peace of mind during outages.",
      "Solar works in most climates! Even cloudy regions can benefit. The key factors are roof condition, orientation (south-facing is best), and local electricity rates."
    ],
    suggestions: [
      "Solar calculator for your home",
      "Solar incentives and rebates",
      "Battery storage options",
      "Solar installation process"
    ]
  },

  water: {
    keywords: ['water', 'heater', 'hot', 'shower', 'bath', 'tank', 'tankless'],
    responses: [
      "Water heating accounts for 18% of your energy bill! Set your water heater to 120°F (49°C) instead of 140°F to save 6-10% without noticing a difference.",
      "Tankless water heaters are 24-34% more efficient than storage tank heaters. They provide hot water on demand and last 20+ years vs 10-15 for tank heaters.",
      "Simple water heating savings: Take shorter showers, fix leaks promptly, insulate hot water pipes, and use cold water for laundry. These changes can reduce water heating costs by 25%."
    ],
    suggestions: [
      "Tankless vs tank comparison",
      "Water heater maintenance",
      "Low-flow fixtures benefits",
      "Heat pump water heaters"
    ]
  }
};

export const findBestMatch = (query: string): EnergyTopic | null => {
  const lowerQuery = query.toLowerCase();
  
  for (const [topic, data] of Object.entries(ENERGY_KNOWLEDGE_BASE)) {
    if (data.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return data;
    }
  }
  
  return null;
};

export const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};