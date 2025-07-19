import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  BarChart3, 
  Users, 
  Globe, 
  FileText, 
  TrendingUp, 
  Settings,
  LogOut,
  Calendar,
  MapPin,
  Eye,
  DollarSign
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { getCountryWithFlag } from "@/lib/countryFlags";

const COLORS = ['#FF1744', '#9C27B0', '#3F51B5', '#2196F3', '#009688', '#4CAF50'];

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  
  // Check if user is authenticated
  const token = localStorage.getItem("admin_token");
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
  
  if (!token) {
    setLocation("/admin/login");
    return null;
  }

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Modern Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">Welcome back, {user.username}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setLocation("/admin/adsense")}
                variant="outline"
                className="bg-white/50 hover:bg-white/80 border-green-200 hover:border-green-300 transition-all duration-200"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                AdSense
              </Button>
              <Button
                onClick={() => setLocation("/admin/settings")}
                variant="outline"
                className="bg-white/50 hover:bg-white/80 border-purple-200 hover:border-purple-300 transition-all duration-200"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tools</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {dashboardData?.stats?.totalTools}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Active calculator tools
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Countries</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                <Globe className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                {dashboardData?.stats?.totalCountries}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Supported countries
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Blog Posts</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {dashboardData?.stats?.totalBlogPosts}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Visitors</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {dashboardData?.stats?.totalVisitors}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Recent visitors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Visitors Chart */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Daily Visitors
              </CardTitle>
              <CardDescription>Visitor traffic over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData?.analytics?.dailyVisitors || []}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 mr-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Top Countries
              </CardTitle>
              <CardDescription>Visitor distribution by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.analytics?.topCountries?.map((country: any, index: number) => {
                  const countryData = getCountryWithFlag(country.country);
                  return (
                    <div key={country.country} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{countryData.flag}</span>
                        <div>
                          <p className="font-semibold text-gray-800">{countryData.name}</p>
                          <p className="text-sm text-gray-600">{country.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-purple-600">{country.count}</p>
                        <p className="text-xs text-gray-500">visitors</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Visitors */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 mr-3">
                <Eye className="w-5 h-5 text-white" />
              </div>
              Recent Visitors
            </CardTitle>
            <CardDescription>Latest visitor activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentVisitors?.map((visitor: any, index: number) => {
                const countryData = getCountryWithFlag(visitor.country);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-blue-50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <span className="text-xl">{countryData.flag}</span>
                      <div>
                        <p className="font-medium text-gray-800">{countryData.name}</p>
                        <p className="text-sm text-gray-600">{visitor.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{visitor.page}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(visitor.visitedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}