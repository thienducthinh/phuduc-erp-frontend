import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { Badge } from '../../ui/badge'

interface ItemCategoryData {
  id: string
  code: string
  name: string
  description: string
  parentCategory: string
  itemCount: number
  status: 'Active' | 'Inactive'
}

const mockCategoriesData: Record<string, ItemCategoryData> = {
  '1': {
    id: '1',
    code: 'CAT001',
    name: 'Electronics',
    description: 'Electronic devices and components',
    parentCategory: 'None',
    itemCount: 125,
    status: 'Active'
  },
  '2': {
    id: '2',
    code: 'CAT002',
    name: 'Accessories',
    description: 'Computer and electronic accessories',
    parentCategory: 'Electronics',
    itemCount: 89,
    status: 'Active'
  },
  '3': {
    id: '3',
    code: 'CAT003',
    name: 'Cables',
    description: 'Various types of cables and connectors',
    parentCategory: 'Accessories',
    itemCount: 45,
    status: 'Active'
  },
  '4': {
    id: '4',
    code: 'CAT004',
    name: 'Office Supplies',
    description: 'General office supplies and stationery',
    parentCategory: 'None',
    itemCount: 67,
    status: 'Active'
  },
  '5': {
    id: '5',
    code: 'CAT005',
    name: 'Furniture',
    description: 'Office and workstation furniture',
    parentCategory: 'None',
    itemCount: 23,
    status: 'Inactive'
  }
}

const emptyCategory: ItemCategoryData = {
  id: '',
  code: '',
  name: '',
  description: '',
  parentCategory: 'None',
  itemCount: 0,
  status: 'Active'
}

interface ItemCategoryDetailProps {
  categoryId: string
}

export function ItemCategoryDetail({ categoryId }: ItemCategoryDetailProps) {
  const [category, setCategory] = useState<ItemCategoryData>(
    categoryId === 'new' ? emptyCategory : (mockCategoriesData[categoryId] || emptyCategory)
  )
  const [isEditing, setIsEditing] = useState(categoryId === 'new')

  useEffect(() => {
    const newCategory = categoryId === 'new' ? emptyCategory : (mockCategoriesData[categoryId] || emptyCategory)
    setCategory(newCategory)
    setIsEditing(categoryId === 'new')
  }, [categoryId])

  const handleSave = () => {
    // Here you would typically call an API to save
    console.log('Saving category:', category)
    setIsEditing(false)
  }

  const handleCancel = () => {
    const newCategory = categoryId === 'new' ? emptyCategory : (mockCategoriesData[categoryId] || emptyCategory)
    setCategory(newCategory)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Item Category Details</h2>
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
                  value={category.code}
                  onChange={(e) => setCategory({ ...category, code: e.target.value })}
                  disabled={category.id !== ''}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{category.code}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              {isEditing ? (
                <Input
                  value={category.name}
                  onChange={(e) => setCategory({ ...category, name: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{category.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Parent Category</Label>
              {isEditing ? (
                <Select value={category.parentCategory} onValueChange={(value) => setCategory({ ...category, parentCategory: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 border rounded-md">{category.parentCategory}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select value={category.status} onValueChange={(value) => setCategory({ ...category, status: value as 'Active' | 'Inactive' })}>
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
                  <Badge className={category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {category.status}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Item Count</Label>
              <div className="px-3 py-2 border rounded-md bg-gray-50">
                {category.itemCount}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md space-y-2">
              <p className="text-sm text-gray-600">Category Information</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Total Items:</span> {category.itemCount}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Parent:</span> {category.parentCategory}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span> {category.status}
                </p>
              </div>
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
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              rows={4}
            />
          ) : (
            <div className="px-3 py-2 border rounded-md min-h-20">{category.description || '(No description)'}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
