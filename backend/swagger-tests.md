# Yaqeen Clothing API - Swagger Testing Guide

This guide provides comprehensive testing instructions for all API endpoints using Swagger UI.

## Accessing Swagger Documentation

1. Start your backend server: `npm start` or `npm run dev`
2. Open your browser and navigate to: `http://localhost:5000/api-docs`
3. You'll see the interactive Swagger UI with all endpoints organized by tags

## Authentication Setup

Before testing protected endpoints, you'll need to:

1. **Register a user** using `/api/auth/register`
2. **Login** using `/api/auth/login` to get a JWT token
3. **Click the "Authorize" button** in Swagger UI
4. **Enter your token** in the format: `Bearer YOUR_JWT_TOKEN`

## Testing All Endpoints

### 1. Authentication Endpoints (`/api/auth`)

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Test Data**:
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "testpassword123",
  "address": "123 Test St, Test City, Test Country",
  "phone": "+1234567890"
}
```
- **Expected Response**: 201 with user data and JWT token

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Test Data**:
```json
{
  "email": "testuser@example.com",
  "password": "testpassword123"
}
```
- **Expected Response**: 200 with JWT token and user data

#### Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Test Data**:
```json
{
  "email": "testuser@example.com"
}
```
- **Expected Response**: 200 with OTP sent message

#### Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Test Data**:
```json
{
  "email": "testuser@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```
- **Expected Response**: 200 with password reset success

#### Change Password (Authenticated)
- **Endpoint**: `POST /api/auth/change-password`
- **Test Data**:
```json
{
  "oldPassword": "testpassword123",
  "newPassword": "newpassword123"
}
```
- **Expected Response**: 200 with password change success

#### Resend OTP
- **Endpoint**: `POST /api/auth/resend-otp`
- **Test Data**:
```json
{
  "email": "testuser@example.com"
}
```
- **Expected Response**: 200 with OTP resent message

### 2. Product Endpoints (`/api/products`)

#### Get All Products
- **Endpoint**: `GET /api/products`
- **Query Parameters**: 
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `category` (optional): Filter by category
  - `collection` (optional): Filter by collection
- **Expected Response**: 200 with paginated products list

#### Get Product by ID
- **Endpoint**: `GET /api/products/{id}`
- **Path Parameter**: `id` - Product ID
- **Expected Response**: 200 with product details

#### Create Product (Admin Only)
- **Endpoint**: `POST /api/products`
- **Test Data**:
```json
{
  "name": "Test Product",
  "description": "A test product for testing purposes",
  "price": 49.99,
  "category": "Test Category",
  "collection": "Test Collection",
  "images": ["test1.jpg", "test2.jpg"],
  "sizes": ["S", "M", "L"],
  "inStock": true
}
```
- **Expected Response**: 201 with created product

#### Update Product (Admin Only)
- **Endpoint**: `PUT /api/products/{id}`
- **Path Parameter**: `id` - Product ID
- **Test Data**: Same as create product
- **Expected Response**: 200 with updated product

#### Delete Product (Admin Only)
- **Endpoint**: `DELETE /api/products/{id}`
- **Path Parameter**: `id` - Product ID
- **Expected Response**: 200 with deletion success message

#### Get Products by Category
- **Endpoint**: `GET /api/products/category/{category}`
- **Path Parameter**: `category` - Category name
- **Expected Response**: 200 with filtered products

#### Get Products by Collection
- **Endpoint**: `GET /api/products/collection/{collection}`
- **Path Parameter**: `collection` - Collection name
- **Expected Response**: 200 with filtered products

### 3. Order Endpoints (`/api/orders`)

#### Create Order
- **Endpoint**: `POST /api/orders`
- **Test Data**:
```json
{
  "products": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "size": "M"
    }
  ],
  "shippingAddress": "123 Test St, Test City, Test Country"
}
```
- **Expected Response**: 201 with created order

#### Get Order by ID (Authenticated)
- **Endpoint**: `GET /api/orders/{orderId}`
- **Path Parameter**: `orderId` - Order ID
- **Expected Response**: 200 with order details

#### Get All Orders (Admin Only)
- **Endpoint**: `GET /api/orders/admin`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `status` (optional): Filter by status
- **Expected Response**: 200 with paginated orders list

#### Update Order Status (Admin Only)
- **Endpoint**: `PUT /api/orders/{orderId}/status`
- **Path Parameter**: `orderId` - Order ID
- **Test Data**:
```json
{
  "status": "processing"
}
```
- **Expected Response**: 200 with updated order

#### Get User Orders (Authenticated)
- **Endpoint**: `GET /api/orders/my/orders`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Expected Response**: 200 with user's orders

### 4. User Management Endpoints (`/api/users`)

#### List All Users (Superadmin Only)
- **Endpoint**: `GET /api/users`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `search` (optional): Search by name or email
- **Expected Response**: 200 with paginated users list

#### Delete User (Superadmin Only)
- **Endpoint**: `DELETE /api/users/{id}`
- **Path Parameter**: `id` - User ID
- **Expected Response**: 200 with deletion success message

### 5. Admin Management Endpoints (`/api/admins`)

#### List All Admins (Superadmin Only)
- **Endpoint**: `GET /api/admins`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `role` (optional): Filter by role
- **Expected Response**: 200 with admins list

#### Create Admin (Superadmin Only)
- **Endpoint**: `POST /api/admins`
- **Test Data**:
```json
{
  "name": "Test Admin",
  "email": "testadmin@example.com",
  "password": "adminpassword123",
  "role": "admin"
}
```
- **Expected Response**: 201 with created admin

#### Update Admin (Superadmin Only)
- **Endpoint**: `PUT /api/admins/{id}`
- **Path Parameter**: `id` - Admin ID
- **Test Data**:
```json
{
  "name": "Updated Admin Name",
  "email": "updatedadmin@example.com",
  "role": "admin"
}
```
- **Expected Response**: 200 with updated admin

#### Delete Admin (Superadmin Only)
- **Endpoint**: `DELETE /api/admins/{id}`
- **Path Parameter**: `id` - Admin ID
- **Expected Response**: 200 with deletion success message

### 6. Tag Management Endpoints (`/api/tags`)

#### Create Tag
- **Endpoint**: `POST /api/tags`
- **Test Data**:
```json
{
  "name": "Test Category",
  "type": "category"
}
```
- **Expected Response**: 201 with created tag

#### Get Tag by Name
- **Endpoint**: `GET /api/tags/name/{name}`
- **Path Parameter**: `name` - Tag name
- **Expected Response**: 200 with tag details

#### Get All Categories
- **Endpoint**: `GET /api/tags/categories`
- **Expected Response**: 200 with categories list

#### Get All Collections
- **Endpoint**: `GET /api/tags/collections`
- **Expected Response**: 200 with collections list

#### Delete Tag
- **Endpoint**: `DELETE /api/tags/name/{name}`
- **Path Parameter**: `name` - Tag name
- **Expected Response**: 200 with deletion success message

#### Add Sale to Tag
- **Endpoint**: `POST /api/tags/add-sale`
- **Test Data**:
```json
{
  "name": "Test Category",
  "salePercentage": 25
}
```
- **Expected Response**: 200 with updated tag

### 7. Message Endpoints (`/api/messages`)

#### Create Message
- **Endpoint**: `POST /api/messages`
- **Test Data**:
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "subject": "Test Message",
  "message": "This is a test message for testing purposes"
}
```
- **Expected Response**: 201 with created message

#### Get All Messages (Admin Only)
- **Endpoint**: `GET /api/messages`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `status` (optional): Filter by status
- **Expected Response**: 200 with paginated messages list

#### Get Messages by User Email
- **Endpoint**: `GET /api/messages/{userEmail}`
- **Path Parameter**: `userEmail` - User's email address
- **Expected Response**: 200 with user's messages

## Testing Workflow

### 1. Basic Setup
1. Start the server
2. Open Swagger UI
3. Test public endpoints first

### 2. User Authentication
1. Register a test user
2. Login to get JWT token
3. Authorize in Swagger UI

### 3. Protected Endpoints
1. Test user-specific endpoints
2. Test admin endpoints (if you have admin role)
3. Test superadmin endpoints (if you have superadmin role)

### 4. Data Validation
1. Test with invalid data
2. Test with missing required fields
3. Test with malformed data

### 5. Error Handling
1. Test 400 responses (bad request)
2. Test 401 responses (unauthorized)
3. Test 403 responses (forbidden)
4. Test 404 responses (not found)
5. Test 500 responses (server error)

## Common Test Scenarios

### Scenario 1: Complete User Journey
1. Register user
2. Login user
3. Browse products
4. Create order
5. Check order status
6. Send message

### Scenario 2: Admin Operations
1. Login as admin
2. Create product
3. Update product
4. View orders
5. Update order status
6. Manage tags

### Scenario 3: Error Testing
1. Invalid authentication
2. Missing required fields
3. Invalid data types
4. Non-existent resources
5. Insufficient permissions

## Tips for Effective Testing

1. **Use realistic test data** that matches your schema
2. **Test both success and failure cases**
3. **Verify response schemas** match the documentation
4. **Test pagination** with different page sizes
5. **Test filtering** with various parameters
6. **Verify authentication** works correctly
7. **Check error messages** are helpful
8. **Test rate limiting** if implemented

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend CORS is configured
2. **Authentication failures**: Check JWT token format and expiration
3. **Schema validation errors**: Verify request body matches schema
4. **Database connection issues**: Check MongoDB connection
5. **File upload issues**: Verify multer configuration

### Debug Steps
1. Check server logs for errors
2. Verify environment variables
3. Test endpoints with Postman/curl
4. Check database connectivity
5. Verify middleware configuration

This testing guide covers all endpoints in your Yaqeen Clothing API. Use it systematically to ensure comprehensive testing coverage.
