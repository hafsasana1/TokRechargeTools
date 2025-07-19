import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';

export default function AboutPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About TokRecharge.com",
    "description": "Learn about TokRecharge.com - Your trusted source for TikTok coin calculations and recharge tools",
    "url": "https://tokrecharge.com/about"
  };

  return (
    <>
      <SEOHead 
        title="About Us - TokRecharge.com | TikTok Coin Calculator & Tools"
        description="Learn about TokRecharge.com, your trusted source for accurate TikTok coin calculations, gift values, and recharge pricing across different countries."
        keywords="about tokrecharge, tiktok coin calculator, tiktok tools, coin converter"
        canonical="https://tokrecharge.com/about"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'About Us' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tiktok-pink to-tiktok-cyan text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About TokRecharge.com
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your trusted source for accurate TikTok coin calculations and comprehensive recharge tools
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-8">
                TokRecharge.com is dedicated to providing TikTok users worldwide with accurate, up-to-date tools for calculating coin values, gift costs, and recharge pricing. We understand the importance of transparency in digital currency transactions and strive to make TikTok's monetization features accessible to everyone.
              </p>

              <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Accurate Calculations</h3>
                  <p className="text-gray-600">
                    Our calculators use real-time exchange rates and official TikTok coin values to provide the most accurate results possible.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Multi-Currency Support</h3>
                  <p className="text-gray-600">
                    Convert TikTok coins to multiple currencies including USD, EUR, GBP, INR, PKR, and many more.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Country Comparisons</h3>
                  <p className="text-gray-600">
                    Compare TikTok coin prices across different countries to understand regional pricing differences.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Creator Tools</h3>
                  <p className="text-gray-600">
                    Specialized calculators for content creators to estimate earnings from gifts and understand withdrawal values.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">Why Choose TokRecharge.com?</h2>
              <ul className="space-y-4 text-gray-600 mb-8">
                <li className="flex items-start">
                  <span className="text-tiktok-pink mr-2">✓</span>
                  <span>Always up-to-date with the latest TikTok coin rates and exchange rates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tiktok-pink mr-2">✓</span>
                  <span>Free to use with no hidden fees or registration required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tiktok-pink mr-2">✓</span>
                  <span>Mobile-friendly design that works on all devices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tiktok-pink mr-2">✓</span>
                  <span>Privacy-focused - we don't store your personal calculation data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tiktok-pink mr-2">✓</span>
                  <span>Comprehensive educational resources about TikTok monetization</span>
                </li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
              <p className="text-gray-600 mb-8">
                We are committed to maintaining the accuracy and reliability of our tools. Our team regularly updates exchange rates, monitors TikTok's pricing changes, and ensures our calculators reflect the most current information available. We believe in transparency and providing users with the information they need to make informed decisions about their TikTok investments.
              </p>

              <div className="bg-gradient-to-r from-tiktok-pink to-tiktok-cyan text-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Start Calculating Today</h3>
                <p className="mb-6">
                  Join thousands of TikTok users who trust TokRecharge.com for accurate coin calculations
                </p>
                <a 
                  href="/coin-calculator" 
                  className="inline-block bg-white text-tiktok-pink px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Try Our Calculator
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}