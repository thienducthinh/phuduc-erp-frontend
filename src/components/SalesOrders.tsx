import { useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus, Search, Eye, Edit, Download } from 'lucide-react'

interface SalesOrder {
  id: string
  customer: string
  orderDate: string
  deliveryDate: string
  status: 'Draft' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  type: 'wholesale' | 'retail'
  total: number
  items: number
}

const mockSalesOrders: SalesOrder[] = [
  {
    id: 'SO-001',
    customer: 'RetailCorp Inc',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    status: 'Shipped',
    type: 'wholesale',
    total: 34500,
    items: 15
  },
  {
    id: 'SO-002',
    customer: 'John Smith',
    orderDate: '2024-01-14',
    deliveryDate: '2024-01-18',
    status: 'Delivered',
    type: 'retail',
    total: 890,
    items: 3
  },
  {
    id: 'SO-003',
    customer: 'Wholesale Hub LLC',
    orderDate: '2024-01-13',
    deliveryDate: '2024-01-22',
    status: 'Confirmed',
    type: 'wholesale',
    total: 67200,
    items: 28
  },
  {
    id: 'SO-004',
    customer: 'Sarah Johnson',
    orderDate: '2024-01-12',
    deliveryDate: '2024-01-16',
    status: 'Draft',
    type: 'retail',
    total: 450,
    items: 2
  },
  {
    id: 'SO-005',
    customer: 'MegaStore Chain',
    orderDate: '2024-01-11',
    deliveryDate: '2024-01-25',
    status: 'Confirmed',
    type: 'wholesale',
    total: 125000,
    items: 45
  },
  {
    id: 'SO-006',
    customer: 'Mike Davis',
    orderDate: '2024-01-10',
    deliveryDate: '2024-01-15',
    status: 'Shipped',
    type: 'retail',
    total: 1250,
    items: 5
  }
]

interface SalesOrdersProps {
  onOpenDetail: (orderId: string) => void
}

export function SalesOrders({ onOpenDetail }: SalesOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders)
  const [newOrder, setNewOrder] = useState({
    customer: '',
    type: '',
    deliveryDate: '',
    priority: ''
  })

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter
    const matchesTab = activeTab === 'all' || order.type === activeTab
    return matchesSearch && matchesStatus && matchesTab
  })

  const handleCreateOrder = () => {
    if (!newOrder.customer || !newOrder.type || !newOrder.deliveryDate) return

    const newSO: SalesOrder = {
      id: `SO-${String(salesOrders.length + 1).padStart(3, '0')}`,
      customer: newOrder.customer,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: newOrder.deliveryDate,
      status: 'Draft',
      type: newOrder.type as 'wholesale' | 'retail',
      total: Math.floor(Math.random() * 100000) + 1000,
      items: Math.floor(Math.random() * 30) + 1
    }

    setSalesOrders([...salesOrders, newSO])
    setNewOrder({ customer: '', type: '', deliveryDate: '', priority: '' })
    setIsCreateDialogOpen(false)
  }

  const handleStatusChange = (orderId: string, newStatus: SalesOrder['status']) => {
    setSalesOrders(salesOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Confirmed': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-yellow-100 text-yellow-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'wholesale' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-2">Sales Orders</h2>
          <p className="text-muted-foreground">Manage wholesale and retail sales orders</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Sales Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Sales Order</DialogTitle>
              <DialogDescription>
                Create a new sales order for your customer
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Input 
                  placeholder="Customer name"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Order Type</Label>
                <Select value={newOrder.type} onValueChange={(value) => setNewOrder({...newOrder, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <Input 
                  type="date"
                  value={newOrder.deliveryDate}
                  onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({...newOrder, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrder} disabled={!newOrder.customer || !newOrder.type || !newOrder.deliveryDate}>
                Create Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer or SO number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="wholesale">Wholesale</TabsTrigger>
              <TabsTrigger value="retail">Retail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SO Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(order.type)}>
                          {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="wholesale" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SO Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.filter(order => order.type === 'wholesale').map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="retail" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SO Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.filter(order => order.type === 'retail').map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}