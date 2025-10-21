// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Public Map", path: "/map" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 ${
              isScrolled 
                ? "bg-gradient-to-br from-blue-600 to-indigo-700" 
                : "bg-white/10 backdrop-blur-md border border-white/20"
            }`}>
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}>
                RoadSense.ai
              </span>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? "text-gray-600" : "text-white/80"
              }`}>
                Report. Track. Resolve.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <button
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? isScrolled
                        ? "bg-blue-100 text-blue-600"
                        : "bg-white/20 text-white backdrop-blur-md"
                      : isScrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white/90 hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  {link.name}
                </button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/login">
              <Button
                variant="ghost"
                className={`font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10 backdrop-blur-sm"
                }`}
              >
                Login
              </Button>
            </Link>
            <Link to="/register/citizen">
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10 backdrop-blur-sm"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl"
          >
            <div className="container mx-auto px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive(link.path)
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </button>
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link to="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}