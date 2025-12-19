import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const salesData = [
  { month: 'Jan', wholesale: 45000, retail: 28000 },
  { month: 'Feb', wholesale: 52000, retail: 32000 },
  { month: 'Mar', wholesale: 48000, retail: 35000 },
  { month: 'Apr', wholesale: 61000, retail: 42000 },
  { month: 'May', wholesale: 55000, retail: 38000 },
  { month: 'Jun', wholesale: 67000, retail: 45000 },
]

const inventoryData = [
  { name: 'In Stock', value: 2400, color: '#22c55e' },
  { name: 'Low Stock', value: 400, color: '#f59e0b' },
  { name: 'Out of Stock', value: 200, color: '#ef4444' },
]

const recentTransactions = [
  { id: 'PO-001', type: 'Purchase', vendor: 'Supplier ABC', amount: 15400, status: 'Pending' },
  { id: 'SO-045', type: 'Sales', customer: 'RetailCorp', amount: 8900, status: 'Shipped' },
  { id: 'PO-002', type: 'Purchase', vendor: 'Global Supply', amount: 22100, status: 'Received' },
  { id: 'SO-046', type: 'Sales', customer: 'Wholesale Hub', amount: 34500, status: 'Delivered' },
]

export function Dashboard() {
  // Purchase Orders data
  const totalPOs = 4
  const totalPOValue = 77450 // Sum of all PO totals from mockPurchaseOrders
  const pendingPOs = 1

  // Sales Orders data
  const totalSOs = 6
  const totalSOValue = 229290 // Sum of all SO totals from mockSalesOrders
  const activeSOs = 4

  return (
    <div className="space-y-6">
      {/* Purchase & Sales Orders Metrics */}
      <div>
        <h3 className="text-lg mb-4">Purchase Orders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total POs</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">🛒</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalPOs}</div>
              <p className="text-xs text-muted-foreground">{pendingPOs} pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total PO Value</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">💵</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">${totalPOValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all purchase orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total SOs</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">💼</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalSOs}</div>
              <p className="text-xs text-muted-foreground">{activeSOs} active orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total SO Value</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">${totalSOValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all sales orders</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="text-lg mb-4">Business Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">$847,200</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Orders</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📋</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">124</div>
              <p className="text-xs text-muted-foreground">8 pending, 116 in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Inventory Items</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📦</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">3,000</div>
              <p className="text-xs text-muted-foreground">200 low stock alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Gross Margin</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">42.8%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Monthly wholesale vs retail sales</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wholesale" fill="#3b82f6" name="Wholesale" />
                <Bar dataKey="retail" fill="#10b981" name="Retail" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current stock levels distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest purchase and sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {transaction.type === 'Purchase' ? '🛒' : '💼'}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.type === 'Purchase' ? transaction.vendor : transaction.customer}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${transaction.amount.toLocaleString()}</p>
                  <p className={`text-sm px-2 py-1 rounded-full ${
                    transaction.status === 'Delivered' || transaction.status === 'Received' 
                      ? 'bg-green-100 text-green-800' 
                      : transaction.status === 'Shipped' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}