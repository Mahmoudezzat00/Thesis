import { renderHook, act } from "@testing-library/react";
import useIsMounted from "@/hooks/use-is-mounted";

describe("useIsMounted", () => {
  it("should return true after mount completes", () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
  });

  it("should stay true throughout component lifecycle", () => {
    const { result, rerender } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(true);
  });

  it("should not cause unnecessary re-renders after initial mount", () => {
    let renderCount = 0;
    const { result, rerender } = renderHook(() => {
      renderCount++;
      return useIsMounted();
    });

    const initialRenderCount = renderCount;
    rerender();

    expect(result.current).toBe(true);
    expect(renderCount).toBe(initialRenderCount + 1);
  });
});
