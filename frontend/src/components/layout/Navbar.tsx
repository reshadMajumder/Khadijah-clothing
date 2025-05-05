import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import KhadijahLogo from '../ui/KhadijahLogo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-teal-950 shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <KhadijahLogo className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-amber-300 transition-colors">Home</Link>
          <Link to="/products" className="text-white hover:text-amber-300 transition-colors">Products</Link>
          <Link to="/about" className="text-white hover:text-amber-300 transition-colors">About</Link>
          <Link to="/contact" className="text-white hover:text-amber-300 transition-colors">Contact us</Link>
          <Link to="/reviews" className="text-white hover:text-amber-300 transition-colors">Reviews</Link>
          <Link to="/terms" className="text-white hover:text-amber-300 transition-colors">Terms</Link>
        </nav>

        {/* Search, Cart & Admin */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 py-1.5 pl-9 pr-3 rounded-full bg-teal-800/80 border border-teal-700 focus:outline-none focus:border-orange-500 text-white placeholder-teal-400"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-400" />
          </form>

          {/* Cart */}
          <Link 
            to="/cart" 
            className="relative p-1.5 rounded-full hover:bg-teal-800 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-white" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {/* Admin Link */}
          {currentUser ? (
            <Link to="/admin" className="text-white hover:text-amber-300 transition-colors text-sm">
              Dashboard
            </Link>
          ) : (
            <Link to="/admin/login" className="text-white hover:text-amber-300 transition-colors text-sm">
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-1 text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-teal-900 shadow-lg py-4 px-4 z-50 slide-up">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-9 pr-3 rounded-md bg-teal-800 text-white placeholder-teal-400 border border-teal-700"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-400" />
          </form>
          
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="text-white hover:text-amber-300 transition-colors py-1">Home</Link>
            <Link to="/about" className="text-white hover:text-amber-300 transition-colors py-1">About</Link>
            <Link to="/contact" className="text-white hover:text-amber-300 transition-colors py-1">Contact</Link>
            <Link to="/reviews" className="text-white hover:text-amber-300 transition-colors py-1">Reviews</Link>
            <Link to="/terms" className="text-white hover:text-amber-300 transition-colors py-1">Terms</Link>
            
            <div className="flex items-center justify-between pt-2 border-t border-teal-700">
              <Link to="/cart" className="flex items-center text-white hover:text-amber-300 transition-colors py-1">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Cart ({getTotalItems()})
              </Link>
              
              {currentUser ? (
                <Link to="/admin" className="text-white hover:text-amber-300 transition-colors py-1">
                  Dashboard
                </Link>
              ) : (
                <Link to="/admin/login" className="text-white hover:text-amber-300 transition-colors py-1">
                  Admin
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;