import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Globe, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CountryData {
  id: number;
  name: string;
  code: string;
  currency: string;
  coinRate: string;
  flag: string;
  coins: number;
  price: string;
  savings?: string;
}

const countryData: CountryData[] = [
  {
    id: 1,
    name: "United States",
    code: "US",
    currency: "USD",
    coinRate: "0.015",
    flag: "🇺🇸",
    coins: 70,
    price: "$1.05"
  },
  {
    id: 2,
    name: "India",
    code: "IN",
    currency: "INR", 
    coinRate: "1.25",
    flag: "🇮🇳",
    coins: 70,
    price: "₹87.50",
    savings: "Save 15%"
  },
  {
    id: 3,
    name: "Pakistan",
    code: "PK",
    currency: "PKR",
    coinRate: "4.2",
    flag: "🇵🇰",
    coins: 70,
    price: "₨294.00",
    savings: "Save 20%"
  },
  {
    id: 4,
    name: "United Kingdom",
    code: "GB",
    currency: "GBP",
    coinRate: "0.012",
    flag: "🇬🇧",
    coins: 70,
    price: "£0.84"
  },
  {
    id: 5,
    name: "Germany",
    code: "DE",
    currency: "EUR",
    coinRate: "0.014",
    flag: "🇩🇪",
    coins: 70,
    price: "€0.98"
  },
  {
    id: 6,
    name: "Canada",
    code: "CA",
    currency: "CAD",
    coinRate: "0.020",
    flag: "🇨🇦",
    coins: 70,
    price: "C$1.40"
  },
  {
    id: 7,
    name: "Australia",
    code: "AU",
    currency: "AUD",
    coinRate: "0.023",
    flag: "🇦🇺",
    coins: 70,
    price: "A$1.61"
  },
  {
    id: 8,
    name: "Japan",
    code: "JP",
    currency: "JPY",
    coinRate: "2.2",
    flag: "🇯🇵",
    coins: 70,
    price: "¥154"
  },
  {
    id: 9,
    name: "Brazil",
    code: "BR",
    currency: "BRL",
    coinRate: "0.075",
    flag: "🇧🇷",
    coins: 70,
    price: "R$5.25",
    savings: "Save 10%"
  },
  {
    id: 10,
    name: "Mexico",
    code: "MX",
    currency: "MXN",
    coinRate: "0.27",
    flag: "🇲🇽",
    coins: 70,
    price: "$18.90"
  },
  {
    id: 11,
    name: "South Korea",
    code: "KR",
    currency: "KRW",
    coinRate: "20.5",
    flag: "🇰🇷",
    coins: 70,
    price: "₩1,435"
  },
  {
    id: 12,
    name: "Turkey",
    code: "TR",
    currency: "TRY",
    coinRate: "0.45",
    flag: "🇹🇷",
    coins: 70,
    price: "₺31.50"
  }
];

export default function CountryPricingSection() {
  const [hoveredCountry, setHoveredCountry] = useState<number | null>(null);

  return (
    <section id="countries" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6">
            <Globe className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Country-Specific Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            TikTok coin rates vary by country. Find your local pricing and compare costs worldwide 
            to get the best value for your recharges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {countryData.map((country) => (
            <Card 
              key={country.id}
              className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredCountry(country.id)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`text-4xl emoji transition-transform duration-300 ${
                      hoveredCountry === country.id ? 'scale-110 animate-bounce' : ''
                    }`}>
                      {country.flag || '🏳️'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{country.code}</h3>
                      <p className="text-sm text-gray-600">{country.name}</p>
                    </div>
                  </div>
                  {country.savings && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
                      {country.savings}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {country.coins} coins
                    </span>
                    <span className="text-2xl font-bold text-gray-800">
                      {country.price}
                    </span>
                  </div>
                  
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ 
                        width: hoveredCountry === country.id ? '100%' : '70%',
                        animation: hoveredCountry === country.id ? 'pulse 2s infinite' : ''
                      }}
                    ></div>
                  </div>
                </div>

                <Link href={`/country-pricing/${country.code.toLowerCase()}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all duration-300"
                  >
                    View {country.name} Prices
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600 animate-pulse" />
            <span className="text-lg font-semibold text-gray-700">
              Prices update in real-time
            </span>
            <Star className="w-6 h-6 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <Link href="/country-pricing">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Globe className="mr-2 h-5 w-5" />
              View All Countries
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}