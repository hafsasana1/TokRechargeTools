import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import CoinCalculatorPage from "@/pages/CoinCalculatorPage";
import GiftValuePage from "@/pages/GiftValuePage";
import EarningsEstimatorPage from "@/pages/EarningsEstimatorPage";
import RechargePricesPage from "@/pages/RechargePricesPage";
import CoinToDiamondPage from "@/pages/CoinToDiamondPage";
import WithdrawValuePage from "@/pages/WithdrawValuePage";
import CountryPricingPage from "@/pages/CountryPricingPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminBlogPage from "@/pages/AdminBlogPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import AdminAnalyticsPage from "@/pages/AdminAnalyticsPage";
import AdminAdsensePage from "@/pages/AdminAdsensePage";
import AdminToolsPage from "@/pages/AdminToolsPage";
import AdminBlogEditPage from "@/pages/AdminBlogEditPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import USAPricingPage from "@/pages/USAPricingPage";
import IndiaPricingPage from "@/pages/IndiaPricingPage";
import PakistanPricingPage from "@/pages/PakistanPricingPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/coin-calculator" component={CoinCalculatorPage} />
      <Route path="/gift-value" component={GiftValuePage} />
      <Route path="/earnings-estimator" component={EarningsEstimatorPage} />
      <Route path="/recharge-prices" component={RechargePricesPage} />
      <Route path="/coin-to-diamond" component={CoinToDiamondPage} />
      <Route path="/withdraw-value" component={WithdrawValuePage} />
      <Route path="/coins-in-:country" component={CountryPricingPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/admin/blog" component={AdminBlogPage} />
      <Route path="/admin/blog/new" component={AdminBlogEditPage} />
      <Route path="/admin/blog/:id" component={AdminBlogEditPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/analytics" component={AdminAnalyticsPage} />
      <Route path="/admin/adsense" component={AdminAdsensePage} />
      <Route path="/admin/tools" component={AdminToolsPage} />
      <Route path="/admin/*" component={AdminDashboardPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />
      <Route path="/coins-in-usa" component={USAPricingPage} />
      <Route path="/coins-in-india" component={IndiaPricingPage} />
      <Route path="/coins-in-pakistan" component={PakistanPricingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
