import { useState } from 'react';
import { Wallet, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calculateWithdrawalAmount, formatCurrency } from '@/lib/calculations';
import { EXCHANGE_RATES } from '@/lib/constants';

export default function WithdrawCalculator() {
  const [coinsToWithdraw, setCoinsToWithdraw] = useState(2000);
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof EXCHANGE_RATES>('USD');
  const [withdrawalFee, setWithdrawalFee] = useState(0.05); // 5% default fee
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const handleCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCoinsToWithdraw(value);
    // Auto-calculate
    const amount = calculateWithdrawalAmount(value, selectedCurrency, withdrawalFee);
    setCalculatedAmount(amount);
  };

  const handleCurrencyChange = (currency: keyof typeof EXCHANGE_RATES) => {
    setSelectedCurrency(currency);
    // Auto-calculate
    const amount = calculateWithdrawalAmount(coinsToWithdraw, currency, withdrawalFee);
    setCalculatedAmount(amount);
  };

  const handleFeeChange = (fee: string) => {
    const feeValue = parseFloat(fee);
    setWithdrawalFee(feeValue);
    // Auto-calculate
    const amount = calculateWithdrawalAmount(coinsToWithdraw, selectedCurrency, feeValue);
    setCalculatedAmount(amount);
  };

  // Initialize with default calculation
  useState(() => {
    const initialAmount = calculateWithdrawalAmount(coinsToWithdraw, selectedCurrency, withdrawalFee);
    setCalculatedAmount(initialAmount);
  });

  const totalValue = coinsToWithdraw * EXCHANGE_RATES[selectedCurrency];
  const creatorEarnings = totalValue * 0.5; // 50% after TikTok commission
  const withdrawalFeeAmount = creatorEarnings * withdrawalFee;
  const finalAmount = calculatedAmount;

  const minimumWithdrawal = selectedCurrency === 'USD' ? 20 : 
                           selectedCurrency === 'INR' ? 1500 : 
                           selectedCurrency === 'PKR' ? 5000 : 20;

  return (
    <Card className="shadow-lg border">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="coins-withdraw" className="block text-sm font-medium text-gray-700 mb-2">
              <Wallet className="inline w-4 h-4 text-tiktok-pink mr-2" />
              Coins to Withdraw
            </Label>
            <Input
              id="coins-withdraw"
              type="number"
              placeholder="Enter coins"
              value={coinsToWithdraw}
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

          <div>
            <Label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Fee
            </Label>
            <Select value={withdrawalFee.toString()} onValueChange={handleFeeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.05">5% (Standard)</SelectItem>
                <SelectItem value="0.03">3% (Premium)</SelectItem>
                <SelectItem value="0.07">7% (High)</SelectItem>
                <SelectItem value="0.02">2% (Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="p-6 bg-gradient-to-r from-green-500 to-tiktok-cyan rounded-lg text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Final Withdrawal Amount</div>
              <div className="text-4xl font-bold">
                {formatCurrency(finalAmount, selectedCurrency)}
              </div>
              <div className="text-sm opacity-90 mt-2">
                After all fees and commissions
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">Total Value</div>
                <div className="text-lg font-bold text-blue-700">
                  {formatCurrency(totalValue, selectedCurrency)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-yellow-600 mb-1">Creator Share</div>
                <div className="text-lg font-bold text-yellow-700">
                  {formatCurrency(creatorEarnings, selectedCurrency)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-red-600 mb-1">Withdrawal Fee</div>
                <div className="text-lg font-bold text-red-700">
                  {formatCurrency(withdrawalFeeAmount, selectedCurrency)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-green-600 mb-1">You Receive</div>
                <div className="text-lg font-bold text-green-700">
                  {formatCurrency(finalAmount, selectedCurrency)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {finalAmount < minimumWithdrawal && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Minimum withdrawal amount is {formatCurrency(minimumWithdrawal, selectedCurrency)}. 
              You need at least {Math.ceil((minimumWithdrawal / finalAmount) * coinsToWithdraw)} coins to withdraw.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Withdrawal Information</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>• Processing time: 3-5 business days</p>
            <p>• Minimum withdrawal: {formatCurrency(minimumWithdrawal, selectedCurrency)}</p>
            <p>• TikTok commission: 50% of gift value</p>
            <p>• Additional fees may apply depending on payment method</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
