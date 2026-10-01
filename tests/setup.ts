import { vi } from "vitest";
Object.defineProperty(window, "matchMedia", {
  value: vi
    .fn()
    .mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
});
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", Observer);
vi.stubGlobal("ResizeObserver", Observer);
