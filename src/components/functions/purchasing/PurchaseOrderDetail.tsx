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
import { Plus, Trash2 } from 'lucide-react'

interface PurchaseOrderLine {
  id: string
  itemCode: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  lineTotal: number
  receivedQty: number
  status: 'pending' | 'partial' | 'received'
}

interface PurchaseOrderHeader {
  id: string
  vendorCode: string
  vendor: string
  vendorName: string
  vendorAddress: string
  orderDate: string
  expectedDate: string
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled'
  currency: string
  paymentTerms: string
  deliveryTerms: string
  notes: string
  subtotal: number
  taxAmount: number
  total: number
}

// Vendor Master Data
interface VendorMaster {
  vendorCode: string
  vendor: string
  vendorName: string
  vendorAddress: string
}

const vendorMasterData: Record<string, VendorMaster> = {
  'VEND001': {
    vendorCode: 'VEND001',
    vendor: 'TSI',
    vendorName: 'Tech Supplies Inc',
    vendorAddress: '123 Technology Ave, Silicon Valley, CA 94000'
  },
  'VEND002': {
    vendorCode: 'VEND002',
    vendor: 'GEL',
    vendorName: 'Global Electronics',
    vendorAddress: '456 Electronics Blvd, Tech City, NY 10001'
  },
  'VEND003': {
    vendorCode: 'VEND003',
    vendor: 'ODP',
    vendorName: 'Office Depot Pro',
    vendorAddress: '789 Office Park, Business District, CA 90210'
  },
  'VEND004': {
    vendorCode: 'VEND004',
    vendor: 'IPC',
    vendorName: 'Industrial Parts Co',
    vendorAddress: '321 Industrial Way, Manufacturing Zone, TX 75001'
  }
}

const mockPOHeaders: Record<string, PurchaseOrderHeader> = {
  'PO-001': {
    id: 'PO-001',
    vendorCode: 'VEND001',
    vendor: 'TSI',
    vendorName: 'Tech Supplies Inc',
    vendorAddress: '123 Technology Ave, Silicon Valley, CA 94000',
    orderDate: '2024-01-15',
    expectedDate: '2024-01-30',
    status: 'Approved',
    currency: 'USD',
    paymentTerms: 'Net 30',
    deliveryTerms: 'FOB Destination',
    notes: 'Urgent delivery required for Q1 projects',
    subtotal: 25500.00,
    taxAmount: 2550.00,
    total: 28050.00
  },
  'PO-002': {
    id: 'PO-002',
    vendorCode: 'VEND002',
    vendor: 'GEL',
    vendorName: 'Global Electronics',
    vendorAddress: '456 Electronics Blvd, Tech City, NY 10001',
    orderDate: '2024-01-12',
    expectedDate: '2024-01-22',
    status: 'Pending',
    currency: 'USD',
    paymentTerms: 'Net 60',
    deliveryTerms: 'FOB Origin',
    notes: 'Standard delivery terms apply',
    subtotal: 22100.00,
    taxAmount: 2210.00,
    total: 24310.00
  },
  'PO-003': {
    id: 'PO-003',
    vendorCode: 'VEND003',
    vendor: 'ODP',
    vendorName: 'Office Depot Pro',
    vendorAddress: '789 Office Park, Business District, CA 90210',
    orderDate: '2024-01-10',
    expectedDate: '2024-01-20',
    status: 'Received',
    currency: 'USD',
    paymentTerms: 'Net 30',
    deliveryTerms: 'CIF',
    notes: 'All items received and inspected',
    subtotal: 8750.00,
    taxAmount: 875.00,
    total: 9625.00
  },
  'PO-004': {
    id: 'PO-004',
    vendorCode: 'VEND004',
    vendor: 'IPC',
    vendorName: 'Industrial Parts Co',
    vendorAddress: '321 Industrial Way, Manufacturing Zone, TX 75001',
    orderDate: '2024-01-08',
    expectedDate: '2024-01-18',
    status: 'Draft',
    currency: 'USD',
    paymentTerms: 'Prepaid',
    deliveryTerms: 'EXW',
    notes: 'Draft order - pending approval',
    subtotal: 31200.00,
    taxAmount: 3120.00,
    total: 34320.00
  }
}

const getTodayDate = () => {
  const today = new Date().toISOString().split('T')[0]
  return today || ''
}

const emptyPOHeader: PurchaseOrderHeader = {
  id: '',
  vendorCode: '',
  vendor: '',
  vendorName: '',
  vendorAddress: '',
  orderDate: getTodayDate(),
  expectedDate: getTodayDate(),
  status: 'Draft',
  currency: 'USD',
  paymentTerms: 'Net 30',
  deliveryTerms: 'FOB Destination',
  notes: '',
  subtotal: 0,
  taxAmount: 0,
  total: 0
}

// Items Master Data
interface ItemMaster {
  itemCode: string
  description: string
  unitPrice: number
}

const itemsMasterData: Record<string, ItemMaster> = {
  'LAPTOP001': {
    itemCode: 'LAPTOP001',
    description: 'Business Laptop Pro 15"',
    unitPrice: 1200.00
  },
  'MONITOR002': {
    itemCode: 'MONITOR002',
    description: '27" 4K Monitor',
    unitPrice: 350.00
  },
  'MOUSE003': {
    itemCode: 'MOUSE003',
    description: 'Wireless Mouse with USB-C',
    unitPrice: 35.00
  },
  'KEYBOARD004': {
    itemCode: 'KEYBOARD004',
    description: 'Mechanical Keyboard RGB',
    unitPrice: 89.00
  },
  'CABLE005': {
    itemCode: 'CABLE005',
    description: 'USB-C to HDMI Cable 2m',
    unitPrice: 25.00
  }
}

const mockPOLines: PurchaseOrderLine[] = [
  {
    id: '1',
    itemCode: 'LAPTOP001',
    description: 'Business Laptop Pro 15"',
    quantity: 10,
    unitPrice: 1200.00,
    discount: 0,
    lineTotal: 12000.00,
    receivedQty: 0,
    status: 'pending'
  },
  {
    id: '2',
    itemCode: 'MONITOR002',
    description: '27" 4K Monitor',
    quantity: 15,
    unitPrice: 350.00,
    discount: 5,
    lineTotal: 4987.50,
    receivedQty: 0,
    status: 'pending'
  },
  {
    id: '3',
    itemCode: 'MOUSE003',
    description: 'Wireless Mouse with USB-C',
    quantity: 25,
    unitPrice: 35.00,
    discount: 0,
    lineTotal: 875.00,
    receivedQty: 0,
    status: 'pending'
  },
  {
    id: '4',
    itemCode: 'KEYBOARD004',
    description: 'Mechanical Keyboard RGB',
    quantity: 20,
    unitPrice: 89.00,
    discount: 10,
    lineTotal: 1602.00,
    receivedQty: 0,
    status: 'pending'
  },
  {
    id: '5',
    itemCode: 'CABLE005',
    description: 'USB-C to HDMI Cable 2m',
    quantity: 30,
    unitPrice: 25.00,
    discount: 0,
    lineTotal: 750.00,
    receivedQty: 0,
    status: 'pending'
  }
]

interface PurchaseOrderDetailProps {
  orderId: string
}

export function PurchaseOrderDetail({ orderId }: PurchaseOrderDetailProps) {
  const [header, setHeader] = useState<PurchaseOrderHeader>(
    orderId === 'new' ? emptyPOHeader : (mockPOHeaders[orderId] || emptyPOHeader)
  )
  const [lines, setLines] = useState<PurchaseOrderLine[]>(orderId === 'new' ? [] : mockPOLines)
  const [isEditing, setIsEditing] = useState(orderId === 'new')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [previousDateValues, setPreviousDateValues] = useState<{ orderDate: string; expectedDate: string }>({
    orderDate: '',
    expectedDate: ''
  })
  const [previousLineValues, setPreviousLineValues] = useState<Record<string, { quantity: number; discount: number }>>({})
  const [focusedLineField, setFocusedLineField] = useState<string>('')

  const [filters, setFilters] = useState({
    itemCode: '',
    description: '',
    quantity: '',
    unitPrice: '',
    discount: '',
    status: 'all'
  })
  const [filterOperators, setFilterOperators] = useState({
    itemCode: 'contains',
    description: 'contains',
    quantity: 'equals',
    unitPrice: 'equals',
    discount: 'equals'
  })

  // Update data when orderId changes
  useEffect(() => {
    const newHeader = orderId === 'new' ? emptyPOHeader : (mockPOHeaders[orderId] || emptyPOHeader)
    setHeader(newHeader)
    setLines(orderId === 'new' ? [] : mockPOLines)
    setIsEditing(orderId === 'new')
  }, [orderId])

  const handleVendorCodeChange = (vendorCode: string) => {
    setHeader({ ...header, vendorCode })
    
    // Lookup vendor data from vendorCode
    const vendorData = vendorMasterData[vendorCode]
    if (vendorData) {
      setHeader(prev => ({
        ...prev,
        vendorCode: vendorData.vendorCode,
        vendor: vendorData.vendor,
        vendorName: vendorData.vendorName,
        vendorAddress: vendorData.vendorAddress
      }))
    } else {
      // Clear vendor data if code not found
      setHeader(prev => ({
        ...prev,
        vendorCode,
        vendor: '',
        vendorName: '',
        vendorAddress: ''
      }))
    }
  }

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

  const filteredLines = lines.filter(line => {
    return (
      applyFilter(line.itemCode, filters.itemCode, filterOperators.itemCode) &&
      applyFilter(line.description, filters.description, filterOperators.description) &&
      applyFilter(line.quantity, filters.quantity, filterOperators.quantity) &&
      applyFilter(line.unitPrice, filters.unitPrice, filterOperators.unitPrice) &&
      applyFilter(line.discount, filters.discount, filterOperators.discount) &&
      (filters.status === 'all' || line.status.toLowerCase() === filters.status.toLowerCase())
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
      setSelectedRows(new Set(filteredLines.map(line => line.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (lineId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(lineId)
    } else {
      newSelected.delete(lineId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteSelected = () => {
    setLines(lines.filter(line => !selectedRows.has(line.id)))
    setSelectedRows(new Set())
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

  const getLineStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'partial': return 'bg-blue-100 text-blue-800'
      case 'received': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleDateShortcut = (value: string): string | null => {
    // Handle shortcuts like "+3" for today + 3 days, "-2" for today - 2 days
    const match = value.match(/^([+-])(\d+)$/)
    if (match && match[1] && match[2]) {
      const sign = match[1]
      const days = match[2]
      const today = new Date()
      const offset = parseInt(days) * (sign === '+' ? 1 : -1)
      today.setDate(today.getDate() + offset)
      const dateStr = today.toISOString().split('T')[0]
      return dateStr || ''
    }
    return ''
  }

  const handleDateInput = (field: 'orderDate' | 'expectedDate', value: string) => {
    // If value is empty, restore the previous value
    if (!value.trim()) {
      setHeader({ ...header, [field]: previousDateValues[field] })
      return
    }

    const shortcutDate = handleDateShortcut(value)
    if (shortcutDate) {
      setHeader({ ...header, [field]: shortcutDate })
    } else {
      setHeader({ ...header, [field]: value })
    }
  }

  const handleDateFocus = (field: 'orderDate' | 'expectedDate') => {
    // Store the current value before clearing
    setPreviousDateValues({
      ...previousDateValues,
      [field]: header[field]
    })
    // Clear the field
    setHeader({ ...header, [field]: '' })
  }

  const handleQuantityFocus = (lineId: string) => {
    // Store the current quantity value before clearing
    const line = lines.find(l => l.id === lineId)
    if (line) {
      setPreviousLineValues({
        ...previousLineValues,
        [lineId]: {
          quantity: line.quantity,
          discount: previousLineValues[lineId]?.discount ?? line.discount
        }
      })
      // Mark this field as focused (display empty)
      setFocusedLineField(`${lineId}:quantity`)
    }
  }

  const handleQuantityBlur = (lineId: string, value: number) => {
    // Clear focused state
    setFocusedLineField('')
    // If the field is empty, restore the previous value
    if (!value || value === 0) {
      const previousValue = previousLineValues[lineId]?.quantity
      if (previousValue !== undefined && previousValue > 0) {
        updateLine(lineId, 'quantity', previousValue)
      }
    }
  }

  const handleDiscountFocus = (lineId: string) => {
    // Store the current discount value before clearing
    const line = lines.find(l => l.id === lineId)
    if (line) {
      setPreviousLineValues({
        ...previousLineValues,
        [lineId]: {
          quantity: previousLineValues[lineId]?.quantity ?? line.quantity,
          discount: line.discount
        }
      })
      // Mark this field as focused (display empty)
      setFocusedLineField(`${lineId}:discount`)
    }
  }

  const handleDiscountBlur = (lineId: string, value: number) => {
    // Clear focused state
    setFocusedLineField('')
    // If the field is empty, restore the previous value
    if (!value || value === 0) {
      const previousValue = previousLineValues[lineId]?.discount
      if (previousValue !== undefined && previousValue > 0) {
        updateLine(lineId, 'discount', previousValue)
      }
    }
  }

  const handleAddLine = () => {
    const newLine: PurchaseOrderLine = {
      id: String(lines.length + 1),
      itemCode: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      lineTotal: 0,
      receivedQty: 0,
      status: 'pending'
    }
    setLines([...lines, newLine])
  }

  const calculateLineTotal = (quantity: number, unitPrice: number, discount: number) => {
    return quantity * unitPrice * (1 - discount / 100)
  }

  const updateLine = (lineId: string, field: keyof PurchaseOrderLine, value: any) => {
    setLines(lines.map(line => {
      if (line.id === lineId) {
        const updatedLine = { ...line, [field]: value }

        // Auto-lookup description and unitPrice when itemCode changes
        if (field === 'itemCode') {
          const itemCode = value.toUpperCase()
          const itemData = itemsMasterData[itemCode]
          if (itemData) {
            updatedLine.itemCode = itemData.itemCode
            updatedLine.description = itemData.description
            updatedLine.unitPrice = itemData.unitPrice
            // Recalculate line total with new unit price
            updatedLine.lineTotal = calculateLineTotal(
              updatedLine.quantity,
              updatedLine.unitPrice,
              updatedLine.discount
            )
          }
        }

        // Recalculate line total when quantity, unitPrice, or discount changes
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          updatedLine.lineTotal = calculateLineTotal(
            updatedLine.quantity,
            updatedLine.unitPrice,
            updatedLine.discount
          )
        }
        return updatedLine
      }
      return line
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-2">Purchase Order</h2>
      </div>

      {/* Purchase Order Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Purchase Order Header</CardTitle>
            <Badge className={getStatusColor(header.status)}>
              {header.status}
            </Badge>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleAddLine}>
              <Plus className="w-4 h-4 mr-2" />
              Add
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                value={header.id}
                onChange={(e) => setHeader({ ...header, id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorCode">Vendor Code</Label>
              <Input
                value={header.vendorCode}
                onChange={(e) => handleVendorCodeChange(e.target.value)}
                placeholder="Enter vendor code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                value={header.vendor}
                disabled={true}
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor Name</Label>
              <Input
                value={header.vendorName}
                disabled={true}
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date</Label>
              <Input
                type="text"
                value={header.orderDate}
                onChange={(e) => setHeader({ ...header, orderDate: e.target.value })}
                onFocus={() => handleDateFocus('orderDate')}
                onBlur={(e) => handleDateInput('orderDate', e.target.value)}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDate">Expected Date</Label>
              <Input
                type="text"
                value={header.expectedDate}
                onChange={(e) => setHeader({ ...header, expectedDate: e.target.value })}
                onFocus={() => handleDateFocus('expectedDate')}
                onBlur={(e) => handleDateInput('expectedDate', e.target.value)}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={header.paymentTerms} onValueChange={(value) => setHeader({ ...header, paymentTerms: value })} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="COD">COD</SelectItem>
                  <SelectItem value="Prepaid">Prepaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryTerms">Delivery Terms</Label>
              <Select value={header.deliveryTerms} onValueChange={(value) => setHeader({ ...header, deliveryTerms: value })} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOB Destination">FOB Destination</SelectItem>
                  <SelectItem value="FOB Origin">FOB Origin</SelectItem>
                  <SelectItem value="CIF">CIF</SelectItem>
                  <SelectItem value="EXW">EXW</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="vendorAddress">Vendor Address</Label>
              <Textarea
                value={header.vendorAddress}
                onChange={(e) => setHeader({ ...header, vendorAddress: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                value={header.notes}
                onChange={(e) => setHeader({ ...header, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Order Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Lines</CardTitle>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleAddLine}>
              <Plus className="w-4 h-4 mr-2" />
              Add
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
                      checked={filteredLines.length > 0 && selectedRows.size === filteredLines.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Mã hàng</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Chiết khấu (%)</TableHead>
                  <TableHead>Line Total</TableHead>
                  <TableHead>Qty Received</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <div className="flex gap-1 items-center">
                      <Select value={filterOperators.itemCode} onValueChange={(value) => updateOperator('itemCode', value)}>
                        <SelectTrigger className="h-8 w-8 px-2 bg-white">
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
                        value={filters.itemCode}
                        onChange={(e) => updateFilter('itemCode', e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-2">
                    <div className="flex gap-1 items-center">
                      <Select value={filterOperators.description} onValueChange={(value) => updateOperator('description', value)}>
                        <SelectTrigger className="h-8 w-8 px-2 bg-white">
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
                        value={filters.description}
                        onChange={(e) => updateFilter('description', e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-2">
                    <div className="flex gap-1 items-center">
                      <Select value={filterOperators.quantity} onValueChange={(value) => updateOperator('quantity', value)}>
                        <SelectTrigger className="h-8 w-8 px-2 bg-white">
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
                        value={filters.quantity}
                        onChange={(e) => updateFilter('quantity', e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-2">
                    <div className="flex gap-1 items-center">
                      <Select value={filterOperators.unitPrice} onValueChange={(value) => updateOperator('unitPrice', value)}>
                        <SelectTrigger className="h-8 w-8 px-2 bg-white">
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
                        value={filters.unitPrice}
                        onChange={(e) => updateFilter('unitPrice', e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-2">
                    <div className="flex gap-1 items-center">
                      <Select value={filterOperators.discount} onValueChange={(value) => updateOperator('discount', value)}>
                        <SelectTrigger className="h-8 w-8 px-2 bg-white">
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
                        value={filters.discount}
                        onChange={(e) => updateFilter('discount', e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                      <SelectTrigger className="h-8 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(line.id)}
                        onCheckedChange={(checked) => handleSelectRow(line.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={line.itemCode}
                        onChange={(e) => updateLine(line.id, 'itemCode', e.target.value)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="min-w-48 px-3 py-2 text-sm">
                        {line.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={focusedLineField === `${line.id}:quantity` ? '' : line.quantity}
                        onChange={(e) => updateLine(line.id, 'quantity', Number(e.target.value))}
                        onFocus={() => handleQuantityFocus(line.id)}
                        onBlur={(e) => handleQuantityBlur(line.id, Number(e.target.value))}
                        className="w-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-24 px-3 py-2 text-sm text-right">
                        {formatVND(line.unitPrice)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={focusedLineField === `${line.id}:discount` ? '' : line.discount}
                        onChange={(e) => updateLine(line.id, 'discount', Number(e.target.value))}
                        onFocus={() => handleDiscountFocus(line.id)}
                        onBlur={(e) => handleDiscountBlur(line.id, Number(e.target.value))}
                        className="w-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        max="100"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatVND(line.lineTotal)}
                    </TableCell>
                    <TableCell>{line.receivedQty}</TableCell>
                    <TableCell>
                      <Badge className={getLineStatusColor(line.status)}>
                        {line.status.charAt(0).toUpperCase() + line.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-6" />

          {/* Order Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatVND(lines.reduce((sum, line) => sum + line.lineTotal, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>{formatVND(lines.reduce((sum, line) => sum + line.lineTotal, 0) * 0.1)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span>{formatVND(lines.reduce((sum, line) => sum + line.lineTotal, 0) * 1.1)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}