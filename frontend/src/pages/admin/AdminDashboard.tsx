import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import KhadijahLogo from '../../components/ui/KhadijahLogo';

// Admin Dashboard Pages
import OrdersPage from './OrdersPage';
import ReviewsPage from './ReviewsPage';
import StaffPage from './StaffPage';
import AdminNotFound from './AdminNotFound';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Protected route - redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!currentUser) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="pt-16 bg-teal-950 min-h-screen">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-teal-800 rounded-md text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-teal-900 shadow-lg transition-transform transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } md:relative md:translate-x-0`}
        >
          <div className="p-4 border-b border-teal-800">
            <Link to="/" className="flex items-center">
              <KhadijahLogo className="h-8 w-auto" />
            </Link>
          </div>

          <nav className="p-4">
            <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Management
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/admin/orders"
                  className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-colors ${
                    location.pathname === '/admin/orders' || location.pathname === '/admin'
                      ? 'bg-teal-800/50 text-white'
                      : 'text-gray-300 hover:bg-teal-800/30 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reviews"
                  className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-colors ${
                    location.pathname === '/admin/reviews'
                      ? 'bg-teal-800/50 text-white'
                      : 'text-gray-300 hover:bg-teal-800/30 hover:text-white'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Manage Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/staff"
                  className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-colors ${
                    location.pathname === '/admin/staff'
                      ? 'bg-teal-800/50 text-white'
                      : 'text-gray-300 hover:bg-teal-800/30 hover:text-white'
                  }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  Manage Staff
                </Link>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-teal-800">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2.5 text-sm rounded-md text-gray-300 hover:bg-teal-800/30 hover:text-white transition-colors w-full"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Log Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<OrdersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="*" element={<AdminNotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;