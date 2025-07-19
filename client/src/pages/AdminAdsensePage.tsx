import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  DollarSign,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Code,
  Globe,
  Smartphone,
  Monitor,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AdUnit {
  id?: number;
  name: string;
  adSlot: string;
  adFormat: string;
  location: string;
  isActive: boolean;
  code: string;
}

export default function AdminAdsensePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [localAds, setLocalAds] = useState<AdUnit[]>([]);
  const [publisherId, setPublisherId] = useState("");
  const [autoAdsCode, setAutoAdsCode] = useState("");
  
  const token = localStorage.getItem("admin_token");
  if (!token) {
    setLocation("/admin/login");
    return null;
  }

  const { data: adsenseData, isLoading } = useQuery({
    queryKey: ["/api/admin/adsense"],
    queryFn: async () => {
      return await fetch("/api/admin/adsense", {
        headers: { "Authorization": `Bearer ${token}` },
      }).then(res => res.json());
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      return await fetch("/api/admin/settings", {
        headers: { "Authorization": `Bearer ${token}` },
      }).then(res => res.json());
    },
  });

  useEffect(() => {
    if (adsenseData) {
      setLocalAds(adsenseData);
    }
  }, [adsenseData]);

  useEffect(() => {
    if (settings) {
      const settingsMap = settings.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setPublisherId(settingsMap.adsenseCode || "");
      setAutoAdsCode(settingsMap.adsenseAutoAds || "");
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
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

  const createAdMutation = useMutation({
    mutationFn: async (adData: Omit<AdUnit, 'id'>) => {
      return await apiRequest("/api/admin/adsense", {
        method: "POST",
        body: JSON.stringify(adData),
        headers: { "Authorization": `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast({ title: "Ad unit created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/adsense"] });
    },
  });

  const updateAdMutation = useMutation({
    mutationFn: async ({ id, ...adData }: AdUnit) => {
      return await apiRequest(`/api/admin/adsense/${id}`, {
        method: "PUT",
        body: JSON.stringify(adData),
        headers: { "Authorization": `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast({ title: "Ad unit updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/adsense"] });
    },
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/adsense/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast({ title: "Ad unit deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/adsense"] });
    },
  });

  const addNewAdUnit = () => {
    const newAd: AdUnit = {
      name: "New Ad Unit",
      adSlot: "",
      adFormat: "auto",
      location: "header",
      isActive: false,
      code: ""
    };
    setLocalAds(prev => [...prev, newAd]);
  };

  const updateLocalAd = (index: number, field: keyof AdUnit, value: any) => {
    setLocalAds(prev => prev.map((ad, i) => 
      i === index ? { ...ad, [field]: value } : ad
    ));
  };

  const saveAdUnit = async (index: number) => {
    const ad = localAds[index];
    if (ad.id) {
      await updateAdMutation.mutateAsync(ad);
    } else {
      await createAdMutation.mutateAsync(ad);
    }
  };

  const deleteAdUnit = async (id: number, index: number) => {
    if (id) {
      await deleteAdMutation.mutateAsync(id);
    } else {
      setLocalAds(prev => prev.filter((_, i) => i !== index));
    }
  };

  const generateAdCode = (ad: AdUnit) => {
    if (!publisherId || !ad.adSlot) return "";
    
    return `<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${publisherId}"
     data-ad-slot="${ad.adSlot}"
     data-ad-format="${ad.adFormat}"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading AdSense settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setLocation("/admin/dashboard")}
                className="flex items-center bg-white/50 hover:bg-white/80 border-purple-200 hover:border-purple-300 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  AdSense Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">Manage your Google AdSense integration and ad placements</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          {/* AdSense Configuration */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-t-lg border-b border-green-100">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 mr-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
                  AdSense Configuration
                </span>
              </CardTitle>
              <CardDescription className="ml-12 text-gray-600">
                Configure your Google AdSense publisher settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-green-500" />
                      Publisher ID
                    </label>
                    <Button
                      onClick={() => updateSettingMutation.mutate({ key: "adsenseCode", value: publisherId })}
                      disabled={updateSettingMutation.isPending}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border-l-4 border-green-200">
                    Your Google AdSense publisher ID (ca-pub-xxxxxxxxxxxxxxxx)
                  </p>
                  <Input
                    value={publisherId}
                    onChange={(e) => setPublisherId(e.target.value)}
                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                    className="bg-white/80 border-green-200 focus:border-green-400 focus:ring-green-300"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-green-500" />
                      Auto Ads Code
                    </label>
                    <Button
                      onClick={() => updateSettingMutation.mutate({ key: "adsenseAutoAds", value: autoAdsCode })}
                      disabled={updateSettingMutation.isPending}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border-l-4 border-green-200">
                    Google AdSense auto ads script code (complete script tag)
                  </p>
                  <Textarea
                    value={autoAdsCode}
                    onChange={(e) => setAutoAdsCode(e.target.value)}
                    placeholder="<script async src=&quot;https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx&quot; crossorigin=&quot;anonymous&quot;></script>"
                    rows={4}
                    className="bg-white/80 border-green-200 focus:border-green-400 focus:ring-green-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ad Units Management */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg border-b border-blue-100">
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 mr-3">
                    <Monitor className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                    Ad Units
                  </span>
                </div>
                <Button
                  onClick={addNewAdUnit}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ad Unit
                </Button>
              </CardTitle>
              <CardDescription className="ml-12 text-gray-600">
                Manage your AdSense ad units and placements
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {localAds.map((ad, index) => (
                  <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={ad.isActive}
                          onCheckedChange={(checked) => updateLocalAd(index, 'isActive', checked)}
                        />
                        <span className="font-medium text-gray-800">
                          {ad.isActive ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => saveAdUnit(index)}
                          disabled={createAdMutation.isPending || updateAdMutation.isPending}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={() => deleteAdUnit(ad.id || 0, index)}
                          disabled={deleteAdMutation.isPending}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ad Name</label>
                        <Input
                          value={ad.name}
                          onChange={(e) => updateLocalAd(index, 'name', e.target.value)}
                          placeholder="Header Banner"
                          className="bg-white border-gray-300 focus:border-blue-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ad Slot ID</label>
                        <Input
                          value={ad.adSlot}
                          onChange={(e) => updateLocalAd(index, 'adSlot', e.target.value)}
                          placeholder="1234567890"
                          className="bg-white border-gray-300 focus:border-blue-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ad Format</label>
                        <select
                          value={ad.adFormat}
                          onChange={(e) => updateLocalAd(index, 'adFormat', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                          <option value="auto">Auto</option>
                          <option value="rectangle">Rectangle</option>
                          <option value="horizontal">Horizontal</option>
                          <option value="vertical">Vertical</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <select
                          value={ad.location}
                          onChange={(e) => updateLocalAd(index, 'location', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                          <option value="header">Header</option>
                          <option value="footer">Footer</option>
                          <option value="sidebar">Sidebar</option>
                          <option value="content-top">Content Top</option>
                          <option value="content-bottom">Content Bottom</option>
                        </select>
                      </div>
                    </div>

                    {publisherId && ad.adSlot && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Generated Ad Code</label>
                        <Textarea
                          value={generateAdCode(ad)}
                          readOnly
                          rows={6}
                          className="bg-gray-50 border-gray-300 font-mono text-xs"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}