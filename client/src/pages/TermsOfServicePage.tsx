import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';

export default function TermsOfServicePage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - TokRecharge.com",
    "description": "Terms of Service for TokRecharge.com - Rules and guidelines for using our TikTok coin calculators",
    "url": "https://tokrecharge.com/terms"
  };

  return (
    <>
      <SEOHead 
        title="Terms of Service - TokRecharge.com | Usage Guidelines & Rules"
        description="Read the Terms of Service for TokRecharge.com. Learn about usage guidelines, rules, and conditions for using our TikTok coin calculators and tools."
        keywords="terms of service, usage guidelines, tokrecharge terms, legal"
        canonical="https://tokrecharge.com/terms"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'Terms of Service' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Guidelines and conditions for using TokRecharge.com services
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-600 mb-8">
                <p><strong>Last updated:</strong> January 2025</p>
              </div>

              <h2 className="text-3xl font-bold mb-6">Agreement to Terms</h2>
              <p className="text-gray-600 mb-8">
                By accessing and using TokRecharge.com ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
              </p>

              <h2 className="text-3xl font-bold mb-6">Description of Service</h2>
              <p className="text-gray-600 mb-4">
                TokRecharge.com provides:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• TikTok coin value calculators</li>
                <li>• Gift value estimation tools</li>
                <li>• Earnings calculators for content creators</li>
                <li>• Country-wise coin pricing comparisons</li>
                <li>• Educational content about TikTok monetization</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Use the Service for any illegal or unauthorized purpose</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Interfere with or disrupt the Service or servers</li>
                <li>• Use automated scripts or bots to access the Service</li>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Engage in any activity that could damage or overload our infrastructure</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Accuracy and Disclaimers</h2>
              <p className="text-gray-600 mb-4">
                While we strive to provide accurate information:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Calculator results are estimates based on available data</li>
                <li>• Actual TikTok coin values may vary from our calculations</li>
                <li>• Exchange rates and pricing are subject to change</li>
                <li>• We are not responsible for financial decisions based on our tools</li>
                <li>• Always verify information through official TikTok channels</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Intellectual Property</h2>
              <p className="text-gray-600 mb-8">
                The Service and its original content, features, and functionality are owned by TokRecharge.com and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2 className="text-3xl font-bold mb-6">Third-Party Services</h2>
              <p className="text-gray-600 mb-8">
                Our Service may contain links to third-party websites or services that are not owned or controlled by TokRecharge.com. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party services.
              </p>

              <h2 className="text-3xl font-bold mb-6">Limitation of Liability</h2>
              <p className="text-gray-600 mb-8">
                In no event shall TokRecharge.com, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>

              <h2 className="text-3xl font-bold mb-6">Service Availability</h2>
              <p className="text-gray-600 mb-8">
                We reserve the right to withdraw or amend our Service, and any service or material we provide on the Service, in our sole discretion without notice. We do not guarantee that our Service will be available at all times or that it will be uninterrupted or error-free.
              </p>

              <h2 className="text-3xl font-bold mb-6">Modifications to Terms</h2>
              <p className="text-gray-600 mb-8">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice before any new terms take effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2 className="text-3xl font-bold mb-6">Termination</h2>
              <p className="text-gray-600 mb-8">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
              </p>

              <h2 className="text-3xl font-bold mb-6">Governing Law</h2>
              <p className="text-gray-600 mb-8">
                These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>

              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Email: legal@tokrecharge.com</li>
                <li>• Contact page: <a href="/contact" className="text-tiktok-pink hover:underline">/contact</a></li>
              </ul>

              <div className="bg-gradient-to-r from-tiktok-pink to-tiktok-cyan text-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
                <p className="mb-6">
                  We're here to help clarify any questions you may have about our terms of service.
                </p>
                <a 
                  href="/contact" 
                  className="inline-block bg-white text-tiktok-pink px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Contact Us
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