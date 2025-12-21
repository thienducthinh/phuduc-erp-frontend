import { useState, useEffect } from 'react'
import './styles/globals.css'
import { Button } from './components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarInset } from './components/ui/sidebar'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import { PurchaseOrders } from './components/functions/purchasing/PurchaseOrders'
import { SalesOrders } from './components/functions/sales/SalesOrders'
import { Inventory } from './components/Inventory'
import { AccessDistribution } from './components/AccessDistribution'
import { PurchaseOrderDetail } from './components/functions/purchasing/PurchaseOrderDetail'
import { SalesOrderDetail } from './components/functions/sales/SalesOrderDetail'
import { PickListByRoute } from './components/functions/logistics/PickListByRoute'
import { Items } from './components/functions/items/Items'
import { ItemDetail } from './components/functions/items/ItemDetail'
import { ItemCategories } from './components/functions/items/ItemCategories'
import { ItemCategoryDetail } from './components/functions/items/ItemCategoryDetail'
import { ItemBrands } from './components/functions/items/ItemBrands'
import { ItemBrandDetail } from './components/functions/items/ItemBrandDetail'
import { PriceBooks } from './components/functions/price_book/PriceBooks'
import { PriceBookDetail } from './components/functions/price_book/PriceBookDetail'
import { Routes } from './components/functions/logistics/Routes'
import { RouteDetail } from './components/functions/logistics/RouteDetail'
import { TabManager, Tab } from './components/TabManager'
import { User as UserIcon, LogOut, Building2, BarChart3, ShoppingCart, TrendingUp, Package, Users, ChevronDown, ChevronRight, DollarSign, Truck } from 'lucide-react'
import { sub } from 'date-fns'

interface User {
  id: string
  username: string
  role: 'admin' | 'user'
  name: string
  department: string
}

let tabIdCounter = 1

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    component: 'dashboard' as const
  },
  {
    id: "items",
    label: "Sản phẩm",
    icon: Package,
    subItems: [
      {
        id: 'items-list',
        label: 'Danh sách sản phẩm',
        component: 'items' as const
      },
      {
        id: 'item-detail',
        label: 'Sản phẩm chi tiết',
        component: 'item' as const
      },
      {
        id: 'item-categories',
        label: 'Danh mục sản phẩm',
        component: 'item-categories' as const
      },
      {        
        id: 'item-category-detail',
        label: 'Danh mục sản phẩm chi tiết',
        component: 'item-category' as const
      },
      {
        id: 'item-brands',
        label: 'Thương hiệu sản phẩm',
        component: 'item-brands' as const
      },
      {        
        id: 'item-brand-detail',
        label: 'Thương hiệu sản phẩm chi tiết',
        component: 'item-brand' as const
      }
    ] 
  },
  {
    id: 'purchase-orders',
    label: 'Mua hàng',
    icon: ShoppingCart,
    subItems: [
      {
        id: 'purchase-orders-list',
        label: 'Đơn mua hàng',
        component: 'purchase-orders' as const
      },
      {
        id: 'purchase-order-new',
        label: 'Đơn mua hàng chi tiết',
        component: 'purchase-order' as const
      }
    ]
  },
  {
    id: 'sales-orders',
    label: 'Bán hàng',
    icon: TrendingUp,
    subItems: [
      {
        id: 'sales-orders-list',
        label: 'Đơn bán hàng',
        component: 'sales-orders' as const
      },
      {
        id: 'sales-order-new',
        label: 'Đơn bán hàng chi tiết',
        component: 'sales-order' as const
      },
      {
        id: 'pick-list-by-route',
        label: 'Pick List by Route',
        component: 'pick-list-by-route' as const
      }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    subItems: [
      {
        id: 'inventory-on-hand',
        label: 'Inventory On Hand',
        component: 'inventory-on-hand' as const
      },
      {
        id: 'inventory-transactions',
        label: 'Transactions',
        component: 'inventory-transactions' as const
      },
      {
        id: 'inventory-adjustment',
        label: 'Adjustment',
        component: 'inventory-adjustment' as const
      }
    ]
  },
  {
    id: 'price-books',
    label: 'Price Books',
    icon: DollarSign,
    subItems: [
      {
        id: 'price-books-list',
        label: 'Price Book List',
        component: 'price-books' as const
      },
      {
        id: 'price-book-new',
        label: 'New Price Book',
        component: 'price-book' as const
      }
    ]
  },
  {
    id: 'logistics',
    label: 'Logistics',
    icon: Truck,
    subItems: [
      {
        id: 'routes-list',
        label: 'Routes',
        component: 'routes' as const
      }
    ]
  }
]

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user from localStorage on initial load
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Initialize with dashboard tab when user logs in
    if (user && tabs.length === 0) {
      const dashboardTab: Tab = {
        id: `tab-${tabIdCounter++}`,
        title: 'Dashboard',
        component: 'dashboard',
        icon: BarChart3,
        closable: false
      }
      setTabs([dashboardTab])
      setActiveTabId(dashboardTab.id)
    }
  }, [user, tabs.length])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    // Persist user to localStorage
    localStorage.setItem('user', JSON.stringify(loggedInUser))
  }

  const handleLogout = () => {
    setUser(null)
    setTabs([])
    setActiveTabId('')
    // Clear user from localStorage
    localStorage.removeItem('user')
  }

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId)
  }

  const handleTabClose = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)

    if (activeTabId === tabId && newTabs.length > 0) {
      const firstTab = newTabs[0]
      if (firstTab) {
        setActiveTabId(firstTab.id)
      }
    }
  }

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }

  const handleMenuClick = (itemId: string, component?: string, label?: string, icon?: any) => {
    if (itemId === 'access-distribution') {
      // Check if tab already exists
      const existingTab = tabs.find(tab => tab.component === 'access-distribution')
      if (existingTab) {
        setActiveTabId(existingTab.id)
        return
      }

      const newTab: Tab = {
        id: `tab-${tabIdCounter++}`,
        title: 'Access Distribution',
        component: 'access-distribution',
        icon: Users,
        closable: true
      }

      setTabs([...tabs, newTab])
      setActiveTabId(newTab.id)
      return
    }

    // Handle sub-items that pass component directly
    if (component) {
      let title = label || ''
      let orderId: string | undefined = undefined

      if (component === 'purchase-order' || component === 'sales-order' || component === 'item' || component === 'price-book') {
        orderId = 'new'
      }

      // Check if tab already exists
      const existingTab = tabs.find(tab => {
        if (orderId) {
          return tab.component === component && tab.orderId === orderId
        }
        return tab.component === component
      })

      if (existingTab) {
        setActiveTabId(existingTab.id)
        return
      }

      const newTab: Tab = {
        id: `tab-${tabIdCounter++}`,
        title,
        component: component as any,
        icon: icon || (component === 'purchase-order' ? ShoppingCart : component === 'sales-order' ? TrendingUp : component === 'price-book' ? DollarSign : Package),
        closable: true,
        ...(orderId && { orderId })
      }

      setTabs([...tabs, newTab])
      setActiveTabId(newTab.id)
      return
    }

    const item = navigationItems.find(nav => nav.id === itemId)
    if (!item) return

    // If item has sub-items, toggle the dropdown instead of opening a tab
    if (item.subItems) {
      toggleMenu(itemId)
      return
    }

    // Check if tab already exists
    const existingTab = tabs.find(tab => tab.component === item.component)
    if (existingTab) {
      setActiveTabId(existingTab.id)
      return
    }

    const newTab: Tab = {
      id: `tab-${tabIdCounter++}`,
      title: item.label,
      component: item.component,
      icon: item.icon,
      closable: item.id !== 'dashboard'
    }

    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
  }

  const handleOpenDetailTab = (type: 'purchase-order' | 'sales-order' | 'item' | 'price-book' | 'route' | 'item-category' | 'item-brand', id: string) => {
    let title = ''
    let icon = ShoppingCart

    switch (type) {
      case 'purchase-order':
        title = 'Purchase Order Detail'
        icon = ShoppingCart
        break
      case 'sales-order':
        title = 'Sales Order Detail'
        icon = TrendingUp
        break
      case 'item':
        title = 'Item Details'
        icon = Package
        break
      case 'item-category':
        title = 'Item Category Details'
        icon = Package
        break
      case 'item-brand':
        title = 'Item Brand Details'
        icon = Package
        break
      case 'price-book':
        title = 'Price Book Details'
        icon = DollarSign
        break
      case 'route':
        title = 'Route Details'
        icon = Truck
        break
    }

    // Check if a detail tab of this type already exists (regardless of which item)
    const existingTabIndex = tabs.findIndex(tab => tab.component === type)

    if (existingTabIndex !== -1) {
      // Update the existing tab with new id and title
      const existingTab = tabs[existingTabIndex]!
      const updatedTabs = [...tabs]
      updatedTabs[existingTabIndex] = {
        id: existingTab.id,
        title,
        component: existingTab.component,
        icon: existingTab.icon,
        closable: existingTab.closable,
        orderId: id
      }
      setTabs(updatedTabs)
      setActiveTabId(existingTab.id)
      return
    }

    // Create new tab if none exists
    const newTab: Tab = {
      id: `tab-${tabIdCounter++}`,
      title,
      component: type,
      icon: icon,
      closable: true,
      orderId: id
    }

    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
  }

  const renderTabContent = () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId)
    if (!activeTab) return null

    switch (activeTab.component) {
      case 'dashboard':
        return <Dashboard />
      case 'items':
        return <Items onOpenDetail={(itemId) => handleOpenDetailTab('item', itemId)} />
      case 'item-categories':
        return <ItemCategories onOpenDetail={(categoryId) => handleOpenDetailTab('item-category', categoryId)} />
      case 'item-brands':
        return <ItemBrands onOpenDetail={(brandId) => handleOpenDetailTab('item-brand', brandId)} />
      case 'purchase-orders':
        return <PurchaseOrders onOpenDetail={(orderId) => handleOpenDetailTab('purchase-order', orderId)} />
      case 'sales-orders':
        return <SalesOrders onOpenDetail={(orderId) => handleOpenDetailTab('sales-order', orderId)} />
      case 'pick-list-by-route':
        return <PickListByRoute onOpenDetail={(pickListId) => handleOpenDetailTab('sales-order', pickListId)} />
      case 'price-books':
        return <PriceBooks onOpenDetail={(priceBookId) => handleOpenDetailTab('price-book', priceBookId)} />
      case 'routes':
        return <Routes onOpenDetail={(routeId) => handleOpenDetailTab('route', routeId)} />
      case 'inventory':
        return <Inventory />
      case 'inventory-on-hand':
        return <Inventory />
      case 'inventory-transactions':
        return <Inventory />
      case 'inventory-adjustment':
        return <Inventory />
      case 'access-distribution':
        return <AccessDistribution />
      case 'item':
        return <ItemDetail itemId={activeTab.orderId!} />
      case 'item-category':
        return <ItemCategoryDetail categoryId={activeTab.orderId!} />
      case 'item-brand':
        return <ItemBrandDetail brandId={activeTab.orderId!} />
      case 'purchase-order':
        return <PurchaseOrderDetail orderId={activeTab.orderId!} />
      case 'sales-order':
        return <SalesOrderDetail orderId={activeTab.orderId!} />
      case 'price-book':
        return <PriceBookDetail priceBookId={activeTab.orderId!} />
      case 'route':
        return <RouteDetail routeId={activeTab.orderId!} />
      default:
        return <Dashboard />
    }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar collapsible="none">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg">Phú Đức</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-4 py-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {item.subItems ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => handleMenuClick(item.id)}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {openMenus.has(item.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </SidebarMenuButton>
                      {openMenus.has(item.id) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuButton
                              key={subItem.id}
                              onClick={() => handleMenuClick(subItem.id, subItem.component, subItem.label, item.icon)}
                              className="w-full text-sm"
                            >
                              <span>{subItem.label}</span>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      className="w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
              {user?.role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick('access-distribution')}
                    className="w-full"
                  >
                    <Users className="w-4 h-4" />
                    <span>Access Distribution</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset>
          <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-600 text-white border-b">
              <div className="flex items-center gap-4">
                <h1 className="text-lg">ERP System</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.name}</span>
                  <span className="text-blue-200">({user.role})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-700"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </header>

            {/* Tab Manager */}
            <TabManager
              tabs={tabs}
              activeTabId={activeTabId}
              onTabChange={handleTabChange}
              onTabClose={handleTabClose}
            />

            {/* Content Area */}
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
              {renderTabContent()}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}