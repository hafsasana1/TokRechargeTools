import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { Coins, TrendingDown, Clock, Shield } from 'lucide-react';

export default function PakistanPricingPage() {
  const { data: countries } = useQuery({
    queryKey: ['/api/countries'],
  });

  const pakistanCountry = countries?.find(c => c.code === 'PK');

  const coinPackages = [
    { coins: 100, price: 200, bonus: 0 },
    { coins: 500, price: 1000, bonus: 25 },
    { coins: 1000, price: 2000, bonus: 50 },
    { coins: 2000, price: 4000, bonus: 100 },
    { coins: 5000, price: 10000, bonus: 300 },
    { coins: 10000, price: 20000, bonus: 700 },
    { coins: 25000, price: 50000, bonus: 2000 },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "TikTok Coin Prices in Pakistan",
    "description": "Current TikTok coin prices and packages available in Pakistan",
    "url": "https://tokrecharge.com/coins-in-pakistan"
  };

  return (
    <>
      <SEOHead 
        title="TikTok Coin Prices in Pakistan - Current PKR Pricing | TokRecharge.com"
        description="View current TikTok coin prices and packages available in Pakistan. Compare coin packages and find the best value for your TikTok purchases in PKR."
        keywords="tiktok coins pakistan, tiktok coin prices pakistan, buy tiktok coins pakistan, tiktok coin packages pakistan, tiktok coins pkr"
        canonical="https://tokrecharge.com/coins-in-pakistan"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'Countries', href: '/#countries' },
        { label: 'Pakistan Pricing' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-white text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-4">🇵🇰</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              TikTok Coin Prices in Pakistan
            </h1>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Current TikTok coin pricing and packages available in Pakistan (PKR)
          </p>
          {pakistanCountry && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <span className="text-lg">Current Rate: {pakistanCountry.coinRate} coins = ₨1 PKR</span>
            </div>
          )}
        </div>
      </section>

      {/* Coin Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pakistan Coin Packages</h2>
              <p className="text-gray-600">Official TikTok coin packages available in Pakistan</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coinPackages.map((pkg, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    <div className="text-3xl font-bold text-green-600 mb-4">
                      ₨{pkg.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      ₨{(pkg.price / (pkg.coins + pkg.bonus)).toFixed(4)} per coin
                    </div>
                    <button className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
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
              <h2 className="text-3xl font-bold mb-4">Why Buy TikTok Coins in Pakistan?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">₨</span>
                  <h3 className="text-xl font-bold">Local Currency Pricing</h3>
                </div>
                <p className="text-gray-600">
                  Pay in Pakistani Rupees with pricing optimized for the local market and economic conditions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <TrendingDown className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold">Affordable Packages</h3>
                </div>
                <p className="text-gray-600">
                  Pakistan offers some of the most affordable TikTok coin rates with generous bonus packages for larger purchases.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold">Local Payment Methods</h3>
                </div>
                <p className="text-gray-600">
                  Support for local payment methods including Easypaisa, JazzCash, bank transfers, and mobile wallets.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">Secure Transactions</h3>
                </div>
                <p className="text-gray-600">
                  All transactions are processed securely through TikTok's official payment system with local banking support.
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
              <h2 className="text-3xl font-bold mb-4">Popular Payment Methods in Pakistan</h2>
              <p className="text-gray-600">Choose from various payment options available for Pakistani users</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-bold mb-2">Mobile Wallets</h3>
                <p className="text-sm text-gray-600">Easypaisa, JazzCash, UBL Omni</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">🏦</div>
                <h3 className="font-bold mb-2">Bank Transfers</h3>
                <p className="text-sm text-gray-600">HBL, UBL, Meezan Bank, Faysal Bank</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="font-bold mb-2">Cards</h3>
                <p className="text-sm text-gray-600">Debit Cards, Credit Cards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">TikTok in Pakistan</h2>
              <p className="text-gray-600">Understanding the local TikTok ecosystem</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Growing Creator Economy</h3>
                <p className="text-gray-600 mb-4">
                  Pakistan has one of the fastest-growing TikTok creator communities in South Asia, 
                  with increasing opportunities for monetization through gifts and brand partnerships.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Millions of active Pakistani TikTok users</li>
                  <li>• Growing local content creation</li>
                  <li>• Increasing brand partnerships</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Local Content Trends</h3>
                <p className="text-gray-600 mb-4">
                  Pakistani content creators excel in comedy, music, fashion, and cultural content, 
                  building strong communities that actively support creators through gifts.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High engagement rates</li>
                  <li>• Strong community support</li>
                  <li>• Cultural and musical content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-green-800">Important Information for Pakistani Users</h3>
              <ul className="space-y-2 text-green-700">
                <li>• Coins can only be purchased through the official TikTok mobile app</li>
                <li>• Prices include applicable taxes as per Pakistani regulations</li>
                <li>• Local payment methods like Easypaisa and JazzCash are supported</li>
                <li>• TikTok coins cannot be transferred between accounts or refunded</li>
                <li>• Bonus coins are promotional and subject to change</li>
                <li>• Always purchase from official sources to avoid scams</li>
                <li>• Ensure TikTok app is updated to the latest version for payment features</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}