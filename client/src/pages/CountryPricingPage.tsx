import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/calculations';
import type { Country, RechargePackage } from '@shared/schema';

export default function CountryPricingPage() {
  const { country } = useParams();
  
  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const { data: allPackages = [] } = useQuery<RechargePackage[]>({
    queryKey: ['/api/recharge-packages'],
  });

  // Find country by URL parameter
  const countryData = countries.find(c => 
    c.name.toLowerCase().replace(' ', '-') === country?.toLowerCase()
  );

  const packages = allPackages.filter(pkg => pkg.countryId === countryData?.id);

  if (!countryData) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Country Not Found</h1>
          <p className="text-gray-600">The requested country pricing page could not be found.</p>
        </div>
        <Footer />
      </>
    );
  }

  const bestValuePackage = packages.length > 0 ? packages.reduce((best, current) => {
    const currentRate = parseFloat(current.price) / current.coins;
    const bestRate = parseFloat(best.price) / best.coins;
    return currentRate < bestRate ? current : best;
  }) : null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `TikTok Coin Prices in ${countryData.name}`,
    "description": `TikTok coin recharge prices and packages available in ${countryData.name}`,
    "url": `https://tokrecharge.com/coins-in-${country}`,
    "about": {
      "@type": "Product",
      "name": "TikTok Coins",
      "description": `TikTok coin packages and pricing for ${countryData.name}`
    }
  };

  return (
    <>
      <SEOHead 
        title={`TikTok Coin Prices in ${countryData.name} - ${countryData.currency} Rates | TokRecharge.com`}
        description={`Find TikTok coin recharge prices in ${countryData.name}. Compare packages and get the best value for ${countryData.currency} purchases.`}
        keywords={`tiktok coins ${countryData.name.toLowerCase()}, tiktok recharge ${countryData.currency.toLowerCase()}, buy tiktok coins ${countryData.name.toLowerCase()}`}
        canonical={`https://tokrecharge.com/coins-in-${country}`}
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'Countries', href: '/#countries' },
        { label: countryData.name }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-tiktok-cyan text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">{countryData.flag}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            TikTok Coin Prices in {countryData.name}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Complete pricing guide for TikTok coin packages in {countryData.name} ({countryData.currency})
          </p>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-tiktok-pink mb-2">
                    {formatCurrency(parseFloat(countryData.coinRate), countryData.currency)}
                  </div>
                  <div className="text-sm text-gray-600">Per TikTok Coin</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-tiktok-cyan mb-2">
                    {countryData.currency}
                  </div>
                  <div className="text-sm text-gray-600">Local Currency</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {packages.length}
                  </div>
                  <div className="text-sm text-gray-600">Available Packages</div>
                </CardContent>
              </Card>
            </div>

            {packages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    TikTok Coin Packages in {countryData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Cost per Coin</TableHead>
                        <TableHead>Savings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => {
                        const costPerCoin = parseFloat(pkg.price) / pkg.coins;
                        const isBestValue = bestValuePackage?.id === pkg.id;
                        
                        return (
                          <TableRow key={pkg.id}>
                            <TableCell className="font-medium">
                              {pkg.coins} coins
                            </TableCell>
                            <TableCell>
                              {formatCurrency(parseFloat(pkg.price), pkg.currency)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(costPerCoin, pkg.currency)}
                            </TableCell>
                            <TableCell>
                              {isBestValue && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Best Value
                                </Badge>
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
          </div>
        </div>
      </section>

      {/* Country-Specific Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">TikTok in {countryData.name}</h2>
              <p className="text-gray-600">Important information for {countryData.name} users</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Popular payment methods in {countryData.name} for TikTok coins:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Credit/Debit Cards</li>
                    <li>• Mobile Payments</li>
                    <li>• Bank Transfers</li>
                    <li>• Digital Wallets</li>
                    <li>• Local Payment Systems</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Regional Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Special features and considerations for {countryData.name}:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Local currency pricing</li>
                    <li>• Regional gift availability</li>
                    <li>• Local payment support</li>
                    <li>• Currency exchange rates</li>
                    <li>• Tax implications</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
