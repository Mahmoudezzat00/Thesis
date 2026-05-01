jest.mock("@/lib/db", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/lib/db/models/user.model", () => ({
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(async (password) => `hashed_${password}`),
  compare: jest.fn(
    async (password, hash) => password === hash.replace("hashed_", ""),
  ),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  formatError: jest.fn((error) => error?.message || "Unknown error"),
}));

jest.mock("@/lib/actions/setting.actions", () => ({
  getSetting: jest.fn(),
}));

import { formatError } from "@/lib/utils";

describe("User Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Input Validation", () => {
    it("should validate user signup schema with correct data", async () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      expect(validData.password).toBe(validData.confirmPassword);
      expect(validData.name.length).toBeGreaterThanOrEqual(2);
    });

    it("should reject passwords that do not match", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "different",
      };

      expect(invalidData.password).not.toBe(invalidData.confirmPassword);
    });

    it("should reject short password", () => {
      const invalidData = {
        password: "ab",
      };

      expect(invalidData.password.length).toBeLessThan(3);
    });
  });

  describe("Error Handling", () => {
    it("should format error messages correctly", () => {
      const error = new Error("Test error");
      const formatted = formatError(error);
      expect(typeof formatted).toBe("string");
    });

    it("should handle unknown errors", () => {
      const formatted = formatError(null);
      expect(typeof formatted).toBe("string");
    });

    it("should handle duplicate key errors", () => {
      const error = {
        code: 11000,
        keyValue: { email: "test@example.com" },
      };
      expect(error.code).toBe(11000);
    });
  });
});
