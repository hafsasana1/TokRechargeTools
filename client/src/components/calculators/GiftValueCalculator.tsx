import { useState } from 'react';
import { Gift, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { calculateCoinValue, formatCurrency } from '@/lib/calculations';
import { EXCHANGE_RATES } from '@/lib/constants';
import type { Gift as GiftType } from '@shared/schema';

export default function GiftValueCalculator() {
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof EXCHANGE_RATES>('USD');

  const { data: gifts = [], isLoading } = useQuery<GiftType[]>({
    queryKey: ['/api/gifts'],
  });

  const handleGiftChange = (giftId: string) => {
    const gift = gifts.find(g => g.id === parseInt(giftId));
    setSelectedGift(gift || null);
  };

  const calculatedValue = selectedGift 
    ? calculateCoinValue(selectedGift.coinCost, selectedCurrency) 
    : 0;

  const creatorEarnings = calculatedValue * 0.5; // 50% creator share

  if (isLoading) {
    return <div className="text-center py-8">Loading gifts...</div>;
  }

  return (
    <Card className="shadow-lg border">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Label htmlFor="gift-select" className="block text-sm font-medium text-gray-700 mb-2">
              <Gift className="inline w-4 h-4 text-tiktok-pink mr-2" />
              Select Gift
            </Label>
            <Select onValueChange={handleGiftChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a TikTok gift" />
              </SelectTrigger>
              <SelectContent>
                {gifts.map((gift) => (
                  <SelectItem key={gift.id} value={gift.id.toString()}>
                    {gift.name} - {gift.coinCost} coins
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 text-tiktok-cyan mr-2" />
              Currency
            </Label>
            <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as keyof typeof EXCHANGE_RATES)}>
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

        {selectedGift && (
          <div className="mt-8 space-y-4">
            <div className="p-6 bg-gradient-to-r from-tiktok-pink to-tiktok-cyan rounded-lg text-white">
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">Gift Cost</div>
                <div className="text-4xl font-bold">
                  {formatCurrency(calculatedValue, selectedCurrency)}
                </div>
                <div className="text-sm opacity-90 mt-2">
                  {selectedGift.coinCost} TikTok Coins
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-green-600 mb-1">Creator Receives</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(creatorEarnings, selectedCurrency)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {selectedGift.diamondValue} diamonds
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-blue-600 mb-1">Gift Rarity</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {selectedGift.rarity}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {selectedGift.category} category
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
