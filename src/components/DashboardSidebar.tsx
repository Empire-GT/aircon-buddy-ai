import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard,
  Calendar,
  User,
  AirVent,
  Bell,
  Settings,
  LogOut,
  Users,
  Wrench,
  DollarSign,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  badge?: number;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  className?: string;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const DashboardSidebar = ({ className, activeSection, onSectionChange }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    switch (userRole) {
      case 'client':
        return '/dashboard/client';
      case 'technician':
        return '/dashboard/technician';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  // Define navigation items based on user role
  const getNavigationItems = (): SidebarItem[] => {
    const baseItems: SidebarItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: getDashboardPath()
      }
    ];

    switch (userRole) {
      case 'client':
        return [
          ...baseItems,
          {
            id: 'bookings',
            label: 'My Bookings',
            icon: Calendar,
            path: '/dashboard/client'
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: User,
            path: '/dashboard/client'
          },
          {
            id: 'equipment',
            label: 'My Equipment',
            icon: AirVent,
            path: '/dashboard/client'
          },
          {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            path: '/dashboard/client'
          }
        ];

      case 'technician':
        return [
          ...baseItems,
          {
            id: 'jobs',
            label: 'My Jobs',
            icon: Wrench,
            path: '/dashboard/technician'
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: User,
            path: '/dashboard/technician'
          },
          {
            id: 'earnings',
            label: 'Earnings',
            icon: DollarSign,
            path: '/dashboard/technician'
          },
          {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            path: '/dashboard/technician'
          },
          {
            id: 'faq',
            label: 'FAQ',
            icon: HelpCircle,
            path: '/dashboard/technician'
          }
        ];

      case 'admin':
        return [
          ...baseItems,
          {
            id: 'overview',
            label: 'Overview',
            icon: BarChart3,
            path: '/dashboard/admin'
          },
          {
            id: 'technicians',
            label: 'Technicians',
            icon: Users,
            path: '/dashboard/admin'
          },
          {
            id: 'bookings',
            label: 'All Bookings',
            icon: Calendar,
            path: '/dashboard/admin'
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: TrendingUp,
            path: '/dashboard/admin'
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/dashboard/admin'
          }
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleItemClick = (item: SidebarItem) => {
    // For technician dashboard, handle section switching
    if (userRole === 'technician' && onSectionChange) {
      onSectionChange(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (item: SidebarItem) => {
    // For technician dashboard, check activeSection
    if (userRole === 'technician' && activeSection) {
      return activeSection === item.id;
    }
    
    if (item.path) {
      return location.pathname === item.path;
    }
    return false;
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <AirVent className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg">AirCon Buddy</h2>
                <p className="text-xs text-muted-foreground capitalize">{userRole} Dashboard</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Button
              key={item.id}
              variant={active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                isCollapsed && "px-2"
              )}
              onClick={() => handleItemClick(item)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => navigate('/booking')}
          >
            <BookOpen className="h-4 w-4" />
            <span>Book Service</span>
          </Button>
        </div>
      )}

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10 text-destructive hover:text-destructive",
            isCollapsed && "px-2"
          )}
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;

