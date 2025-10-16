import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  User, 
  Settings, 
  Bell, 
  AirVent,
  Edit,
  Save,
  X,
  RefreshCw,
  History,
  Plus,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import RescheduleModal from '@/components/RescheduleModal';
import MessagingLayout from '@/components/MessagingLayout';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State management
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    avatar_url: ''
  });

  // Equipment management state
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [equipmentForm, setEquipmentForm] = useState({
    brand: '',
    model: '',
    type: '',
    capacity: '',
    installation_date: '',
    notes: ''
  });

  // Reschedule modal state
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    currentDate: string;
    currentTime: string;
  }>({
    isOpen: false,
    bookingId: null,
    currentDate: '',
    currentTime: ''
  });

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchBookings(),
      fetchProfile(),
      fetchEquipment(),
      fetchNotifications()
    ]);
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, category)
      `)
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (!error && data) {
      setProfile(data);
      setProfileForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        avatar_url: data.avatar_url || ''
      });
    }
  };

  const fetchEquipment = async () => {
    const { data, error } = await supabase
      .from('equipment' as any)
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEquipment(data);
    }
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications' as any)
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setNotifications(data);
    }
  };

  const canCancelBooking = (scheduledDate: string) => {
    const bookingDate = new Date(scheduledDate);
    const today = new Date();
    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };

  const canRescheduleBooking = (scheduledDate: string, status: string) => {
    const bookingDate = new Date(scheduledDate);
    const today = new Date();
    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 1 && ['pending', 'confirmed'].includes(status);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (!error) {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      fetchBookings();
    } else {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRescheduleBooking = async (bookingId: string, newDate: string, newTime: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ 
        scheduled_date: newDate,
        scheduled_time: newTime,
        status: 'pending'
      })
      .eq('id', bookingId);

    if (!error) {
      toast({
        title: "Booking Rescheduled",
        description: "Your booking has been successfully rescheduled.",
      });
      fetchBookings();
    } else {
      toast({
        title: "Error",
        description: "Failed to reschedule booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openRescheduleModal = (bookingId: string, currentDate: string, currentTime: string) => {
    setRescheduleModal({
      isOpen: true,
      bookingId,
      currentDate,
      currentTime
    });
  };

  const closeRescheduleModal = () => {
    setRescheduleModal({
      isOpen: false,
      bookingId: null,
      currentDate: '',
      currentTime: ''
    });
  };

  const confirmReschedule = (newDate: string, newTime: string) => {
    if (rescheduleModal.bookingId) {
      handleRescheduleBooking(rescheduleModal.bookingId, newDate, newTime);
    }
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from('profiles')
      .update(profileForm)
      .eq('id', user?.id);

    if (!error) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditingProfile(false);
      fetchProfile();
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddEquipment = async () => {
    const { error } = await supabase
      .from('equipment' as any)
      .insert({
        client_id: user?.id,
        ...equipmentForm
      } as any);

    if (!error) {
      toast({
        title: "Equipment Added",
        description: "Your air conditioner has been added to your profile.",
      });
      setIsAddingEquipment(false);
      setEquipmentForm({
        brand: '',
        model: '',
        type: '',
        capacity: '',
        installation_date: '',
        notes: ''
      });
      fetchEquipment();
    } else {
      toast({
        title: "Error",
        description: "Failed to add equipment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications' as any)
      .update({ is_read: true } as any)
      .eq('id', notificationId);
    
    fetchNotifications();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700';
      case 'assigned': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'assigned': return <User className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setActiveTab(section);
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Client Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile, bookings, and aircon equipment
          </p>
        </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <AirVent className="h-4 w-4" />
                Equipment
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {notifications.filter(n => !n.is_read).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <Button variant="accent" onClick={() => navigate('/booking')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book New Service
                </Button>
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground py-12">Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <AirVent className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No bookings yet</p>
                  <Button variant="accent" onClick={() => navigate('/booking')}>
                    Book a Service
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="p-6 hover:shadow-large transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{booking.services?.name}</h3>
                            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                              {getStatusIcon(booking.status)}
                              {booking.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.service_address}, {booking.service_city}</span>
                            </div>
                            {booking.technician_id && booking.technicians?.profiles && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-green-600" />
                                <span>Technician: {booking.technicians.profiles.full_name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent mb-4">₱{booking.total_price}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {booking.technician_id && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setActiveTab('messages');
                                  // You could also set a specific booking to open in chat
                                }}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                            )}
                            {canRescheduleBooking(booking.scheduled_date, booking.status) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openRescheduleModal(booking.id, booking.scheduled_date, booking.scheduled_time)}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Reschedule
                              </Button>
                            )}
                            {canCancelBooking(booking.scheduled_date) && booking.status !== 'cancelled' && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <div className="max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Settings</h2>
                  <Button 
                    variant={isEditingProfile ? "outline" : "default"}
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{profile?.full_name || 'User'}</h3>
                      <p className="text-muted-foreground">{profile?.phone || 'No phone number'}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="avatar_url">Avatar URL</Label>
                        <Input
                          id="avatar_url"
                          value={profileForm.avatar_url}
                          onChange={(e) => setProfileForm({...profileForm, avatar_url: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                        <p className="text-lg">{profile?.full_name || 'Not set'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                        <p className="text-lg">{profile?.phone || 'Not set'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                        <p className="text-lg">{profile?.address || 'Not set'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">City</Label>
                        <p className="text-lg">{profile?.city || 'Not set'}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Equipment Tab */}
            <TabsContent value="equipment" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Air Conditioners</h2>
                <Button 
                  variant={isAddingEquipment ? "outline" : "default"}
                  onClick={() => setIsAddingEquipment(!isAddingEquipment)}
                >
                  {isAddingEquipment ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Equipment
                    </>
                  )}
                </Button>
              </div>

              {isAddingEquipment && (
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">Add New Air Conditioner</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={equipmentForm.brand}
                        onChange={(e) => setEquipmentForm({...equipmentForm, brand: e.target.value})}
                        placeholder="e.g., Carrier, Daikin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={equipmentForm.model}
                        onChange={(e) => setEquipmentForm({...equipmentForm, model: e.target.value})}
                        placeholder="e.g., 42QHC018DS"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={equipmentForm.type}
                        onChange={(e) => setEquipmentForm({...equipmentForm, type: e.target.value})}
                        placeholder="e.g., Window, Split, Cassette"
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        value={equipmentForm.capacity}
                        onChange={(e) => setEquipmentForm({...equipmentForm, capacity: e.target.value})}
                        placeholder="e.g., 1HP, 1.5HP, 2HP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="installation_date">Installation Date</Label>
                      <Input
                        id="installation_date"
                        type="date"
                        value={equipmentForm.installation_date}
                        onChange={(e) => setEquipmentForm({...equipmentForm, installation_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={equipmentForm.notes}
                        onChange={(e) => setEquipmentForm({...equipmentForm, notes: e.target.value})}
                        placeholder="Additional notes about this unit"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddEquipment} className="mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                </Card>
              )}

              {equipment.length === 0 ? (
                <Card className="p-12 text-center">
                  <AirVent className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No air conditioners registered yet</p>
                  <Button variant="accent" onClick={() => setIsAddingEquipment(true)}>
                    Add Your First AC Unit
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {equipment.map((unit) => (
                    <Card key={unit.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <AirVent className="h-8 w-8 text-accent" />
                          <div>
                            <h3 className="font-bold">{unit.brand} {unit.model}</h3>
                            <p className="text-sm text-muted-foreground">
                              {unit.type} • {unit.capacity}
                            </p>
                            {unit.installation_date && (
                              <p className="text-xs text-muted-foreground">
                                Installed: {new Date(unit.installation_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {unit.last_service_date ? 
                            `Last serviced: ${new Date(unit.last_service_date).toLocaleDateString()}` :
                            'Never serviced'
                          }
                        </Badge>
                      </div>
                      {unit.notes && (
                        <div className="mt-3 p-2 bg-secondary/30 rounded text-sm">
                          {unit.notes}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="mt-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Messages</h2>
                <p className="text-muted-foreground">
                  Chat with your assigned technicians about your bookings
                </p>
              </div>
              <MessagingLayout className="h-[600px]" />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <Button variant="outline" onClick={fetchNotifications}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {notifications.length === 0 ? (
                <Card className="p-12 text-center">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`p-4 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold">{notification.title}</h3>
                          <p className="text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <RescheduleModal
            isOpen={rescheduleModal.isOpen}
            onClose={closeRescheduleModal}
            onConfirm={confirmReschedule}
            currentDate={rescheduleModal.currentDate}
            currentTime={rescheduleModal.currentTime}
          />
        </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
