import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'
import { Textarea } from '../../ui/textarea'
import { Separator } from '../../ui/separator'
import { Edit, Save, Plus, Trash2, Download, Send, ArrowLeft, Truck } from 'lucide-react'

interface SalesOrderLine {
  id: string
  itemCode: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  lineTotal: number
  shippedQty: number
  status: 'pending' | 'partial' | 'shipped' | 'delivered'
}

interface SalesOrderHeader {
  id: string
  customer: string
  customerAddress: string
  orderDate: string
  deliveryDate: string
  status: 'Draft' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  type: 'wholesale' | 'retail'
  currency: string
  paymentTerms: string
  deliveryTerms: string
  salesRep: string
  priority: 'Low' | 'Medium' | 'High'
  notes: string
  subtotal: number
  taxAmount: number
  shippingAmount: number
  total: number
}

const mockSOHeader: SalesOrderHeader = {
  id: 'SO-001',
  customer: 'ABC Corporation',
  customerAddress: '456 Business Blvd, Enterprise City, NY 10001',
  orderDate: '2024-01-15',
  deliveryDate: '2024-01-25',
  status: 'Confirmed',
  type: 'wholesale',
  currency: 'USD',
  paymentTerms: 'Net 15',
  deliveryTerms: 'FOB Origin',
  salesRep: 'John Smith',
  priority: 'High',
  notes: 'Preferred customer - expedite shipping',
  subtotal: 45500.00,
  taxAmount: 4550.00,
  shippingAmount: 250.00,
  total: 50300.00
}

const mockSOLines: SalesOrderLine[] = [
  {
    id: '1',
    itemCode: 'LAPTOP001',
    description: 'Business Laptop Pro 15"',
    quantity: 20,
    unitPrice: 1200.00,
    discount: 5,
    lineTotal: 22800.00,
    shippedQty: 0,
    status: 'pending'
  },
  {
    id: '2',
    itemCode: 'MONITOR002',
    description: '27" 4K Monitor',
    quantity: 25,
    unitPrice: 350.00,
    discount: 10,
    lineTotal: 7875.00,
    shippedQty: 0,
    status: 'pending'
  },
  {
    id: '3',
    itemCode: 'DOCK003',
    description: 'USB-C Docking Station',
    quantity: 20,
    unitPrice: 150.00,
    discount: 0,
    lineTotal: 3000.00,
    shippedQty: 0,
    status: 'pending'
  },
  {
    id: '4',
    itemCode: 'HEADSET004',
    description: 'Wireless Noise-Cancelling Headset',
    quantity: 30,
    unitPrice: 89.00,
    discount: 15,
    lineTotal: 2266.50,
    shippedQty: 0,
    status: 'pending'
  },
  {
    id: '5',
    itemCode: 'STAND005',
    description: 'Adjustable Laptop Stand',
    quantity: 25,
    unitPrice: 45.00,
    discount: 0,
    lineTotal: 1125.00,
    shippedQty: 0,
    status: 'pending'
  }
]

interface SalesOrderDetailProps {
  orderId: string
}

export function SalesOrderDetail({  }: SalesOrderDetailProps) {
  const [header, setHeader] = useState<SalesOrderHeader>(mockSOHeader)
  const [lines, setLines] = useState<SalesOrderLine[]>(mockSOLines)
  const [isEditing, setIsEditing] = useState(false)
  const [_isAddingLine, setIsAddingLine] = useState(false)

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLineStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'partial': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleAddLine = () => {
    const newLine: SalesOrderLine = {
      id: String(lines.length + 1),
      itemCode: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      lineTotal: 0,
      shippedQty: 0,
      status: 'pending'
    }
    setLines([...lines, newLine])
    setIsAddingLine(false)
  }

  const handleDeleteLine = (lineId: string) => {
    setLines(lines.filter(line => line.id !== lineId))
  }

  const calculateLineTotal = (quantity: number, unitPrice: number, discount: number) => {
    return quantity * unitPrice * (1 - discount / 100)
  }

  const updateLine = (lineId: string, field: keyof SalesOrderLine, value: any) => {
    setLines(lines.map(line => {
      if (line.id === lineId) {
        const updatedLine = { ...line, [field]: value }
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
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-2">Sales Order {header.id}</h2>
          <p className="text-muted-foreground">Order details and line items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Truck className="w-4 h-4 mr-2" />
            Ship
          </Button>
          <Button variant="outline">
            <Send className="w-4 h-4 mr-2" />
            Send to Customer
          </Button>
        </div>
      </div>

      {/* Sales Order Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sales Order Header</CardTitle>
            <div className="flex gap-2">
              <Badge className={getStatusColor(header.status)}>
                {header.status}
              </Badge>
              <Badge className={getTypeColor(header.type)}>
                {header.type.charAt(0).toUpperCase() + header.type.slice(1)}
              </Badge>
              <Badge className={getPriorityColor(header.priority)}>
                {header.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                value={header.customer}
                onChange={(e) => setHeader({...header, customer: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date</Label>
              <Input
                type="date"
                value={header.orderDate}
                onChange={(e) => setHeader({...header, orderDate: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                type="date"
                value={header.deliveryDate}
                onChange={(e) => setHeader({...header, deliveryDate: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Order Type</Label>
              <Select value={header.type} onValueChange={(value: 'wholesale' | 'retail') => setHeader({...header, type: value})} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={header.priority} onValueChange={(value: 'Low' | 'Medium' | 'High') => setHeader({...header, priority: value})} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesRep">Sales Representative</Label>
              <Input
                value={header.salesRep}
                onChange={(e) => setHeader({...header, salesRep: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={header.currency} onValueChange={(value) => setHeader({...header, currency: value})} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={header.paymentTerms} onValueChange={(value) => setHeader({...header, paymentTerms: value})} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="COD">COD</SelectItem>
                  <SelectItem value="Prepaid">Prepaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryTerms">Delivery Terms</Label>
              <Select value={header.deliveryTerms} onValueChange={(value) => setHeader({...header, deliveryTerms: value})} disabled={!isEditing}>
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
              <Label htmlFor="customerAddress">Customer Address</Label>
              <Textarea
                value={header.customerAddress}
                onChange={(e) => setHeader({...header, customerAddress: e.target.value})}
                disabled={!isEditing}
                rows={2}
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

      {/* Sales Order Lines */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sales Order Lines</CardTitle>
            {isEditing && (
              <Button onClick={handleAddLine}>
                <Plus className="w-4 h-4 mr-2" />
                Add Line
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty Ordered</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Line Total</TableHead>
                  <TableHead>Qty Shipped</TableHead>
                  <TableHead>Status</TableHead>
                  {isEditing && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Input
                        value={line.itemCode}
                        onChange={(e) => updateLine(line.id, 'itemCode', e.target.value)}
                        disabled={!isEditing}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={line.description}
                        onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                        disabled={!isEditing}
                        className="min-w-48"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => updateLine(line.id, 'quantity', Number(e.target.value))}
                        disabled={!isEditing}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => updateLine(line.id, 'unitPrice', Number(e.target.value))}
                        disabled={!isEditing}
                        className="w-24"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.discount}
                        onChange={(e) => updateLine(line.id, 'discount', Number(e.target.value))}
                        disabled={!isEditing}
                        className="w-20"
                        min="0"
                        max="100"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${line.lineTotal.toFixed(2)}
                    </TableCell>
                    <TableCell>{line.shippedQty}</TableCell>
                    <TableCell>
                      <Badge className={getLineStatusColor(line.status)}>
                        {line.status.charAt(0).toUpperCase() + line.status.slice(1)}
                      </Badge>
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLine(line.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    )}
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
                <span>${lines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${(lines.reduce((sum, line) => sum + line.lineTotal, 0) * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${header.shippingAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span>${((lines.reduce((sum, line) => sum + line.lineTotal, 0) * 1.1) + header.shippingAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}