import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardNavbar from '../components/DashboardNavbar';

const DashboardLayout = ({ role }) => {
  const { user, logout } = useAuth();
  
  if (!user && !localStorage.getItem('token')) {
     return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Top Navbar */}
       <DashboardNavbar />

       {/* Main Content Area */}
       <main className="flex-grow max-w-[95%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
       </main>
    </div>
  );
};

export default DashboardLayout;
