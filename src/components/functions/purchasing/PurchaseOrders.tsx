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

interface PurchaseOrder {
  id: string
  vendor: string
  vendorName: string
  orderDate: string
  expectedDate: string
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled'
  total: number
  items: number
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    vendor: 'XXX0123',
    vendorName: 'Tech Supplies Inc',
    orderDate: '2024-01-15',
    expectedDate: '2024-01-25',
    status: 'Pending',
    total: 15400,
    items: 12
  },
  {
    id: 'PO-002',
    vendor: 'XXX0456',
    vendorName: 'Global Electronics',
    orderDate: '2024-01-12',
    expectedDate: '2024-01-22',
    status: 'Approved',
    total: 22100,
    items: 8
  },
  {
    id: 'PO-003',
    vendor: 'XXX0789',
    vendorName: 'Office Depot Pro',
    orderDate: '2024-01-10',
    expectedDate: '2024-01-20',
    status: 'Received',
    total: 8750,
    items: 25
  },
  {
    id: 'PO-004',
    vendor: 'XXX0124',
    vendorName: 'Industrial Parts Co',
    orderDate: '2024-01-08',
    expectedDate: '2024-01-18',
    status: 'Draft',
    total: 31200,
    items: 6
  },
]

interface PurchaseOrderDetail {
  onOpenDetail: (orderId: string) => void
}

export function PurchaseOrders({ onOpenDetail }: PurchaseOrderDetail) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLookupDialog, setShowLookupDialog] = useState(false)
  const [lookupPONumber, setLookupPONumber] = useState('')
  const [filters, setFilters] = useState({
    id: '',
    vendor: '',
    orderDate: '',
    expectedDate: '',
    status: 'all',
    items: '',
    total: ''
  })
  const [filterOperators, setFilterOperators] = useState({
    id: 'contains',
    vendor: 'contains',
    items: 'equals',
    total: 'equals'
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

  const filteredOrders = purchaseOrders.filter(order => {
    return (
      applyFilter(order.id, filters.id, filterOperators.id) &&
      applyFilter(order.vendor, filters.vendor, filterOperators.vendor) &&
      (filters.status === 'all' || order.status.toLowerCase() === filters.status.toLowerCase()) &&
      applyFilter(order.items, filters.items, filterOperators.items) &&
      applyFilter(order.total, filters.total, filterOperators.total)
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
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Approved': return 'bg-blue-100 text-blue-800'
      case 'Received': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredOrders.map(order => order.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(orderId)
    } else {
      newSelected.delete(orderId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setPurchaseOrders(purchaseOrders.filter(order => !selectedRows.has(order.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  const handleLookupClick = () => {
    setLookupPONumber('')
    setShowLookupDialog(true)
  }

  const handleConfirmLookup = () => {
    const poNumber = lookupPONumber.trim()
    if (!poNumber) return

    const order = purchaseOrders.find(order =>
      order.id.toLowerCase() === poNumber.toLowerCase()
    )

    if (order) {
      onOpenDetail(order.id)
      setShowLookupDialog(false)
      setLookupPONumber('')
    } else {
      alert(`Purchase Order "${poNumber}" not found.`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Purchase Orders</h2>
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
                    checked={filteredOrders.length > 0 && selectedRows.size === filteredOrders.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-8"></TableHead>
                <TableHead>Mã Đơn hàng</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead></TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
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
                    <Select value={filterOperators.vendor} onValueChange={(value) => updateOperator('vendor', value)}>
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
                      value={filters.vendor}
                      onChange={(e) => updateFilter('vendor', e.target.value)}
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.items} onValueChange={(value) => updateOperator('items', value)}>
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
                      value={filters.items}
                      onChange={(e) => updateFilter('items', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.total} onValueChange={(value) => updateOperator('total', value)}>
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
                      value={filters.total}
                      onChange={(e) => updateFilter('total', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(order.id)}
                      onCheckedChange={(checked) => handleSelectRow(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Details"
                        onClick={() => onOpenDetail(order.id)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.vendorName}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.expectedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
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
              Are you sure you want to delete {selectedRows.size} purchase order{selectedRows.size > 1 ? 's' : ''}?
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
            <AlertDialogTitle>Tìm kiếm Đơn mua hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Nhập số Đơn mua hàng để mở chi tiết.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nhập số Đơn mua hàng"
              value={lookupPONumber}
              onChange={(e) => setLookupPONumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmLookup()
                }
              }}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLookup} className="bg-blue-600 hover:bg-blue-700">
              Tìm kiếm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}