import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Gift,
  ShieldCheck,
  Truck,
  ZoomIn,
  ZoomOut,
  Rotate3D,
} from "lucide-react";
import { products } from "../data/products";
import type { Metal } from "../data/products";
import { JewelryExperience } from "../components/JewelryExperience";
import { ProductOptions } from "../components/ProductOptions";
import { ProductCard } from "../components/ProductCard";
import { Accordion, Overlay, Photo, SectionHeading } from "../components/ui";

export function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [view, setView] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [metal, setMetal] = useState<Metal>(
    product?.metals[0] || "Sterling silver",
  );
  useEffect(() => {
    setView(0);
    setZoom(false);
    setLightbox(false);
    setMetal(product?.metals[0] || "Sterling silver");
    if (product) document.title = `${product.name} — SAPPHELINE`;
  }, [id, product]);
  useEffect(() => {
    if (!lightbox) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setView(
          (previous) => (previous + (event.key === "ArrowRight" ? 1 : 2)) % 3,
        );
        setZoom(false);
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [lightbox]);
  if (!product)
    return (
      <div className="empty-state not-found">
        <span className="eyebrow">A LITTLE DETOUR</span>
        <h1>This piece is yet to be made.</h1>
        <p>Let’s find something extraordinary in our jewelry box.</p>
        <Link className="button primary" to="/shop">
          Explore all jewelry
          <ArrowRight size={17} />
        </Link>
      </div>
    );
  const isSignature =
    product.id === "nocturne-ring" || product.id === "stillwater-ring";
  const gallery = [
    {
      src: product.image,
      position: product.position || "50% 50%",
      scale: 1,
      label: "The piece",
    },
    {
      src: product.image,
      position: product.position || "50% 50%",
      scale: 1.55,
      label: "The details",
    },
    {
      src: isSignature ? `${import.meta.env.BASE_URL}images/editorial.png` : product.image,
      position: isSignature ? "50% 50%" : product.position || "50% 50%",
      scale: isSignature ? 1 : 0.88,
      label: isSignature ? "Worn, your way" : "The studio view",
    },
  ];
  const current = gallery[view];
  const related = products
    .filter((p) => p.id !== product.id && p.collection === product.collection)
    .concat(products.filter((p) => p.collection !== product.collection))
    .slice(0, 4);
  const next = (direction: number) => {
    setView((view + direction + gallery.length) % gallery.length);
    setZoom(false);
  };
  return (
    <>
      <div className="breadcrumb container">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">All jewelry</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <section className="product-detail container">
        <div className="gallery">
          <button
            className="gallery-main"
            onClick={() => {
              setZoom(false);
              setLightbox(true);
            }}
            aria-label={`Enlarge ${product.name}: ${current.label}`}
          >
            <Photo
              src={current.src}
              alt={`${product.name} — ${current.label.toLowerCase()}`}
              style={{
                objectPosition: current.position,
                transform: `scale(${current.scale})`,
              }}
            />
            <span className="gallery-view-label">{current.label}</span>
            <span className="gallery-expand">
              <Expand size={18} />
            </span>
          </button>
          <div className="gallery-thumbnails">
            {gallery.map((g, i) => (
              <button
                key={i}
                className={view === i ? "active" : ""}
                onClick={() => setView(i)}
                aria-label={`Show ${g.label}`}
                aria-pressed={view === i}
              >
                <Photo
                  src={g.src}
                  alt={g.label}
                  style={{
                    objectPosition: g.position,
                    transform: `scale(${g.scale})`,
                  }}
                />
              </button>
            ))}
            <span>
              Considered from
              <br /> every angle.
            </span>
          </div>
          <a className="gallery-360-link" href="#piece-360">
            <Rotate3D size={16} strokeWidth={1.2} /> View the design in 360°{" "}
            <ArrowRight size={14} />
          </a>
        </div>
        <div className="product-detail-copy">
          <ProductOptions
            key={product.id}
            product={product}
            selectedMetal={metal}
            onMetalChange={setMetal}
          />
          <div className="product-promises">
            <span>
              <Gift size={16} strokeWidth={1.2} />
              Gift-ready
            </span>
            <span>
              <Truck size={16} strokeWidth={1.2} />
              Tracked delivery
            </span>
            <span>
              <ShieldCheck size={16} strokeWidth={1.2} />
              Crafted to last
            </span>
          </div>
          <Accordion title="The finer details" defaultOpen>
            <p>
              Hand-finished {product.metals[0].toLowerCase()}
              {product.stone !== "No stone"
                ? ` with a carefully selected ${product.stone.toLowerCase()} stone`
                : ""}
              . Each piece carries subtle variations that make it yours.
            </p>
            <ul>
              <li>
                {product.category === "Rings"
                  ? "Available in US sizes 4–9; custom sizes on inquiry."
                  : product.category === "Necklaces"
                    ? "Adjustable chain: 40–45 cm, with a secure clasp."
                    : "Sold as a pair, with secure fastenings."}
              </li>
              <li>
                Presented in a signature Sappheline box with a soft pouch.
              </li>
            </ul>
          </Accordion>
          <Accordion title="Delivery & returns">
            <p>
              Complimentary tracked delivery over $250; $15 for orders below.{" "}
              {product.leadTime}. Ready-to-ship pieces can be returned unworn
              within 30 days. Custom and made-to-order pieces are final sale.
            </p>
            <p>All delivery details are illustrative for this demonstration.</p>
          </Accordion>
          <Accordion title="Care for your piece">
            <p>
              A little care goes a long way. Remove before swimming or exercise.
              Keep away from perfume and household cleaners, gently polish with
              a soft cloth, and store in its own pouch.
            </p>
          </Accordion>
          <Accordion title="Make it personal">
            <p>
              Have a different stone, finish, or size in mind? Our atelier can
              help you create your own interpretation.
            </p>
            <Link to="/atelier#inquiry" className="arrow-link">
              Begin a conversation
              <ArrowRight size={15} />
            </Link>
          </Accordion>
        </div>
      </section>
      <JewelryExperience
        product={product}
        selectedMetal={metal}
        onMetalChange={setMetal}
      />
      <section className="product-story">
        <div className="container">
          <span className="eyebrow">THE STORY WITHIN THE STONE</span>
          <h2>
            Not simply made.
            <br /> <em>Considered.</em>
          </h2>
          <div>
            <p>
              Every {product.collection} piece begins with a quiet observation:
              the way light falls, a line found in nature, the feeling of
              something familiar.
            </p>
            <p>
              From the first sketch to the final polish, each detail is shaped
              with intention. The result is a piece that feels effortless, and
              becomes more yours with time.
            </p>
            <Link to="/atelier" className="arrow-link">
              The art of making
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="A BEAUTIFUL CONVERSATION"
          title="Better, together."
          link="See all pieces"
          to="/shop"
        />
        <div className="product-grid featured-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <Overlay
        open={lightbox}
        onClose={() => setLightbox(false)}
        title={product.name}
        className="lightbox"
      >
        <div className={`lightbox-image ${zoom ? "zoomed" : ""}`}>
          <Photo
            src={current.src}
            alt={`${product.name} enlarged, ${current.label.toLowerCase()}`}
            style={{
              objectPosition: current.position,
              transform: `scale(${zoom ? current.scale * 1.65 : current.scale})`,
            }}
          />
        </div>
        <div className="lightbox-controls">
          <button
            className="icon-button"
            onClick={() => next(-1)}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <span>
            {view + 1} / {gallery.length} · {current.label}
          </span>
          <button
            className="icon-button"
            onClick={() => next(1)}
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
          <button
            className="icon-button"
            onClick={() => setZoom(!zoom)}
            aria-label={zoom ? "Zoom out" : "Zoom in"}
          >
            {zoom ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
        </div>
      </Overlay>
    </>
  );
}
