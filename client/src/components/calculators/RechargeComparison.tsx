import { useState } from 'react';
import { CreditCard, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/calculations';
import type { Country, RechargePackage } from '@shared/schema';

export default function RechargeComparison() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const { data: packages = [] } = useQuery<RechargePackage[]>({
    queryKey: ['/api/recharge-packages'],
    enabled: !!selectedCountry,
  });

  const handleCountryChange = (countryId: string) => {
    const country = countries.find(c => c.id === parseInt(countryId));
    setSelectedCountry(country || null);
  };

  const countryPackages = packages.filter(pkg => pkg.countryId === selectedCountry?.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-tiktok-pink" />
            Select Country for Recharge Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline w-4 h-4 text-tiktok-cyan mr-2" />
              Country
            </Label>
            <Select onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.flag || '🏳️'} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedCountry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {selectedCountry.flag || '🏳️'} {selectedCountry.name} - TikTok Coin Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coins</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Cost per Coin</TableHead>
                  <TableHead>Best Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countryPackages.map((pkg) => {
                  const costPerCoin = parseFloat(pkg.price) / pkg.coins;
                  const bestValue = costPerCoin === Math.min(...countryPackages.map(p => parseFloat(p.price) / p.coins));
                  
                  return (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.coins} coins</TableCell>
                      <TableCell>
                        {formatCurrency(parseFloat(pkg.price), pkg.currency)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(costPerCoin, pkg.currency)}
                      </TableCell>
                      <TableCell>
                        {bestValue && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Best Value
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {countries.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Country Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.slice(0, 6).map((country) => (
                <div key={country.id} className="p-4 border rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{country.flag || '🏳️'}</div>
                    <div className="font-semibold">{country.flag} {country.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      70 coins ≈ {formatCurrency(70 * parseFloat(country.coinRate), country.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
