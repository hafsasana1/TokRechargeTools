import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { Coins, DollarSign, TrendingDown, Clock } from 'lucide-react';

export default function USAPricingPage() {
  const { data: countries } = useQuery({
    queryKey: ['/api/countries'],
  });

  const usaCountry = countries?.find(c => c.code === 'US');

  const coinPackages = [
    { coins: 65, price: 0.99, bonus: 0 },
    { coins: 330, price: 4.99, bonus: 10 },
    { coins: 660, price: 9.99, bonus: 30 },
    { coins: 1320, price: 19.99, bonus: 70 },
    { coins: 3300, price: 49.99, bonus: 200 },
    { coins: 6600, price: 99.99, bonus: 500 },
    { coins: 16500, price: 249.99, bonus: 1500 },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "TikTok Coin Prices in USA",
    "description": "Current TikTok coin prices and packages available in the United States",
    "url": "https://tokrecharge.com/coins-in-usa"
  };

  return (
    <>
      <SEOHead 
        title="TikTok Coin Prices in USA - Current US Pricing | TokRecharge.com"
        description="View current TikTok coin prices and packages available in the United States. Compare coin packages and find the best value for your TikTok purchases."
        keywords="tiktok coins usa, tiktok coin prices usa, buy tiktok coins usa, tiktok coin packages usa"
        canonical="https://tokrecharge.com/coins-in-usa"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'Countries', href: '/#countries' },
        { label: 'USA Pricing' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-4">🇺🇸</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              TikTok Coin Prices in USA
            </h1>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Current TikTok coin pricing and packages available in the United States
          </p>
          {usaCountry && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <span className="text-lg">Current Rate: {usaCountry.coinRate} coins = $1 USD</span>
            </div>
          )}
        </div>
      </section>

      {/* Coin Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">USA Coin Packages</h2>
              <p className="text-gray-600">Official TikTok coin packages available in the United States</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coinPackages.map((pkg, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {pkg.coins.toLocaleString()} Coins
                    </h3>
                    {pkg.bonus > 0 && (
                      <p className="text-green-600 font-medium mb-2">
                        +{pkg.bonus} Bonus Coins
                      </p>
                    )}
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                      ${pkg.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      ${(pkg.price / (pkg.coins + pkg.bonus)).toFixed(4)} per coin
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Buy on TikTok
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Buy TikTok Coins in USA?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">Stable Pricing</h3>
                </div>
                <p className="text-gray-600">
                  USD pricing provides stable and predictable coin costs without currency fluctuation concerns.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <TrendingDown className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold">Bulk Discounts</h3>
                </div>
                <p className="text-gray-600">
                  Larger packages offer better value per coin and include bonus coins for extra savings.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold">Instant Purchase</h3>
                </div>
                <p className="text-gray-600">
                  Coins are added to your account immediately after successful payment through the TikTok app.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Coins className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-bold">Multiple Payment Options</h3>
                </div>
                <p className="text-gray-600">
                  Support for credit cards, PayPal, Apple Pay, Google Pay, and other popular payment methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-800">Important Information</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Coins can only be purchased through the official TikTok mobile app</li>
                <li>• Prices may vary slightly based on your device's app store (iOS/Android)</li>
                <li>• TikTok coins cannot be transferred between accounts or refunded</li>
                <li>• Bonus coins are promotional and subject to change</li>
                <li>• Always purchase from official sources to avoid scams</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}