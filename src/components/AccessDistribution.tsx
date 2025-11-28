import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus, Search, Edit, UserPlus, Settings } from 'lucide-react'

interface UserPermission {
  id: string
  username: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  department: string
  status: 'active' | 'inactive'
  permissions: {
    dashboard: boolean
    purchaseOrders: boolean
    salesOrders: boolean
    inventory: boolean
    reports: boolean
    settings: boolean
  }
  lastLogin: string
}

const mockUserPermissions: UserPermission[] = [
  {
    id: '1',
    username: 'admin',
    name: 'System Administrator',
    email: 'admin@company.com',
    role: 'admin',
    department: 'IT',
    status: 'active',
    permissions: {
      dashboard: true,
      purchaseOrders: true,
      salesOrders: true,
      inventory: true,
      reports: true,
      settings: true
    },
    lastLogin: '2024-01-15 09:30:00'
  },
  {
    id: '2',
    username: 'john.doe',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'manager',
    department: 'Procurement',
    status: 'active',
    permissions: {
      dashboard: true,
      purchaseOrders: true,
      salesOrders: false,
      inventory: true,
      reports: true,
      settings: false
    },
    lastLogin: '2024-01-15 08:45:00'
  },
  {
    id: '3',
    username: 'jane.smith',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'manager',
    department: 'Sales',
    status: 'active',
    permissions: {
      dashboard: true,
      purchaseOrders: false,
      salesOrders: true,
      inventory: true,
      reports: true,
      settings: false
    },
    lastLogin: '2024-01-15 10:15:00'
  },
  {
    id: '4',
    username: 'mike.wilson',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'user',
    department: 'Inventory',
    status: 'active',
    permissions: {
      dashboard: true,
      purchaseOrders: false,
      salesOrders: false,
      inventory: true,
      reports: false,
      settings: false
    },
    lastLogin: '2024-01-14 16:20:00'
  },
  {
    id: '5',
    username: 'sarah.johnson',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'user',
    department: 'Finance',
    status: 'inactive',
    permissions: {
      dashboard: true,
      purchaseOrders: true,
      salesOrders: true,
      inventory: false,
      reports: true,
      settings: false
    },
    lastLogin: '2024-01-10 14:30:00'
  }
]

export function AccessDistribution() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserPermission | null>(null)
  const [users, setUsers] = useState<UserPermission[]>(mockUserPermissions)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const updateUserPermission = (userId: string, permission: keyof UserPermission['permissions'], value: boolean) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, permissions: { ...user.permissions, [permission]: value } }
        : user
    ))
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-2">Access Distribution</h2>
          <p className="text-muted-foreground">Manage user permissions and access controls</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and set their permissions
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input placeholder="Enter username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input type="password" placeholder="Enter temporary password" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {users.filter(u => u.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Administrators</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive Users</CardDescription>
            <CardTitle className="text-2xl text-gray-600">
              {users.filter(u => u.status === 'inactive').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dashboard</TableHead>
                  <TableHead>Purchase Orders</TableHead>
                  <TableHead>Sales Orders</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead>Settings</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.permissions.dashboard}
                        onCheckedChange={(checked) => updateUserPermission(user.id, 'dashboard', checked)}
                        disabled={user.status === 'inactive'}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.permissions.purchaseOrders}
                        onCheckedChange={(checked) => updateUserPermission(user.id, 'purchaseOrders', checked)}
                        disabled={user.status === 'inactive'}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.permissions.salesOrders}
                        onCheckedChange={(checked) => updateUserPermission(user.id, 'salesOrders', checked)}
                        disabled={user.status === 'inactive'}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.permissions.inventory}
                        onCheckedChange={(checked) => updateUserPermission(user.id, 'inventory', checked)}
                        disabled={user.status === 'inactive'}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.permissions.reports}
                        onCheckedChange={(checked) => updateUserPermission(user.id, 'reports', checked)}
                        disabled={user.status === 'inactive'}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.permissions.settings}
                        onCheckedChange={(checked) => updateUserPermission(user.id, 'settings', checked)}
                        disabled={user.status === 'inactive' || user.role !== 'admin'}
                      />
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(user.lastLogin).toLocaleDateString()}<br />
                      {new Date(user.lastLogin).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}