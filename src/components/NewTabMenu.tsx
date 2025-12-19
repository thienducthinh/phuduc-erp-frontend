import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { availableModules } from './TabManager'

interface NewTabMenuProps {
  onSelectModule: (moduleId: string) => void
  userRole: 'admin' | 'user'
  isOpen: boolean
  onClose: () => void
}

export function NewTabMenu({ onSelectModule, userRole, isOpen, onClose }: NewTabMenuProps) {
  if (!isOpen) return null

  const filteredModules = availableModules.filter(module => 
    !module.requiredRole || module.requiredRole === userRole
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg">Open New Tab</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredModules.map((module) => (
              <button
                key={module.id}
                onClick={() => {
                  onSelectModule(module.id)
                  onClose()
                }}
                className="flex flex-col items-center gap-3 p-6 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <module.icon className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium">{module.title}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}