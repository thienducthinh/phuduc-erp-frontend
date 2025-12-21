# Azure Backend Integration Guide

This guide explains how to connect your React frontend to an Azure backend (Azure App Service, Azure Functions, or Azure SQL Database).

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Setup](#backend-setup)
3. [Frontend Configuration](#frontend-configuration)
4. [API Endpoints Structure](#api-endpoints-structure)
5. [Authentication](#authentication)
6. [Testing the Connection](#testing-the-connection)
7. [Deployment](#deployment)

---

## Architecture Overview

```
React Frontend (Vite)
       ↓
   API Client
       ↓
Azure App Service / Azure Functions
       ↓
Azure SQL Database
```

---

## Backend Setup

### Option 1: Azure App Service with Node.js/Express

#### 1. Create Azure SQL Database

```bash
# Create a resource group
az group create --name phuduc-erp-rg --location eastus

# Create SQL Server
az sql server create \
  --name phuduc-erp-sqlserver \
  --resource-group phuduc-erp-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password YourPassword123!

# Create SQL Database
az sql db create \
  --resource-group phuduc-erp-rg \
  --server phuduc-erp-sqlserver \
  --name phuduc-erp-db \
  --service-objective S0
```

#### 2. Database Schema Example

```sql
-- Item Brands Table
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

-- Item Categories Table
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

-- Create indexes for better performance
CREATE INDEX IX_ItemBrands_Status ON ItemBrands(Status);
CREATE INDEX IX_ItemBrands_Code ON ItemBrands(Code);
CREATE INDEX IX_ItemCategories_Status ON ItemCategories(Status);
CREATE INDEX IX_ItemCategories_Code ON ItemCategories(Code);
```

#### 3. Create Node.js Backend

Create a simple Express.js API:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Item Brands Endpoints
app.get('/api/v1/item-brands', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query('SELECT * FROM ItemBrands WHERE Status = @status OR @status = \'all\'');

    res.json({
      data: result.recordset,
      total: result.recordset.length,
      page: 1,
      pageSize: result.recordset.length,
      totalPages: 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/item-brands/:id', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('SELECT * FROM ItemBrands WHERE Id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({ data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/item-brands', async (req, res) => {
  try {
    const { code, name, manufacturer, country, website, contactEmail, contactPhone, description, status } = req.body;

    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('code', sql.NVarChar, code)
      .input('name', sql.NVarChar, name)
      .input('manufacturer', sql.NVarChar, manufacturer)
      .input('country', sql.NVarChar, country)
      .input('website', sql.NVarChar, website)
      .input('contactEmail', sql.NVarChar, contactEmail)
      .input('contactPhone', sql.NVarChar, contactPhone)
      .input('description', sql.NVarChar, description)
      .input('status', sql.NVarChar, status)
      .query(`
        INSERT INTO ItemBrands (Code, Name, Manufacturer, Country, Website, ContactEmail, ContactPhone, Description, Status)
        OUTPUT INSERTED.*
        VALUES (@code, @name, @manufacturer, @country, @website, @contactEmail, @contactPhone, @description, @status)
      `);

    res.status(201).json({ data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/v1/item-brands/:id', async (req, res) => {
  try {
    const { name, manufacturer, country, website, contactEmail, contactPhone, description, status } = req.body;

    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('name', sql.NVarChar, name)
      .input('manufacturer', sql.NVarChar, manufacturer)
      .input('country', sql.NVarChar, country)
      .input('website', sql.NVarChar, website)
      .input('contactEmail', sql.NVarChar, contactEmail)
      .input('contactPhone', sql.NVarChar, contactPhone)
      .input('description', sql.NVarChar, description)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE ItemBrands
        SET Name = @name, Manufacturer = @manufacturer, Country = @country,
            Website = @website, ContactEmail = @contactEmail, ContactPhone = @contactPhone,
            Description = @description, Status = @status, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);

    res.json({ data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/v1/item-brands/:id', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('DELETE FROM ItemBrands WHERE Id = @id');

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 4. Deploy to Azure App Service

```bash
# Create App Service Plan
az appservice plan create \
  --name phuduc-erp-plan \
  --resource-group phuduc-erp-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group phuduc-erp-rg \
  --plan phuduc-erp-plan \
  --name phuduc-erp-api \
  --runtime "NODE|18-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group phuduc-erp-rg \
  --name phuduc-erp-api \
  --settings \
    DB_USER="sqladmin" \
    DB_PASSWORD="YourPassword123!" \
    DB_SERVER="phuduc-erp-sqlserver.database.windows.net" \
    DB_NAME="phuduc-erp-db"

# Deploy your code (using ZIP deployment or GitHub Actions)
az webapp deployment source config-zip \
  --resource-group phuduc-erp-rg \
  --name phuduc-erp-api \
  --src ./api.zip
```

### Option 2: Azure Functions (Serverless)

For a serverless approach, you can use Azure Functions. Each API endpoint becomes a function.

```javascript
// ItemBrandsGet/index.js
const sql = require('mssql');

module.exports = async function (context, req) {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: { encrypt: true }
  };

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query('SELECT * FROM ItemBrands');

    context.res = {
      status: 200,
      body: {
        data: result.recordset,
        total: result.recordset.length
      }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
```

---

## Frontend Configuration

### 1. Create Environment File

Copy [.env.example](.env.example) to `.env` and update with your Azure backend URL:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=https://phuduc-erp-api.azurewebsites.net/api
VITE_API_VERSION=v1
VITE_USE_MOCK_DATA=false
```

### 2. API Client Structure

The API client is already set up in your project:

```
src/
├── config/
│   └── api.ts              # API configuration and endpoints
├── services/
│   ├── apiClient.ts        # Base HTTP client
│   ├── itemBrandService.ts # Item Brand API calls
│   └── itemCategoryService.ts # Item Category API calls
```

### 3. Update Components

Components are already configured to use the API services with automatic fallback to mock data:

- [ItemBrandDetail.tsx](src/components/functions/items/ItemBrandDetail.tsx) - Uses `itemBrandService`
- [ItemBrands.tsx](src/components/functions/items/ItemBrands.tsx) - Needs update
- [ItemCategoryDetail.tsx](src/components/functions/items/ItemCategoryDetail.tsx) - Needs update
- [ItemCategories.tsx](src/components/functions/items/ItemCategories.tsx) - Needs update

---

## API Endpoints Structure

Your backend should implement these endpoints:

### Item Brands

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/item-brands` | List all brands (with pagination) |
| GET | `/api/v1/item-brands/:id` | Get single brand |
| POST | `/api/v1/item-brands` | Create new brand |
| PUT | `/api/v1/item-brands/:id` | Update brand |
| DELETE | `/api/v1/item-brands/:id` | Delete brand |
| POST | `/api/v1/item-brands/batch-delete` | Delete multiple brands |

### Item Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/item-categories` | List all categories |
| GET | `/api/v1/item-categories/:id` | Get single category |
| POST | `/api/v1/item-categories` | Create new category |
| PUT | `/api/v1/item-categories/:id` | Update category |
| DELETE | `/api/v1/item-categories/:id` | Delete category |

### Expected Response Format

All endpoints should return responses in this format:

```json
{
  "data": { ... },
  "success": true,
  "message": "Optional message"
}
```

For lists with pagination:

```json
{
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

For errors:

```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Authentication

### Option 1: Azure AD B2C

For enterprise authentication:

1. **Create Azure AD B2C Tenant**
2. **Register Application**
3. **Configure in Frontend**

```typescript
// src/config/auth.ts
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_TENANT_ID}`,
    redirectUri: window.location.origin,
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);
```

4. **Add Authentication to API Client**

The API client already supports Bearer token authentication. Update the `getAuthToken()` function in [src/config/api.ts](src/config/api.ts) to retrieve the token from your auth provider.

### Option 2: JWT Tokens

For custom JWT authentication:

1. Backend generates JWT token on login
2. Frontend stores token in localStorage
3. API client automatically adds token to requests

```typescript
// After successful login
localStorage.setItem('authToken', 'your-jwt-token');
```

---

## Testing the Connection

### 1. Start Development Server

```bash
npm run dev
```

### 2. Open Browser DevTools

Navigate to Network tab to see API requests.

### 3. Test API Connection

1. Navigate to "Thương hiệu sản phẩm" (Item Brands)
2. Click on a brand to view details
3. Try editing and saving
4. Check the Network tab for API calls

### 4. Check Console for Errors

If API fails, the app will automatically fallback to mock data and log:

```
API call failed, using mock data: [error details]
```

---

## Deployment

### Deploy Frontend to Azure Static Web Apps

```bash
# Build production version
npm run build

# Deploy using Azure CLI
az staticwebapp create \
  --name phuduc-erp-frontend \
  --resource-group phuduc-erp-rg \
  --source ./dist \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### Configure CORS on Backend

Make sure your Azure backend allows requests from your frontend domain:

```javascript
// In your Express app
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://phuduc-erp-frontend.azurestaticapps.net'
  ],
  credentials: true
}));
```

Or in Azure App Service settings:

```bash
az webapp cors add \
  --resource-group phuduc-erp-rg \
  --name phuduc-erp-api \
  --allowed-origins https://phuduc-erp-frontend.azurestaticapps.net
```

---

## Troubleshooting

### Issue: CORS Errors

**Solution**: Enable CORS on your Azure backend (see above).

### Issue: 401 Unauthorized

**Solution**: Check that authentication token is being sent correctly.

### Issue: Connection Refused

**Solution**:
1. Verify backend is running
2. Check firewall rules on Azure SQL
3. Verify connection string

### Issue: Data Not Loading

**Solution**:
1. Check browser console for errors
2. Verify API endpoint URLs in `.env`
3. Test API endpoints directly using Postman
4. Check backend logs in Azure Portal

---

## Next Steps

1. ✅ Update remaining components (ItemBrands, ItemCategories, ItemCategoryDetail) to use API
2. ✅ Set up Azure SQL Database
3. ✅ Deploy backend API
4. ✅ Configure authentication
5. ✅ Test end-to-end integration
6. ✅ Deploy frontend to Azure
7. ✅ Set up CI/CD pipeline

---

## Resources

- [Azure SQL Database Documentation](https://docs.microsoft.com/azure/azure-sql/)
- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Azure AD B2C Documentation](https://docs.microsoft.com/azure/active-directory-b2c/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
