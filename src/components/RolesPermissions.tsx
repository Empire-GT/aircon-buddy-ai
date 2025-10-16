import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserCheck,
  UserX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
  user_count: number;
  created_at: string;
}

const RolesPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  // Predefined permissions
  const systemPermissions: Permission[] = [
    // User Management
    { id: 'users.view', name: 'View Users', description: 'View user list and details', category: 'User Management' },
    { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management' },
    { id: 'users.edit', name: 'Edit Users', description: 'Edit user information', category: 'User Management' },
    { id: 'users.delete', name: 'Delete Users', description: 'Delete user accounts', category: 'User Management' },
    { id: 'users.activate', name: 'Activate/Deactivate Users', description: 'Activate or deactivate user accounts', category: 'User Management' },

    // Booking Management
    { id: 'bookings.view', name: 'View Bookings', description: 'View all bookings', category: 'Booking Management' },
    { id: 'bookings.create', name: 'Create Bookings', description: 'Create new bookings', category: 'Booking Management' },
    { id: 'bookings.edit', name: 'Edit Bookings', description: 'Edit booking details', category: 'Booking Management' },
    { id: 'bookings.delete', name: 'Delete Bookings', description: 'Delete bookings', category: 'Booking Management' },
    { id: 'bookings.assign', name: 'Assign Technicians', description: 'Assign technicians to bookings', category: 'Booking Management' },

    // Technician Management
    { id: 'technicians.view', name: 'View Technicians', description: 'View technician list and details', category: 'Technician Management' },
    { id: 'technicians.create', name: 'Create Technicians', description: 'Create new technician accounts', category: 'Technician Management' },
    { id: 'technicians.edit', name: 'Edit Technicians', description: 'Edit technician information', category: 'Technician Management' },
    { id: 'technicians.delete', name: 'Delete Technicians', description: 'Delete technician accounts', category: 'Technician Management' },
    { id: 'technicians.verify', name: 'Verify Technicians', description: 'Verify technician credentials', category: 'Technician Management' },

    // Financial Management
    { id: 'financial.view', name: 'View Financial Data', description: 'View financial reports and analytics', category: 'Financial Management' },
    { id: 'financial.edit', name: 'Edit Financial Data', description: 'Edit financial information', category: 'Financial Management' },
    { id: 'payments.view', name: 'View Payments', description: 'View payment information', category: 'Financial Management' },
    { id: 'payments.process', name: 'Process Payments', description: 'Process payment transactions', category: 'Financial Management' },

    // System Administration
    { id: 'system.settings', name: 'System Settings', description: 'Access system configuration', category: 'System Administration' },
    { id: 'system.roles', name: 'Manage Roles', description: 'Create and manage user roles', category: 'System Administration' },
    { id: 'system.permissions', name: 'Manage Permissions', description: 'Manage system permissions', category: 'System Administration' },
    { id: 'system.logs', name: 'View System Logs', description: 'View system activity logs', category: 'System Administration' },

    // Support Management
    { id: 'support.view', name: 'View Support Tickets', description: 'View customer support tickets', category: 'Support Management' },
    { id: 'support.respond', name: 'Respond to Support', description: 'Respond to support tickets', category: 'Support Management' },
    { id: 'support.close', name: 'Close Support Tickets', description: 'Close support tickets', category: 'Support Management' },

    // Reports and Analytics
    { id: 'reports.view', name: 'View Reports', description: 'View system reports', category: 'Reports & Analytics' },
    { id: 'reports.export', name: 'Export Reports', description: 'Export report data', category: 'Reports & Analytics' },
    { id: 'analytics.view', name: 'View Analytics', description: 'View system analytics', category: 'Reports & Analytics' },
  ];

  useEffect(() => {
    setPermissions(systemPermissions);
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      // For now, we'll create some default roles since we don't have a roles table yet
      const defaultRoles: Role[] = [
        {
          id: 'admin',
          name: 'Administrator',
          description: 'Full system access with all permissions',
          permissions: systemPermissions.map(p => p.id),
          is_system: true,
          user_count: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 'manager',
          name: 'Manager',
          description: 'Management access with limited administrative permissions',
          permissions: [
            'users.view', 'users.edit', 'users.activate',
            'bookings.view', 'bookings.edit', 'bookings.assign',
            'technicians.view', 'technicians.edit', 'technicians.verify',
            'financial.view', 'payments.view',
            'support.view', 'support.respond', 'support.close',
            'reports.view', 'analytics.view'
          ],
          is_system: false,
          user_count: 0,
          created_at: new Date().toISOString()
        },
        {
          id: 'supervisor',
          name: 'Supervisor',
          description: 'Supervisory access for managing technicians and bookings',
          permissions: [
            'users.view',
            'bookings.view', 'bookings.edit', 'bookings.assign',
            'technicians.view', 'technicians.edit',
            'support.view', 'support.respond',
            'reports.view'
          ],
          is_system: false,
          user_count: 0,
          created_at: new Date().toISOString()
        },
        {
          id: 'technician',
          name: 'Technician',
          description: 'Technician access for managing assigned jobs',
          permissions: [
            'bookings.view',
            'technicians.view'
          ],
          is_system: true,
          user_count: 0,
          created_at: new Date().toISOString()
        },
        {
          id: 'client',
          name: 'Client',
          description: 'Client access for managing bookings and services',
          permissions: [
            'bookings.view', 'bookings.create',
            'support.view'
          ],
          is_system: true,
          user_count: 0,
          created_at: new Date().toISOString()
        }
      ];

      setRoles(defaultRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData: Partial<Role>) => {
    try {
      const newRole: Role = {
        id: roleData.name?.toLowerCase().replace(/\s+/g, '_') || '',
        name: roleData.name || '',
        description: roleData.description || '',
        permissions: roleData.permissions || [],
        is_system: false,
        user_count: 0,
        created_at: new Date().toISOString()
      };

      setRoles([...roles, newRole]);
      setIsCreateModalOpen(false);
      
      toast({
        title: "Success",
        description: "Role created successfully",
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
    }
  };

  const handleEditRole = async (updatedRole: Role) => {
    try {
      setRoles(roles.map(role => 
        role.id === updatedRole.id ? updatedRole : role
      ));
      setIsEditModalOpen(false);
      
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      setRoles(roles.filter(role => role.id !== roleId));
      
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const getPermissionCategory = (category: string) => {
    const categoryPermissions = permissions.filter(p => p.category === category);
    return categoryPermissions;
  };

  const getRoleColor = (role: Role) => {
    if (role.is_system) {
      return 'bg-blue-100 text-blue-700';
    }
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage user roles and system permissions</p>
        </div>
        <Button variant="accent" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="p-6 hover:shadow-medium transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <Badge className={`text-xs ${getRoleColor(role)}`}>
                    {role.is_system ? 'System' : 'Custom'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedRole(role);
                    setIsViewModalOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {!role.is_system && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRole(role);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Permissions</span>
                <Badge variant="outline">{role.permissions.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Users</span>
                <Badge variant="outline">{role.user_count}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(role.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Role Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions
            </DialogDescription>
          </DialogHeader>

          <CreateEditRoleForm
            onSubmit={handleCreateRole}
            onCancel={() => setIsCreateModalOpen(false)}
            permissions={permissions}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and permissions
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <CreateEditRoleForm
              role={selectedRole}
              onSubmit={handleEditRole}
              onCancel={() => setIsEditModalOpen(false)}
              permissions={permissions}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Role Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              View role information and permissions
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedRole.name}</h3>
                  <p className="text-muted-foreground">{selectedRole.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getRoleColor(selectedRole)}>
                      {selectedRole.is_system ? 'System Role' : 'Custom Role'}
                    </Badge>
                    <Badge variant="outline">{selectedRole.permissions.length} permissions</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Permissions</h4>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {Object.entries(
                      permissions
                        .filter(p => selectedRole.permissions.includes(p.id))
                        .reduce((acc, permission) => {
                          if (!acc[permission.category]) {
                            acc[permission.category] = [];
                          }
                          acc[permission.category].push(permission);
                          return acc;
                        }, {} as Record<string, Permission[]>)
                    ).map(([category, categoryPermissions]) => (
                      <div key={category}>
                        <h5 className="font-medium text-sm text-muted-foreground mb-2">{category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                              <ShieldCheck className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="text-sm font-medium">{permission.name}</p>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedRole && !selectedRole.is_system && (
              <Button onClick={() => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(true);
              }}>
                Edit Role
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Create/Edit Role Form Component
interface CreateEditRoleFormProps {
  role?: Role;
  onSubmit: (role: Partial<Role>) => void;
  onCancel: () => void;
  permissions: Permission[];
}

const CreateEditRoleForm = ({ role, onSubmit, onCancel, permissions }: CreateEditRoleFormProps) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || []
  });

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  const getPermissionCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const categories = [...new Set(permissions.map(p => p.category))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Role Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter role name"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter role description"
          />
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Permissions</Label>
        <ScrollArea className="h-64 border rounded-lg p-4">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category}>
                <h5 className="font-medium text-sm text-muted-foreground mb-2">{category}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getPermissionCategory(category).map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                          {permission.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default RolesPermissions;
