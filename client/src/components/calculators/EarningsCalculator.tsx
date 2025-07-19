import { useState } from 'react';
import { TrendingUp, Coins, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { calculateCreatorEarnings, formatCurrency } from '@/lib/calculations';
import { EXCHANGE_RATES } from '@/lib/constants';

export default function EarningsCalculator() {
  const [coinsReceived, setCoinsReceived] = useState(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof EXCHANGE_RATES>('USD');
  const [calculatedEarnings, setCalculatedEarnings] = useState(0);

  const handleCalculate = () => {
    const earnings = calculateCreatorEarnings(coinsReceived, selectedCurrency);
    setCalculatedEarnings(earnings);
  };

  const handleCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCoinsReceived(value);
    // Auto-calculate on input change
    const earnings = calculateCreatorEarnings(value, selectedCurrency);
    setCalculatedEarnings(earnings);
  };

  const handleCurrencyChange = (currency: keyof typeof EXCHANGE_RATES) => {
    setSelectedCurrency(currency);
    // Auto-calculate on currency change
    const earnings = calculateCreatorEarnings(coinsReceived, currency);
    setCalculatedEarnings(earnings);
  };

  // Initialize with default calculation
  useState(() => {
    const initialEarnings = calculateCreatorEarnings(coinsReceived, selectedCurrency);
    setCalculatedEarnings(initialEarnings);
  });

  const totalValue = coinsReceived * EXCHANGE_RATES[selectedCurrency];
  const tiktokCommission = totalValue - calculatedEarnings;

  return (
    <Card className="shadow-lg border">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Label htmlFor="coins-received" className="block text-sm font-medium text-gray-700 mb-2">
              <Coins className="inline w-4 h-4 text-tiktok-pink mr-2" />
              Coins Received from Gifts
            </Label>
            <Input
              id="coins-received"
              type="number"
              placeholder="Enter coins received"
              value={coinsReceived}
              onChange={handleCoinsChange}
              className="text-lg"
            />
          </div>

          <div>
            <Label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 text-tiktok-cyan mr-2" />
              Currency
            </Label>
            <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
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

        <div className="mt-8 space-y-4">
          <div className="p-6 bg-gradient-to-r from-green-500 to-tiktok-cyan rounded-lg text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Your Estimated Earnings</div>
              <div className="text-4xl font-bold">
                {formatCurrency(calculatedEarnings, selectedCurrency)}
              </div>
              <div className="text-sm opacity-90 mt-2">
                After TikTok's 50% commission
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">Total Value</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatCurrency(totalValue, selectedCurrency)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-red-600 mb-1">TikTok Commission</div>
                <div className="text-xl font-bold text-red-700">
                  {formatCurrency(tiktokCommission, selectedCurrency)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-green-600 mb-1">Your Share</div>
                <div className="text-xl font-bold text-green-700">
                  50%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Calculate Earnings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
