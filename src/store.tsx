import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Metal, Product } from "./data/products";
import { priceFor } from "./data/products";

export interface BagItem {
  key: string;
  id: string;
  metal: Metal;
  size: string;
  quantity: number;
  price: number;
}
function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private browsing still supports the current session. */
  }
}
function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial));
  useEffect(() => {
    persist(key, value);
  }, [key, value]);
  return [value, setValue] as const;
}
interface Store {
  theme: string;
  toggleTheme: () => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  bag: BagItem[];
  addToBag: (product: Product, metal: Metal, size: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearBag: () => void;
  drawer: "bag" | "wishlist" | "search" | null;
  setDrawer: (value: "bag" | "wishlist" | "search" | null) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  toast: string;
  notify: (message: string) => void;
}
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = usePersisted("sappheline-theme", "light");
  const [wishlist, setWishlist] = usePersisted<string[]>(
    "sappheline-wishlist",
    [],
  );
  const [bag, setBag] = usePersisted<BagItem[]>("sappheline-bag", []);
  const [drawer, setDrawer] = useState<Store["drawer"]>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme =
      theme === "dark" ? "dark" : "light";
  }, [theme]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  const toggleWish = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setToast(
      wishlist.includes(id)
        ? "Piece removed from your wishlist"
        : "A little something saved for later",
    );
  };
  const addToBag = (product: Product, metal: Metal, size: string) => {
    const key = `${product.id}-${metal}-${size}`;
    setBag((prev) =>
      prev.some((x) => x.key === key)
        ? prev.map((x) =>
            x.key === key ? { ...x, quantity: x.quantity + 1 } : x,
          )
        : [
            ...prev,
            {
              key,
              id: product.id,
              metal,
              size,
              quantity: 1,
              price: priceFor(product, metal),
            },
          ],
    );
    setQuickView(null);
    setDrawer("bag");
    setToast(`${product.name} added to your bag`);
  };
  return (
    <Context.Provider
      value={{
        theme,
        toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
        wishlist,
        toggleWish,
        bag,
        addToBag,
        setQuantity: (key, q) =>
          setBag((prev) =>
            q < 1
              ? prev.filter((x) => x.key !== key)
              : prev.map((x) =>
                  x.key === key ? { ...x, quantity: Math.min(q, 99) } : x,
                ),
          ),
        clearBag: () => setBag([]),
        drawer,
        setDrawer,
        quickView,
        setQuickView,
        toast,
        notify: setToast,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const context = useContext(Context);
  if (!context) throw new Error("StoreProvider is required");
  return context;
}
