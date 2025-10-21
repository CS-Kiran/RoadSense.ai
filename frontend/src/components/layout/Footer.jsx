// src/components/layout/Footer.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Instagram, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    Product: [
      { name: "Features", path: "/#features" },
      { name: "How it Works", path: "/#how-it-works" },
      { name: "Public Map", path: "/map" },
    ],
    Company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Careers", path: "/careers" },
    ],
    Legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
    ],
    Support: [
      { name: "Help Center", path: "/help" },
      { name: "FAQ", path: "/faq" },
      { name: "Documentation", path: "/docs" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">RoadSense.ai</span>
                  <p className="text-xs text-gray-400">Report. Track. Resolve.</p>
                </div>
              </Link>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Empowering citizens and government to work together for better roads.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-blue-400" />
                  <span>support@RoadSense.ai</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-blue-400" />
                  <span>1800-123-4567</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-white mb-3 text-sm">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mb-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RoadSense.ai. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-all p-2 rounded-lg hover:bg-gray-800"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  );
}