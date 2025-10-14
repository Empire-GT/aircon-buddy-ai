import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wind, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!userRole) return '/auth';
    return `/dashboard/${userRole}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-accent rounded-lg shadow-soft group-hover:shadow-medium transition-all">
              <Wind className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ProQual
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Pricing
            </Link>
            {user && userRole === 'client' && (
              <Link to="/booking" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Book Service
              </Link>
            )}
            {user && (
              <Link to={getDashboardLink()} className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button variant="accent" size="sm" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
