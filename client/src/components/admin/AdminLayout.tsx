import { useLocation } from "wouter";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  
  // Check authentication
  const token = localStorage.getItem("admin_token");
  if (!token) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title={title} subtitle={subtitle} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}