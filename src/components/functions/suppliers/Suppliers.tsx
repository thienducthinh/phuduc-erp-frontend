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

interface Supplier {
  id: string
  supplierCode: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  status: 'Active' | 'Inactive' | 'Pending'
  totalPurchases: number
  lastPurchaseDate: string
}

const mockSuppliers: Supplier[] = [
  {
    id: 'SUPP-001',
    supplierCode: 'S001',
    name: 'Global Supplies Inc',
    email: 'sales@globalsupplies.com',
    phone: '555-0201',
    address: '789 Industrial Blvd',
    city: 'Chicago',
    status: 'Active',
    totalPurchases: 125,
    lastPurchaseDate: '2024-01-14'
  },
  {
    id: 'SUPP-002',
    supplierCode: 'S002',
    name: 'Premium Materials Co',
    email: 'orders@premiummaterials.com',
    phone: '555-0202',
    address: '321 Commerce St',
    city: 'Houston',
    status: 'Active',
    totalPurchases: 87,
    lastPurchaseDate: '2024-01-13'
  },
  {
    id: 'SUPP-003',
    supplierCode: 'S003',
    name: 'Quick Parts LLC',
    email: 'contact@quickparts.com',
    phone: '555-0203',
    address: '654 Market Ave',
    city: 'Phoenix',
    status: 'Pending',
    totalPurchases: 0,
    lastPurchaseDate: '-'
  },
  {
    id: 'SUPP-004',
    supplierCode: 'S004',
    name: 'Wholesale Goods Corp',
    email: 'info@wholesalegoods.com',
    phone: '555-0204',
    address: '987 Distribution Way',
    city: 'Dallas',
    status: 'Active',
    totalPurchases: 156,
    lastPurchaseDate: '2024-01-11'
  }
]

interface SuppliersProps {
  onOpenDetail: (supplierId: string) => void
}

export function Suppliers({ onOpenDetail }: SuppliersProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLookupDialog, setShowLookupDialog] = useState(false)
  const [lookupSupplierNumber, setLookupSupplierNumber] = useState('')
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    email: '',
    city: '',
    status: 'all',
    totalPurchases: ''
  })
  const [filterOperators, setFilterOperators] = useState({
    id: 'contains',
    name: 'contains',
    email: 'contains',
    city: 'contains',
    totalPurchases: 'equals'
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

  const filteredSuppliers = suppliers.filter(supplier => {
    return (
      applyFilter(supplier.id, filters.id, filterOperators.id) &&
      applyFilter(supplier.name, filters.name, filterOperators.name) &&
      applyFilter(supplier.email, filters.email, filterOperators.email) &&
      applyFilter(supplier.city, filters.city, filterOperators.city) &&
      (filters.status === 'all' || supplier.status.toLowerCase() === filters.status.toLowerCase()) &&
      applyFilter(supplier.totalPurchases, filters.totalPurchases, filterOperators.totalPurchases)
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
      setSelectedRows(new Set(filteredSuppliers.map(supplier => supplier.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (supplierId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(supplierId)
    } else {
      newSelected.delete(supplierId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setSuppliers(suppliers.filter(supplier => !selectedRows.has(supplier.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  const handleLookupClick = () => {
    setLookupSupplierNumber('')
    setShowLookupDialog(true)
  }

  const handleConfirmLookup = () => {
    const supplierNumber = lookupSupplierNumber.trim()
    if (!supplierNumber) return

    const supplier = suppliers.find(supplier =>
      supplier.id.toLowerCase() === supplierNumber.toLowerCase()
    )

    if (supplier) {
      onOpenDetail(supplier.id)
      setShowLookupDialog(false)
      setLookupSupplierNumber('')
    } else {
      alert(`Supplier "${supplierNumber}" not found.`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Suppliers</h2>
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
                    checked={filteredSuppliers.length > 0 && selectedRows.size === filteredSuppliers.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-8"></TableHead>
                <TableHead>Supplier ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Purchases</TableHead>
                <TableHead>Last Purchase</TableHead>
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
                    <Select value={filterOperators.totalPurchases} onValueChange={(value) => updateOperator('totalPurchases', value)}>
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
                      value={filters.totalPurchases}
                      onChange={(e) => updateFilter('totalPurchases', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(supplier.id)}
                      onCheckedChange={(checked) => handleSelectRow(supplier.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Details"
                        onClick={() => onOpenDetail(supplier.id)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.city}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{supplier.totalPurchases}</TableCell>
                  <TableCell>{supplier.lastPurchaseDate !== '-' ? new Date(supplier.lastPurchaseDate).toLocaleDateString() : '-'}</TableCell>
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
              Are you sure you want to delete {selectedRows.size} supplier{selectedRows.size > 1 ? 's' : ''}?
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
            <AlertDialogTitle>Search Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Enter supplier ID to open details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter supplier ID"
              value={lookupSupplierNumber}
              onChange={(e) => setLookupSupplierNumber(e.target.value)}
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
