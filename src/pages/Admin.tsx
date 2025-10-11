import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from "lucide-react";

const Admin = () => {
  const stats = [
    { 
      icon: DollarSign, 
      label: "Total Revenue", 
      value: "₱125,400", 
      change: "+12.5%",
      trend: "up"
    },
    { 
      icon: Users, 
      label: "Active Technicians", 
      value: "48", 
      change: "+8",
      trend: "up"
    },
    { 
      icon: CheckCircle, 
      label: "Completed Jobs", 
      value: "342", 
      change: "+23%",
      trend: "up"
    },
    { 
      icon: TrendingUp, 
      label: "Customer Retention", 
      value: "94%", 
      change: "+3%",
      trend: "up"
    },
  ];

  const recentBookings = [
    { 
      id: "BK-2341", 
      customer: "Maria Santos", 
      service: "Deep Cleaning",
      technician: "Juan Cruz",
      status: "In Progress",
      amount: "₱800"
    },
    { 
      id: "BK-2340", 
      customer: "John Reyes", 
      service: "Installation",
      technician: "Pedro Gomez",
      status: "Scheduled",
      amount: "₱2,500"
    },
    { 
      id: "BK-2339", 
      customer: "Ana Lopez", 
      service: "General Cleaning",
      technician: "Carlos Tan",
      status: "Completed",
      amount: "₱500"
    },
  ];

  const topTechnicians = [
    { name: "Juan Cruz", rating: 4.9, jobs: 127, earnings: "₱38,200" },
    { name: "Pedro Gomez", rating: 4.8, jobs: 98, earnings: "₱31,400" },
    { name: "Carlos Tan", rating: 4.9, jobs: 115, earnings: "₱34,500" },
    { name: "Miguel Reyes", rating: 4.7, jobs: 89, earnings: "₱26,700" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Manage technicians, bookings, and monitor business performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-accent rounded-lg">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technicians">Technicians</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Recent Bookings</h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="space-y-1">
                          <p className="font-semibold">{booking.customer}</p>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                          <p className="text-xs text-muted-foreground">Tech: {booking.technician}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-primary">{booking.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* AI Insights */}
                <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold">AI Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg border-l-4 border-accent">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-accent mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Revenue Forecast</p>
                          <p className="text-sm text-muted-foreground">
                            Expected revenue increase of 18% next month based on current trends
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Performance Alert</p>
                          <p className="text-sm text-muted-foreground">
                            3 technicians showing below-average ratings this week
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border-l-4 border-green-500">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Customer Retention</p>
                          <p className="text-sm text-muted-foreground">
                            94% retention rate - 12 customers likely to book again this month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technicians" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Top Performing Technicians</h3>
                  <Button variant="accent">Add New Technician</Button>
                </div>
                <div className="space-y-4">
                  {topTechnicians.map((tech, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:shadow-medium transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                          {tech.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold">{tech.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {tech.rating}
                            </span>
                            <span>{tech.jobs} jobs</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{tech.earnings}</p>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">All Bookings</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Filter</Button>
                    <Button variant="accent" size="sm">Export</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border-2 border-border rounded-lg hover:border-accent/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-muted-foreground">{booking.id}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="font-semibold">{booking.customer}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Wrench className="h-4 w-4" />
                              {booking.service}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {booking.technician}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-2">{booking.amount}</p>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
