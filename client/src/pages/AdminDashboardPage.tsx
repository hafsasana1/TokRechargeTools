import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, 
  Users, 
  Globe, 
  FileText, 
  TrendingUp, 
  MapPin,
  Eye,
  DollarSign,
  AlertTriangle
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
import AdminLayout from "@/components/admin/AdminLayout";

const COLORS = ['#FF1744', '#9C27B0', '#3F51B5', '#2196F3', '#009688', '#4CAF50'];

export default function AdminDashboardPage() {
  const token = localStorage.getItem("admin_token");

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

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening.">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="WELCOME!" subtitle="Here's what's happening with your website today.">
      {/* Server Status Alert */}
      <Alert className="mb-6 bg-orange-50 border-orange-200">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          We regret to inform you that our server is currently experiencing issues. Our team is working to resolve this.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Performance</CardTitle>
                  <div className="flex space-x-4 mt-2">
                    <Button variant="ghost" size="sm" className="text-xs">ALL</Button>
                    <Button variant="ghost" size="sm" className="text-xs">1M</Button>
                    <Button variant="ghost" size="sm" className="text-xs">6M</Button>
                    <Button variant="ghost" size="sm" className="text-xs">1Y</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dashboardData?.analytics?.dailyVisitors || []}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#f97316" fillOpacity={1} fill="url(#colorVisitors)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            <Card className="bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Ind...</p>
                    <p className="text-2xl font-bold">{dashboardData?.stats?.totalTools || '13,647'}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-green-600">+ 2.3%</span>
                  <span className="text-gray-500 ml-1">Last Week</span>
                  <Button variant="link" size="sm" className="ml-auto p-0 h-auto text-xs">View More</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Leads</p>
                    <p className="text-2xl font-bold">{dashboardData?.stats?.totalVisitors || '9,526'}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-green-600">+ 8.1%</span>
                  <span className="text-gray-500 ml-1">Last Month</span>
                  <Button variant="link" size="sm" className="ml-auto p-0 h-auto text-xs">View More</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Deals</p>
                    <p className="text-2xl font-bold">{dashboardData?.stats?.totalCountries || '976'}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-red-600">- 0.3%</span>
                  <span className="text-gray-500 ml-1">Last Month</span>
                  <Button variant="link" size="sm" className="ml-auto p-0 h-auto text-xs">View More</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Booked Revenue</p>
                    <p className="text-2xl font-bold">$123.6k</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-red-600">- 10.0%</span>
                  <span className="text-gray-500 ml-1">Last Month</span>
                  <Button variant="link" size="sm" className="ml-auto p-0 h-auto text-xs">View More</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversions Donut Chart */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Returning', value: 65.2 },
                          { name: 'New', value: 34.8 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        startAngle={90}
                        endAngle={450}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#f97316" />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">65.2%</span>
                    <span className="text-xs text-gray-500">Returning Customer</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Week</span>
                  <span className="font-semibold">23.5k</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Week</span>
                  <span className="font-semibold">41.05k</span>
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs">View Details</Button>
              </div>
            </CardContent>
          </Card>

          {/* Sessions by Country */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Sessions by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.analytics?.topCountries?.slice(0, 4).map((country: any, index: number) => {
                  const countryData = getCountryWithFlag(country.country);
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                  return (
                    <div key={country.country} className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <span className="text-xl">{countryData.flag}</span>
                      <span className="text-sm flex-1">{countryData.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Week</span>
                  <span className="font-semibold">23.5k</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Week</span>
                  <span className="font-semibold">41.05k</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Top Pages</CardTitle>
              <Button variant="link" size="sm" className="text-orange-500 text-xs">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Page Path</p>
                    <p className="text-xs text-gray-500">Page Views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Exit Rate</p>
                  </div>
                </div>
                {[
                  { path: 'larkon/ecommerce.html', views: 465, rate: '44%', color: 'text-green-600' },
                  { path: 'larkon/dashboard.html', views: 426, rate: '65.4%', color: 'text-red-600' },
                  { path: 'larkon/chat.html', views: 254, rate: '23.5%', color: 'text-green-600' },
                  { path: 'larkon/auth-login.html', views: 3869, rate: '5.2%', color: 'text-green-600' },
                  { path: 'larkon/email.html', views: 985, rate: '54.8%', color: 'text-red-600' },
                  { path: 'larkon/social.html', views: 653, rate: '7.4%', color: 'text-green-600' },
                  { path: 'larkon/blog.html', views: 478, rate: '1.4%', color: 'text-green-600' }
                ].map((page, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 hover:underline cursor-pointer">{page.path}</p>
                      <p className="text-xs text-gray-500">{page.views}</p>
                    </div>
                    <div className={`text-xs font-medium ${page.color}`}>
                      {page.rate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}