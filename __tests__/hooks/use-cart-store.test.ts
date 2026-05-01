import { renderHook, act, waitFor } from "@testing-library/react";
import useCartStore from "@/hooks/use-cart-store";
import { OrderItem, ShippingAddress } from "@/types";

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

const mockOrderItem: OrderItem = {
  clientId: "1",
  product: "507f1f77bcf86cd799439011",
  name: "Test Product",
  slug: "test-product",
  category: "Electronics",
  quantity: 1,
  countInStock: 10,
  image: "https://example.com/image.jpg",
  price: 99.99,
};

const mockShippingAddress: ShippingAddress = {
  fullName: "John Doe",
  street: "123 Main St",
  city: "New York",
  postalCode: "10001",
  province: "NY",
  phone: "1234567890",
  country: "USA",
};

describe("useCartStore", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe("initial state", () => {
    it("should have empty cart initially", () => {
      const { result } = renderHook(() => useCartStore());
      expect(result.current.cart.items).toEqual([]);
      expect(result.current.cart.totalPrice).toBe(0);
    });
  });

  describe("addItem", () => {
    it("should add item to empty cart", async () => {
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.addItem(mockOrderItem, 1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product).toBe(mockOrderItem.product);
    });

    it("should increase quantity if item already exists", async () => {
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.addItem(mockOrderItem, 1);
        await result.current.addItem(mockOrderItem, 1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(2);
    });

    it("should reject if not enough stock", async () => {
      const { result } = renderHook(() => useCartStore());
      const item = { ...mockOrderItem, countInStock: 1 };

      await act(async () => {
        try {
          await result.current.addItem(item, 2);
        } catch (error) {
          expect((error as Error).message).toBe("Not enough items in stock");
        }
      });
    });

    it("should handle items with different colors separately", async () => {
      const { result } = renderHook(() => useCartStore());
      const item1 = { ...mockOrderItem, color: "red" };
      const item2 = { ...mockOrderItem, color: "blue" };

      await act(async () => {
        await result.current.addItem(item1, 1);
        await result.current.addItem(item2, 1);
      });

      expect(result.current.cart.items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("should remove item from cart", async () => {
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.addItem(mockOrderItem, 1);
        await result.current.removeItem(mockOrderItem);
      });

      expect(result.current.cart.items).toHaveLength(0);
    });

    it("should not affect other items", async () => {
      const { result } = renderHook(() => useCartStore());
      const item1 = { ...mockOrderItem, product: "1" };
      const item2 = { ...mockOrderItem, product: "2" };

      await act(async () => {
        await result.current.addItem(item1, 1);
        await result.current.addItem(item2, 1);
        await result.current.removeItem(item1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product).toBe("2");
    });
  });

  describe("updateItem", () => {
    it("should update item quantity", async () => {
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.addItem(mockOrderItem, 1);
        await result.current.updateItem(mockOrderItem, 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
    });

    it("should not update if item not in cart", async () => {
      const { result } = renderHook(() => useCartStore());
      const nonExistentItem = { ...mockOrderItem, product: "nonexistent" };

      await act(async () => {
        await result.current.updateItem(nonExistentItem, 5);
      });

      expect(result.current.cart.items).toHaveLength(0);
    });
  });

  describe("setShippingAddress", () => {
    it("should set shipping address", async () => {
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.setShippingAddress(mockShippingAddress);
      });

      expect(result.current.cart.shippingAddress).toEqual(mockShippingAddress);
    });
  });

  describe("setPaymentMethod", () => {
    it("should set payment method", () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.setPaymentMethod("credit-card");
      });

      expect(result.current.cart.paymentMethod).toBe("credit-card");
    });
  });

  describe("clearCart", () => {
    it("should clear all items", async () => {
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.addItem(mockOrderItem, 2);
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
    });
  });
});
