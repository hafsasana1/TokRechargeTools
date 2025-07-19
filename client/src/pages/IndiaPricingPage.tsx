import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { Coins, IndianRupee, TrendingDown, Clock } from 'lucide-react';

export default function IndiaPricingPage() {
  const { data: countries } = useQuery({
    queryKey: ['/api/countries'],
  });

  const indiaCountry = countries?.find(c => c.code === 'IN');

  const coinPackages = [
    { coins: 70, price: 79, bonus: 0 },
    { coins: 350, price: 399, bonus: 15 },
    { coins: 700, price: 799, bonus: 35 },
    { coins: 1400, price: 1599, bonus: 75 },
    { coins: 3500, price: 3999, bonus: 200 },
    { coins: 7000, price: 7999, bonus: 550 },
    { coins: 17500, price: 19999, bonus: 1500 },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "TikTok Coin Prices in India",
    "description": "Current TikTok coin prices and packages available in India",
    "url": "https://tokrecharge.com/coins-in-india"
  };

  return (
    <>
      <SEOHead 
        title="TikTok Coin Prices in India - Current INR Pricing | TokRecharge.com"
        description="View current TikTok coin prices and packages available in India. Compare coin packages and find the best value for your TikTok purchases in INR."
        keywords="tiktok coins india, tiktok coin prices india, buy tiktok coins india, tiktok coin packages india, tiktok coins inr"
        canonical="https://tokrecharge.com/coins-in-india"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'Countries', href: '/#countries' },
        { label: 'India Pricing' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-4">🇮🇳</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              TikTok Coin Prices in India
            </h1>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Current TikTok coin pricing and packages available in India (INR)
          </p>
          {indiaCountry && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <span className="text-lg">Current Rate: {indiaCountry.coinRate} coins = ₹1 INR</span>
            </div>
          )}
        </div>
      </section>

      {/* Coin Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">India Coin Packages</h2>
              <p className="text-gray-600">Official TikTok coin packages available in India</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coinPackages.map((pkg, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    <div className="text-3xl font-bold text-orange-600 mb-4">
                      ₹{pkg.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      ₹{(pkg.price / (pkg.coins + pkg.bonus)).toFixed(4)} per coin
                    </div>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
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
              <h2 className="text-3xl font-bold mb-4">Why Buy TikTok Coins in India?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <IndianRupee className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">Local Currency Pricing</h3>
                </div>
                <p className="text-gray-600">
                  Pay in Indian Rupees with pricing optimized for the Indian market and economy.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <TrendingDown className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold">Competitive Rates</h3>
                </div>
                <p className="text-gray-600">
                  India offers some of the most competitive TikTok coin rates globally with attractive bonus packages.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold">UPI & Local Payments</h3>
                </div>
                <p className="text-gray-600">
                  Support for UPI, Paytm, PhonePe, and other popular Indian payment methods for easy transactions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Coins className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-bold">Generous Bonuses</h3>
                </div>
                <p className="text-gray-600">
                  Larger packages include substantial bonus coins, offering excellent value for frequent users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Popular Payment Methods in India</h2>
              <p className="text-gray-600">Choose from various payment options available for Indian users</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-bold mb-2">UPI Payments</h3>
                <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="font-bold mb-2">Cards</h3>
                <p className="text-sm text-gray-600">Debit Cards, Credit Cards, RuPay</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">🏪</div>
                <h3 className="font-bold mb-2">Wallets</h3>
                <p className="text-sm text-gray-600">Paytm Wallet, Amazon Pay, Mobikwik</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-orange-100 border-l-4 border-orange-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-orange-800">Important Information for Indian Users</h3>
              <ul className="space-y-2 text-orange-700">
                <li>• Coins can only be purchased through the official TikTok mobile app</li>
                <li>• Prices include applicable taxes as per Indian regulations</li>
                <li>• UPI and other local payment methods are widely supported</li>
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