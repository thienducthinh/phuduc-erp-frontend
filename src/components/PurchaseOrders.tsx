import { useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Plus, Search, Eye, Edit, Download } from 'lucide-react'

interface PurchaseOrder {
  id: string
  vendor: string
  orderDate: string
  expectedDate: string
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled'
  total: number
  items: number
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    vendor: 'Tech Supplies Inc',
    orderDate: '2024-01-15',
    expectedDate: '2024-01-25',
    status: 'Pending',
    total: 15400,
    items: 12
  },
  {
    id: 'PO-002',
    vendor: 'Global Electronics',
    orderDate: '2024-01-12',
    expectedDate: '2024-01-22',
    status: 'Approved',
    total: 22100,
    items: 8
  },
  {
    id: 'PO-003',
    vendor: 'Office Depot Pro',
    orderDate: '2024-01-10',
    expectedDate: '2024-01-20',
    status: 'Received',
    total: 8750,
    items: 25
  },
  {
    id: 'PO-004',
    vendor: 'Industrial Parts Co',
    orderDate: '2024-01-08',
    expectedDate: '2024-01-18',
    status: 'Draft',
    total: 31200,
    items: 6
  },
]

interface PurchaseOrdersProps {
  onOpenDetail: (orderId: string) => void
}

export function PurchaseOrders({ onOpenDetail }: PurchaseOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [newOrder, setNewOrder] = useState({
    vendor: '',
    expectedDate: '',
    notes: ''
  })

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateOrder = () => {
    if (!newOrder.vendor || !newOrder.expectedDate) return

    const newPO: PurchaseOrder = {
      id: `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      vendor: newOrder.vendor,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: newOrder.expectedDate,
      status: 'Draft',
      total: Math.floor(Math.random() * 50000) + 5000,
      items: Math.floor(Math.random() * 20) + 1
    }

    setPurchaseOrders([...purchaseOrders, newPO])
    setNewOrder({ vendor: '', expectedDate: '', notes: '' })
    setIsCreateDialogOpen(false)
  }

  const handleStatusChange = (orderId: string, newStatus: PurchaseOrder['status']) => {
    setPurchaseOrders(purchaseOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Approved': return 'bg-blue-100 text-blue-800'
      case 'Received': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-2">Purchase Orders</h2>
          <p className="text-muted-foreground">Manage your purchase orders and vendor relationships</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Create a new purchase order for your vendor
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select value={newOrder.vendor} onValueChange={(value) => setNewOrder({...newOrder, vendor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tech Supplies Inc">Tech Supplies Inc</SelectItem>
                    <SelectItem value="Global Electronics">Global Electronics</SelectItem>
                    <SelectItem value="Office Depot Pro">Office Depot Pro</SelectItem>
                    <SelectItem value="Industrial Parts Co">Industrial Parts Co</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected-date">Expected Delivery</Label>
                <Input 
                  type="date" 
                  value={newOrder.expectedDate}
                  onChange={(e) => setNewOrder({...newOrder, expectedDate: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  placeholder="Additional notes for this purchase order..."
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrder} disabled={!newOrder.vendor || !newOrder.expectedDate}>
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
                  placeholder="Search by vendor or PO number..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
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
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.expectedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="View Details"
                        onClick={() => onOpenDetail(order.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Change Status"
                        onClick={() => {
                          const nextStatus = 
                            order.status === 'Draft' ? 'Pending' :
                            order.status === 'Pending' ? 'Approved' :
                            order.status === 'Approved' ? 'Received' : 'Received'
                          handleStatusChange(order.id, nextStatus)
                        }}
                        disabled={order.status === 'Received' || order.status === 'Cancelled'}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Download">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}