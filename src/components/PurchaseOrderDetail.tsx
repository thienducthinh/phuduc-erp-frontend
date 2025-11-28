import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Textarea } from './ui/textarea'
import { Separator } from './ui/separator'
import { Edit, Save, Plus, Trash2, Download, Send, ArrowLeft } from 'lucide-react'

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
  vendor: string
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

const mockPOHeader: PurchaseOrderHeader = {
  id: 'PO-001',
  vendor: 'Tech Supplies Inc',
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
  const [header, setHeader] = useState<PurchaseOrderHeader>(mockPOHeader)
  const [lines, setLines] = useState<PurchaseOrderLine[]>(mockPOLines)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingLine, setIsAddingLine] = useState(false)

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

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleAddLine = () => {
    const newLine: PurchaseOrderLine = {
      id: String(lines.length + 1),
      itemCode: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      lineTotal: 0,
      receivedQty: 0,
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

  const updateLine = (lineId: string, field: keyof PurchaseOrderLine, value: any) => {
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
          <h2 className="text-2xl mb-2">Purchase Order</h2>
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
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                value={header.id}
                onChange={(e) => setHeader({...header, id: e.target.value})}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                value={header.vendor}
                onChange={(e) => setHeader({...header, vendor: e.target.value})}
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
              <Label htmlFor="expectedDate">Expected Date</Label>
              <Input
                type="date"
                value={header.expectedDate}
                onChange={(e) => setHeader({...header, expectedDate: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={header.paymentTerms} onValueChange={(value) => setHeader({...header, paymentTerms: value})} disabled={!isEditing}>
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
              <Label htmlFor="vendorAddress">Vendor Address</Label>
              <Textarea
                value={header.vendorAddress}
                onChange={(e) => setHeader({...header, vendorAddress: e.target.value})}
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

      {/* Purchase Order Lines */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Purchase Order Lines</CardTitle>
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
                  <TableHead>Qty Received</TableHead>
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
                    <TableCell>{line.receivedQty}</TableCell>
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
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span>${(lines.reduce((sum, line) => sum + line.lineTotal, 0) * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}