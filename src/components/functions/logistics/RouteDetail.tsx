import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'
import { Textarea } from '../../ui/textarea'
import { Separator } from '../../ui/separator'
import { Checkbox } from '../../ui/checkbox'
import { Plus, Trash2, Download, Send, ArrowLeft, RefreshCw, Binoculars } from 'lucide-react'

const TextFilterOperators = () => (
  <SelectContent>
    <SelectItem value="equals">Equals</SelectItem>
    <SelectItem value="notEquals">Does Not Equal</SelectItem>
    <SelectItem value="contains">Contains</SelectItem>
    <SelectItem value="startsWith">Starts With</SelectItem>
    <SelectItem value="endsWith">Ends With</SelectItem>
  </SelectContent>
)

const NumericFilterOperators = () => (
  <SelectContent>
    <SelectItem value="equals">Equals</SelectItem>
    <SelectItem value="notEquals">Does Not Equal</SelectItem>
    <SelectItem value="greaterThan">Greater Than</SelectItem>
    <SelectItem value="greaterThanOrEqual">Greater Than or Equal</SelectItem>
    <SelectItem value="lessThan">Less Than</SelectItem>
    <SelectItem value="lessThanOrEqual">Less Than or Equal</SelectItem>
  </SelectContent>
)

interface RouteCustomer {
  id: string
  customerId: string
  customerName: string
  address: string
  city: string
  orderCount: number
  totalItems: number
  status: 'pending' | 'in-transit' | 'delivered'
}

interface RouteHeader {
  id: string
  routeCode: string
  origin: string
  destination: string
  distance: number
  estimatedTime: string
  status: 'Active' | 'Inactive' | 'Paused' | 'Archived'
  driver: string
  vehicle: string
  startDate: string
  endDate: string
  notes: string
  totalDistance: number
  totalTime: string
}

const mockRouteHeaders: Record<string, RouteHeader> = {
  'RT-001': {
    id: 'RT-001',
    routeCode: 'RT001',
    origin: 'New York',
    destination: 'Boston',
    distance: 215,
    estimatedTime: '4h 30m',
    status: 'Active',
    driver: 'John Smith',
    vehicle: 'Truck-001',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    notes: 'Morning route with high priority deliveries',
    totalDistance: 215,
    totalTime: '4h 30m'
  },
  'RT-002': {
    id: 'RT-002',
    routeCode: 'RT002',
    origin: 'Los Angeles',
    destination: 'San Francisco',
    distance: 380,
    estimatedTime: '6h 15m',
    status: 'Active',
    driver: 'Maria Garcia',
    vehicle: 'Truck-002',
    startDate: '2024-01-14',
    endDate: '2024-01-14',
    notes: 'West coast route',
    totalDistance: 380,
    totalTime: '6h 15m'
  },
  'RT-003': {
    id: 'RT-003',
    routeCode: 'RT003',
    origin: 'Chicago',
    destination: 'Detroit',
    distance: 280,
    estimatedTime: '5h 00m',
    status: 'Paused',
    driver: 'Michael Johnson',
    vehicle: 'Truck-003',
    startDate: '2024-01-13',
    endDate: '2024-01-13',
    notes: 'Midwest route - currently paused',
    totalDistance: 280,
    totalTime: '5h 00m'
  },
  'RT-004': {
    id: 'RT-004',
    routeCode: 'RT004',
    origin: 'Houston',
    destination: 'Dallas',
    distance: 240,
    estimatedTime: '4h 45m',
    status: 'Active',
    driver: 'Sarah Davis',
    vehicle: 'Truck-004',
    startDate: '2024-01-12',
    endDate: '2024-01-12',
    notes: 'South region route with multiple stops',
    totalDistance: 240,
    totalTime: '4h 45m'
  }
}

const mockRouteCustomers: RouteCustomer[] = [
  {
    id: '1',
    customerId: 'CUST-001',
    customerName: 'RetailCorp Inc',
    address: '123 Main St',
    city: 'New York',
    orderCount: 5,
    totalItems: 25,
    status: 'pending'
  },
  {
    id: '2',
    customerId: 'CUST-002',
    customerName: 'John Smith',
    address: '456 Oak Ave',
    city: 'New York',
    orderCount: 2,
    totalItems: 8,
    status: 'pending'
  },
  {
    id: '3',
    customerId: 'CUST-003',
    customerName: 'Wholesale Hub LLC',
    address: '789 Pine Rd',
    city: 'Boston',
    orderCount: 3,
    totalItems: 15,
    status: 'in-transit'
  },
  {
    id: '4',
    customerId: 'CUST-004',
    customerName: 'Sarah Johnson',
    address: '321 Elm St',
    city: 'Boston',
    orderCount: 1,
    totalItems: 4,
    status: 'pending'
  }
]

const getTodayDate = () => {
  const today = new Date().toISOString().split('T')[0]
  return today || ''
}

const emptyRouteHeader: RouteHeader = {
  id: '',
  routeCode: '',
  origin: '',
  destination: '',
  distance: 0,
  estimatedTime: '',
  status: 'Active',
  driver: '',
  vehicle: '',
  startDate: getTodayDate(),
  endDate: getTodayDate(),
  notes: '',
  totalDistance: 0,
  totalTime: ''
}

interface RouteDetailProps {
  routeId: string
}

export function RouteDetail({ routeId }: RouteDetailProps) {
  const [header, setHeader] = useState<RouteHeader>(
    routeId === 'new' ? emptyRouteHeader : (mockRouteHeaders[routeId] || emptyRouteHeader)
  )
  const [customers, setCustomers] = useState<RouteCustomer[]>(routeId === 'new' ? [] : mockRouteCustomers)
  const [isEditing, setIsEditing] = useState(routeId === 'new')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const [filters, setFilters] = useState({
    customerName: '',
    city: '',
    status: 'all'
  })
  const [filterOperators, setFilterOperators] = useState({
    customerName: 'contains',
    city: 'contains'
  })

  useEffect(() => {
    const newHeader = routeId === 'new' ? emptyRouteHeader : (mockRouteHeaders[routeId] || emptyRouteHeader)
    setHeader(newHeader)
    setCustomers(routeId === 'new' ? [] : mockRouteCustomers)
    setIsEditing(routeId === 'new')
  }, [routeId])

  const applyFilter = (value: any, filterValue: string, operator: string) => {
    if (!filterValue) return true
    const val = value.toString().toLowerCase()
    const filter = filterValue.toLowerCase()

    switch (operator) {
      case 'equals':
        return val === filter
      case 'notEquals':
        return val !== filter
      case 'contains':
        return val.includes(filter)
      case 'startsWith':
        return val.startsWith(filter)
      case 'endsWith':
        return val.endsWith(filter)
      default:
        return true
    }
  }

  const filteredCustomers = customers.filter(customer => {
    return (
      applyFilter(customer.customerName, filters.customerName, filterOperators.customerName) &&
      applyFilter(customer.city, filters.city, filterOperators.city) &&
      (filters.status === 'all' || customer.status === filters.status)
    )
  })

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const updateOperator = (key: string, operator: string) => {
    setFilterOperators(prev => ({ ...prev, [key]: operator }))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredCustomers.map(c => c.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (customerId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(customerId)
    } else {
      newSelected.delete(customerId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteSelected = () => {
    setCustomers(customers.filter(c => !selectedRows.has(c.id)))
    setSelectedRows(new Set())
  }

  const handleAddCustomer = () => {
    const newCustomer: RouteCustomer = {
      id: String(customers.length + 1),
      customerId: '',
      customerName: '',
      address: '',
      city: '',
      orderCount: 0,
      totalItems: 0,
      status: 'pending'
    }
    setCustomers([...customers, newCustomer])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-transit': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Paused': return 'bg-yellow-100 text-yellow-800'
      case 'Archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{header.routeCode}</h2>
          <p className="text-gray-600">{header.origin} → {header.destination}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Route Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Route Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="routeCode">Route Code</Label>
              <Input
                value={header.routeCode}
                onChange={(e) => setHeader({...header, routeCode: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={header.status} onValueChange={(value) => setHeader({...header, status: value as any})} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                value={header.origin}
                onChange={(e) => setHeader({...header, origin: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                value={header.destination}
                onChange={(e) => setHeader({...header, destination: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                type="number"
                value={header.distance}
                onChange={(e) => setHeader({...header, distance: parseInt(e.target.value) || 0})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                value={header.estimatedTime}
                onChange={(e) => setHeader({...header, estimatedTime: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver">Driver</Label>
              <Input
                value={header.driver}
                onChange={(e) => setHeader({...header, driver: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                value={header.vehicle}
                onChange={(e) => setHeader({...header, vehicle: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                value={header.startDate}
                onChange={(e) => setHeader({...header, startDate: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                value={header.endDate}
                onChange={(e) => setHeader({...header, endDate: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                value={header.notes}
                onChange={(e) => setHeader({...header, notes: e.target.value})}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Customers on Route</CardTitle>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleAddCustomer}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={selectedRows.size === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredCustomers.length > 0 && selectedRows.size === filteredCustomers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <div className="flex gap-1 items-center">
                      <Select value={filterOperators.customerName} onValueChange={(value) => updateOperator('customerName', value)}>
                        <SelectTrigger className="h-8 w-8 px-2 bg-white">
                        </SelectTrigger>
                        <TextFilterOperators />
                      </Select>
                      <Input
                        placeholder=""
                        value={filters.customerName}
                        onChange={(e) => updateFilter('customerName', e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <div className="flex gap-1 items-center">
                      <Select value={filterOperators.city} onValueChange={(value) => updateOperator('city', value)}>
                        <SelectTrigger className="h-8 w-8 px-2 bg-white">
                        </SelectTrigger>
                        <TextFilterOperators />
                      </Select>
                      <Input
                        placeholder=""
                        value={filters.city}
                        onChange={(e) => updateFilter('city', e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(customer.id)}
                        onCheckedChange={(checked) => handleSelectRow(customer.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{customer.customerId}</TableCell>
                    <TableCell>{customer.customerName}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.orderCount}</TableCell>
                    <TableCell>{customer.totalItems}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
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
