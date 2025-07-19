import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Coins } from 'lucide-react';

export default function LiveCalculatorDemo() {
  const [coinCount, setCoinCount] = useState(1000);
  const [usdValue, setUsdValue] = useState(13.99);
  const [creatorEarnings, setCreatorEarnings] = useState(6.99);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live updates with slight variations
      const baseCoinRate = 0.01399; // Base rate for USD
      const variation = 0.98 + Math.random() * 0.04; // ±2% variation
      
      const newCoinCount = 900 + Math.floor(Math.random() * 200); // 900-1100 coins
      const newUsdValue = newCoinCount * baseCoinRate * variation;
      const newCreatorEarnings = newUsdValue * 0.5; // 50% creator share
      
      setCoinCount(newCoinCount);
      setUsdValue(newUsdValue);
      setCreatorEarnings(newCreatorEarnings);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 overflow-hidden">
        {/* Browser Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-sm text-gray-500 font-medium">tokrecharge.com</div>
        </div>

        {/* Live Calculator Display */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-purple-800">TikTok Coins</span>
              </div>
              <span className="text-3xl font-bold text-purple-800 transition-all duration-1000">
                {coinCount.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-blue-800">🇺🇸 USD Value</span>
              </div>
              <span className="text-3xl font-bold text-blue-800 transition-all duration-1000">
                ${usdValue.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-green-800">Creator Earns</span>
              </div>
              <span className="text-3xl font-bold text-green-800 transition-all duration-1000">
                ${creatorEarnings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Live calculation updates every 3 seconds</span>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
        <span className="text-2xl">💰</span>
      </div>
      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
        <span className="text-lg">🎁</span>
      </div>
    </div>
  );
}