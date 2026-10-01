import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { SlidersHorizontal, X, ArrowRight, Gem } from "lucide-react";
import { products, collections, money } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Accordion, Overlay, Photo } from "../components/ui";

const filterGroups: { key: string; label: string; values: string[] }[] = [
  {
    key: "category",
    label: "Category",
    values: ["Rings", "Necklaces", "Earrings"],
  },
  {
    key: "metal",
    label: "Metal",
    values: ["Sterling silver", "14k white gold", "14k yellow gold"],
  },
  {
    key: "stone",
    label: "Stone",
    values: ["Sapphire", "Diamond", "Amethyst", "No stone"],
  },
  {
    key: "collection",
    label: "Collection",
    values: collections.map((c) => c.name),
  },
];
export function Shop() {
  const [params, setParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const sort = params.get("sort") || "featured";
  const max = Number(params.get("price") || 1000);
  const gift = params.has("gift");
  const active = filterGroups.flatMap((g) =>
    params.getAll(g.key).map((v) => ({ key: g.key, value: v })),
  );
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    const values = next.getAll(key);
    next.delete(key);
    (values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value]
    ).forEach((v) => next.append(key, v));
    setParams(next, { replace: true });
  };
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next, { replace: true });
  };
  const clear = () => setParams({}, { replace: true });
  const filtered = products.filter(
    (p) =>
      filterGroups.every((g) => {
        const values = params.getAll(g.key);
        if (!values.length) return true;
        return g.key === "metal"
          ? p.metals.some((m) => values.includes(m))
          : values.includes(p[g.key as "category" | "stone" | "collection"]);
      }) &&
      p.price <= max &&
      (!gift || p.price <= 400),
  );
  const sorted = [...filtered].sort((a, b) =>
    sort === "price-low"
      ? a.price - b.price
      : sort === "price-high"
        ? b.price - a.price
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : 0,
  );
  const filters = (scope: string) => (
    <>
      <div className="filter-top">
        <span className="eyebrow">REFINE YOUR DISCOVERY</span>
        <button className="text-button" onClick={clear}>
          Clear all
        </button>
      </div>
      {filterGroups.map((g) => (
        <Accordion key={g.key} title={g.label} defaultOpen>
          <div className="filter-options">
            {g.values.map((value) => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={params.getAll(g.key).includes(value)}
                  onChange={() => change(g.key, value)}
                />
                <span>{value}</span>
                {g.key === "category" && (
                  <small>
                    {products.filter((p) => p.category === value).length}
                  </small>
                )}
              </label>
            ))}
          </div>
        </Accordion>
      ))}
      <Accordion title="Price" defaultOpen>
        <label className="price-label" htmlFor={`${scope}-price`}>
          Up to {money(max)}
        </label>
        <input
          id={`${scope}-price`}
          className="price-range"
          type="range"
          min="150"
          max="1000"
          step="25"
          value={max}
          onChange={(e) => setParam("price", e.target.value)}
        />
        <div className="range-labels">
          <span>$150</span>
          <span>$1,000</span>
        </div>
      </Accordion>
      <div className="filter-atelier">
        <Gem size={24} strokeWidth={1} />
        <h3>Made just for you.</h3>
        <p>
          Have something in mind?
          <br />
          Let’s bring it to life.
        </p>
        <Link className="arrow-link" to="/atelier#inquiry">
          Visit the atelier <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
  return (
    <>
      <section className="shop-intro">
        <div className="container">
          <div>
            <span className="eyebrow">THE SAPPHELINE JEWELRY BOX</span>
            <h1>
              {gift ? "Small gifts. Big feelings." : "Your next forever piece."}
            </h1>
            <p>
              {gift
                ? "A considered edit of thoughtful gifts, all under $400."
                : "Sculptural forms, precious details. Find something that feels like you."}
            </p>
          </div>
          <span className="shop-intro-star">✧</span>
        </div>
      </section>
      <section className="shop-content container">
        <div className="shop-toolbar">
          <div>
            <span>
              {sorted.length} {sorted.length === 1 ? "piece" : "pieces"}
            </span>
            {params.get("collection") && (
              <span className="toolbar-collection">
                {" "}
                / {params.getAll("collection").join(", ")}
              </span>
            )}
          </div>
          <div className="toolbar-controls">
            <button
              className="filter-toggle"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal size={16} /> Filters{" "}
              {active.length > 0 && `(${active.length})`}
            </button>
            <label htmlFor="sort-products">Sort by</label>
            <select
              id="sort-products"
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>
        <div className="shop-layout">
          <aside className="shop-sidebar" aria-label="Product filters">
            {filters("desktop")}
          </aside>
          <div className="shop-products">
            {(active.length > 0 || max < 1000 || gift) && (
              <div className="active-filters">
                {active.map((f) => (
                  <button
                    key={`${f.key}-${f.value}`}
                    onClick={() => change(f.key, f.value)}
                  >
                    {f.value}
                    <X size={12} />
                  </button>
                ))}
                {max < 1000 && (
                  <button onClick={() => setParam("price", "1000")}>
                    Up to {money(max)}
                    <X size={12} />
                  </button>
                )}
                {gift && (
                  <button
                    onClick={() => {
                      const n = new URLSearchParams(params);
                      n.delete("gift");
                      setParams(n);
                    }}
                  >
                    Gift edit
                    <X size={12} />
                  </button>
                )}
              </div>
            )}
            {sorted.length ? (
              <div className="product-grid shop-grid">
                {sorted.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty-state shop-empty">
                <Gem size={42} strokeWidth={1} />
                <h2>Let’s widen the possibilities.</h2>
                <p>
                  No pieces match this combination. Try changing a filter
                  <br />
                  or explore our complete jewelry box.
                </p>
                <button className="button primary" onClick={clear}>
                  See all pieces <ArrowRight size={16} />
                </button>
              </div>
            )}
            <div className="shop-bottom-note">
              <span>✧</span>
              <p>Made thoughtfully. Chosen personally. Kept forever.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="shop-banner">
        <Photo
          src={`${import.meta.env.BASE_URL}images/hero.png`}
          alt="Sapphire and silver, a signature Sappheline pairing"
          loading="lazy"
        />
        <div>
          <span className="eyebrow">
            NOT JUST A PIECE. A LITTLE PIECE OF YOU.
          </span>
          <h2>
            Find your own
            <br />
            <em>kind of extraordinary.</em>
          </h2>
          <Link to="/atelier" className="arrow-link">
            Discover our story
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
      <Overlay
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Refine your discovery"
        drawer
        className="mobile-filter-drawer"
      >
        <div className="mobile-filters">{filters("mobile")}</div>
        <div className="filter-drawer-footer">
          <button
            className="button primary"
            onClick={() => setFilterOpen(false)}
          >
            Show {sorted.length} pieces
            <ArrowRight size={16} />
          </button>
        </div>
      </Overlay>
    </>
  );
}
