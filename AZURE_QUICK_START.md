# Azure Integration - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your Azure backend URL:

```env
VITE_API_BASE_URL=https://your-azure-api.azurewebsites.net/api
VITE_API_VERSION=v1
```

### Step 2: Test the Connection

```bash
# Start development server
npm run dev
```

1. Open browser to `http://localhost:5173`
2. Login to the app
3. Navigate to **"Thương hiệu sản phẩm"** (Item Brands)
4. Click on any brand to view details
5. Open Browser DevTools → Network tab
6. You should see API calls to your Azure backend

### Step 3: Fallback Behavior

**✅ API Available**: Data loads from Azure backend
**❌ API Unavailable**: Automatically falls back to mock data with console warning

---

## 📁 Project Structure

```
src/
├── config/
│   └── api.ts                    # API endpoint configuration
├── services/
│   ├── apiClient.ts              # HTTP client with error handling
│   ├── itemBrandService.ts       # Item Brand CRUD operations
│   └── itemCategoryService.ts    # Item Category CRUD operations
└── components/functions/items/
    ├── ItemBrandDetail.tsx       # ✅ API integrated
    ├── ItemBrands.tsx            # ⚠️  Needs update
    ├── ItemCategoryDetail.tsx    # ⚠️  Needs update
    └── ItemCategories.tsx        # ⚠️  Needs update
```

---

## 🔧 Required Backend Endpoints

Your Azure backend needs to implement these endpoints:

### Item Brands
- `GET    /api/v1/item-brands` - List all brands
- `GET    /api/v1/item-brands/:id` - Get single brand
- `POST   /api/v1/item-brands` - Create brand
- `PUT    /api/v1/item-brands/:id` - Update brand
- `DELETE /api/v1/item-brands/:id` - Delete brand

### Item Categories
- `GET    /api/v1/item-categories` - List all categories
- `GET    /api/v1/item-categories/:id` - Get single category
- `POST   /api/v1/item-categories` - Create category
- `PUT    /api/v1/item-categories/:id` - Update category
- `DELETE /api/v1/item-categories/:id` - Delete category

---

## 📊 Database Schema

```sql
-- Item Brands
CREATE TABLE ItemBrands (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(200) NOT NULL,
    Manufacturer NVARCHAR(200),
    Country NVARCHAR(100),
    Website NVARCHAR(500),
    ContactEmail NVARCHAR(200),
    ContactPhone NVARCHAR(50),
    Description NVARCHAR(MAX),
    ItemCount INT DEFAULT 0,
    Status NVARCHAR(20) CHECK (Status IN ('Active', 'Inactive')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Item Categories
CREATE TABLE ItemCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    ParentCategory NVARCHAR(200),
    ItemCount INT DEFAULT 0,
    Status NVARCHAR(20) CHECK (Status IN ('Active', 'Inactive')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
```

---

## 🔐 Authentication (Optional)

If using Azure AD authentication, add these to `.env`:

```env
VITE_AZURE_AD_CLIENT_ID=your-client-id
VITE_AZURE_AD_TENANT_ID=your-tenant-id
VITE_AZURE_AD_REDIRECT_URI=http://localhost:5173
```

The API client will automatically include the Bearer token in all requests.

---

## ✅ Testing Checklist

- [ ] `.env` file created with correct `VITE_API_BASE_URL`
- [ ] Backend API is running and accessible
- [ ] CORS is enabled on backend for your frontend domain
- [ ] Database tables are created
- [ ] Test GET request in browser DevTools
- [ ] Test CREATE operation (add new brand)
- [ ] Test UPDATE operation (edit brand)
- [ ] Test DELETE operation (delete brand)

---

## 🐛 Common Issues

### Issue: "Failed to fetch" in console

**Cause**: Backend not running or CORS not enabled
**Fix**:
1. Check backend is running at the URL in `.env`
2. Enable CORS on Azure App Service
3. Add your frontend domain to allowed origins

### Issue: Data loads but shows mock data

**Cause**: API returning wrong format
**Fix**: Ensure API returns data in correct format:

```json
{
  "data": { "id": "1", "code": "BRD001", ... }
}
```

### Issue: 401 Unauthorized

**Cause**: Missing or invalid auth token
**Fix**: Check that `getAuthToken()` in `src/config/api.ts` returns valid token

---

## 📚 Next Steps

1. **Update remaining components** to use API services
2. **Set up authentication** if needed
3. **Deploy to Azure** using Static Web Apps
4. **Set up CI/CD** with GitHub Actions

For detailed instructions, see [AZURE_INTEGRATION_GUIDE.md](./AZURE_INTEGRATION_GUIDE.md)

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify backend logs in Azure Portal
4. Review the full integration guide for troubleshooting
