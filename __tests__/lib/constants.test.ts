import {
  SENDER_NAME,
  SENDER_EMAIL,
  USER_ROLES,
  COLORS,
  THEMES,
} from "@/lib/constants";

describe("lib/constants", () => {
  describe("SENDER_NAME", () => {
    it("should be defined", () => {
      expect(SENDER_NAME).toBeDefined();
    });

    it("should be a string", () => {
      expect(typeof SENDER_NAME).toBe("string");
    });

    it("should have fallback value", () => {
      expect(SENDER_NAME).toBe("support");
    });
  });

  describe("SENDER_EMAIL", () => {
    it("should be defined", () => {
      expect(SENDER_EMAIL).toBeDefined();
    });

    it("should be a string", () => {
      expect(typeof SENDER_EMAIL).toBe("string");
    });

    it("should be valid email format", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(SENDER_EMAIL)).toBe(true);
    });
  });

  describe("USER_ROLES", () => {
    it("should be an array", () => {
      expect(Array.isArray(USER_ROLES)).toBe(true);
    });

    it("should contain Admin role", () => {
      expect(USER_ROLES).toContain("Admin");
    });

    it("should contain User role", () => {
      expect(USER_ROLES).toContain("User");
    });

    it("should have expected length", () => {
      expect(USER_ROLES.length).toBe(2);
    });

    it("should only contain strings", () => {
      USER_ROLES.forEach((role) => {
        expect(typeof role).toBe("string");
      });
    });
  });

  describe("COLORS", () => {
    it("should be an array", () => {
      expect(Array.isArray(COLORS)).toBe(true);
    });

    it("should contain expected colors", () => {
      expect(COLORS).toContain("Blue");
      expect(COLORS).toContain("Gold");
      expect(COLORS).toContain("Green");
      expect(COLORS).toContain("Red");
    });

    it("should have expected length", () => {
      expect(COLORS.length).toBe(4);
    });

    it("should only contain strings", () => {
      COLORS.forEach((color) => {
        expect(typeof color).toBe("string");
      });
    });

    it("should not be empty", () => {
      expect(COLORS.length).toBeGreaterThan(0);
    });
  });

  describe("THEMES", () => {
    it("should be an array", () => {
      expect(Array.isArray(THEMES)).toBe(true);
    });

    it("should contain Light theme", () => {
      expect(THEMES).toContain("Light");
    });

    it("should contain Dark theme", () => {
      expect(THEMES).toContain("Dark");
    });

    it("should contain System theme", () => {
      expect(THEMES).toContain("System");
    });

    it("should have expected length", () => {
      expect(THEMES.length).toBe(3);
    });

    it("should only contain strings", () => {
      THEMES.forEach((theme) => {
        expect(typeof theme).toBe("string");
      });
    });

    it("should not be empty", () => {
      expect(THEMES.length).toBeGreaterThan(0);
    });
  });
});
