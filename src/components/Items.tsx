import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog'
import { Plus, ArrowRight, Trash2, Save, RefreshCw } from 'lucide-react'

interface Item {
  id: string
  code: string
  name: string
  category: string
  unitPrice: number
  stock: number
  status: 'Active' | 'Inactive'
}

const mockItems: Item[] = [
  {
    id: '1',
    code: 'ITEM001',
    name: 'Business Laptop Pro 15"',
    category: 'Electronics',
    unitPrice: 1200.00,
    stock: 25,
    status: 'Active'
  },
  {
    id: '2',
    code: 'ITEM002',
    name: '27" 4K Monitor',
    category: 'Electronics',
    unitPrice: 350.00,
    stock: 45,
    status: 'Active'
  },
  {
    id: '3',
    code: 'ITEM003',
    name: 'Wireless Mouse with USB-C',
    category: 'Accessories',
    unitPrice: 35.00,
    stock: 150,
    status: 'Active'
  },
  {
    id: '4',
    code: 'ITEM004',
    name: 'Mechanical Keyboard RGB',
    category: 'Accessories',
    unitPrice: 89.00,
    stock: 80,
    status: 'Active'
  },
  {
    id: '5',
    code: 'ITEM005',
    name: 'USB-C to HDMI Cable 2m',
    category: 'Cables',
    unitPrice: 25.00,
    stock: 200,
    status: 'Inactive'
  }
]

interface ItemsProps {
  onOpenDetail: (itemId: string) => void
}

export function Items({ onOpenDetail }: ItemsProps) {
  const [items, setItems] = useState<Item[]>(mockItems)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    category: '',
    status: 'all'
  })

  const filteredItems = items.filter(item => {
    if (filters.code && !item.code.toLowerCase().includes(filters.code.toLowerCase())) return false
    if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.category && !item.category.toLowerCase().includes(filters.category.toLowerCase())) return false
    if (filters.status !== 'all' && item.status !== filters.status) return false
    return true
  })

  const updateFilter = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredItems.map(item => item.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setItems(items.filter(item => !selectedRows.has(item.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Items Master</h2>
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
                      checked={filteredItems.length > 0 && selectedRows.size === filteredItems.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Stock</TableHead>
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
                      value={filters.category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      className="h-8"
                    />
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(item.id)}
                        onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Details"
                          onClick={() => onOpenDetail(item.id)}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      <Badge className={item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {item.status}
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
              Are you sure you want to delete {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''}?
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
