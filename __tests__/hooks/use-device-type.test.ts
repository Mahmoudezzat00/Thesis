import { renderHook, act } from "@testing-library/react";
import useDeviceType from "@/hooks/use-device-type";

describe("useDeviceType", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return desktop for width > 768", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("desktop");
  });

  it("should return mobile for width <= 768", () => {
    window.innerWidth = 600;
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("mobile");
  });

  it("should return mobile at exactly 768px", () => {
    window.innerWidth = 768;
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("mobile");
  });

  it("should update on window resize", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("desktop");

    act(() => {
      window.innerWidth = 600;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe("mobile");
  });

  it("should handle resize from mobile to desktop", () => {
    window.innerWidth = 600;
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("mobile");

    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe("desktop");
  });

  it("should set initial value on mount", () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("desktop");
  });

  it("should cleanup resize listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useDeviceType());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });

  it("should add resize listener on mount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const { unmount } = renderHook(() => useDeviceType());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    unmount();
    addEventListenerSpy.mockRestore();
  });
});
