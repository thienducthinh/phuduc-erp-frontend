import { useState } from 'react'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Badge } from '../../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
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
import { Plus, ArrowRight, Trash2, Binoculars } from 'lucide-react'

interface Route {
  id: string
  routeCode: string
  origin: string
  destination: string
  distance: number
  estimatedTime: string
  status: 'Active' | 'Inactive' | 'Paused' | 'Archived'
  shipmentsCount: number
  lastUpdated: string
}

const mockRoutes: Route[] = [
  {
    id: 'RT-001',
    routeCode: 'RT001',
    origin: 'New York',
    destination: 'Boston',
    distance: 215,
    estimatedTime: '4h 30m',
    status: 'Active',
    shipmentsCount: 12,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'RT-002',
    routeCode: 'RT002',
    origin: 'Los Angeles',
    destination: 'San Francisco',
    distance: 380,
    estimatedTime: '6h 15m',
    status: 'Active',
    shipmentsCount: 8,
    lastUpdated: '2024-01-12'
  },
  {
    id: 'RT-003',
    routeCode: 'RT003',
    origin: 'Chicago',
    destination: 'Detroit',
    distance: 280,
    estimatedTime: '5h 00m',
    status: 'Paused',
    shipmentsCount: 0,
    lastUpdated: '2024-01-10'
  },
  {
    id: 'RT-004',
    routeCode: 'RT004',
    origin: 'Houston',
    destination: 'Dallas',
    distance: 240,
    estimatedTime: '4h 45m',
    status: 'Active',
    shipmentsCount: 15,
    lastUpdated: '2024-01-08'
  },
]

interface RouteDetail {
  onOpenDetail: (routeId: string) => void
}

export function Routes({ onOpenDetail }: RouteDetail) {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLookupDialog, setShowLookupDialog] = useState(false)
  const [lookupRouteNumber, setLookupRouteNumber] = useState('')
  const [filters, setFilters] = useState({
    id: '',
    origin: '',
    destination: '',
    status: 'all',
    shipmentsCount: '',
    distance: ''
  })
  const [filterOperators, setFilterOperators] = useState({
    id: 'contains',
    origin: 'contains',
    destination: 'contains',
    shipmentsCount: 'equals',
    distance: 'equals'
  })

  const applyFilter = (value: any, filterValue: string, operator: string) => {
    if (!filterValue) return true
    const val = value.toString().toLowerCase()
    const filter = filterValue.toLowerCase()

    switch (operator) {
      case 'equals':
        return val === filter
      case 'notEquals':
        return val !== filter
      case 'contains':
        return val.includes(filter)
      case 'startsWith':
        return val.startsWith(filter)
      case 'endsWith':
        return val.endsWith(filter)
      case 'greaterThan':
        return parseFloat(val) > parseFloat(filter)
      case 'greaterThanOrEqual':
        return parseFloat(val) >= parseFloat(filter)
      case 'lessThan':
        return parseFloat(val) < parseFloat(filter)
      case 'lessThanOrEqual':
        return parseFloat(val) <= parseFloat(filter)
      default:
        return true
    }
  }

  const filteredRoutes = routes.filter(route => {
    return (
      applyFilter(route.id, filters.id, filterOperators.id) &&
      applyFilter(route.origin, filters.origin, filterOperators.origin) &&
      applyFilter(route.destination, filters.destination, filterOperators.destination) &&
      (filters.status === 'all' || route.status.toLowerCase() === filters.status.toLowerCase()) &&
      applyFilter(route.shipmentsCount, filters.shipmentsCount, filterOperators.shipmentsCount) &&
      applyFilter(route.distance, filters.distance, filterOperators.distance)
    )
  })

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const updateOperator = (key: string, operator: string) => {
    setFilterOperators(prev => ({ ...prev, [key]: operator }))
  }

  const handleStatusChange = (routeId: string, newStatus: Route['status']) => {
    setRoutes(routes.map(route =>
      route.id === routeId ? { ...route, status: newStatus } : route
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Paused': return 'bg-yellow-100 text-yellow-800'
      case 'Archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredRoutes.map(route => route.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (routeId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(routeId)
    } else {
      newSelected.delete(routeId)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setRoutes(routes.filter(route => !selectedRows.has(route.id)))
    setSelectedRows(new Set())
    setShowDeleteDialog(false)
  }

  const handleLookupClick = () => {
    setLookupRouteNumber('')
    setShowLookupDialog(true)
  }

  const handleConfirmLookup = () => {
    const routeNumber = lookupRouteNumber.trim()
    if (!routeNumber) return

    const route = routes.find(route =>
      route.id.toLowerCase() === routeNumber.toLowerCase()
    )

    if (route) {
      onOpenDetail(route.id)
      setShowLookupDialog(false)
      setLookupRouteNumber('')
    } else {
      alert(`Route "${routeNumber}" not found.`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-4">Routes</h2>
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
          <Button variant="outline" size="sm" onClick={handleLookupClick}>
            <Binoculars className="w-4 h-4 mr-2" />
            Binoculars
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredRoutes.length > 0 && selectedRows.size === filteredRoutes.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-8"></TableHead>
                <TableHead>Route ID</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Distance (km)</TableHead>
                <TableHead>Estimated Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shipments</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="py-2"></TableHead>
                <TableHead className="py-2"></TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.id} onValueChange={(value) => updateOperator('id', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.id}
                      onChange={(e) => updateFilter('id', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.origin} onValueChange={(value) => updateOperator('origin', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.origin}
                      onChange={(e) => updateFilter('origin', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.destination} onValueChange={(value) => updateOperator('destination', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts With</SelectItem>
                        <SelectItem value="endsWith">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.destination}
                      onChange={(e) => updateFilter('destination', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.distance} onValueChange={(value) => updateOperator('distance', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="greaterThan">Greater Than</SelectItem>
                        <SelectItem value="greaterThanOrEqual">Greater Than or Equal</SelectItem>
                        <SelectItem value="lessThan">Less Than</SelectItem>
                        <SelectItem value="lessThanOrEqual">Less Than or Equal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.distance}
                      onChange={(e) => updateFilter('distance', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2"></TableHead>
                <TableHead className="py-2">
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="py-2">
                  <div className="flex gap-1 items-center">
                    <Select value={filterOperators.shipmentsCount} onValueChange={(value) => updateOperator('shipmentsCount', value)}>
                      <SelectTrigger className="h-8 w-8 px-2">
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Does Not Equal</SelectItem>
                        <SelectItem value="greaterThan">Greater Than</SelectItem>
                        <SelectItem value="greaterThanOrEqual">Greater Than or Equal</SelectItem>
                        <SelectItem value="lessThan">Less Than</SelectItem>
                        <SelectItem value="lessThanOrEqual">Less Than or Equal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder=""
                      value={filters.shipmentsCount}
                      onChange={(e) => updateFilter('shipmentsCount', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(route.id)}
                      onCheckedChange={(checked) => handleSelectRow(route.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Details"
                        onClick={() => onOpenDetail(route.id)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{route.id}</TableCell>
                  <TableCell>{route.origin}</TableCell>
                  <TableCell>{route.destination}</TableCell>
                  <TableCell>{route.distance}</TableCell>
                  <TableCell>{route.estimatedTime}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(route.status)}>
                      {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{route.shipmentsCount}</TableCell>
                  <TableCell>{new Date(route.lastUpdated).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRows.size} route{selectedRows.size > 1 ? 's' : ''}?
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

      <AlertDialog open={showLookupDialog} onOpenChange={setShowLookupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Search Route</AlertDialogTitle>
            <AlertDialogDescription>
              Enter route ID to open details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter route ID"
              value={lookupRouteNumber}
              onChange={(e) => setLookupRouteNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmLookup()
                }
              }}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLookup} className="bg-blue-600 hover:bg-blue-700">
              Search
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
