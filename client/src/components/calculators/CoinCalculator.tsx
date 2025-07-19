import { useState } from 'react';
import { Coins, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { calculateCoinValue, formatCurrency } from '@/lib/calculations';
import { EXCHANGE_RATES } from '@/lib/constants';

export default function CoinCalculator() {
  const [coinAmount, setCoinAmount] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof EXCHANGE_RATES>('USD');
  const [calculatedValue, setCalculatedValue] = useState(0);

  const handleCalculate = () => {
    const value = calculateCoinValue(coinAmount, selectedCurrency);
    setCalculatedValue(value);
  };

  const handleCoinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCoinAmount(value);
    // Auto-calculate on input change
    const calculated = calculateCoinValue(value, selectedCurrency);
    setCalculatedValue(calculated);
  };

  const handleCurrencyChange = (currency: keyof typeof EXCHANGE_RATES) => {
    setSelectedCurrency(currency);
    // Auto-calculate on currency change
    const calculated = calculateCoinValue(coinAmount, currency);
    setCalculatedValue(calculated);
  };

  // Initialize with default calculation
  useState(() => {
    const initialValue = calculateCoinValue(coinAmount, selectedCurrency);
    setCalculatedValue(initialValue);
  });

  return (
    <Card className="shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <Label htmlFor="coin-amount" className="block text-sm font-semibold text-gray-800 mb-3">
              <Coins className="inline w-5 h-5 text-pink-600 mr-2" />
              TikTok Coins
            </Label>
            <Input
              id="coin-amount"
              type="number"
              placeholder="Enter coin amount"
              value={coinAmount}
              onChange={handleCoinAmountChange}
              className="text-xl font-semibold h-14 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
            />
          </div>

          <div className="relative">
            <Label htmlFor="currency" className="block text-sm font-semibold text-gray-800 mb-3">
              <Globe className="inline w-5 h-5 text-cyan-600 mr-2" />
              Currency
            </Label>
            <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="h-14 border-2 border-gray-200 focus:border-purple-500 rounded-xl text-lg font-semibold">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                <SelectItem value="PKR">🇵🇰 PKR - Pakistani Rupee</SelectItem>
                <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                <SelectItem value="CAD">🇨🇦 CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white shadow-2xl">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-3 font-medium">💰 Estimated Value</div>
            <div className="text-5xl font-bold mb-2 tracking-tight">
              {formatCurrency(calculatedValue, selectedCurrency)}
            </div>
            <div className="text-sm opacity-90 mt-3 bg-black/20 rounded-full px-4 py-2 inline-block">
              1 TikTok Coin ≈ {formatCurrency(EXCHANGE_RATES[selectedCurrency], selectedCurrency)}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleCalculate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Calculate Value
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
