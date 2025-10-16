import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
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
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
  const [sidebarStats, setSidebarStats] = useState({
    unassignedBookings: 0,
    activeTechnicians: 0,
    todayBookings: 0,
    pendingMessages: 0
  });
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch sidebar statistics for admin
  useEffect(() => {
    if (userRole === 'admin') {
      fetchSidebarStats();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchSidebarStats, 30000);
      return () => clearInterval(interval);
    }
  }, [userRole]);

  const fetchSidebarStats = async () => {
    try {
      const [unassignedBookingsResult, todayBookingsResult, activeTechniciansResult, pendingMessagesResult] = await Promise.all([
        // Unassigned bookings
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .is('technician_id', null),
        
        // Today's bookings
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('scheduled_date', new Date().toISOString().split('T')[0]),
        
        // Active technicians
        supabase
          .from('technicians')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Pending messages (unread)
        supabase
          .from('chat_messages')
          .select('id', { count: 'exact', head: true })
          .eq('is_read', false)
      ]);

      setSidebarStats({
        unassignedBookings: unassignedBookingsResult.count || 0,
        todayBookings: todayBookingsResult.count || 0,
        activeTechnicians: activeTechniciansResult.count || 0,
        pendingMessages: pendingMessagesResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching sidebar stats:', error);
    }
  };

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
            path: '/dashboard/client',
            badge: 3 // Example badge count
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
          {
            id: 'overview',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: getDashboardPath()
          },
          {
            id: 'bookings',
            label: 'All Bookings',
            icon: Calendar,
            badge: sidebarStats.unassignedBookings
          },
          {
            id: 'technicians',
            label: 'Technicians',
            icon: Users,
            badge: sidebarStats.activeTechnicians
          },
          {
            id: 'subscriptions',
            label: 'Subscriptions',
            icon: DollarSign
          },
          {
            id: 'user-management',
            label: 'User Management',
            icon: User
          },
          {
            id: 'roles-permissions',
            label: 'Roles & Permissions',
            icon: Shield
          },
          {
            id: 'messages',
            label: 'Messages',
            icon: MessageCircle,
            badge: sidebarStats.pendingMessages
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: TrendingUp
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings
          }
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleItemClick = (item: SidebarItem) => {
    console.log('Sidebar item clicked:', item.id, 'User role:', userRole, 'onSectionChange:', !!onSectionChange);
    
    // For technician, client, and admin dashboards, handle section switching
    if ((userRole === 'technician' || userRole === 'client' || userRole === 'admin') && onSectionChange) {
      onSectionChange(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (item: SidebarItem) => {
    // For technician, client, and admin dashboards, check activeSection
    if ((userRole === 'technician' || userRole === 'client' || userRole === 'admin') && activeSection) {
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
            className="h-8 w-8 p-0 hover:bg-muted"
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
            <AvatarFallback className="bg-muted text-muted-foreground">
              {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.user_metadata?.full_name || 'User Name'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Stats Section */}
      {userRole === 'admin' && !isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Live Stats</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSidebarStats}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <Activity className="h-3 w-3" />
            </Button>
          </div>
          <Card className="p-3 bg-muted/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Unassigned
                </span>
                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {sidebarStats.unassignedBookings}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Today
                </span>
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {sidebarStats.todayBookings}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Active Techs
                </span>
                <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {sidebarStats.activeTechnicians}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11 rounded-lg transition-all duration-200",
                isCollapsed && "px-2",
                active && "bg-accent text-accent-foreground hover:bg-accent/90",
                !active && "hover:bg-muted"
              )}
              onClick={() => handleItemClick(item)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant={item.id === 'bookings' ? "destructive" : "secondary"} 
                      className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
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
        <div className="p-4 space-y-1">
          {userRole === 'admin' ? (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-muted"
                onClick={() => navigate('/technician-application')}
              >
                <UserPlus className="h-4 w-4" />
                <span className="font-medium">Add Technician</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-muted"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Back to Home</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-muted"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Back to Home</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-muted"
                onClick={() => navigate('/booking')}
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Book Service</span>
              </Button>
            </>
          )}
        </div>
      )}

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed && "px-2"
          )}
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;

