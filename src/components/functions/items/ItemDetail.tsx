import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { Badge } from '../../ui/badge'

interface ItemData {
  id: string
  code: string
  name: string
  category: string
  unitPrice: number
  stock: number
  status: 'Active' | 'Inactive'
  description: string
  unit: string
}

const mockItemsData: Record<string, ItemData> = {
  '1': {
    id: '1',
    code: 'ITEM001',
    name: 'Business Laptop Pro 15"',
    category: 'Electronics',
    unitPrice: 1200.00,
    stock: 25,
    status: 'Active',
    description: 'High-performance business laptop with i7 processor',
    unit: 'Piece'
  },
  '2': {
    id: '2',
    code: 'ITEM002',
    name: '27" 4K Monitor',
    category: 'Electronics',
    unitPrice: 350.00,
    stock: 45,
    status: 'Active',
    description: '4K resolution monitor for professional use',
    unit: 'Piece'
  },
  '3': {
    id: '3',
    code: 'ITEM003',
    name: 'Wireless Mouse with USB-C',
    category: 'Accessories',
    unitPrice: 35.00,
    stock: 150,
    status: 'Active',
    description: 'Ergonomic wireless mouse with USB-C charging',
    unit: 'Piece'
  },
  '4': {
    id: '4',
    code: 'ITEM004',
    name: 'Mechanical Keyboard RGB',
    category: 'Accessories',
    unitPrice: 89.00,
    stock: 80,
    status: 'Active',
    description: 'RGB mechanical keyboard with tactile switches',
    unit: 'Piece'
  },
  '5': {
    id: '5',
    code: 'ITEM005',
    name: 'USB-C to HDMI Cable 2m',
    category: 'Cables',
    unitPrice: 25.00,
    stock: 200,
    status: 'Inactive',
    description: '2m USB-C to HDMI cable for video output',
    unit: 'Piece'
  }
}

const emptyItem: ItemData = {
  id: '',
  code: '',
  name: '',
  category: 'Electronics',
  unitPrice: 0,
  stock: 0,
  status: 'Active',
  description: '',
  unit: 'Piece'
}

interface ItemDetailProps {
  itemId: string
}

export function ItemDetail({ itemId }: ItemDetailProps) {
  const [item, setItem] = useState<ItemData>(
    itemId === 'new' ? emptyItem : (mockItemsData[itemId] || emptyItem)
  )
  const [isEditing, setIsEditing] = useState(itemId === 'new')

  useEffect(() => {
    const newItem = itemId === 'new' ? emptyItem : (mockItemsData[itemId] || emptyItem)
    setItem(newItem)
    setIsEditing(itemId === 'new')
  }, [itemId])

  const handleSave = () => {
    // Here you would typically call an API to save
    console.log('Saving item:', item)
    setIsEditing(false)
  }

  const handleCancel = () => {
    const newItem = itemId === 'new' ? emptyItem : (mockItemsData[itemId] || emptyItem)
    setItem(newItem)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Item Details</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              {isEditing ? (
                <Input
                  value={item.code}
                  onChange={(e) => setItem({ ...item, code: e.target.value })}
                  disabled={item.id !== ''}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{item.code}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              {isEditing ? (
                <Input
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{item.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              {isEditing ? (
                <Select value={item.category} onValueChange={(value) => setItem({ ...item, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Cables">Cables</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 border rounded-md">{item.category}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              {isEditing ? (
                <Input
                  value={item.unit}
                  onChange={(e) => setItem({ ...item, unit: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{item.unit}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select value={item.status} onValueChange={(value) => setItem({ ...item, status: value as 'Active' | 'Inactive' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2">
                  <Badge className={item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {item.status}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unit Price</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => setItem({ ...item, unitPrice: Number(e.target.value) })}
                  step="0.01"
                  className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">${item.unitPrice.toFixed(2)}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Current Stock</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={item.stock}
                  onChange={(e) => setItem({ ...item, stock: Number(e.target.value) })}
                  className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{item.stock}</div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Total Inventory Value</p>
              <p className="text-lg font-bold">${(item.unitPrice * item.stock).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              rows={4}
            />
          ) : (
            <div className="px-3 py-2 border rounded-md min-h-20">{item.description || '(No description)'}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
