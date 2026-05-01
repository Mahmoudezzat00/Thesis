import "@testing-library/jest-dom";

jest.mock("query-string", () => ({
  parse: jest.fn(() => ({})),
  stringifyUrl: jest.fn(({ url }) => url),
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const React = require("react");
    return React.createElement("img", props);
  },
}));

jest.mock("next/link", () => {
  const React = require("react");
  return ({ children, href }: any) => {
    return React.createElement("a", { href }, children);
  };
});

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  SessionProvider: ({ children }: any) => children,
}));
