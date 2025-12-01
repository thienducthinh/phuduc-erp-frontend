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

interface PriceBook {
  id: string
  name: string
  description: string
  currency: string
  itemCount: number
  validFrom: string
  validTo: string
  status: 'Active' | 'Inactive'
}

const mockPriceBooks: PriceBook[] = [
  {
    id: '1',
    name: 'Standard Price Book 2024',
    description: 'Default pricing for all customers',
    currency: 'USD',
    itemCount: 45,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active'
  },
  {
    id: '2',
    name: 'VIP Customer Discount',
    description: 'Special pricing for VIP customers',
    currency: 'USD',
    itemCount: 45,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Seasonal Promotion Q1',
    description: 'Q1 2024 promotional pricing',
    currency: 'USD',
    itemCount: 30,
    validFrom: '2024-01-01',
    validTo: '2024-03-31',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Wholesale Pricing',
    description: 'Bulk order pricing',
    currency: 'USD',
    itemCount: 50,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Legacy Price Book 2023',
    description: 'Previous year pricing',
    currency: 'USD',
    itemCount: 40,
    validFrom: '2023-01-01',
    validTo: '2023-12-31',
    status: 'Inactive'
  }
]

interface PriceBooksProps {
  onOpenDetail: (priceBookId: string) => void
}

export function PriceBooks({ onOpenDetail }: PriceBooksProps) {
  const [priceBooks, setPriceBooks] = useState<PriceBook[]>(mockPriceBooks)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    currency: '',
    status: 'all'
  })

  const filteredPriceBooks = priceBooks.filter(pb => {
    if (filters.name && !pb.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.currency && !pb.currency.toLowerCase().includes(filters.currency.toLowerCase())) return false
    if (filters.status !== 'all' && pb.status !== filters.status) return false
    return true
  })

  const updateFilter = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredPriceBooks.map(pb => pb.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (priceBookId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(priceBookId)
    } else {
      newSelected.delete(priceBookId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setPriceBooks(priceBooks.filter(pb => !selectedRows.has(pb.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Price Books</h2>
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
                      checked={filteredPriceBooks.length > 0 && selectedRows.size === filteredPriceBooks.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <Input
                      placeholder=""
                      value={filters.name}
                      onChange={(e) => updateFilter('name', e.target.value)}
                      className="h-8"
                    />
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2">
                    <Input
                      placeholder=""
                      value={filters.currency}
                      onChange={(e) => updateFilter('currency', e.target.value)}
                      className="h-8 w-20"
                    />
                  </TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                  <TableHead className="py-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPriceBooks.map((pb) => (
                  <TableRow key={pb.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(pb.id)}
                        onCheckedChange={(checked) => handleSelectRow(pb.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Details"
                          onClick={() => onOpenDetail(pb.id)}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{pb.name}</TableCell>
                    <TableCell>{pb.description}</TableCell>
                    <TableCell>{pb.currency}</TableCell>
                    <TableCell>{pb.itemCount}</TableCell>
                    <TableCell>{new Date(pb.validFrom).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(pb.validTo).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={pb.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {pb.status}
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
              Are you sure you want to delete {selectedRows.size} price book{selectedRows.size > 1 ? 's' : ''}?
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
