import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import KhadijahLogo from '../ui/KhadijahLogo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-teal-950 border-t border-teal-800 pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <KhadijahLogo className="h-10 w-auto" />
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              Elevating women's fashion with elegant pieces that blend tradition and contemporary style.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=sarees" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Sarees
                </Link>
              </li>
              <li>
                <Link to="/?category=kurtis" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Kurtis
                </Link>
              </li>
              <li>
                <Link to="/?category=gowns" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Gowns
                </Link>
              </li>
              <li>
                <Link to="/?category=traditional" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Traditional Wear
                </Link>
              </li>
              <li>
                <Link to="/?category=accessories" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Fashion Street, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <PhoneCall className="h-5 w-5 text-orange-500 mr-2" />
                <a href="tel:+8801700000000" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  +880 170 000 0000
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-2" />
                <a href="mailto:info@khadijah.com" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  info@khadijah.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-teal-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Khadijah Women's Fashion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;