import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => scrollToSection("hero")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
            Rs
          </div>
          <span className="text-xl font-bold">RoadSense.ai</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <Link
            to="/map"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Public Map
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register/citizen">
            <Button>Register</Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-background/95 backdrop-blur md:hidden">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2"
            >
              How It Works
            </button>
            <Link
              to="/map"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Public Map
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="flex flex-col gap-3 pt-4 border-t">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register/citizen" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
