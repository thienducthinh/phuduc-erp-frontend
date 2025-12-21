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

interface ItemCategory {
  id: string
  code: string
  name: string
  description: string
  itemCount: number
  status: 'Active' | 'Inactive'
}

const mockCategories: ItemCategory[] = [
  {
    id: '1',
    code: 'CAT001',
    name: 'Electronics',
    description: 'Electronic devices and components',
    itemCount: 125,
    status: 'Active'
  },
  {
    id: '2',
    code: 'CAT002',
    name: 'Accessories',
    description: 'Computer and electronic accessories',
    itemCount: 89,
    status: 'Active'
  },
  {
    id: '3',
    code: 'CAT003',
    name: 'Cables',
    description: 'Various types of cables and connectors',
    itemCount: 45,
    status: 'Active'
  },
  {
    id: '4',
    code: 'CAT004',
    name: 'Office Supplies',
    description: 'General office supplies and stationery',
    itemCount: 67,
    status: 'Active'
  },
  {
    id: '5',
    code: 'CAT005',
    name: 'Furniture',
    description: 'Office and workstation furniture',
    itemCount: 23,
    status: 'Inactive'
  }
]

interface ItemCategoriesProps {
  onOpenDetail: (categoryId: string) => void
}

export function ItemCategories({ onOpenDetail }: ItemCategoriesProps) {
  const [categories, setCategories] = useState<ItemCategory[]>(mockCategories)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    description: '',
    status: 'all'
  })

  const filteredCategories = categories.filter(category => {
    if (filters.code && !category.code.toLowerCase().includes(filters.code.toLowerCase())) return false
    if (filters.name && !category.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.description && !category.description.toLowerCase().includes(filters.description.toLowerCase())) return false
    if (filters.status !== 'all' && category.status !== filters.status) return false
    return true
  })

  const updateFilter = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredCategories.map(category => category.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (categoryId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(categoryId)
    } else {
      newSelected.delete(categoryId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setCategories(categories.filter(category => !selectedRows.has(category.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Item Categories</h2>
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
                      checked={filteredCategories.length > 0 && selectedRows.size === filteredCategories.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
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
                      value={filters.description}
                      onChange={(e) => updateFilter('description', e.target.value)}
                      className="h-8"
                    />
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(category.id)}
                        onCheckedChange={(checked) => handleSelectRow(category.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Details"
                          onClick={() => onOpenDetail(category.id)}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.code}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.itemCount}</TableCell>
                    <TableCell>
                      <Badge className={category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {category.status}
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
              Are you sure you want to delete {selectedRows.size} categor{selectedRows.size > 1 ? 'ies' : 'y'}?
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
