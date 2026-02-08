import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { ArrowLeft } from 'lucide-react'

interface CustomerHeader {
  id: string
  customerCode: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  status: 'Active' | 'Inactive' | 'Pending'
  paymentTerms: string
  creditLimit: number
  taxId: string
  notes: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
}

const mockCustomerHeaders: Record<string, CustomerHeader> = {
  'CUST-001': {
    id: 'CUST-001',
    customerCode: 'C001',
    name: 'RetailCorp Inc',
    email: 'contact@retailcorp.com',
    phone: '555-0101',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    status: 'Active',
    paymentTerms: 'Net 30',
    creditLimit: 50000,
    taxId: 'TAX-001',
    notes: 'Preferred customer with high volume orders',
    contactPerson: 'John Doe',
    contactPhone: '555-0111',
    contactEmail: 'john.doe@retailcorp.com'
  },
  'CUST-002': {
    id: 'CUST-002',
    customerCode: 'C002',
    name: 'Wholesale Hub LLC',
    email: 'info@wholesalehub.com',
    phone: '555-0102',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    status: 'Active',
    paymentTerms: 'Net 45',
    creditLimit: 75000,
    taxId: 'TAX-002',
    notes: 'Long-term partner',
    contactPerson: 'Jane Smith',
    contactPhone: '555-0112',
    contactEmail: 'jane.smith@wholesalehub.com'
  }
}

const emptyCustomerHeader: CustomerHeader = {
  id: '',
  customerCode: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  status: 'Active',
  paymentTerms: 'Net 30',
  creditLimit: 0,
  taxId: '',
  notes: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: ''
}

interface CustomerDetailProps {
  customerId: string
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const [header, setHeader] = useState<CustomerHeader>(
    customerId === 'new' ? emptyCustomerHeader : (mockCustomerHeaders[customerId] || emptyCustomerHeader)
  )
  const [isEditing, setIsEditing] = useState(customerId === 'new')

  useEffect(() => {
    const newHeader = customerId === 'new' ? emptyCustomerHeader : (mockCustomerHeaders[customerId] || emptyCustomerHeader)
    setHeader(newHeader)
    setIsEditing(customerId === 'new')
  }, [customerId])

  const handleSave = () => {
    console.log('Saving customer:', header)
    setIsEditing(false)
    // TODO: Implement actual save logic
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{customerId === 'new' ? 'New Customer' : header.name}</h2>
          <p className="text-gray-600">{header.customerCode}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Customer Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerCode">Customer Code</Label>
              <Input
                id="customerCode"
                value={header.customerCode}
                onChange={(e) => setHeader({...header, customerCode: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={header.status} onValueChange={(value) => setHeader({...header, status: value as any})} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={header.name}
                onChange={(e) => setHeader({...header, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={header.email}
                onChange={(e) => setHeader({...header, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={header.phone}
                onChange={(e) => setHeader({...header, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={header.taxId}
                onChange={(e) => setHeader({...header, taxId: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={header.address}
                onChange={(e) => setHeader({...header, address: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={header.city}
                onChange={(e) => setHeader({...header, city: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={header.state}
                onChange={(e) => setHeader({...header, state: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={header.zipCode}
                onChange={(e) => setHeader({...header, zipCode: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={header.country}
                onChange={(e) => setHeader({...header, country: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment & Credit Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment & Credit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={header.paymentTerms} onValueChange={(value) => setHeader({...header, paymentTerms: value})} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 45">Net 45</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditLimit">Credit Limit</Label>
              <Input
                id="creditLimit"
                type="number"
                value={header.creditLimit}
                onChange={(e) => setHeader({...header, creditLimit: parseFloat(e.target.value) || 0})}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={header.contactPerson}
                onChange={(e) => setHeader({...header, contactPerson: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={header.contactEmail}
                onChange={(e) => setHeader({...header, contactEmail: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={header.contactPhone}
                onChange={(e) => setHeader({...header, contactPhone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={header.notes}
            onChange={(e) => setHeader({...header, notes: e.target.value})}
            disabled={!isEditing}
            rows={4}
            placeholder="Add any additional notes about this customer..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
