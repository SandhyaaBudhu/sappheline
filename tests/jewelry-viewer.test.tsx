import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

const { controls, create } = vi.hoisted(() => {
  const controls = {
    setModel: vi.fn(),
    setTheme: vi.fn(),
    setSpinning: vi.fn(),
    zoom: vi.fn(),
    rotate: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn(),
  };
  return { controls, create: vi.fn(() => controls) };
});
vi.mock("../src/components/jewelry/scene", () => ({
  createJewelryScene: create,
}));
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/");
  vi.clearAllMocks();
  Object.defineProperty(window, "WebGL2RenderingContext", {
    value: class {},
    configurable: true,
  });
});
afterEach(() => {
  cleanup();
  delete (window as unknown as Record<string, unknown>).WebGL2RenderingContext;
});
describe("360 degree jewelry studio", () => {
  it("loads on demand, switches real model configs, and routes view controls", async () => {
    const user = userEvent.setup();
    render(<App />);
    const studio = screen.getByRole("region", {
      name: "Beauty, from every angle.",
    });
    expect(create).not.toHaveBeenCalled();
    await user.click(
      within(studio).getByRole("button", { name: "Explore in 360°" }),
    );
    await waitFor(() => expect(create).toHaveBeenCalledTimes(1));
    await user.click(
      within(studio).getByRole("button", { name: "Rotate jewelry left" }),
    );
    expect(controls.rotate).toHaveBeenCalledWith(-Math.PI / 6);
    await user.click(
      within(studio).getByRole("button", { name: "Zoom in jewelry" }),
    );
    expect(controls.zoom).toHaveBeenCalledWith(1);
    await user.click(
      within(studio).getByRole("button", { name: "Start jewelry rotation" }),
    );
    expect(controls.setSpinning).toHaveBeenLastCalledWith(true);
    await user.click(
      within(studio).getByRole("button", { name: "Reset jewelry view" }),
    );
    expect(controls.reset).toHaveBeenCalled();
    expect(controls.setSpinning).toHaveBeenLastCalledWith(false);
    await user.click(
      within(studio).getByRole("button", { name: /The pendant/ }),
    );
    expect(controls.setModel).toHaveBeenLastCalledWith({
      shape: "pendant",
      metal: "14k yellow gold",
      stone: "Sapphire",
    });
    await user.click(
      within(studio).getByRole("button", {
        name: "Preview in Sterling silver",
      }),
    );
    expect(controls.setModel).toHaveBeenLastCalledWith({
      shape: "pendant",
      metal: "Sterling silver",
      stone: "Sapphire",
    });
    await user.click(within(studio).getByRole("button", { name: /The hoops/ }));
    expect(controls.setModel).toHaveBeenLastCalledWith({
      shape: "hoops",
      metal: "14k yellow gold",
      stone: "No stone",
    });
    cleanup();
    expect(controls.dispose).toHaveBeenCalledTimes(1);
  });
  it("keeps studio finish, product finish, price, and bag variant synchronized", async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, "", "/product/nocturne-ring");
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Explore in 360°" }));
    await waitFor(() => expect(create).toHaveBeenCalled());
    await user.click(
      screen.getByRole("button", { name: "Preview in 14k white gold" }),
    );
    expect(
      screen
        .getByRole("button", { name: "14k white gold", exact: true })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByText("$705")).toBeTruthy();
    expect(controls.setModel).toHaveBeenLastCalledWith({
      shape: "ring",
      metal: "14k white gold",
      stone: "Sapphire",
    });
    await user.selectOptions(screen.getByLabelText("Ring size"), "6");
    await user.click(screen.getByRole("button", { name: "Add to bag" }));
    expect(
      JSON.parse(localStorage.getItem("sappheline-bag")!)[0],
    ).toMatchObject({ metal: "14k white gold", price: 705 });
  });
  it("shows photography and disables 3D controls when WebGL is unavailable", async () => {
    delete (window as unknown as Record<string, unknown>)
      .WebGL2RenderingContext;
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Explore in 360°" }));
    expect(screen.getByText("Explore the photographic view.")).toBeTruthy();
    expect(
      (
        screen.getByRole("button", {
          name: "Zoom in jewelry",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(create).not.toHaveBeenCalled();
    expect(
      screen.getByAltText("Nocturne Sapphire Ring photographic preview"),
    ).toBeTruthy();
  });
});
