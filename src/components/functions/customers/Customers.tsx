import { useState } from 'react'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Checkbox } from '../../ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../ui/alert-dialog'
import { Plus, ArrowRight, Trash2, Binoculars } from 'lucide-react'

interface Customer {
  id: string
  customerCode: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  status: 'Active' | 'Inactive' | 'Pending'
  totalOrders: number
  lastOrderDate: string
}

const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    customerCode: 'C001',
    name: 'RetailCorp Inc',
    email: 'contact@retailcorp.com',
    phone: '555-0101',
    address: '123 Main St',
    city: 'New York',
    status: 'Active',
    totalOrders: 45,
    lastOrderDate: '2024-01-15'
  },
  {
    id: 'CUST-002',
    customerCode: 'C002',
    name: 'Wholesale Hub LLC',
    email: 'info@wholesalehub.com',
    phone: '555-0102',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    status: 'Active',
    totalOrders: 32,
    lastOrderDate: '2024-01-12'
  },
  {
    id: 'CUST-003',
    customerCode: 'C003',
    name: 'Quick Mart',
    email: 'orders@quickmart.com',
    phone: '555-0103',
    address: '789 Pine Rd',
    city: 'Chicago',
    status: 'Pending',
    totalOrders: 0,
    lastOrderDate: '-'
  },
  {
    id: 'CUST-004',
    customerCode: 'C004',
    name: 'Super Store Co',
    email: 'purchasing@superstore.com',
    phone: '555-0104',
    address: '321 Elm St',
    city: 'Houston',
    status: 'Active',
    totalOrders: 78,
    lastOrderDate: '2024-01-10'
  }
]

interface CustomersProps {
  onOpenDetail: (customerId: string) => void
}

export function Customers({ onOpenDetail }: CustomersProps) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLookupDialog, setShowLookupDialog] = useState(false)
  const [lookupCustomerNumber, setLookupCustomerNumber] = useState('')
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    email: '',
    city: '',
    status: 'all',
    totalOrders: ''
  })
  const [filterOperators, setFilterOperators] = useState({
    id: 'contains',
    name: 'contains',
    email: 'contains',
    city: 'contains',
    totalOrders: 'equals'
  })

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
      case 'greaterThan':
        return parseFloat(val) > parseFloat(filter)
      case 'greaterThanOrEqual':
        return parseFloat(val) >= parseFloat(filter)
      case 'lessThan':
        return parseFloat(val) < parseFloat(filter)
      case 'lessThanOrEqual':
        return parseFloat(val) <= parseFloat(filter)
      default:
        return true
    }
  }

  const filteredCustomers = customers.filter(customer => {
    return (
      applyFilter(customer.id, filters.id, filterOperators.id) &&
      applyFilter(customer.name, filters.name, filterOperators.name) &&
      applyFilter(customer.email, filters.email, filterOperators.email) &&
      applyFilter(customer.city, filters.city, filterOperators.city) &&
      (filters.status === 'all' || customer.status.toLowerCase() === filters.status.toLowerCase()) &&
      applyFilter(customer.totalOrders, filters.totalOrders, filterOperators.totalOrders)
    )
  })

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const updateOperator = (key: string, operator: string) => {
    setFilterOperators(prev => ({ ...prev, [key]: operator }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredCustomers.map(customer => customer.id)))
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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setCustomers(customers.filter(customer => !selectedRows.has(customer.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  const handleLookupClick = () => {
    setLookupCustomerNumber('')
    setShowLookupDialog(true)
  }

  const handleConfirmLookup = () => {
    const customerNumber = lookupCustomerNumber.trim()
    if (!customerNumber) return

    const customer = customers.find(customer =>
      customer.id.toLowerCase() === customerNumber.toLowerCase()
    )

    if (customer) {
      onOpenDetail(customer.id)
      setShowLookupDialog(false)
      setLookupCustomerNumber('')
    } else {
      alert(`Customer "${customerNumber}" not found.`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Customers</h2>
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => onOpenDetail('new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            disabled={selectedRows.size === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline" size="sm" onClick={handleLookupClick}>
            <Binoculars className="w-4 h-4 mr-2" />
            Binoculars
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredCustomers.length > 0 && selectedRows.size === filteredCustomers.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-8"></TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="py-2"></TableHead>
                <TableHead className="py-2"></TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.id} onValueChange={(value) => updateOperator('id', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.id}
                      onChange={(e) => updateFilter('id', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.name} onValueChange={(value) => updateOperator('name', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.name}
                      onChange={(e) => updateFilter('name', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.email} onValueChange={(value) => updateOperator('email', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.email}
                      onChange={(e) => updateFilter('email', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2"></TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.city} onValueChange={(value) => updateOperator('city', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.city}
                      onChange={(e) => updateFilter('city', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2">
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.totalOrders} onValueChange={(value) => updateOperator('totalOrders', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="greaterThan">Greater Than</SelectItem>
                        <SelectItem value="greaterThanOrEqual">Greater Than or Equal</SelectItem>
                        <SelectItem value="lessThan">Less Than</SelectItem>
                        <SelectItem value="lessThanOrEqual">Less Than or Equal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.totalOrders}
                      onChange={(e) => updateFilter('totalOrders', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2"></TableHead>
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Details"
                        onClick={() => onOpenDetail(customer.id)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.lastOrderDate !== '-' ? new Date(customer.lastOrderDate).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.size} customer{selectedRows.size > 1 ? 's' : ''}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLookupDialog} onOpenChange={setShowLookupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Search Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Enter customer ID to open details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter customer ID"
              value={lookupCustomerNumber}
              onChange={(e) => setLookupCustomerNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmLookup()
                }
              }}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLookup} className="bg-blue-600 hover:bg-blue-700">
              Search
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
