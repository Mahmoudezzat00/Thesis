# Testing Guide

## Project Testing Setup

This project uses **Jest** with React Testing Library for comprehensive testing of utilities, hooks, and components.

### Test Scripts

```bash
# Run tests once
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage report
npm test:coverage
```

### Directory Structure

```
__tests__/
├── lib/
│   ├── utils.test.ts          # Utility function tests
│   └── validator.test.ts       # Zod schema validation tests
├── hooks/
│   └── use-cart-store.test.ts  # Zustand store hook tests
├── components/                 # Component tests (to be added)
├── api/                        # API route tests (to be added)
└── README.md
```

### Test Patterns

#### Utility Function Tests

```typescript
describe("functionName", () => {
  it("should do something specific", () => {
    expect(functionName(input)).toBe(expectedOutput);
  });
});
```

#### Hook Tests

```typescript
const { result } = renderHook(() => useHook());
act(() => {
  // trigger state changes
});
expect(result.current.value).toBe(expectedValue);
```

#### Schema Validation Tests

```typescript
expect(() => Schema.parse(validData)).not.toThrow();
expect(() => Schema.parse(invalidData)).toThrow();
```

### Coverage Thresholds

- **Lines**: 20%+
- **Functions**: 20%+
- **Branches**: 20%+
- **Statements**: 20%+

### Adding New Tests

1. Create test file matching the source file (e.g., `component.test.tsx` for `component.tsx`)
2. Follow the existing patterns in `__tests__/`
3. Mock external dependencies as needed
4. Run `npm test:coverage` to ensure coverage goals are met

### Mocking

Common mocks are set up in `jest.setup.ts`:

- `next/image`
- `next/link`
- `next-auth/react`
- `ResizeObserver`

Add additional mocks in `jest.setup.ts` or use inline `jest.mock()` in specific test files.

### Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)
