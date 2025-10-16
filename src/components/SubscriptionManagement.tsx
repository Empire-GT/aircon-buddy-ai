import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Play,
  Pause,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan_name: string;
  plan_type: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  amount: number;
  billing_cycle: 'monthly' | 'yearly';
  auto_renew: boolean;
  created_at: string;
}

interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  monthly_revenue: number;
  yearly_revenue: number;
  churn_rate: number;
  growth_rate: number;
  plan_distribution: {
    basic: number;
    premium: number;
    enterprise: number;
  };
}

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    total_subscriptions: 0,
    active_subscriptions: 0,
    monthly_revenue: 0,
    yearly_revenue: 0,
    churn_rate: 0,
    growth_rate: 0,
    plan_distribution: { basic: 0, premium: 0, enterprise: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  // Sample subscription plans
  const subscriptionPlans = [
    { id: 'basic', name: 'Basic Plan', price: 29.99, features: ['5 Bookings/month', 'Basic Support', 'Standard Services'] },
    { id: 'premium', name: 'Premium Plan', price: 59.99, features: ['15 Bookings/month', 'Priority Support', 'All Services', 'Scheduling'] },
    { id: 'enterprise', name: 'Enterprise Plan', price: 99.99, features: ['Unlimited Bookings', '24/7 Support', 'All Services', 'Advanced Analytics', 'Custom Integration'] }
  ];

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      // For now, we'll create sample data since we don't have a subscriptions table yet
      const sampleSubscriptions: Subscription[] = [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'John Doe',
          user_email: 'john@example.com',
          plan_name: 'Premium Plan',
          plan_type: 'premium',
          status: 'active',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          amount: 59.99,
          billing_cycle: 'monthly',
          auto_renew: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          user_id: 'user2',
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          plan_name: 'Basic Plan',
          plan_type: 'basic',
          status: 'active',
          start_date: '2024-02-01',
          end_date: '2024-12-31',
          amount: 29.99,
          billing_cycle: 'monthly',
          auto_renew: true,
          created_at: '2024-02-01T00:00:00Z'
        },
        {
          id: '3',
          user_id: 'user3',
          user_name: 'Mike Johnson',
          user_email: 'mike@example.com',
          plan_name: 'Enterprise Plan',
          plan_type: 'enterprise',
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          amount: 99.99,
          billing_cycle: 'monthly',
          auto_renew: true,
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '4',
          user_id: 'user4',
          user_name: 'Sarah Wilson',
          user_email: 'sarah@example.com',
          plan_name: 'Premium Plan',
          plan_type: 'premium',
          status: 'cancelled',
          start_date: '2024-01-01',
          end_date: '2024-06-30',
          amount: 59.99,
          billing_cycle: 'monthly',
          auto_renew: false,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          user_id: 'user5',
          user_name: 'David Brown',
          user_email: 'david@example.com',
          plan_name: 'Basic Plan',
          plan_type: 'basic',
          status: 'expired',
          start_date: '2023-12-01',
          end_date: '2024-03-31',
          amount: 29.99,
          billing_cycle: 'monthly',
          auto_renew: false,
          created_at: '2023-12-01T00:00:00Z'
        }
      ];

      setSubscriptions(sampleSubscriptions);
      calculateStats(sampleSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subscriptionData: Subscription[]) => {
    const total = subscriptionData.length;
    const active = subscriptionData.filter(s => s.status === 'active').length;
    const monthlyRevenue = subscriptionData
      .filter(s => s.status === 'active' && s.billing_cycle === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0);
    const yearlyRevenue = subscriptionData
      .filter(s => s.status === 'active' && s.billing_cycle === 'yearly')
      .reduce((sum, s) => sum + s.amount, 0);
    
    const planDistribution = {
      basic: subscriptionData.filter(s => s.plan_type === 'basic' && s.status === 'active').length,
      premium: subscriptionData.filter(s => s.plan_type === 'premium' && s.status === 'active').length,
      enterprise: subscriptionData.filter(s => s.plan_type === 'enterprise' && s.status === 'active').length
    };

    setStats({
      total_subscriptions: total,
      active_subscriptions: active,
      monthly_revenue: monthlyRevenue,
      yearly_revenue: yearlyRevenue,
      churn_rate: total > 0 ? ((total - active) / total) * 100 : 0,
      growth_rate: 12.5, // Sample growth rate
      plan_distribution
    });
  };

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsViewModalOpen(true);
  };

  const handleUpdateSubscriptionStatus = async (subscriptionId: string, newStatus: string) => {
    try {
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: newStatus as any } : sub
        )
      );
      
      toast({
        title: "Success",
        description: "Subscription status updated successfully",
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || subscription.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || subscription.plan_type === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'expired':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'basic':
        return 'bg-blue-100 text-blue-700';
      case 'premium':
        return 'bg-purple-100 text-purple-700';
      case 'enterprise':
        return 'bg-gold-100 text-gold-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p className="text-muted-foreground">Manage user subscriptions and billing</p>
        </div>
        <Button variant="accent">
          <CreditCard className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Subscriptions</p>
              <p className="text-3xl font-bold">{stats.total_subscriptions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">+{stats.growth_rate}%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
              <p className="text-3xl font-bold">{stats.active_subscriptions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <Progress value={(stats.active_subscriptions / stats.total_subscriptions) * 100} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
              <p className="text-3xl font-bold">₱{stats.monthly_revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">+8.2%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
              <p className="text-3xl font-bold">{stats.churn_rate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">-2.1%</span>
          </div>
        </Card>
      </div>

      {/* Plan Distribution Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Plan Distribution</h3>
          <PieChart className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.plan_distribution).map(([plan, count]) => (
            <div key={plan} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getPlanColor(plan)}`}>
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium capitalize">{plan} Plan</p>
                  <p className="text-sm text-muted-foreground">{count} subscribers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.active_subscriptions > 0 ? ((count / stats.active_subscriptions) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPlan} onValueChange={setFilterPlan}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Subscriptions List */}
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading subscriptions...</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No subscriptions found</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredSubscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>
                        {subscription.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{subscription.user_name}</h3>
                        <Badge className={`text-xs ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </Badge>
                        <Badge className={`text-xs ${getPlanColor(subscription.plan_type)}`}>
                          {subscription.plan_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{subscription.user_email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {subscription.billing_cycle} • ₱{subscription.amount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires {new Date(subscription.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSubscription(subscription)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateSubscriptionStatus(subscription.id, 'active')}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateSubscriptionStatus(subscription.id, 'cancelled')}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>

      {/* View Subscription Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              Complete subscription information and billing details
            </DialogDescription>
          </DialogHeader>

          {selectedSubscription && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">
                    {selectedSubscription.user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedSubscription.user_name}</h3>
                  <p className="text-muted-foreground">{selectedSubscription.user_email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(selectedSubscription.status)}>
                      {selectedSubscription.status}
                    </Badge>
                    <Badge className={getPlanColor(selectedSubscription.plan_type)}>
                      {selectedSubscription.plan_type}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Plan Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedSubscription.plan_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground">₱{selectedSubscription.amount} / {selectedSubscription.billing_cycle}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSubscription.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSubscription.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Auto Renew</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubscription.auto_renew ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSubscription.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">Plan Features</Label>
                <div className="space-y-2">
                  {subscriptionPlans
                    .find(plan => plan.id === selectedSubscription.plan_type)
                    ?.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsViewModalOpen(false)}>
              Edit Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagement;
