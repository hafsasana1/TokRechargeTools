import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';
import CoinCalculator from '@/components/calculators/CoinCalculator';
import ToolCard from '@/components/common/ToolCard';
import CountryCard from '@/components/common/CountryCard';
import BlogCard from '@/components/common/BlogCard';
import FAQSection from '@/components/common/FAQSection';
import LiveCalculatorDemo from '@/components/hero/LiveCalculatorDemo';
import CountryPricingSection from '@/components/sections/CountryPricingSection';
import { FAQ_DATA } from '@/lib/constants';
import type { Tool, Country, BlogPost } from '@shared/schema';

export default function HomePage() {
  const { data: tools = [] } = useQuery<Tool[]>({
    queryKey: ['/api/tools'],
  });

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TokRecharge.com",
    "description": "TikTok Coin Calculator and Recharge Tools",
    "url": "https://tokrecharge.com",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SEOHead 
        title="TokRecharge.com - TikTok Coin Calculator & Recharge Tools"
        description="Calculate TikTok coin values, compare recharge prices, estimate earnings, and convert gifts to cash. Free TikTok calculator tools for creators and fans."
        keywords="tiktok coin calculator, tiktok recharge price, tiktok gift value, tiktok earnings calculator"
        canonical="https://tokrecharge.com"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[{ label: 'TikTok Tools' }]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              TikTok Coin Calculator & Tools
            </h1>
            <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
              Calculate coin values, compare recharge prices, estimate earnings, and convert gifts to real cash. 
              All your TikTok money tools in one place with live data updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <a href="#coin-calculator">Start Calculating</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
                <a href="#tools">View All Tools</a>
              </Button>
            </div>
          </div>
          
          {/* Live Calculator Demo */}
          <div className="mt-12">
            <LiveCalculatorDemo />
          </div>
        </div>
      </section>

      {/* Featured Calculator */}
      <section id="coin-calculator" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">TikTok Coin to Currency Calculator</h2>
              <p className="text-lg text-gray-600">Convert TikTok coins to real money instantly with live exchange rates</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-gray-100">
              <CoinCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">All TikTok Tools</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive suite of calculators and converters for TikTok creators and fans</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Country-Specific Pages */}
      <CountryPricingSection />

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">TikTok Money Blog</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Latest guides and insights about TikTok monetization, earnings, and creator economy</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={FAQ_DATA} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Using Our TikTok Tools</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Join thousands of creators and fans who use our calculators daily to maximize their TikTok earnings</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <a href="#coin-calculator">Calculate Coins Now</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300">
              <a href="#tools">Browse All Tools</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
