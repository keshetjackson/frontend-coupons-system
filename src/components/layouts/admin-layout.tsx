import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LogOut, Menu, Home, Tag, FileText, Users } from 'lucide-react';
import { useAuth } from '../../store/auth';


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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-4 px-2 py-1.5 text-sm text-gray-500">
            Logged in as: {user?.username}
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-margin duration-200 ease-in-out ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            {!sidebarOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            
            <div className="ml-auto">
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};