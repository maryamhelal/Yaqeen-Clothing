const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Yaqeen Clothing API",
      version: "1.0.0",
      description:
        "A comprehensive API for Yaqeen Clothing e-commerce platform",
      contact: {
        name: "Yaqeen Clothing",
        email: process.env.EMAIL_USER,
      },
      servers: [
        {
          url: "http://localhost:5000",
          description: "Development server",
        },
        {
          url: "https://api.yaqeenclothing.com",
          description: "Production server",
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            address: { type: "string", example: "123 Main St, City, Country" },
            phone: { type: "string", example: "+1234567890" },
            type: { type: "string", enum: ["user"], example: "user" },
          },
        },
        Admin: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "Admin User" },
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "superadmin"],
              example: "admin",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "689f4f2b16f93d8095b96ac9" },
            name: { type: "string", example: "Classic T-Shirt" },
            description: {
              type: "string",
              example: "A comfortable cotton t-shirt",
            },
            price: { type: "number", example: 3000 },
            salePercentage: { type: "number", example: 35 },
            salePrice: { type: "number", example: 1950 },
            image: {
              type: "string",
              example: "/uploads/image-1755270955314-734466673.jpg",
            },
            colors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "black" },
                  hex: { type: "string", example: "#000000" },
                  image: {
                    type: "string",
                    example:
                      "/uploads/colorImages_0-1755270955314-734466673.jpg",
                  },
                  sizes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        size: { type: "string", example: "M" },
                        quantity: { type: "number", example: 10 },
                      },
                    },
                  },
                },
              },
            },
            category: { type: "string", example: "689a6952c950165eecdd3e72" },
            collection: { type: "string", example: "689a62f811fe4cd253a67e12" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            user: { type: "string", example: "507f1f77bcf86cd799439011" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: {
                    type: "string",
                    example: "507f1f77bcf86cd799439011",
                  },
                  quantity: { type: "number", example: 2 },
                  size: { type: "string", example: "M" },
                },
              },
            },
            totalAmount: { type: "number", example: 59.98 },
            status: {
              type: "string",
              enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ],
              example: "pending",
            },
            shippingAddress: {
              type: "string",
              example: "123 Main St, City, Country",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Message: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            subject: { type: "string", example: "Product Inquiry" },
            message: {
              type: "string",
              example: "I would like to know more about your products",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Tag: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "Summer Collection" },
            description: {
              type: "string",
              example: "Our latest summer collection featuring trendy styles",
            },
            image: { type: "string", example: "https://example.com/image.jpg" },
            tag: {
              type: "string",
              enum: ["category", "collection"],
              example: "collection",
            },
            sale: { type: "number", example: 20 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: { type: "string", example: "password123" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "address", "phone"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: { type: "string", example: "password123" },
            address: { type: "string", example: "123 Main St, City, Country" },
            phone: { type: "string", example: "+1234567890" },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["email", "otp", "newPassword"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            otp: { type: "string", example: "123456" },
            newPassword: { type: "string", example: "newpassword123" },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: { type: "string", example: "oldpassword123" },
            newPassword: { type: "string", example: "newpassword123" },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["name", "description", "price", "category", "collection"],
          properties: {
            name: { type: "string", example: "Classic T-Shirt" },
            description: {
              type: "string",
              example: "A comfortable cotton t-shirt",
            },
            price: { type: "number", example: 29.99 },
            category: { type: "string", example: "T-Shirts" },
            collection: { type: "string", example: "Summer Collection" },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["image1.jpg", "image2.jpg"],
            },
            sizes: {
              type: "array",
              items: { type: "string" },
              example: ["S", "M", "L", "XL"],
            },
            inStock: { type: "boolean", example: true },
          },
        },
        CreateOrderRequest: {
          type: "object",
          required: ["products", "shippingAddress"],
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                required: ["product", "quantity", "size"],
                properties: {
                  product: {
                    type: "string",
                    example: "507f1f77bcf86cd799439011",
                  },
                  quantity: { type: "number", example: 2 },
                  size: { type: "string", example: "M" },
                },
              },
            },
            shippingAddress: {
              type: "string",
              example: "123 Main St, City, Country",
            },
          },
        },
        UpdateOrderStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ],
              example: "processing",
            },
          },
        },
        CreateAdminRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Admin User" },
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            password: { type: "string", example: "adminpassword123" },
            role: {
              type: "string",
              enum: ["admin", "superadmin"],
              example: "admin",
            },
          },
        },
        CreateTagRequest: {
          type: "object",
          required: ["name", "tag"],
          properties: {
            name: { type: "string", example: "Summer Collection" },
            description: {
              type: "string",
              example: "Our latest summer collection featuring trendy styles",
            },
            image: { type: "string", example: "https://example.com/image.jpg" },
            tag: {
              type: "string",
              enum: ["category", "collection"],
              example: "collection",
            },
          },
        },
        UpdateTagRequest: {
          type: "object",
          properties: {
            description: {
              type: "string",
              example: "Our latest summer collection featuring trendy styles",
            },
            image: { type: "string", example: "https://example.com/image.jpg" },
            tag: {
              type: "string",
              enum: ["category", "collection"],
              example: "collection",
            },
          },
        },
        CreateMessageRequest: {
          type: "object",
          required: ["name", "email", "subject", "message"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            subject: { type: "string", example: "Product Inquiry" },
            message: {
              type: "string",
              example: "I would like to know more about your products",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./server.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
