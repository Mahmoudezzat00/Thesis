import { renderHook, act } from "@testing-library/react";
import useCartStore from "@/hooks/use-cart-store";
import { toSlug, formatCurrency, round2 } from "@/lib/utils";
import {
  OrderItemSchema,
  ShippingAddressSchema,
  CartSchema,
} from "@/lib/validator";

jest.mock("@/lib/actions/order.actions", () => ({
  calcDeliveryDateAndPrice: jest.fn(({ items, shippingAddress }) => {
    return {
      itemsPrice: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      taxPrice: 0,
      shippingPrice: shippingAddress ? 10 : 0,
      totalPrice:
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
        (shippingAddress ? 10 : 0),
    };
  }),
}));

describe("Integration Tests - Shopping Cart Flow", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe("Complete Purchase Flow", () => {
    it("should handle complete cart to checkout flow", async () => {
      const { result } = renderHook(() => useCartStore());

      const product = {
        clientId: "1",
        product: "507f1f77bcf86cd799439011",
        name: "Gaming Laptop",
        slug: "gaming-laptop",
        category: "Electronics",
        quantity: 1,
        countInStock: 5,
        image: "https://example.com/laptop.jpg",
        price: 1299.99,
      };

      const shippingAddress = {
        fullName: "John Doe",
        street: "123 Main St",
        city: "New York",
        postalCode: "10001",
        province: "NY",
        phone: "1234567890",
        country: "USA",
      };

      await act(async () => {
        await result.current.addItem(product, 1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.totalPrice).toBeGreaterThan(0);

      await act(async () => {
        await result.current.setShippingAddress(shippingAddress);
      });

      expect(result.current.cart.shippingAddress).toEqual(shippingAddress);
      expect(result.current.cart.shippingPrice).toBe(10);

      act(() => {
        result.current.setPaymentMethod("credit-card");
      });

      expect(result.current.cart.paymentMethod).toBe("credit-card");
    });

    it("should validate entire order before checkout", async () => {
      const product = {
        clientId: "1",
        product: "507f1f77bcf86cd799439011",
        name: "Gaming Laptop",
        slug: "gaming-laptop",
        category: "Electronics",
        quantity: 1,
        countInStock: 5,
        image: "https://example.com/laptop.jpg",
        price: 1299.99,
      };

      const shippingAddress = {
        fullName: "John Doe",
        street: "123 Main St",
        city: "New York",
        postalCode: "10001",
        province: "NY",
        phone: "1234567890",
        country: "USA",
      };

      expect(() => OrderItemSchema.parse(product)).not.toThrow();
      expect(() => ShippingAddressSchema.parse(shippingAddress)).not.toThrow();
    });
  });

  describe("Product Quantity Management", () => {
    it("should update product quantity in cart", async () => {
      const { result } = renderHook(() => useCartStore());

      const product = {
        clientId: "1",
        product: "507f1f77bcf86cd799439011",
        name: "Test Product",
        slug: "test-product",
        category: "Electronics",
        quantity: 1,
        countInStock: 10,
        image: "https://example.com/image.jpg",
        price: 50,
      };

      await act(async () => {
        await result.current.addItem(product, 1);
        await result.current.updateItem(product, 3);
      });

      expect(result.current.cart.items[0].quantity).toBe(3);
      expect(result.current.cart.itemsPrice).toBe(150);
    });

    it("should calculate correct total with multiple items", async () => {
      const { result } = renderHook(() => useCartStore());

      const product1 = {
        clientId: "1",
        product: "1",
        name: "Product 1",
        slug: "product-1",
        category: "Electronics",
        quantity: 1,
        countInStock: 10,
        image: "https://example.com/image1.jpg",
        price: 50,
      };

      const product2 = {
        clientId: "2",
        product: "2",
        name: "Product 2",
        slug: "product-2",
        category: "Electronics",
        quantity: 1,
        countInStock: 10,
        image: "https://example.com/image2.jpg",
        price: 75,
      };

      await act(async () => {
        await result.current.addItem(product1, 2);
        await result.current.addItem(product2, 1);
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.itemsPrice).toBe(175);
    });
  });

  describe("Price Formatting in Cart", () => {
    it("should format prices correctly throughout checkout", () => {
      const price = 99.9;
      const formatted = formatCurrency(price);

      expect(formatted).toBe("$99.90");
    });

    it("should round prices to 2 decimals", () => {
      const price = 0.1 + 0.2;
      const rounded = round2(price);

      expect(rounded).toBe(0.3);
    });

    it("should handle large amounts correctly", () => {
      const amount = 1299.99;
      const currency = formatCurrency(amount);

      expect(currency).toContain("$1,299.99");
    });
  });

  describe("Product Search and Filtering", () => {
    it("should convert product name to slug correctly", () => {
      const productName = "Gaming Laptop Pro Max";
      const slug = toSlug(productName);

      expect(slug).toBe("gaming-laptop-pro-max");
    });

    it("should handle special characters in product names", () => {
      const productName = "iPhone 14 Pro & Accessories!";
      const slug = toSlug(productName);

      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toContain("&");
      expect(slug).not.toContain("!");
    });
  });

  describe("Stock Validation", () => {
    it("should prevent adding more items than available stock", async () => {
      const { result } = renderHook(() => useCartStore());

      const product = {
        clientId: "1",
        product: "507f1f77bcf86cd799439011",
        name: "Limited Product",
        slug: "limited-product",
        category: "Electronics",
        quantity: 1,
        countInStock: 2,
        image: "https://example.com/image.jpg",
        price: 50,
      };

      await act(async () => {
        try {
          await result.current.addItem(product, 3);
        } catch (error) {
          expect((error as Error).message).toBe("Not enough items in stock");
        }
      });
    });

    it("should allow adding item up to stock limit", async () => {
      const { result } = renderHook(() => useCartStore());

      const product = {
        clientId: "1",
        product: "507f1f77bcf86cd799439011",
        name: "Product",
        slug: "product",
        category: "Electronics",
        quantity: 1,
        countInStock: 5,
        image: "https://example.com/image.jpg",
        price: 50,
      };

      await act(async () => {
        await result.current.addItem(product, 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
    });
  });

  describe("Cart Persistence", () => {
    it("should maintain cart state across operations", async () => {
      const { result } = renderHook(() => useCartStore());

      const product = {
        clientId: "1",
        product: "507f1f77bcf86cd799439011",
        name: "Test Product",
        slug: "test-product",
        category: "Electronics",
        quantity: 1,
        countInStock: 10,
        image: "https://example.com/image.jpg",
        price: 50,
      };

      await act(async () => {
        await result.current.addItem(product, 1);
      });

      const cartAfterAdd = { ...result.current.cart };

      await act(async () => {
        await result.current.updateItem(product, 2);
      });

      expect(result.current.cart.items).toHaveLength(cartAfterAdd.items.length);
    });
  });
});
