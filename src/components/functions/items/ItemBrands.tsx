import { useState } from 'react'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'
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
import { Plus, ArrowRight, Trash2, Save, RefreshCw } from 'lucide-react'

interface ItemBrand {
  id: string
  code: string
  name: string
  manufacturer: string
  country: string
  itemCount: number
  status: 'Active' | 'Inactive'
}

const mockBrands: ItemBrand[] = [
  {
    id: '1',
    code: 'BRD001',
    name: 'Dell',
    manufacturer: 'Dell Inc.',
    country: 'USA',
    itemCount: 45,
    status: 'Active'
  },
  {
    id: '2',
    code: 'BRD002',
    name: 'HP',
    manufacturer: 'HP Inc.',
    country: 'USA',
    itemCount: 38,
    status: 'Active'
  },
  {
    id: '3',
    code: 'BRD003',
    name: 'Lenovo',
    manufacturer: 'Lenovo Group Ltd.',
    country: 'China',
    itemCount: 52,
    status: 'Active'
  },
  {
    id: '4',
    code: 'BRD004',
    name: 'Logitech',
    manufacturer: 'Logitech International S.A.',
    country: 'Switzerland',
    itemCount: 67,
    status: 'Active'
  },
  {
    id: '5',
    code: 'BRD005',
    name: 'Samsung',
    manufacturer: 'Samsung Electronics',
    country: 'South Korea',
    itemCount: 29,
    status: 'Inactive'
  }
]

interface ItemBrandsProps {
  onOpenDetail: (brandId: string) => void
}

export function ItemBrands({ onOpenDetail }: ItemBrandsProps) {
  const [brands, setBrands] = useState<ItemBrand[]>(mockBrands)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    manufacturer: '',
    country: '',
    status: 'all'
  })

  const filteredBrands = brands.filter(brand => {
    if (filters.code && !brand.code.toLowerCase().includes(filters.code.toLowerCase())) return false
    if (filters.name && !brand.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.manufacturer && !brand.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase())) return false
    if (filters.country && !brand.country.toLowerCase().includes(filters.country.toLowerCase())) return false
    if (filters.status !== 'all' && brand.status !== filters.status) return false
    return true
  })

  const updateFilter = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredBrands.map(brand => brand.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (brandId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(brandId)
    } else {
      newSelected.delete(brandId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setBrands(brands.filter(brand => !selectedRows.has(brand.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Item Brands</h2>
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
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox
                      checked={filteredBrands.length > 0 && selectedRows.size === filteredBrands.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Item Count</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <Input
                      placeholder=""
                      value={filters.code}
                      onChange={(e) => updateFilter('code', e.target.value)}
                      className="h-8"
                    />
                  </TableHead>
                  <TableHead className="py-2">
                    <Input
                      placeholder=""
                      value={filters.name}
                      onChange={(e) => updateFilter('name', e.target.value)}
                      className="h-8"
                    />
                  </TableHead>
                  <TableHead className="py-2">
                    <Input
                      placeholder=""
                      value={filters.manufacturer}
                      onChange={(e) => updateFilter('manufacturer', e.target.value)}
                      className="h-8"
                    />
                  </TableHead>
                  <TableHead className="py-2">
                    <Input
                      placeholder=""
                      value={filters.country}
                      onChange={(e) => updateFilter('country', e.target.value)}
                      className="h-8"
                    />
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(brand.id)}
                        onCheckedChange={(checked) => handleSelectRow(brand.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Details"
                          onClick={() => onOpenDetail(brand.id)}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{brand.code}</TableCell>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>{brand.manufacturer}</TableCell>
                    <TableCell>{brand.country}</TableCell>
                    <TableCell>{brand.itemCount}</TableCell>
                    <TableCell>
                      <Badge className={brand.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {brand.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.size} brand{selectedRows.size > 1 ? 's' : ''}?
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
    </div>
  )
}
