import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Building2, User as UserIcon, Lock } from 'lucide-react'

interface MockUser {
  id: string
  username: string
  password: string
  role: 'admin' | 'user'
  name: string
  department: string
}

interface User {
  id: string
  username: string
  role: 'admin' | 'user'
  name: string
  department: string
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
    department: 'IT'
  },
  {
    id: '2',
    username: 'john.doe',
    password: 'password123',
    role: 'user',
    name: 'John Doe',
    department: 'Procurement'
  },
  {
    id: '3',
    username: 'jane.smith',
    password: 'password123',
    role: 'user',
    name: 'Jane Smith',
    department: 'Sales'
  },
  {
    id: '4',
    username: 'mike.wilson',
    password: 'password123',
    role: 'user',
    name: 'Mike Wilson',
    department: 'Inventory'
  }
]

interface LoginProps {
  onLogin: (user: User) => void
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser = mockUsers.find(u => u.username === username && u.password === password)

    if (mockUser) {
      // Exclude password from the user object
      const { password: _, ...user } = mockUser
      onLogin(user)
    } else {
      setError('Invalid username or password')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl">Infor Baan LN ERP</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the ERP system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">Test Credentials:</p>
              <div className="space-y-1 text-xs bg-gray-50 p-3 rounded">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>User:</strong> john.doe / password123</p>
                <p><strong>User:</strong> jane.smith / password123</p>
                <p><strong>User:</strong> mike.wilson / password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}