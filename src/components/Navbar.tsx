import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-accent rounded-lg shadow-soft group-hover:shadow-medium transition-all">
              <Wind className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              CoolAir Pro
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <Link to="/booking" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Book Service
            </Link>
            <Link to="/admin" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="accent" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
