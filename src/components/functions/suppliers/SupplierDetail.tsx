import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { ArrowLeft } from 'lucide-react'

interface SupplierHeader {
  id: string
  supplierCode: string
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
  taxId: string
  notes: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  bankAccount: string
  bankName: string
}

const mockSupplierHeaders: Record<string, SupplierHeader> = {
  'SUPP-001': {
    id: 'SUPP-001',
    supplierCode: 'S001',
    name: 'Global Supplies Inc',
    email: 'sales@globalsupplies.com',
    phone: '555-0201',
    address: '789 Industrial Blvd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    status: 'Active',
    paymentTerms: 'Net 30',
    taxId: 'TAX-S001',
    notes: 'Reliable supplier with quick turnaround times',
    contactPerson: 'Mike Johnson',
    contactPhone: '555-0211',
    contactEmail: 'mike.johnson@globalsupplies.com',
    bankAccount: '123456789',
    bankName: 'First National Bank'
  },
  'SUPP-002': {
    id: 'SUPP-002',
    supplierCode: 'S002',
    name: 'Premium Materials Co',
    email: 'orders@premiummaterials.com',
    phone: '555-0202',
    address: '321 Commerce St',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    country: 'USA',
    status: 'Active',
    paymentTerms: 'Net 45',
    taxId: 'TAX-S002',
    notes: 'Premium quality materials supplier',
    contactPerson: 'Sarah Williams',
    contactPhone: '555-0212',
    contactEmail: 'sarah.williams@premiummaterials.com',
    bankAccount: '987654321',
    bankName: 'Commerce Bank'
  }
}

const emptySupplierHeader: SupplierHeader = {
  id: '',
  supplierCode: '',
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
  taxId: '',
  notes: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  bankAccount: '',
  bankName: ''
}

interface SupplierDetailProps {
  supplierId: string
}

export function SupplierDetail({ supplierId }: SupplierDetailProps) {
  const [header, setHeader] = useState<SupplierHeader>(
    supplierId === 'new' ? emptySupplierHeader : (mockSupplierHeaders[supplierId] || emptySupplierHeader)
  )
  const [isEditing, setIsEditing] = useState(supplierId === 'new')

  useEffect(() => {
    const newHeader = supplierId === 'new' ? emptySupplierHeader : (mockSupplierHeaders[supplierId] || emptySupplierHeader)
    setHeader(newHeader)
    setIsEditing(supplierId === 'new')
  }, [supplierId])

  const handleSave = () => {
    console.log('Saving supplier:', header)
    setIsEditing(false)
    // TODO: Implement actual save logic
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{supplierId === 'new' ? 'New Supplier' : header.name}</h2>
          <p className="text-gray-600">{header.supplierCode}</p>
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

      {/* Supplier Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="supplierCode">Supplier Code</Label>
              <Input
                id="supplierCode"
                value={header.supplierCode}
                onChange={(e) => setHeader({...header, supplierCode: e.target.value})}
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

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
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
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={header.bankName}
                onChange={(e) => setHeader({...header, bankName: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                value={header.bankAccount}
                onChange={(e) => setHeader({...header, bankAccount: e.target.value})}
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
            placeholder="Add any additional notes about this supplier..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
