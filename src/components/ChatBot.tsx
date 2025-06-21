import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Lightbulb, Zap } from 'lucide-react';
import { BillCalculation, Appliance } from '../types';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface Props {
  billData: BillCalculation | null;
  appliances: Appliance[];
}

const ENERGY_KNOWLEDGE_BASE = {
  greetings: [
    "Hello! I'm your Energy Assistant. I can help you reduce your electricity bill and optimize your energy usage. What would you like to know?",
    "Hi there! I'm here to help you save energy and money. Ask me anything about your electricity usage!",
    "Welcome! I'm your personal energy advisor. How can I help you lower your power bill today?"
  ],
  
  tips: {
    lighting: [
      "Switch to LED bulbs - they use 75% less energy than incandescent bulbs",
      "Use natural light during the day and turn off lights when leaving rooms",
      "Consider motion sensors for outdoor and basement lighting"
    ],
    cooling: [
      "Set your AC to 78°F (26°C) when home, higher when away",
      "Use ceiling fans to feel cooler at higher temperatures",
      "Close blinds during hot days to reduce heat gain",
      "Clean or replace AC filters monthly for better efficiency"
    ],
    heating: [
      "Lower your thermostat by 7-10°F when away to save up to 10% annually",
      "Seal air leaks around windows and doors",
      "Use a programmable thermostat for automatic temperature control"
    ],
    appliances: [
      "Unplug electronics when not in use to eliminate phantom loads",
      "Run dishwashers and washing machines with full loads",
      "Use cold water for washing clothes when possible",
      "Keep your refrigerator between 37-40°F and freezer at 5°F"
    ]
  }
};

const QUICK_SUGGESTIONS = [
  "How to reduce my bill?",
  "LED vs incandescent bulbs",
  "Best AC temperature?",
  "Phantom load devices",
  "Energy efficient appliances",
  "Solar panel benefits"
];

export default function ChatBot({ billData, appliances }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      const greeting = ENERGY_KNOWLEDGE_BASE.greetings[
        Math.floor(Math.random() * ENERGY_KNOWLEDGE_BASE.greetings.length)
      ];
      
      setTimeout(() => {
        addBotMessage(greeting, QUICK_SUGGESTIONS.slice(0, 3));
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, suggestions?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, message]);
    setIsTyping(false);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const generatePersonalizedResponse = (query: string): { response: string; suggestions?: string[] } => {
    const lowerQuery = query.toLowerCase();
    
    // Bill-specific responses
    if (billData && (lowerQuery.includes('bill') || lowerQuery.includes('cost') || lowerQuery.includes('reduce'))) {
      const topAppliance = billData.applianceBreakdown
        .sort((a, b) => b.monthlyCost - a.monthlyCost)[0];
      
      if (topAppliance) {
        return {
          response: `Your current monthly bill is $${billData.monthlyBill.toFixed(2)}. Your biggest energy consumer is "${topAppliance.appliance.name}" costing $${topAppliance.monthlyCost.toFixed(2)}/month. Here are some ways to reduce it:`,
          suggestions: getApplianceSpecificTips(topAppliance.appliance.category)
        };
      }
    }

    // Lighting questions
    if (lowerQuery.includes('light') || lowerQuery.includes('led') || lowerQuery.includes('bulb')) {
      return {
        response: "LED bulbs are a great investment! They use 75% less energy than incandescent bulbs and last 25 times longer. A typical LED bulb costs about $2-4 but can save you $80+ over its lifetime.",
        suggestions: ["How much can I save with LEDs?", "Best LED bulb types", "Smart lighting options"]
      };
    }

    // AC/Cooling questions
    if (lowerQuery.includes('ac') || lowerQuery.includes('air condition') || lowerQuery.includes('cool') || lowerQuery.includes('temperature')) {
      return {
        response: "For optimal energy savings, set your AC to 78°F (26°C) when home and 85°F (29°C) when away. Each degree lower can increase your bill by 6-8%. Use ceiling fans to feel comfortable at higher temperatures!",
        suggestions: ["Ceiling fan benefits", "AC maintenance tips", "Smart thermostat options"]
      };
    }

    // Phantom load questions
    if (lowerQuery.includes('phantom') || lowerQuery.includes('standby') || lowerQuery.includes('unplug')) {
      return {
        response: "Phantom loads (standby power) can account for 5-10% of your electricity bill! Common culprits include TVs, cable boxes, chargers, and coffee makers. Use power strips to easily cut power to multiple devices.",
        suggestions: ["Which devices to unplug?", "Smart power strips", "Energy monitoring devices"]
      };
    }

    // Appliance questions
    if (lowerQuery.includes('appliance') || lowerQuery.includes('refrigerator') || lowerQuery.includes('washer') || lowerQuery.includes('dryer')) {
      return {
        response: "When buying new appliances, look for ENERGY STAR certified models. They use 10-50% less energy than standard models. For existing appliances, proper maintenance is key - clean filters, check seals, and use appropriate settings.",
        suggestions: ["ENERGY STAR benefits", "Appliance maintenance tips", "When to replace old appliances"]
      };
    }

    // Solar questions
    if (lowerQuery.includes('solar') || lowerQuery.includes('panel')) {
      return {
        response: "Solar panels can significantly reduce your electricity bill! The average home can save $1,000-1,500 annually. With federal tax credits and local incentives, most systems pay for themselves in 6-10 years.",
        suggestions: ["Solar installation cost", "Solar incentives", "How much solar do I need?"]
      };
    }

    // Default response with personalized touch
    let response = "I'd be happy to help you save energy! ";
    
    if (billData) {
      response += `With your current usage of ${billData.totalKwh.toFixed(0)} kWh/month, there are several ways to reduce your bill. `;
    }
    
    response += "What specific area would you like to focus on?";

    return {
      response,
      suggestions: ["Reduce heating/cooling costs", "Lower lighting bills", "Appliance efficiency tips", "Phantom load elimination"]
    };
  };

  const getApplianceSpecificTips = (category: string): string[] => {
    switch (category) {
      case 'Heating & Cooling':
        return ENERGY_KNOWLEDGE_BASE.tips.cooling.slice(0, 3);
      case 'Lighting':
        return ENERGY_KNOWLEDGE_BASE.tips.lighting.slice(0, 3);
      case 'Kitchen':
      case 'Laundry':
      case 'Electronics':
        return ENERGY_KNOWLEDGE_BASE.tips.appliances.slice(0, 3);
      default:
        return ["Use energy-efficient settings", "Unplug when not in use", "Consider upgrading to ENERGY STAR models"];
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addUserMessage(inputText);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { response, suggestions } = generatePersonalizedResponse(inputText);
      addBotMessage(response, suggestions);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addUserMessage(suggestion);
    setIsTyping(true);

    setTimeout(() => {
      const { response, suggestions } = generatePersonalizedResponse(suggestion);
      addBotMessage(response, suggestions);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Simple Circle */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Energy Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help you save energy</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-white text-gray-800 shadow-sm border'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div className={`flex-shrink-0 ${message.isBot ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isBot
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about reducing your energy usage..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}