import { useState } from "react";
import { Heart, ShoppingBag, Ruler, Check, ArrowRight } from "lucide-react";
import type { Metal, Product } from "../data/products";
import { money, priceFor } from "../data/products";
import { useStore } from "../store";
import { Overlay } from "./ui";

export function ProductOptions({
  product,
  compact = false,
  selectedMetal,
  onMetalChange,
}: {
  product: Product;
  compact?: boolean;
  selectedMetal?: Metal;
  onMetalChange?: (metal: Metal) => void;
}) {
  const [localMetal, setLocalMetal] = useState<Metal>(product.metals[0]);
  const metal = selectedMetal || localMetal;
  const setMetal = (value: Metal) => {
    setLocalMetal(value);
    onMetalChange?.(value);
  };
  const [size, setSize] = useState("");
  const [sizeHelp, setSizeHelp] = useState(false);
  const [circumference, setCircumference] = useState("");
  const [error, setError] = useState("");
  const { addToBag, wishlist, toggleWish } = useStore();
  const ring = product.category === "Rings";
  const suggested = Math.min(
    9,
    Math.max(4, Math.round((Number(circumference) - 46.8) / 2.6 + 4)),
  );
  return (
    <div className="product-options">
      <span className="eyebrow">
        {product.collection} / {product.category}
      </span>
      <h1 className={compact ? "compact-title" : ""}>{product.name}</h1>
      <p className="detail-price">
        {money(priceFor(product, metal))}
        <span>Complimentary signature packaging</span>
      </p>
      <p className="product-description">{product.description}</p>
      <fieldset className="metal-options">
        <legend>
          Metal <span>{metal}</span>
        </legend>
        <div>
          {product.metals.map((m) => (
            <button
              key={m}
              className={`metal-choice ${m.includes("yellow") ? "gold" : "silver"} ${metal === m ? "active" : ""}`}
              aria-label={m}
              aria-pressed={metal === m}
              onClick={() => setMetal(m)}
            >
              {metal === m && <Check size={15} />}
            </button>
          ))}
        </div>
        <small>
          Photography shows {product.metals[0].toLowerCase()}. Selected finish
          is made to order.
        </small>
      </fieldset>
      {ring && (
        <div className="size-options">
          <div className="size-label">
            <label htmlFor={`size-${product.id}`}>Ring size</label>
            <button className="text-button" onClick={() => setSizeHelp(true)}>
              <Ruler size={14} /> Find your size
            </button>
          </div>
          <select
            id={`size-${product.id}`}
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "size-error" : undefined}
          >
            <option value="">Select your size (US)</option>
            {[4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>
                US {n}
              </option>
            ))}
          </select>
          {error && (
            <p className="form-error" id="size-error">
              {error}
            </p>
          )}
        </div>
      )}
      <div className="add-row">
        <button
          className="button primary"
          onClick={() => {
            if (ring && !size) {
              setError("Please select a ring size.");
              return;
            }
            addToBag(product, metal, ring ? `US ${size}` : "One size");
          }}
        >
          Add to bag <ShoppingBag size={17} />
        </button>
        <button
          className={`icon-button outline-wish ${wishlist.includes(product.id) ? "saved" : ""}`}
          aria-label="Save to wishlist"
          aria-pressed={wishlist.includes(product.id)}
          onClick={() => toggleWish(product.id)}
        >
          <Heart
            size={20}
            fill={wishlist.includes(product.id) ? "currentColor" : "none"}
          />
        </button>
      </div>
      <p className="lead-time">
        <span /> {product.leadTime}
      </p>
      <Overlay
        open={sizeHelp}
        onClose={() => setSizeHelp(false)}
        title="A perfect fit"
      >
        <div className="size-help">
          <span className="eyebrow">THE RING SIZE GUIDE</span>
          <p>
            Wrap a strip of paper around the base of your finger. Mark where it
            meets, then measure that length in millimeters. Measure at the end
            of the day, when your hands are warm.
          </p>
          <table>
            <thead>
              <tr>
                <th>US size</th>
                <th>Inside circumference</th>
              </tr>
            </thead>
            <tbody>
              {[4, 5, 6, 7, 8, 9].map((n, i) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{(46.8 + i * 2.6).toFixed(1)} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
          <label htmlFor="circumference">Your measurement (mm)</label>
          <input
            id="circumference"
            type="number"
            min="46.8"
            max="59.8"
            step="0.1"
            placeholder="e.g. 52"
            value={circumference}
            onChange={(e) => setCircumference(e.target.value)}
          />
          {circumference &&
            Number(circumference) >= 46.8 &&
            Number(circumference) <= 59.8 && (
              <button
                className="button primary"
                onClick={() => {
                  setSize(String(suggested));
                  setError("");
                  setSizeHelp(false);
                }}
              >
                Choose US {suggested}
                <ArrowRight size={16} />
              </button>
            )}
          {circumference &&
            (Number(circumference) < 46.8 || Number(circumference) > 59.8) && (
              <p className="form-error">
                For measurements outside 46.8–59.8 mm, ask our atelier for a
                custom size.
              </p>
            )}
          <small>
            If you fall between sizes, choose the larger size. This paper method
            is a guide; a jeweler can confirm your fit.
          </small>
        </div>
      </Overlay>
    </div>
  );
}
