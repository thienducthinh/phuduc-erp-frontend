import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { Badge } from '../../ui/badge'
import { itemBrandService, ItemBrandData, mockBrandsData } from '../../../services/itemBrandService'
import { ApiError } from '../../../services/apiClient'

const emptyBrand: ItemBrandData = {
  id: '',
  code: '',
  name: '',
  manufacturer: '',
  country: 'USA',
  website: '',
  contactEmail: '',
  contactPhone: '',
  description: '',
  itemCount: 0,
  status: 'Active'
}

interface ItemBrandDetailProps {
  brandId: string
}

export function ItemBrandDetail({ brandId }: ItemBrandDetailProps) {
  const [brand, setBrand] = useState<ItemBrandData>(emptyBrand)
  const [isEditing, setIsEditing] = useState(brandId === 'new')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load brand data from API or mock data
  useEffect(() => {
    const loadBrandData = async () => {
      if (brandId === 'new') {
        setBrand(emptyBrand)
        setIsEditing(true)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Try to fetch from API
        const data = await itemBrandService.getById(brandId)
        setBrand(data)
        setIsEditing(false)
      } catch (err) {
        // Fallback to mock data if API fails
        console.warn('API call failed, using mock data:', err)
        const mockData = mockBrandsData[brandId]
        if (mockData) {
          setBrand(mockData)
        } else {
          setError('Brand not found')
          setBrand(emptyBrand)
        }
        setIsEditing(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadBrandData()
  }, [brandId])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (brandId === 'new') {
        // Create new brand
        const newBrand = await itemBrandService.create({
          code: brand.code,
          name: brand.name,
          manufacturer: brand.manufacturer,
          country: brand.country,
          website: brand.website,
          contactEmail: brand.contactEmail,
          contactPhone: brand.contactPhone,
          description: brand.description,
          status: brand.status
        })
        setBrand(newBrand)
        console.log('Brand created successfully:', newBrand)
      } else {
        // Update existing brand
        const updatedBrand = await itemBrandService.update(brandId, {
          code: brand.code,
          name: brand.name,
          manufacturer: brand.manufacturer,
          country: brand.country,
          website: brand.website,
          contactEmail: brand.contactEmail,
          contactPhone: brand.contactPhone,
          description: brand.description,
          status: brand.status
        })
        setBrand(updatedBrand)
        console.log('Brand updated successfully:', updatedBrand)
      }
      setIsEditing(false)
    } catch (err) {
      console.error('Save failed:', err)
      if (err instanceof ApiError) {
        setError(`Failed to save: ${err.message}`)
      } else {
        setError('Failed to save brand. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reload original data
    if (brandId === 'new') {
      setBrand(emptyBrand)
    } else {
      const mockData = mockBrandsData[brandId]
      if (mockData) {
        setBrand(mockData)
      }
    }
    setIsEditing(false)
    setError(null)
  }

  if (isLoading && !brand.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Item Brand Details</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
                  value={brand.code}
                  onChange={(e) => setBrand({ ...brand, code: e.target.value })}
                  disabled={brand.id !== ''}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{brand.code}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Brand Name</Label>
              {isEditing ? (
                <Input
                  value={brand.name}
                  onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{brand.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Manufacturer</Label>
              {isEditing ? (
                <Input
                  value={brand.manufacturer}
                  onChange={(e) => setBrand({ ...brand, manufacturer: e.target.value })}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{brand.manufacturer}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              {isEditing ? (
                <Select value={brand.country} onValueChange={(value) => setBrand({ ...brand, country: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="South Korea">South Korea</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Switzerland">Switzerland</SelectItem>
                    <SelectItem value="Taiwan">Taiwan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 border rounded-md">{brand.country}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select value={brand.status} onValueChange={(value) => setBrand({ ...brand, status: value as 'Active' | 'Inactive' })}>
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
                  <Badge className={brand.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {brand.status}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Website</Label>
              {isEditing ? (
                <Input
                  value={brand.website}
                  onChange={(e) => setBrand({ ...brand, website: e.target.value })}
                  placeholder="www.example.com"
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{brand.website || '(Not specified)'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Contact Email</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={brand.contactEmail}
                  onChange={(e) => setBrand({ ...brand, contactEmail: e.target.value })}
                  placeholder="support@example.com"
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{brand.contactEmail || '(Not specified)'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Contact Phone</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={brand.contactPhone}
                  onChange={(e) => setBrand({ ...brand, contactPhone: e.target.value })}
                  placeholder="+1-xxx-xxx-xxxx"
                />
              ) : (
                <div className="px-3 py-2 border rounded-md">{brand.contactPhone || '(Not specified)'}</div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-md space-y-2">
              <p className="text-sm text-gray-600">Brand Statistics</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Total Items:</span> {brand.itemCount}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Country:</span> {brand.country}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span> {brand.status}
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
              value={brand.description}
              onChange={(e) => setBrand({ ...brand, description: e.target.value })}
              rows={4}
              placeholder="Enter brand description..."
            />
          ) : (
            <div className="px-3 py-2 border rounded-md min-h-20">{brand.description || '(No description)'}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
