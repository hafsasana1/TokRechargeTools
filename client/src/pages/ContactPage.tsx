import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';
import { Mail, MessageCircle, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact TokRecharge.com",
    "description": "Get in touch with TokRecharge.com for support, questions, or feedback about our TikTok coin calculators",
    "url": "https://tokrecharge.com/contact"
  };

  return (
    <>
      <SEOHead 
        title="Contact Us - TokRecharge.com | Get Help with TikTok Coin Calculators"
        description="Contact TokRecharge.com for support, feedback, or questions about our TikTok coin calculators and tools. We're here to help!"
        keywords="contact tokrecharge, support, help, tiktok calculator support"
        canonical="https://tokrecharge.com/contact"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'Contact' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tiktok-cyan to-blue-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Have questions about our TikTok coin calculators? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Methods */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-tiktok-pink/10 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-tiktok-pink" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Email Support</h3>
                      <p className="text-gray-600 mb-2">
                        For general inquiries and support
                      </p>
                      <a 
                        href="mailto:support@tokrecharge.com" 
                        className="text-tiktok-pink hover:underline font-medium"
                      >
                        support@tokrecharge.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-tiktok-cyan/10 p-3 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-tiktok-cyan" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Feedback</h3>
                      <p className="text-gray-600 mb-2">
                        Share your suggestions and feedback
                      </p>
                      <a 
                        href="mailto:feedback@tokrecharge.com" 
                        className="text-tiktok-cyan hover:underline font-medium"
                      >
                        feedback@tokrecharge.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Response Time</h3>
                      <p className="text-gray-600">
                        We typically respond within 24-48 hours during business days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Global Support</h3>
                      <p className="text-gray-600">
                        We support users worldwide in multiple languages and currencies
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Common Questions</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">How accurate are your calculators?</h3>
                    <p className="text-gray-600">
                      Our calculators use real-time exchange rates and official TikTok coin values, updated regularly for maximum accuracy.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">Do you charge for using the tools?</h3>
                    <p className="text-gray-600">
                      No, all our TikTok coin calculators and tools are completely free to use with no hidden fees.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">Can you add support for my currency?</h3>
                    <p className="text-gray-600">
                      Yes! Contact us with your currency request and we'll work to add support for it in our calculators.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">How often do you update the rates?</h3>
                    <p className="text-gray-600">
                      We update exchange rates daily and monitor TikTok coin pricing changes to ensure accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form CTA */}
            <div className="mt-16 bg-gradient-to-r from-tiktok-pink to-tiktok-cyan text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="mb-6">
                Don't hesitate to reach out! We're here to help you get the most out of our TikTok tools.
              </p>
              <a 
                href="mailto:support@tokrecharge.com" 
                className="inline-block bg-white text-tiktok-pink px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Send Us an Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}