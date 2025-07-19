import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  DollarSign,
  Globe,
  Shield,
  MessageSquare,
  Calendar,
  HelpCircle,
  LogOut
} from "lucide-react";

interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  section?: string;
}

const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", section: "GENERAL" },
  { title: "Analytics", icon: BarChart3, href: "/admin/analytics", section: "GENERAL" },
  { title: "Blog", icon: FileText, href: "/admin/blog", section: "GENERAL" },
  { title: "AdSense", icon: DollarSign, href: "/admin/adsense", section: "GENERAL" },
  { title: "Settings", icon: Settings, href: "/admin/settings", section: "GENERAL" },
];

export default function AdminSidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  };

  const isActive = (href: string) => location === href;

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Larkon</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              GENERAL
            </p>
            <div className="space-y-1">
              {sidebarItems.filter(item => item.section === "GENERAL").map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  onClick={() => setLocation(item.href)}
                  className={`w-full justify-start text-left px-3 py-2 h-auto ${
                    isActive(item.href)
                      ? "bg-slate-800 text-orange-400 border-r-2 border-orange-400"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 h-auto"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}