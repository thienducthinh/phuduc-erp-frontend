import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Plus, Search, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react'

interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  onHand: number
  reserved: number
  available: number
  reorderPoint: number
  unitCost: number
  location: string
  lastUpdated: string
}

interface InventoryTransaction {
  id: string
  sku: string
  productName: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  reference: string
  date: string
  user: string
}

interface AdjustmentOrder {
  id: string
  date: string
  reason: string
  status: 'Draft' | 'Pending' | 'Approved' | 'Completed'
  items: number
  totalAdjustment: number
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    sku: 'LAPTOP001',
    name: 'Business Laptop Pro',
    category: 'Electronics',
    onHand: 45,
    reserved: 8,
    available: 37,
    reorderPoint: 20,
    unitCost: 1200,
    location: 'A1-B2',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    sku: 'MOUSE002',
    name: 'Wireless Mouse',
    category: 'Accessories',
    onHand: 15,
    reserved: 3,
    available: 12,
    reorderPoint: 25,
    unitCost: 35,
    location: 'C3-D1',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    sku: 'DESK003',
    name: 'Standing Desk',
    category: 'Furniture',
    onHand: 8,
    reserved: 2,
    available: 6,
    reorderPoint: 5,
    unitCost: 450,
    location: 'F1-A3',
    lastUpdated: '2024-01-13'
  },
  {
    id: '4',
    sku: 'PHONE004',
    name: 'Business Phone',
    category: 'Electronics',
    onHand: 0,
    reserved: 0,
    available: 0,
    reorderPoint: 10,
    unitCost: 299,
    location: 'B2-C4',
    lastUpdated: '2024-01-12'
  },
  {
    id: '5',
    sku: 'MONITOR005',
    name: '27" 4K Monitor',
    category: 'Electronics',
    onHand: 22,
    reserved: 5,
    available: 17,
    reorderPoint: 15,
    unitCost: 350,
    location: 'A2-C1',
    lastUpdated: '2024-01-14'
  },
  {
    id: '6',
    sku: 'CHAIR006',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    onHand: 12,
    reserved: 1,
    available: 11,
    reorderPoint: 8,
    unitCost: 280,
    location: 'F2-A1',
    lastUpdated: '2024-01-13'
  },
  {
    id: '7',
    sku: 'CABLE007',
    name: 'USB-C Cable 2m',
    category: 'Accessories',
    onHand: 85,
    reserved: 15,
    available: 70,
    reorderPoint: 50,
    unitCost: 15,
    location: 'C1-D3',
    lastUpdated: '2024-01-15'
  }
]

const mockTransactions: InventoryTransaction[] = [
  {
    id: 'TXN001',
    sku: 'LAPTOP001',
    productName: 'Business Laptop Pro',
    type: 'in',
    quantity: 20,
    reason: 'Purchase Order',
    reference: 'PO-001',
    date: '2024-01-15',
    user: 'John Doe'
  },
  {
    id: 'TXN002',
    sku: 'MOUSE002',
    productName: 'Wireless Mouse',
    type: 'out',
    quantity: -5,
    reason: 'Sales Order',
    reference: 'SO-045',
    date: '2024-01-14',
    user: 'Jane Smith'
  },
  {
    id: 'TXN003',
    sku: 'DESK003',
    productName: 'Standing Desk',
    type: 'adjustment',
    quantity: -2,
    reason: 'Damaged Items',
    reference: 'ADJ-001',
    date: '2024-01-13',
    user: 'Mike Johnson'
  }
]

const mockAdjustments: AdjustmentOrder[] = [
  {
    id: 'ADJ-001',
    date: '2024-01-13',
    reason: 'Damaged Items Write-off',
    status: 'Completed',
    items: 3,
    totalAdjustment: -2
  },
  {
    id: 'ADJ-002',
    date: '2024-01-10',
    reason: 'Cycle Count Adjustment',
    status: 'Pending',
    items: 15,
    totalAdjustment: 8
  }
]

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [inventoryItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [transactions] = useState<InventoryTransaction[]>(mockTransactions)
  const [adjustments] = useState<AdjustmentOrder[]>(mockAdjustments)

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.available === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (item.available <= item.reorderPoint) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'in': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'out': return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'adjustment': return <Package className="w-4 h-4 text-blue-600" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const lowStockItems = inventoryItems.filter(item => item.available <= item.reorderPoint && item.available > 0)
  const outOfStockItems = inventoryItems.filter(item => item.available === 0)
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.onHand * item.unitCost), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-2">Inventory Management</h2>
          <p className="text-muted-foreground">Track stock levels, transactions, and adjustments</p>
        </div>
        <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Inventory Adjustment</DialogTitle>
              <DialogDescription>
                Adjust inventory quantities for cycle counts, damages, or corrections
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Adjustment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cycle-count">Cycle Count</SelectItem>
                    <SelectItem value="damaged">Damaged Items</SelectItem>
                    <SelectItem value="theft">Theft/Loss</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea placeholder="Additional details about this adjustment..." />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAdjustmentDialogOpen(false)}>
                Create Adjustment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Items</CardDescription>
            <CardTitle className="text-2xl">{inventoryItems.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock Alerts</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{lowStockItems.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Out of Stock</CardDescription>
            <CardTitle className="text-2xl text-red-600">{outOfStockItems.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">${totalValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="on-hand" className="w-full">
            <div className="p-6 pb-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="on-hand">Inventory on Hand</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="on-hand" className="p-6 pt-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>On Hand</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Unit Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.onHand}</TableCell>
                        <TableCell>{item.reserved}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.available <= item.reorderPoint && item.available > 0 && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                            {item.available === 0 && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            {item.available}
                          </div>
                        </TableCell>
                        <TableCell>{item.reorderPoint}</TableCell>
                        <TableCell>
                          <Badge className={stockStatus.color}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>${item.unitCost}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="transactions" className="p-6 pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.sku}</TableCell>
                      <TableCell>{transaction.productName}</TableCell>
                      <TableCell className={transaction.quantity < 0 ? 'text-red-600' : 'text-green-600'}>
                        {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                      </TableCell>
                      <TableCell>{transaction.reason}</TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="adjustments" className="p-6 pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adjustment ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items Affected</TableHead>
                    <TableHead>Total Adjustment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-medium">{adjustment.id}</TableCell>
                      <TableCell>{new Date(adjustment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{adjustment.reason}</TableCell>
                      <TableCell>
                        <Badge className={
                          adjustment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          adjustment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {adjustment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{adjustment.items}</TableCell>
                      <TableCell className={adjustment.totalAdjustment < 0 ? 'text-red-600' : 'text-green-600'}>
                        {adjustment.totalAdjustment > 0 ? '+' : ''}{adjustment.totalAdjustment}
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