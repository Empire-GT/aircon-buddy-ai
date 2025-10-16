import { Link } from "react-router-dom";
import { Wind, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="h-6 w-6" />
              <span className="text-xl font-bold">ProQual</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Professional aircon services at your fingertips. We connect you with certified technicians for all your air conditioning needs.
            </p>
            <div className="flex gap-4">
              <a href="tel:+631234567890" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="mailto:support@proqual.com" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Book Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/join-our-team" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Join Our Team
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <a href="tel:+631234567890" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  +63 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2025 ProQual. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

