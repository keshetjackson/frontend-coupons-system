import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LogOut, Menu, Home, Tag, FileText, Users } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Button } from '../ui/button';

const navigation = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Users', path: '/admin/users', icon: Users },
];

export const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <h1 className="text-xl font-bold text-white">Admin</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full px-4 py-3 border-t">
          <Button 
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="flex items-center h-16 px-6 bg-white shadow-sm">
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 text-right">
            <span className="font-medium text-gray-700">{user?.username}</span>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};