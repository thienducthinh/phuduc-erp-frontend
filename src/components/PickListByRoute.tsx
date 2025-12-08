import { useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus, ArrowRight, Printer } from 'lucide-react'

interface PickListItem {
  id: string
  itemCode: string
  itemName: string
  quantity: number
  location: string
  picked: boolean
  weight: number
}

interface PickList {
  id: string
  routeId: string
  routeName: string
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold'
  createdDate: string
  items: PickListItem[]
  totalItems: number
  pickedItems: number
}

const mockPickLists: PickList[] = [
  {
    id: 'PL-001',
    routeId: 'RT-001',
    routeName: 'New York to Boston',
    status: 'In Progress',
    createdDate: '2024-01-15',
    items: [
      { id: 'PLI-001', itemCode: 'ITEM-001', itemName: 'Widget A', quantity: 5, location: 'A-01-01', picked: true, weight: 2.5 },
      { id: 'PLI-002', itemCode: 'ITEM-002', itemName: 'Widget B', quantity: 10, location: 'B-02-03', picked: false, weight: 3.2 },
      { id: 'PLI-003', itemCode: 'ITEM-003', itemName: 'Gadget C', quantity: 3, location: 'C-03-02', picked: true, weight: 1.8 }
    ],
    totalItems: 3,
    pickedItems: 2
  },
  {
    id: 'PL-002',
    routeId: 'RT-002',
    routeName: 'Los Angeles to San Francisco',
    status: 'Pending',
    createdDate: '2024-01-14',
    items: [
      { id: 'PLI-004', itemCode: 'ITEM-004', itemName: 'Widget D', quantity: 8, location: 'A-01-02', picked: false, weight: 2.1 },
      { id: 'PLI-005', itemCode: 'ITEM-005', itemName: 'Gadget E', quantity: 2, location: 'D-04-01', picked: false, weight: 0.9 }
    ],
    totalItems: 2,
    pickedItems: 0
  },
  {
    id: 'PL-003',
    routeId: 'RT-003',
    routeName: 'Chicago to Detroit',
    status: 'Completed',
    createdDate: '2024-01-13',
    items: [
      { id: 'PLI-006', itemCode: 'ITEM-006', itemName: 'Widget F', quantity: 12, location: 'A-01-03', picked: true, weight: 4.5 },
      { id: 'PLI-007', itemCode: 'ITEM-007', itemName: 'Gadget G', quantity: 4, location: 'E-05-01', picked: true, weight: 1.6 }
    ],
    totalItems: 2,
    pickedItems: 2
  },
  {
    id: 'PL-004',
    routeId: 'RT-004',
    routeName: 'Houston to Dallas',
    status: 'In Progress',
    createdDate: '2024-01-12',
    items: [
      { id: 'PLI-008', itemCode: 'ITEM-008', itemName: 'Widget H', quantity: 6, location: 'B-02-01', picked: true, weight: 2.8 },
      { id: 'PLI-009', itemCode: 'ITEM-009', itemName: 'Gadget I', quantity: 9, location: 'F-06-02', picked: true, weight: 3.5 },
      { id: 'PLI-010', itemCode: 'ITEM-010', itemName: 'Widget J', quantity: 3, location: 'A-01-04', picked: false, weight: 1.2 }
    ],
    totalItems: 3,
    pickedItems: 2
  }
]

interface PickListByRouteProps {
  onOpenDetail: (pickListId: string) => void
}

export function PickListByRoute({ onOpenDetail }: PickListByRouteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pickLists, setPickLists] = useState<PickList[]>(mockPickLists)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredPickLists = pickLists.filter(pickList => {
    const matchesSearch = pickList.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pickList.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pickList.routeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || pickList.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleTogglePicked = (pickListId: string, itemId: string) => {
    setPickLists(pickLists.map(pl => {
      if (pl.id === pickListId) {
        const updatedItems = pl.items.map(item =>
          item.id === itemId ? { ...item, picked: !item.picked } : item
        )
        const pickedCount = updatedItems.filter(i => i.picked).length
        return { ...pl, items: updatedItems, pickedItems: pickedCount }
      }
      return pl
    }))
  }

  const calculateTotalWeight = (items: PickListItem[]) => {
    return items.reduce((total, item) => total + item.weight * item.quantity, 0).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Pick List by Route</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Pick List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <Input
              placeholder="Search by route, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPickLists.map((pickList) => (
              <div key={pickList.id} className="border rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleExpanded(pickList.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <h3 className="font-medium">{pickList.id}</h3>
                      <p className="text-sm text-gray-600">{pickList.routeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{pickList.totalItems} items</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenDetail(pickList.id)
                      }}
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {expandedId === pickList.id && (
                  <div className="p-4 bg-white border-t">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8"></TableHead>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Weight (kg)</TableHead>
                          <TableHead>Location</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pickList.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={item.picked}
                                onChange={() => handleTogglePicked(pickList.id, item.id)}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{item.itemCode}</TableCell>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.weight}</TableCell>
                            <TableCell>{item.location}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-medium bg-gray-50">
                          <TableCell colSpan={4} className="text-right">Total Weight:</TableCell>
                          <TableCell>{calculateTotalWeight(pickList.items)} kg</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
