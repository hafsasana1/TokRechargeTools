import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Settings, 
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useLocation } from "wouter";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [, setLocation] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const user = JSON.parse(localStorage.getItem("admin_user") || '{"username": "Admin"}');

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-64 bg-gray-50 border-0 focus:bg-white"
            />
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="p-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500"></Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-500 text-white text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">{user.username}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setLocation("/admin/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}