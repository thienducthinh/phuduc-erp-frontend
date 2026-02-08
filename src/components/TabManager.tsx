import { useState } from 'react'
import { X, BarChart3, ShoppingCart, TrendingUp, Package, Users, Truck } from 'lucide-react'
import { cn } from './ui/utils'

export interface Tab {
  id: string
  title: string
  component: 'dashboard' | 'purchase-orders' | 'sales-orders' | 'inventory' | 'inventory-on-hand' | 'inventory-transactions' | 'inventory-adjustment' | 'access-distribution' | 'purchase-order' | 'sales-order' | 'items' | 'item' | 'item-categories' | 'item-category' | 'item-brands' | 'item-brand' | 'price-books' | 'price-book' | 'logistics' | 'routes' | 'pick-list-by-route' | 'route' | 'suppliers' | 'supplier' | 'customers' | 'customer'
  icon: any
  closable: boolean
  orderId?: string
}

interface TabManagerProps {
  tabs: Tab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
  onTabClose: (tabId: string) => void
}

export function TabManager({ tabs, activeTabId, onTabChange, onTabClose }: TabManagerProps) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTab(tabId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault()
    if (draggedTab && draggedTab !== targetTabId) {
      // Implement tab reordering logic here if needed
      console.log(`Move tab ${draggedTab} to position of ${targetTabId}`)
    }
    setDraggedTab(null)
  }

  return (
    <div className="flex items-center bg-gray-100 border-b overflow-x-auto scrollbar-thin sticky top-0 z-20">
      <div className="flex items-center min-w-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center min-w-[120px] max-w-[200px] border-r border-gray-200 bg-white relative flex-shrink-0 shadow-sm",
              activeTabId === tab.id && "bg-blue-50 border-b-2 border-b-blue-500 shadow-md"
            )}
            draggable
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tab.id)}
          >
            <button
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 text-sm min-w-0 flex-1 hover:bg-gray-50 transition-colors",
                activeTabId === tab.id && "text-blue-600 font-medium hover:bg-blue-50"
              )}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{tab.title}</span>
            </button>
            {tab.closable && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
                className="flex-shrink-0 p-1.5 mr-1 hover:bg-gray-200 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export const availableModules = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    component: 'dashboard' as const,
    icon: BarChart3,
    requiredRole: null
  },
  {
    id: 'purchase-orders',
    title: 'Purchase Orders',
    component: 'purchase-orders' as const,
    icon: ShoppingCart,
    requiredRole: null
  },
  {
    id: 'sales-orders',
    title: 'Sales Orders',
    component: 'sales-orders' as const,
    icon: TrendingUp,
    requiredRole: null
  },
  {
    id: 'inventory',
    title: 'Inventory',
    component: 'inventory' as const,
    icon: Package,
    requiredRole: null
  },
  {
    id: 'access-distribution',
    title: 'Access Distribution',
    component: 'access-distribution' as const,
    icon: Users,
    requiredRole: 'admin' as const
  },
  {
    id: 'logistics',
    title: 'Logistics',
    component: 'logistics' as const,
    icon: Truck,
    requiredRole: null
  },
  {
    id: 'routes',
    title: 'Routes',
    component: 'routes' as const,
    icon: Truck,
    requiredRole: null
  }
]