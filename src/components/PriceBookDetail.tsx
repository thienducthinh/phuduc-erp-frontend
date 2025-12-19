import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Textarea } from './ui/textarea'
import { Plus, Trash2 } from 'lucide-react'

interface PriceBookItem {
  itemCode: string
  itemName: string
  basePrice: number
  discountPercent: number
  finalPrice: number
}

interface PriceBookData {
  id: string
  name: string
  description: string
  currency: string
  validFrom: string
  validTo: string
  status: 'Active' | 'Inactive'
  items: PriceBookItem[]
}

const mockPriceBooksData: Record<string, PriceBookData> = {
  '1': {
    id: '1',
    name: 'Standard Price Book 2024',
    description: 'Default pricing for all customers',
    currency: 'USD',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active',
    items: [
      { itemCode: 'ITEM001', itemName: 'Business Laptop Pro 15"', basePrice: 1200, discountPercent: 0, finalPrice: 1200 },
      { itemCode: 'ITEM002', itemName: '27" 4K Monitor', basePrice: 350, discountPercent: 0, finalPrice: 350 },
      { itemCode: 'ITEM003', itemName: 'Wireless Mouse with USB-C', basePrice: 35, discountPercent: 0, finalPrice: 35 }
    ]
  },
  '2': {
    id: '2',
    name: 'VIP Customer Discount',
    description: 'Special pricing for VIP customers',
    currency: 'USD',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active',
    items: [
      { itemCode: 'ITEM001', itemName: 'Business Laptop Pro 15"', basePrice: 1200, discountPercent: 10, finalPrice: 1080 },
      { itemCode: 'ITEM002', itemName: '27" 4K Monitor', basePrice: 350, discountPercent: 10, finalPrice: 315 },
      { itemCode: 'ITEM003', itemName: 'Wireless Mouse with USB-C', basePrice: 35, discountPercent: 5, finalPrice: 33.25 }
    ]
  }
}

const emptyPriceBook: PriceBookData = {
  id: '',
  name: '',
  description: '',
  currency: 'USD',
  validFrom: new Date().toISOString().split('T')[0] || '',
  validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
  status: 'Active',
  items: []
}

interface PriceBookDetailProps {
  priceBookId: string
}

export function PriceBookDetail({ priceBookId }: PriceBookDetailProps) {
  const [priceBook, setPriceBook] = useState<PriceBookData>(
    priceBookId === 'new' ? emptyPriceBook : (mockPriceBooksData[priceBookId] || emptyPriceBook)
  )
  const [isEditing, setIsEditing] = useState(priceBookId === 'new')

  useEffect(() => {
    const newPriceBook = priceBookId === 'new' ? emptyPriceBook : (mockPriceBooksData[priceBookId] || emptyPriceBook)
    setPriceBook(newPriceBook)
    setIsEditing(priceBookId === 'new')
  }, [priceBookId])

  const handleSave = () => {
    console.log('Saving price book:', priceBook)
    setIsEditing(false)
  }

  const handleCancel = () => {
    const newPriceBook = priceBookId === 'new' ? emptyPriceBook : (mockPriceBooksData[priceBookId] || emptyPriceBook)
    setPriceBook(newPriceBook)
    setIsEditing(false)
  }

  const updateItemPrice = (index: number, field: string, value: any) => {
    const newItems = [...priceBook.items]
    const item = newItems[index]
    if (item) {
      const updated = { ...item, [field]: value }
      if (field === 'basePrice' || field === 'discountPercent') {
        updated.finalPrice = updated.basePrice * (1 - updated.discountPercent / 100)
      }
      newItems[index] = updated
      setPriceBook({
        ...priceBook,
        items: newItems
      })
    }
  }

  const handleAddItem = () => {
    const newItem: PriceBookItem = {
      itemCode: '',
      itemName: '',
      basePrice: 0,
      discountPercent: 0,
      finalPrice: 0
    }
    setPriceBook({
      ...priceBook,
      items: [...priceBook.items, newItem]
    })
  }

  const handleDeleteItem = (index: number) => {
    setPriceBook({
      ...priceBook,
      items: priceBook.items.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Price Book Details</h2>
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

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              {isEditing ? (
                <Input
                  value={priceBook.name}
                  onChange={(e) => setPriceBook({ ...priceBook, name: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{priceBook.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              {isEditing ? (
                <Select value={priceBook.currency} onValueChange={(value) => setPriceBook({ ...priceBook, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 border rounded-md">{priceBook.currency}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Valid From</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={priceBook.validFrom}
                  onChange={(e) => setPriceBook({ ...priceBook, validFrom: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{new Date(priceBook.validFrom).toLocaleDateString()}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Valid To</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={priceBook.validTo}
                  onChange={(e) => setPriceBook({ ...priceBook, validTo: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{new Date(priceBook.validTo).toLocaleDateString()}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select value={priceBook.status} onValueChange={(value) => setPriceBook({ ...priceBook, status: value as 'Active' | 'Inactive' })}>
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
                  <Badge className={priceBook.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {priceBook.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            {isEditing ? (
              <Textarea
                value={priceBook.description}
                onChange={(e) => setPriceBook({ ...priceBook, description: e.target.value })}
                rows={3}
              />
            ) : (
              <div className="px-3 py-2 border rounded-md min-h-12">{priceBook.description || '(No description)'}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Pricing Items</CardTitle>
          {isEditing && (
            <Button size="sm" onClick={handleAddItem} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Final Price</TableHead>
                  {isEditing && <TableHead className="w-12"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceBook.items.map((item, index) => (
                  <TableRow key={item.itemCode || `new-${index}`}>
                    <TableCell className="font-medium">
                      {isEditing ? (
                        <Input
                          value={item.itemCode}
                          onChange={(e) => updateItemPrice(index, 'itemCode', e.target.value)}
                          placeholder="Item Code"
                          className="w-24"
                        />
                      ) : (
                        item.itemCode
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateItemPrice(index, 'itemName', e.target.value)}
                          placeholder="Item Name"
                          className="w-48"
                        />
                      ) : (
                        item.itemName
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.basePrice}
                          onChange={(e) => updateItemPrice(index, 'basePrice', Number(e.target.value))}
                          step="0.01"
                          className="w-24 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      ) : (
                        `$${item.basePrice.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.discountPercent}
                          onChange={(e) => updateItemPrice(index, 'discountPercent', Number(e.target.value))}
                          step="0.01"
                          className="w-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      ) : (
                        `${item.discountPercent.toFixed(2)}%`
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">${item.finalPrice.toFixed(2)}</TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          {priceBook.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">No items in this price book</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
