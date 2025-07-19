import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  ExternalLink,
  Globe,
  Search,
  BarChart3,
  Facebook,
  Instagram,
  Twitter,
  Code
} from "lucide-react";

interface VerificationCode {
  platform: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  instructions: string;
  format: string;
  verifyUrl?: string;
}

interface VerificationCodeManagerProps {
  codes: Record<string, string>;
  onSave: (key: string, value: string) => void;
  isPending: boolean;
}

const verificationPlatforms: VerificationCode[] = [
  {
    platform: "googleVerification",
    name: "Google Search Console",
    icon: Search,
    color: "from-blue-500 to-green-500",
    description: "Verify your site with Google Search Console for SEO insights",
    instructions: "1. Go to Google Search Console\n2. Add your property\n3. Choose HTML tag method\n4. Copy the content value from meta tag",
    format: "content=\"abcdef123456789...\"",
    verifyUrl: "https://search.google.com/search-console"
  },
  {
    platform: "bingVerification",
    name: "Bing Webmaster Tools",
    icon: Globe,
    color: "from-blue-600 to-blue-800",
    description: "Verify your site with Bing Webmaster Tools",
    instructions: "1. Go to Bing Webmaster Tools\n2. Add your site\n3. Choose HTML meta tag method\n4. Copy the content value",
    format: "content=\"123456789ABCDEF...\"",
    verifyUrl: "https://www.bing.com/webmasters"
  },
  {
    platform: "googleAnalytics",
    name: "Google Analytics 4",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
    description: "Track website traffic and user behavior",
    instructions: "1. Create GA4 property\n2. Get Measurement ID\n3. Format: G-XXXXXXXXXX",
    format: "G-XXXXXXXXXX",
    verifyUrl: "https://analytics.google.com"
  },
  {
    platform: "facebookPixel",
    name: "Facebook Pixel",
    icon: Facebook,
    color: "from-blue-600 to-blue-800",
    description: "Track conversions and optimize Facebook ads",
    instructions: "1. Go to Facebook Events Manager\n2. Create Pixel\n3. Copy Pixel ID (numbers only)",
    format: "123456789012345",
    verifyUrl: "https://business.facebook.com/events_manager2"
  },
  {
    platform: "yandexVerification",
    name: "Yandex Webmaster",
    icon: Search,
    color: "from-red-500 to-orange-500",
    description: "Verify your site with Yandex Webmaster (Russian search engine)",
    instructions: "1. Go to Yandex Webmaster\n2. Add site\n3. Choose HTML meta tag\n4. Copy content value",
    format: "content=\"yandex-verification-code\"",
    verifyUrl: "https://webmaster.yandex.com"
  }
];

export default function VerificationCodeManager({ codes, onSave, isPending }: VerificationCodeManagerProps) {
  const [localCodes, setLocalCodes] = useState<Record<string, string>>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLocalCodes(codes);
  }, [codes]);

  const updateLocalCode = (key: string, value: string) => {
    setLocalCodes(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    await onSave(key, localCodes[key] || "");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    } catch (error) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const getVerificationStatus = (platform: string) => {
    const code = localCodes[platform] || codes[platform];
    if (!code || code.trim() === "") {
      return { status: "not-configured", label: "Not Configured", color: "bg-gray-100 text-gray-600" };
    }
    
    // Basic validation based on platform
    let isValid = false;
    switch (platform) {
      case "googleAnalytics":
        isValid = /^G-[A-Z0-9]{10}$/.test(code.trim());
        break;
      case "facebookPixel":
        isValid = /^\d{15,16}$/.test(code.trim());
        break;
      default:
        isValid = code.trim().length > 10; // Basic length check
    }
    
    return isValid 
      ? { status: "verified", label: "Verified", color: "bg-green-100 text-green-700" }
      : { status: "invalid", label: "Invalid Format", color: "bg-yellow-100 text-yellow-700" };
  };

  return (
    <div className="grid gap-6">
      {verificationPlatforms.map((platform) => {
        const status = getVerificationStatus(platform.platform);
        const isExpanded = expandedCard === platform.platform;
        
        return (
          <Card key={platform.platform} className="bg-white/70 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader 
              className={`bg-gradient-to-r ${platform.color}/10 rounded-t-lg border-b border-gray-100 cursor-pointer`}
              onClick={() => setExpandedCard(isExpanded ? null : platform.platform)}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color} mr-3`}>
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className={`bg-gradient-to-r ${platform.color} bg-clip-text text-transparent font-semibold`}>
                      {platform.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={status.color}>
                    {status.status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {status.status === "invalid" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {status.status === "not-configured" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {status.label}
                  </Badge>
                  {platform.verifyUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(platform.verifyUrl, '_blank');
                      }}
                      className="p-2 h-8 w-8"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardTitle>
              <CardDescription className="ml-12 text-gray-600">
                {platform.description}
              </CardDescription>
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="p-8 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Setup Instructions
                  </h4>
                  <pre className="text-sm text-blue-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
{platform.instructions}
                  </pre>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-purple-500" />
                      {platform.name} Code
                    </label>
                    <div className="flex items-center space-x-2">
                      {localCodes[platform.platform] && (
                        <Button
                          onClick={() => copyToClipboard(localCodes[platform.platform])}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleSave(platform.platform)}
                        disabled={isPending}
                        size="sm"
                        className={`bg-gradient-to-r ${platform.color} hover:opacity-90 text-white border-0`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-purple-200">
                    <p className="text-xs text-gray-600">
                      <strong>Expected format:</strong> {platform.format}
                    </p>
                  </div>
                  
                  <Input
                    value={localCodes[platform.platform] || ""}
                    onChange={(e) => updateLocalCode(platform.platform, e.target.value)}
                    placeholder={`Enter your ${platform.name.toLowerCase()} code...`}
                    className="bg-white border-gray-300 focus:border-purple-400 focus:ring-purple-300"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}