import {
  UserSignUpSchema,
  UserSignInSchema,
  ProductInputSchema,
  CartSchema,
  OrderInputSchema,
} from "@/lib/validator";
import { formatError } from "@/lib/utils";

describe("Integration Tests - Data Validation Flow", () => {
  describe("User Registration Flow", () => {
    it("should validate complete user signup", () => {
      const signupData = {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
      };

      expect(() => UserSignUpSchema.parse(signupData)).not.toThrow();
    });

    it("should catch validation errors in signup", () => {
      const invalidData = {
        name: "J",
        email: "invalid-email",
        password: "short",
        confirmPassword: "different",
      };

      expect(() => UserSignUpSchema.parse(invalidData)).toThrow();
    });

    it("should validate user login with same schema constraints", () => {
      const loginData = {
        email: "john@example.com",
        password: "SecurePassword123",
      };

      expect(() => UserSignInSchema.parse(loginData)).not.toThrow();
    });
  });

  describe("Product Catalog Validation", () => {
    it("should validate complete product for catalog", () => {
      const product = {
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        category: "Electronics",
        images: [
          "https://example.com/img1.jpg",
          "https://example.com/img2.jpg",
        ],
        brand: "AudioTech",
        description: "High-quality wireless headphones with noise cancellation",
        isPublished: true,
        price: 299.99,
        listPrice: 399.99,
        countInStock: 50,
        avgRating: 4.5,
        numReviews: 120,
        ratingDistribution: [
          { rating: 5, count: 80 },
          { rating: 4, count: 30 },
          { rating: 3, count: 10 },
        ],
        numSales: 500,
      };

      expect(() => ProductInputSchema.parse(product)).not.toThrow();
    });

    it("should handle product validation errors", () => {
      const invalidProduct = {
        name: "AB",
        slug: "ab",
        category: "",
        images: [],
        brand: "",
        description: "",
        isPublished: true,
        price: 99.999,
        listPrice: 150,
        countInStock: -5,
      };

      expect(() => ProductInputSchema.parse(invalidProduct)).toThrow();
    });
  });

  describe("Order Validation Flow", () => {
    it("should validate complete order with all details", () => {
      const orderData = {
        user: "507f1f77bcf86cd799439011",
        items: [
          {
            clientId: "1",
            product: "507f1f77bcf86cd799439012",
            name: "Headphones",
            slug: "headphones",
            category: "Electronics",
            quantity: 1,
            countInStock: 10,
            image: "https://example.com/headphones.jpg",
            price: 299.99,
          },
        ],
        shippingAddress: {
          fullName: "John Doe",
          street: "123 Main St",
          city: "New York",
          postalCode: "10001",
          province: "NY",
          phone: "1234567890",
          country: "USA",
        },
        paymentMethod: "credit-card",
        itemsPrice: 299.99,
        shippingPrice: 10,
        taxPrice: 30,
        totalPrice: 339.99,
        expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      };

      expect(() => OrderInputSchema.parse(orderData)).not.toThrow();
    });

    it("should enforce delivery date must be in future", () => {
      const pastOrder = {
        items: [
          {
            clientId: "1",
            product: "507f1f77bcf86cd799439012",
            name: "Product",
            slug: "product",
            category: "Electronics",
            quantity: 1,
            countInStock: 10,
            image: "https://example.com/img.jpg",
            price: 99.99,
          },
        ],
        expectedDeliveryDate: new Date(Date.now() - 1000),
        shippingAddress: {
          fullName: "John",
          street: "St",
          city: "City",
          postalCode: "12345",
          province: "State",
          phone: "1234567890",
          country: "USA",
        },
        paymentMethod: "card",
        itemsPrice: 99.99,
        shippingPrice: 10,
        taxPrice: 10,
        totalPrice: 119.99,
      };

      expect(() => OrderInputSchema.parse(pastOrder)).toThrow();
    });
  });

  describe("Error Handling Across Operations", () => {
    it("should format validation errors from user input", () => {
      const error = {
        name: "ZodError",
        errors: {
          email: { path: "email", message: "Invalid email format" },
        },
      };

      const formatted = formatError(error);
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    });

    it("should handle duplicate entry errors", () => {
      const error = {
        code: 11000,
        keyValue: { email: "existing@example.com" },
      };

      const formatted = formatError(error);
      expect(formatted).toContain("email");
      expect(formatted).toContain("already exists");
    });

    it("should handle database connection errors gracefully", () => {
      const error = new Error("Database connection failed");
      const formatted = formatError(error);

      expect(formatted).toBe("Database connection failed");
    });
  });

  describe("Multi-step Validation Scenarios", () => {
    it("should validate cart before converting to order", () => {
      const cart = {
        items: [
          {
            clientId: "1",
            product: "507f1f77bcf86cd799439011",
            name: "Item",
            slug: "item",
            category: "Electronics",
            quantity: 2,
            countInStock: 5,
            image: "https://example.com/img.jpg",
            price: 50,
          },
        ],
        itemsPrice: 100,
        totalPrice: 100,
      };

      expect(() => CartSchema.parse(cart)).not.toThrow();
    });

    it("should validate shipping address separately from cart", () => {
      const address = {
        fullName: "Jane Doe",
        street: "456 Oak Ave",
        city: "Los Angeles",
        postalCode: "90001",
        province: "CA",
        phone: "9876543210",
        country: "USA",
      };

      const cart = {
        items: [
          {
            clientId: "1",
            product: "507f1f77bcf86cd799439011",
            name: "Item",
            slug: "item",
            category: "Electronics",
            quantity: 1,
            countInStock: 10,
            image: "https://example.com/img.jpg",
            price: 99.99,
          },
        ],
        itemsPrice: 99.99,
        totalPrice: 99.99,
        shippingAddress: address,
      };

      expect(() => CartSchema.parse(cart)).not.toThrow();
    });
  });
});
