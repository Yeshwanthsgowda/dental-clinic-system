import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  User, 
  LogOut, 
  Stethoscope,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  const getNavItems = () => {
    if (role === 'doctor') {
      return [
        { name: 'Dashboard', path: '/doctor/dashboard' },
        { name: 'Appointments', path: '/doctor/appointments' },
        { name: 'Schedule', path: '/doctor/schedule' },
        { name: 'My Services', path: '/doctor/treatments' },
        { name: 'Reviews', path: '/doctor/reviews' },
        { name: 'Profile', path: '/doctor/profile' },
      ];
    }
    return [
      { name: 'Home', path: '/' },
      { name: 'Doctors', path: '/doctors' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ];
  };

  const navItems = getNavItems();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={role === 'doctor' ? '/doctor/dashboard' : '/'} className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advik Dento Care
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => window.scrollTo(0, 0)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {role === 'patient' && (
                  <Link
                    to="/patient/appointments"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>My Appointments</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={handleNavClick}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  {role === 'patient' && (
                    <Link
                      to="/patient/appointments"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={handleNavClick}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Appointments</span>
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button variant="ghost" asChild>
                    <Link to="/login" onClick={handleNavClick}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register" onClick={handleNavClick}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;