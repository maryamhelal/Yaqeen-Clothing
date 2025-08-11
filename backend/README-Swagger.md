# Yaqeen Clothing API - Swagger Setup

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 3. Access Swagger Documentation
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

## What's Included

**Complete API Documentation** - All 30+ endpoints documented
**Interactive Testing** - Test endpoints directly from Swagger UI
**Request/Response Examples** - Real test data for all endpoints
**Authentication Support** - JWT bearer token support
**Schema Definitions** - Complete data models
**Error Documentation** - All possible response codes
**Comprehensive Testing Guide** - Step-by-step testing instructions

## API Endpoints Covered

### Authentication (7 endpoints)
- User registration, login, password management

### Products (7 endpoints)
- CRUD operations, filtering, categorization

### Orders (6 endpoints)
- Order creation, management, status updates

### Users (2 endpoints)
- User listing and management (Superadmin only)

### Admins (4 endpoints)
- Admin user management (Superadmin only)

### Tags (6 endpoints)
- Category and collection management

### Messages (3 endpoints)
- Contact form and message management

## Testing Your API

1. **Start with public endpoints** (products, tags, messages)
2. **Register a test user** using `/api/auth/register`
3. **Login to get JWT token** using `/api/auth/login`
4. **Click "Authorize"** in Swagger UI and enter: `Bearer YOUR_TOKEN`
5. **Test protected endpoints** with full authentication

## Features

- **Real-time Testing** - No need for Postman or other tools
- **Request Validation** - Automatic schema validation
- **Response Examples** - See exactly what to expect
- **Authentication Flow** - Easy token management
- **Error Handling** - Complete error documentation
- **Pagination Support** - Built-in pagination examples
- **Filtering Examples** - Query parameter usage

## Customization

The Swagger configuration is in `swagger.js` and can be easily modified:
- Change API title and description
- Add new schemas
- Modify server URLs
- Customize UI appearance

## Troubleshooting

- **Port conflicts**: Change `PORT` in `.env` file
- **Database issues**: Check MongoDB connection string
- **CORS errors**: Verify CORS configuration
- **Auth failures**: Check JWT secret in `.env`

## Next Steps

1. Test all endpoints systematically
2. Use the testing guide in `swagger-tests.md`
3. Customize schemas as needed
4. Add more examples for complex endpoints
5. Integrate with your frontend testing

Your API is now fully documented and testable! 🚀
