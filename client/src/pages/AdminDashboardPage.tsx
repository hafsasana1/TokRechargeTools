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
  Eye
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiktok-pink mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                TokRecharge Admin
              </h1>
              <Badge variant="secondary" className="ml-3">
                {user.role}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.username}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.totalTools || 0}</div>
              <p className="text-xs text-muted-foreground">Active calculator tools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.totalCountries || 0}</div>
              <p className="text-xs text-muted-foreground">Supported countries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.totalBlogPosts || 0}</div>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.totalVisitors || 0}</div>
              <p className="text-xs text-muted-foreground">Recent visitors</p>
            </CardContent>
          </Card>
        </div>

        {/* Modern Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Visitors Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Daily Visitors Trend
              </CardTitle>
              <CardDescription>Visitor traffic over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData?.analytics?.dailyVisitors?.map((item: any) => ({
                  date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  visitors: item.count
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#FF1744" 
                    fill="url(#colorGradient)" 
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF1744" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF1744" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Country Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Visitor Countries
              </CardTitle>
              <CardDescription>Geographic distribution of visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData?.analytics?.topCountries?.slice(0, 6).map((item: any, index: number) => ({
                      ...item,
                      color: COLORS[index % COLORS.length]
                    })) || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ country, count }) => `${country}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(dashboardData?.analytics?.topCountries?.slice(0, 6) || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Page Views Bar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Page Performance
            </CardTitle>
            <CardDescription>Most popular pages by view count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.analytics?.topPages?.slice(0, 8).map((item: any) => ({
                page: item.page.replace(/^\//, '') || 'Home',
                views: item.count
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#9C27B0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charts and Analytics - List View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Top Countries
              </CardTitle>
              <CardDescription>Visitor traffic by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.analytics.topCountries?.map((country: any, index: number) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-tiktok-pink to-tiktok-cyan rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="ml-3 font-medium">{getCountryWithFlag(country.country || 'Unknown')}</span>
                    </div>
                    <Badge variant="secondary">{country.count} visits</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Popular Pages
              </CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.analytics.topPages?.map((page: any, index: number) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="ml-3 font-medium text-sm">{page.page}</span>
                    </div>
                    <Badge variant="secondary">{page.count} views</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Visitors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Visitors
            </CardTitle>
            <CardDescription>Latest visitor activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-left p-2">Location</th>
                    <th className="text-left p-2">Page</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentVisitors?.map((visitor: any) => (
                    <tr key={visitor.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-xs">{visitor.ipAddress}</td>
                      <td className="p-2">
                        {visitor.country && visitor.city 
                          ? `${visitor.city}, ${getCountryWithFlag(visitor.country)}`
                          : getCountryWithFlag(visitor.country || 'Unknown')
                        }
                      </td>
                      <td className="p-2 font-medium">{visitor.page}</td>
                      <td className="p-2 text-gray-500">
                        {new Date(visitor.visitedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button 
              className="h-20 flex flex-col bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              onClick={() => setLocation("/admin/blog")}
            >
              <FileText className="w-6 h-6 mb-1" />
              Manage Blog
            </Button>
            <Button 
              className="h-20 flex flex-col bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => setLocation("/admin/settings")}
            >
              <Settings className="w-6 h-6 mb-1" />
              Site Settings
            </Button>
            <Button 
              className="h-20 flex flex-col bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              onClick={() => setLocation("/admin/analytics")}
            >
              <BarChart3 className="w-6 h-6 mb-1" />
              Analytics
            </Button>
            <Button 
              className="h-20 flex flex-col bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={() => setLocation("/admin/ads")}
            >
              <TrendingUp className="w-6 h-6 mb-1" />
              Ad Manager
            </Button>
            <Button 
              className="h-20 flex flex-col bg-gradient-to-r from-tiktok-pink to-tiktok-cyan hover:from-tiktok-pink/90 hover:to-tiktok-cyan/90"
              onClick={() => setLocation("/admin/tools")}
            >
              <BarChart3 className="w-6 h-6 mb-1" />
              Manage Tools
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}