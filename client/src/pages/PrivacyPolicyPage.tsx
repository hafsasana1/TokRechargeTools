import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SEOHead from '@/components/common/SEOHead';

export default function PrivacyPolicyPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - TokRecharge.com",
    "description": "Privacy Policy for TokRecharge.com - Learn how we protect your data when using our TikTok coin calculators",
    "url": "https://tokrecharge.com/privacy"
  };

  return (
    <>
      <SEOHead 
        title="Privacy Policy - TokRecharge.com | Data Protection & User Privacy"
        description="Learn about TokRecharge.com's privacy policy, data collection practices, and how we protect your information when using our TikTok coin calculators."
        keywords="privacy policy, data protection, user privacy, tokrecharge privacy"
        canonical="https://tokrecharge.com/privacy"
        schemaData={schemaData}
      />
      
      <Header />
      
      <Breadcrumb items={[
        { label: 'Privacy Policy' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your privacy is important to us. Learn how we protect your data.
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

              <h2 className="text-3xl font-bold mb-6">Introduction</h2>
              <p className="text-gray-600 mb-8">
                TokRecharge.com ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and TikTok coin calculator tools.
              </p>

              <h2 className="text-3xl font-bold mb-6">Information We Collect</h2>
              
              <h3 className="text-2xl font-bold mb-4">Information You Provide</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Calculator inputs (coin amounts, currency selections)</li>
                <li>• Contact information when you reach out to us</li>
                <li>• Feedback and suggestions you provide</li>
              </ul>

              <h3 className="text-2xl font-bold mb-4">Automatically Collected Information</h3>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• IP address and general location information</li>
                <li>• Browser type and version</li>
                <li>• Pages visited and time spent on our site</li>
                <li>• Device information (mobile, desktop, etc.)</li>
                <li>• Referral sources</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">How We Use Your Information</h2>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• To provide and improve our calculator tools</li>
                <li>• To analyze website usage and optimize user experience</li>
                <li>• To respond to your inquiries and provide support</li>
                <li>• To ensure website security and prevent abuse</li>
                <li>• To comply with legal obligations</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Data Storage and Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Calculator inputs are processed locally and not permanently stored</li>
                <li>• Website analytics data is anonymized</li>
                <li>• Secure HTTPS encryption for all data transmission</li>
                <li>• Regular security updates and monitoring</li>
                <li>• Limited access to personal information by authorized personnel only</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Remember your calculator preferences</li>
                <li>• Analyze website traffic and usage patterns</li>
                <li>• Improve website functionality and user experience</li>
                <li>• Provide relevant content and features</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We may use third-party services for:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Website analytics (Google Analytics)</li>
                <li>• Exchange rate data providers</li>
                <li>• Content delivery networks</li>
                <li>• Security and performance monitoring</li>
              </ul>
              <p className="text-gray-600 mb-8">
                These third parties have their own privacy policies, and we encourage you to review them.
              </p>

              <h2 className="text-3xl font-bold mb-6">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Access the personal information we have about you</li>
                <li>• Request correction of inaccurate information</li>
                <li>• Request deletion of your personal information</li>
                <li>• Object to the processing of your information</li>
                <li>• Withdraw consent where applicable</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6">Children's Privacy</h2>
              <p className="text-gray-600 mb-8">
                Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>

              <h2 className="text-3xl font-bold mb-6">International Users</h2>
              <p className="text-gray-600 mb-8">
                Our website is accessible worldwide. If you are accessing our site from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
              </p>

              <h2 className="text-3xl font-bold mb-6">Changes to This Policy</h2>
              <p className="text-gray-600 mb-8">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated "Last updated" date.
              </p>

              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• Email: privacy@tokrecharge.com</li>
                <li>• Contact page: <a href="/contact" className="text-tiktok-pink hover:underline">/contact</a></li>
              </ul>

              <div className="bg-gradient-to-r from-tiktok-pink to-tiktok-cyan text-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Questions About Privacy?</h3>
                <p className="mb-6">
                  We're committed to transparency. Contact us with any privacy concerns.
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