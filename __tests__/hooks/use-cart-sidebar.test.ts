import { renderHook, act } from "@testing-library/react";
import useCartSidebar from "@/hooks/use-cart-sidebar";
import useCartStore from "@/hooks/use-cart-store";
import useDeviceType from "@/hooks/use-device-type";

jest.mock("@/hooks/use-device-type", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@/hooks/use-cart-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from "next/navigation";

describe("useCartSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false when cart is empty", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("desktop");
    (usePathname as jest.Mock).mockReturnValue("/products");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(false);
  });

  it("should return false on mobile device", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [{ id: "1" }] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("mobile");
    (usePathname as jest.Mock).mockReturnValue("/products");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(false);
  });

  it("should return false on restricted paths", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [{ id: "1" }] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("desktop");
    (usePathname as jest.Mock).mockReturnValue("/cart");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(false);
  });

  it("should return true when conditions are met", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [{ id: "1" }] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("desktop");
    (usePathname as jest.Mock).mockReturnValue("/products");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(true);
  });

  it("should return false on checkout path", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [{ id: "1" }] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("desktop");
    (usePathname as jest.Mock).mockReturnValue("/checkout");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(false);
  });

  it("should return false on sign-in path", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [{ id: "1" }] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("desktop");
    (usePathname as jest.Mock).mockReturnValue("/sign-in");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(false);
  });

  it("should return false on admin paths", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [{ id: "1" }] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("desktop");
    (usePathname as jest.Mock).mockReturnValue("/admin/products");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(false);
  });

  it("should return false on account paths", () => {
    (useCartStore as jest.Mock).mockReturnValue({
      cart: { items: [{ id: "1" }] },
    });
    (useDeviceType as jest.Mock).mockReturnValue("desktop");
    (usePathname as jest.Mock).mockReturnValue("/account/profile");

    const { result } = renderHook(() => useCartSidebar());
    expect(result.current).toBe(false);
  });
});
