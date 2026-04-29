import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog'
import { ChevronRight, Truck } from 'lucide-react'

interface RouteAndDate {
  id: string
  routeCode: string
  routeName: string
  date: string
  totalCustomers: number
  totalOrders: number
  totalAmount: number
  status: 'pending' | 'in-progress' | 'completed'
}

interface Customer {
  id: string
  name: string
  address: string
  phone: string
  totalAmount: number
  itemsCount: number
}

interface OrderDetail {
  orderId: string
  customerName: string
  date: string
  route: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

interface OrderItem {
  id: string
  itemCode: string
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

// Mock data for routes and dates
const mockRoutesAndDates: RouteAndDate[] = [
  {
    id: 'R001-2024-01-20',
    routeCode: 'R001',
    routeName: 'Downtown Route',
    date: '2024-01-20',
    totalCustomers: 5,
    totalOrders: 5,
    totalAmount: 12500,
    status: 'completed'
  },
  {
    id: 'R002-2024-01-20',
    routeCode: 'R002',
    routeName: 'Suburban Route',
    date: '2024-01-20',
    totalCustomers: 8,
    totalOrders: 8,
    totalAmount: 28900,
    status: 'completed'
  },
  {
    id: 'R001-2024-01-21',
    routeCode: 'R001',
    routeName: 'Downtown Route',
    date: '2024-01-21',
    totalCustomers: 6,
    totalOrders: 6,
    totalAmount: 15200,
    status: 'in-progress'
  },
  {
    id: 'R003-2024-01-21',
    routeCode: 'R003',
    routeName: 'Industrial Route',
    date: '2024-01-21',
    totalCustomers: 4,
    totalOrders: 4,
    totalAmount: 45800,
    status: 'pending'
  },
  {
    id: 'R002-2024-01-21',
    routeCode: 'R002',
    routeName: 'Suburban Route',
    date: '2024-01-21',
    totalCustomers: 7,
    totalOrders: 7,
    totalAmount: 22100,
    status: 'in-progress'
  }
]

// Mock function to get customers for a specific route and date
const getCustomersForRouteAndDate = (routeCode: string, date: string): Customer[] => {
  const customersByRoute: { [key: string]: Customer[] } = {
    'R001': [
      { id: 'C001', name: 'ABC Corporation', address: '456 Business Blvd', phone: '555-0101', totalAmount: 2500, itemsCount: 3 },
      { id: 'C002', name: 'XYZ Enterprises', address: '789 Commerce St', phone: '555-0102', totalAmount: 3200, itemsCount: 5 },
      { id: 'C003', name: 'Tech Solutions Ltd', address: '123 Innovation Ave', phone: '555-0103', totalAmount: 2800, itemsCount: 4 },
      { id: 'C004', name: 'Global Traders', address: '321 Trade Way', phone: '555-0104', totalAmount: 2000, itemsCount: 2 },
      { id: 'C005', name: 'Premier Supplies', address: '654 Supply Rd', phone: '555-0105', totalAmount: 1500, itemsCount: 2 },
      { id: 'C006', name: 'Elite Distribution', address: '987 Dist Lane', phone: '555-0106', totalAmount: 2200, itemsCount: 3 }
    ],
    'R002': [
      { id: 'C007', name: 'Metro Retail Co', address: '111 Market St', phone: '555-0201', totalAmount: 4500, itemsCount: 6 },
      { id: 'C008', name: 'Urban Goods Ltd', address: '222 Plaza Ave', phone: '555-0202', totalAmount: 3800, itemsCount: 5 },
      { id: 'C009', name: 'Suburban Shop', address: '333 Mall Rd', phone: '555-0203', totalAmount: 2900, itemsCount: 4 },
      { id: 'C010', name: 'Corner Store Inc', address: '444 Street Ln', phone: '555-0204', totalAmount: 2100, itemsCount: 3 },
      { id: 'C011', name: 'Local Market', address: '555 Town Center', phone: '555-0205', totalAmount: 3200, itemsCount: 4 },
      { id: 'C012', name: 'Community Trade', address: '666 Community Way', phone: '555-0206', totalAmount: 2800, itemsCount: 3 },
      { id: 'C013', name: 'Neighborhood Store', address: '777 Neighbor St', phone: '555-0207', totalAmount: 2400, itemsCount: 3 },
      { id: 'C014', name: 'Small Business Plus', address: '888 Business Ln', phone: '555-0208', totalAmount: 3200, itemsCount: 4 }
    ],
    'R003': [
      { id: 'C015', name: 'Heavy Industry Co', address: '1000 Factory Blvd', phone: '555-0301', totalAmount: 15200, itemsCount: 8 },
      { id: 'C016', name: 'Manufacturing Corp', address: '2000 Plant Ave', phone: '555-0302', totalAmount: 18500, itemsCount: 10 },
      { id: 'C017', name: 'Industrial Supply', address: '3000 Industry Dr', phone: '555-0303', totalAmount: 8200, itemsCount: 5 },
      { id: 'C018', name: 'Production House', address: '4000 Production Rd', phone: '555-0304', totalAmount: 3900, itemsCount: 3 }
    ]
  }
  return customersByRoute[routeCode] || []
}

// Mock function to get order details for a customer on a specific date
const getOrderDetailForCustomer = (customerId: string, routeCode: string, date: string): OrderDetail => {
  const mockOrders: { [key: string]: OrderDetail } = {
    'C001': {
      orderId: 'SO-C001-20240120',
      customerName: 'ABC Corporation',
      date: '2024-01-20',
      route: 'R001',
      items: [
        { id: '1', itemCode: 'PROD001', description: 'Industrial Equipment A', quantity: 10, unitPrice: 150, lineTotal: 1500 },
        { id: '2', itemCode: 'PROD002', description: 'Industrial Equipment B', quantity: 5, unitPrice: 200, lineTotal: 1000 }
      ],
      subtotal: 2500,
      tax: 250,
      shipping: 75,
      total: 2825
    }
  }
  return mockOrders[customerId] || {
    orderId: `SO-${customerId}-${date.replace(/-/g, '')}`,
    customerName: 'Customer Name',
    date,
    route: routeCode,
    items: [
      { id: '1', itemCode: 'SAMPLE001', description: 'Sample Product', quantity: 1, unitPrice: 100, lineTotal: 100 }
    ],
    subtotal: 100,
    tax: 10,
    shipping: 0,
    total: 110
  }
}

export function SalesOrderbyRoute() {
  const [routesAndDates] = useState<RouteAndDate[]>(mockRoutesAndDates)
  const [selectedRouteAndDate, setSelectedRouteAndDate] = useState<RouteAndDate | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRoutesAndDates = routesAndDates.filter(route => {
    const matchesSearch = route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.routeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleRouteAndDateClick = (route: RouteAndDate) => {
    setSelectedRouteAndDate(route)
    setSelectedCustomer(null)
    setOrderDetail(null)
  }

  const handleCustomerClick = (customer: Customer) => {
    if (!selectedRouteAndDate) return
    setSelectedCustomer(customer)
    const detail = getOrderDetailForCustomer(customer.id, selectedRouteAndDate.routeCode, selectedRouteAndDate.date)
    setOrderDetail(detail)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const customers = selectedRouteAndDate ? getCustomersForRouteAndDate(selectedRouteAndDate.routeCode, selectedRouteAndDate.date) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-2">Sales Orders by Route</h2>
          <p className="text-muted-foreground">View and manage orders by delivery route and date</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2">Search Route</Label>
              <Input
                id="search"
                placeholder="Search by route code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Routes and Dates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Routes & Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Code</TableHead>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutesAndDates.map((route) => (
                  <TableRow key={route.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{route.routeCode}</TableCell>
                    <TableCell>{route.routeName}</TableCell>
                    <TableCell>{new Date(route.date).toLocaleDateString()}</TableCell>
                    <TableCell>{route.totalCustomers}</TableCell>
                    <TableCell>{route.totalOrders}</TableCell>
                    <TableCell>${route.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(route.status)}>
                        {route.status.charAt(0).toUpperCase() + route.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRouteAndDateClick(route)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customers Modal Dialog */}
      <Dialog open={!!selectedRouteAndDate} onOpenChange={(open) => {
        if (!open) {
          setSelectedRouteAndDate(null)
          setSelectedCustomer(null)
          setOrderDetail(null)
        }
      }}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                {selectedRouteAndDate?.routeName} - {selectedRouteAndDate?.date ? new Date(selectedRouteAndDate.date).toLocaleDateString() : ''}
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedRouteAndDate?.totalCustomers} customers on this route
            </DialogDescription>
          </DialogHeader>

          {!orderDetail ? (
            // Customers List (Horizontal)
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <h3 className="font-semibold text-sm mb-2">{customer.name}</h3>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><span className="font-medium">Address:</span> {customer.address}</p>
                      <p><span className="font-medium">Phone:</span> {customer.phone}</p>
                      <div className="flex justify-between mt-3 pt-3 border-t">
                        <span>Amount: ${customer.totalAmount.toLocaleString()}</span>
                        <span>Items: {customer.itemsCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Order Detail View
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{orderDetail.customerName}</h3>
                  <p className="text-sm text-gray-600">Order ID: {orderDetail.orderId}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(orderDetail.date).toLocaleDateString()}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOrderDetail(null)}
                >
                  ← Back to Customers
                </Button>
              </div>

              {/* Order Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetail.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>${item.lineTotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Order Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${orderDetail.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${orderDetail.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${orderDetail.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total:</span>
                    <span>${orderDetail.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
