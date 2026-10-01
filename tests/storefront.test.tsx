import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  cleanup,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});
afterEach(cleanup);
function open(path: string) {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

describe("Sappheline storefront", () => {
  it("renders every main route and a useful unknown-product state", () => {
    for (const [path, title] of [
      ["/", "A quiet kind of extraordinary."],
      ["/collections", "Distinct worlds. A shared soul."],
      ["/shop", "Your next forever piece."],
      ["/product/nocturne-ring", "Nocturne Sapphire Ring"],
      ["/atelier", "A little of us. All of you."],
      ["/product/missing", "This piece is yet to be made."],
    ]) {
      open(path);
      expect(
        screen.getByRole("heading", { level: 1, name: title }),
      ).toBeTruthy();
      cleanup();
    }
  });
  it("filters by multiple facets, changes sort, and recovers from an empty result", async () => {
    const user = userEvent.setup();
    open("/shop");
    await user.click(screen.getByLabelText(/^Rings/));
    expect(screen.getAllByRole("article")).toHaveLength(3);
    await user.click(screen.getByLabelText("Diamond"));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Halo Diamond Ring", exact: true }),
    ).toBeTruthy();
    await user.click(screen.getByLabelText("Nocturne"));
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("Let’s widen the possibilities.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "See all pieces" }));
    await user.selectOptions(screen.getByLabelText("Sort by"), "price-low");
    const cards = screen.getAllByRole("article");
    expect(
      within(cards[0]).getByRole("link", {
        name: "Entwine Sculptural Hoops",
        exact: true,
      }),
    ).toBeTruthy();
    expect(cards).toHaveLength(8);
  });
  it("persists wishlist changes across a remount", async () => {
    const user = userEvent.setup();
    open("/shop");
    await user.click(
      screen.getByRole("button", {
        name: "Save Nocturne Sapphire Ring to wishlist",
      }),
    );
    expect(JSON.parse(localStorage.getItem("sappheline-wishlist")!)).toEqual([
      "nocturne-ring",
    ]);
    cleanup();
    open("/shop");
    expect(
      screen
        .getByRole("button", {
          name: "Remove Nocturne Sapphire Ring from wishlist",
        })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    await user.click(
      screen.getByRole("button", { name: "Open wishlist, 1 pieces" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Your wishlist (1)" });
    await user.click(
      within(dialog).getByRole("button", {
        name: "Remove Nocturne Sapphire Ring from wishlist",
      }),
    );
    expect(screen.getByText("Keep the pieces that speak to you.")).toBeTruthy();
  });
  it("validates size, reprices metal, manages bag quantities, and confirms demo checkout", async () => {
    const user = userEvent.setup();
    open("/product/nocturne-ring");
    await user.click(screen.getByRole("button", { name: "Add to bag" }));
    expect(screen.getByText("Please select a ring size.")).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "14k white gold", exact: true }),
    );
    expect(screen.getByText("$705")).toBeTruthy();
    await user.selectOptions(screen.getByLabelText("Ring size"), "6");
    await user.click(screen.getByRole("button", { name: "Add to bag" }));
    const dialog = screen.getByRole("dialog", { name: "Your bag (1)" });
    await user.click(
      within(dialog).getByRole("button", {
        name: "Increase Nocturne Sapphire Ring quantity",
      }),
    );
    expect(screen.getByRole("dialog", { name: "Your bag (2)" })).toBeTruthy();
    expect(screen.getByText("$1,410")).toBeTruthy();
    const persisted = JSON.parse(localStorage.getItem("sappheline-bag")!);
    expect(persisted[0]).toMatchObject({
      metal: "14k white gold",
      size: "US 6",
      quantity: 2,
      price: 705,
    });
    await user.click(
      screen.getByRole("button", {
        name: "Decrease Nocturne Sapphire Ring quantity",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Complete demo order" }),
    );
    expect(screen.getByText("DEMO ORDER CONFIRMED")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("sappheline-bag")!)).toEqual([]);
    expect(screen.getByText(/No payment was taken/)).toBeTruthy();
  });
  it("calculates delivery and removes the last bag item", async () => {
    const user = userEvent.setup();
    open("/product/entwine-hoops");
    await user.click(screen.getByRole("button", { name: "Add to bag" }));
    expect(screen.getByText("$15")).toBeTruthy();
    expect(
      screen.getByText(/Add \$65 for complimentary delivery/),
    ).toBeTruthy();
    await user.click(
      screen.getByRole("button", {
        name: "Remove Entwine Sculptural Hoops from bag",
      }),
    );
    expect(
      screen.getByText("Your bag is waiting for its first piece."),
    ).toBeTruthy();
  });
  it("uses the ring helper and navigates the zoom gallery", async () => {
    const user = userEvent.setup();
    open("/product/nocturne-ring");
    await user.click(screen.getByRole("button", { name: "Find your size" }));
    await user.type(screen.getByLabelText("Your measurement (mm)"), "52");
    await user.click(screen.getByRole("button", { name: "Choose US 6" }));
    expect(
      (screen.getByLabelText("Ring size") as HTMLSelectElement).value,
    ).toBe("6");
    await user.click(
      screen.getByRole("button", { name: "Show Worn, your way" }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Enlarge Nocturne Sapphire Ring: Worn, your way",
      }),
    );
    expect(screen.getByText("3 / 3 · Worn, your way")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("1 / 3 · The piece")).toBeTruthy();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
  it("opens quick view, selects a ring size, and adds to bag", async () => {
    const user = userEvent.setup();
    open("/shop");
    await user.click(
      within(screen.getAllByRole("article")[0]).getByRole("button", {
        name: "Quick view",
      }),
    );
    const dialog = screen.getByRole("dialog", { name: "A closer look" });
    await user.selectOptions(within(dialog).getByLabelText("Ring size"), "7");
    await user.click(
      within(dialog).getByRole("button", { name: "Add to bag" }),
    );
    expect(screen.getByRole("dialog", { name: "Your bag (1)" })).toBeTruthy();
  });
  it("searches products and offers a recoverable empty result", async () => {
    const user = userEvent.setup();
    open("/");
    await user.click(screen.getByRole("button", { name: "Search jewelry" }));
    await user.type(screen.getByLabelText("Search products"), "sapphire");
    expect(screen.getByText("4 pieces found")).toBeTruthy();
    await user.clear(screen.getByLabelText("Search products"));
    await user.type(screen.getByLabelText("Search products"), "unobtainium");
    expect(screen.getByText("0 pieces found")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByText("A few pieces you might love")).toBeTruthy();
  });
  it("validates and confirms a custom inquiry without sending anything", async () => {
    const user = userEvent.setup();
    open("/atelier");
    await user.click(screen.getByRole("button", { name: "Share your story" }));
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeTruthy();
    await user.type(screen.getByLabelText(/Your name/), "Alex Morgan");
    await user.type(
      within(screen.getByRole("main")).getByLabelText(/Email address/),
      "alex@example.test",
    );
    await user.selectOptions(
      screen.getByLabelText(/Project type/),
      "A bespoke ring",
    );
    await user.selectOptions(
      screen.getByLabelText(/Preferred metal/),
      "Sterling silver",
    );
    await user.selectOptions(
      screen.getByLabelText(/Your timeline/),
      "In 3–6 months",
    );
    await user.selectOptions(
      screen.getByLabelText(/Budget band/),
      "$500–$1,000",
    );
    await user.type(
      screen.getByLabelText(/A little about your idea/),
      "A sapphire ring to celebrate an important anniversary.",
    );
    await user.click(screen.getByRole("button", { name: "Share your story" }));
    expect(screen.getByText("Thank you, Alex.")).toBeTruthy();
    expect(screen.getByText(/Your inquiry has not been sent/)).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "Start a new inquiry" }),
    );
    expect((screen.getByLabelText(/Your name/) as HTMLInputElement).value).toBe(
      "",
    );
  });
  it("persists and restores the dark theme", async () => {
    const user = userEvent.setup();
    open("/");
    await user.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(JSON.parse(localStorage.getItem("sappheline-theme")!)).toBe("dark");
    cleanup();
    open("/");
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeTruthy();
  });
  it("filters through the mobile drawer and navigates through the mobile menu", async () => {
    const user = userEvent.setup();
    open("/shop");
    await user.click(screen.getByRole("button", { name: "Filters" }));
    const dialog = screen.getByRole("dialog", {
      name: "Refine your discovery",
    });
    await user.click(
      within(dialog).getByRole("checkbox", { name: /Earrings/ }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
    const desktopPrice = document.getElementById("desktop-price"),
      mobilePrice = document.getElementById("mobile-price");
    expect(desktopPrice).toBeTruthy();
    expect(mobilePrice).toBeTruthy();
    expect(desktopPrice).not.toBe(mobilePrice);
    await user.click(
      within(dialog).getByRole("button", { name: "Show 2 pieces" }),
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    await user.click(
      within(
        screen.getByRole("dialog", { name: "Explore Sappheline" }),
      ).getByRole("link", { name: "Collections", exact: true }),
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Distinct worlds. A shared soul.",
      }),
    ).toBeTruthy();
  });
  it("expands product information and keyboard-navigates the lightbox", async () => {
    const user = userEvent.setup();
    open("/product/nocturne-ring");
    const shipping = within(screen.getByRole("main")).getByRole("button", {
      name: "Delivery & returns",
      exact: true,
    });
    await user.click(shipping);
    expect(shipping.getAttribute("aria-expanded")).toBe("true");
    await user.click(
      screen.getByRole("button", {
        name: "Enlarge Nocturne Sapphire Ring: The piece",
      }),
    );
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("2 / 3 · The details")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("1 / 3 · The piece")).toBeTruthy();
  });
});
