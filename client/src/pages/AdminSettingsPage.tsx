import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Save, 
  Globe,
  Search,
  BarChart3,
  Image,
  Code,
  DollarSign,
  Shield
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import VerificationCodeManager from "@/components/VerificationCodeManager";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  
  const token = localStorage.getItem("admin_token");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      return await fetch("/api/admin/settings", {
        headers: { "Authorization": `Bearer ${token}` },
      }).then(res => res.json());
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await apiRequest(`/api/admin/settings/${key}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
        headers: { "Authorization": `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast({ title: "Settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
  });

  const form = useForm();

  const settingsConfig = [
    {
      section: "General",
      icon: Globe,
      settings: [
        { key: "title", label: "Website Title", type: "text", description: "Main website title" },
        { key: "metaTitle", label: "Meta Title", type: "text", description: "SEO meta title" },
        { key: "metaDescription", label: "Meta Description", type: "textarea", description: "SEO meta description" },
      ]
    },
    {
      section: "Branding",
      icon: Image,
      settings: [
        { key: "logo", label: "Logo URL", type: "text", description: "Website logo path" },
        { key: "favicon", label: "Favicon URL", type: "text", description: "Website favicon path" },
      ]
    },
    {
      section: "AdSense & Monetization",
      icon: DollarSign,
      settings: [
        { key: "adsenseCode", label: "AdSense Publisher ID", type: "text", description: "Google AdSense publisher ID (ca-pub-xxxxxxxxxxxxxxxx)" },
        { key: "adsenseAutoAds", label: "Auto Ads Code", type: "textarea", description: "Google AdSense auto ads script code" },
        { key: "adsHeader", label: "Header Ad Unit", type: "textarea", description: "Ad code for header placement" },
        { key: "adsFooter", label: "Footer Ad Unit", type: "textarea", description: "Ad code for footer placement" },
        { key: "adsSidebar", label: "Sidebar Ad Unit", type: "textarea", description: "Ad code for sidebar placement" },
      ]
    },
    {
      section: "Verification Codes",
      icon: Shield,
      settings: [
        { key: "googleVerification", label: "Google Search Console", type: "text", description: "Google site verification meta tag content" },
        { key: "bingVerification", label: "Bing Webmaster", type: "text", description: "Bing site verification meta tag content" },
        { key: "facebookPixel", label: "Facebook Pixel ID", type: "text", description: "Facebook pixel tracking ID" },
        { key: "googleAnalytics", label: "Google Analytics ID", type: "text", description: "Google Analytics measurement ID (G-XXXXXXXXXX)" },
        { key: "yandexVerification", label: "Yandex Webmaster", type: "text", description: "Yandex site verification meta tag content" },
      ]
    }
  ];

  const handleSave = (key: string, value: string) => {
    updateMutation.mutate({ key, value });
  };

  const settingsMap = settings?.reduce((acc: any, setting: any) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {}) || {};

  // Initialize local values when settings load
  useEffect(() => {
    if (settings) {
      const initialValues = settings.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setLocalValues(initialValues);
    }
  }, [settings]);

  const handleInputChange = (key: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveValue = async (key: string, value: string) => {
    await updateMutation.mutateAsync({ key, value });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Site Settings" subtitle="Configure your website settings and integrations">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings" subtitle="Configure your website settings and integrations">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8">
          {/* Verification Codes Section */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg border-b border-blue-100">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                  Site Verification & Tracking
                </span>
              </CardTitle>
              <CardDescription className="ml-12 text-gray-600">
                Manage verification codes for search engines and analytics platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <VerificationCodeManager 
                codes={settingsMap}
                onSave={handleSaveValue}
                isPending={updateMutation.isPending}
              />
            </CardContent>
          </Card>

          {settingsConfig.map((section) => (
            <Card key={section.section} className="bg-white/70 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-lg border-b border-purple-100">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 mr-3">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                      {section.section}
                    </span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 ml-12">
                  Configure {section.section.toLowerCase()} settings for your website
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-8">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          <Code className="w-4 h-4 mr-2 text-purple-500" />
                          {setting.label}
                        </label>
                        <Button
                          onClick={() => handleSaveValue(setting.key, localValues[setting.key] || settingsMap[setting.key] || "")}
                          disabled={updateMutation.isPending}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updateMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border-l-4 border-purple-200">
                        {setting.description}
                      </p>
                      <div className="relative">
                        {setting.type === "textarea" ? (
                          <Textarea
                            value={localValues[setting.key] || settingsMap[setting.key] || ""}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            placeholder={`Enter ${setting.label.toLowerCase()}...`}
                            className="w-full bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            rows={4}
                          />
                        ) : (
                          <Input
                            value={localValues[setting.key] || settingsMap[setting.key] || ""}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            placeholder={`Enter ${setting.label.toLowerCase()}...`}
                            className="w-full bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}