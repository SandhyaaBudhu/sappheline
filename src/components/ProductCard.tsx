import { Heart, ArrowUpRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { money } from "../data/products";
import { useStore } from "../store";
import { Photo } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish, setQuickView } = useStore();
  const saved = wishlist.includes(product.id);
  return (
    <article className="product-card">
      <div
        className={`product-image ${product.image.includes("hero") ? "sapphire-image" : ""}`}
      >
        <Link
          to={`/product/${product.id}`}
          aria-label={`Explore ${product.name}`}
        >
          <Photo
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{ objectPosition: product.position }}
          />
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`wish-button ${saved ? "saved" : ""}`}
          onClick={() => toggleWish(product.id)}
          aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}
          aria-pressed={saved}
        >
          <Heart
            size={17}
            strokeWidth={1.4}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
        <button className="quick-view" onClick={() => setQuickView(product)}>
          <Eye size={15} /> Quick view <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="product-caption">
        <div>
          <Link to={`/product/${product.id}`} className="product-name">
            {product.name}
          </Link>
          <p>
            {product.metals[0]}
            {product.stone !== "No stone"
              ? ` · ${product.stone.toLowerCase()}`
              : ""}
          </p>
        </div>
        <span>{money(product.price)}</span>
      </div>
    </article>
  );
}
