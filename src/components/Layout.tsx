import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  Check,
  Plus,
  Minus,
  Trash2,
  Gem,
  PackageCheck,
  X,
} from "lucide-react";
import { products, money } from "../data/products";
import { useStore } from "../store";
import { Overlay, Photo } from "./ui";
import { ProductOptions } from "./ProductOptions";

const navigation = [
  { to: "/collections", label: "Collections" },
  { to: "/shop", label: "All jewelry" },
  { to: "/atelier", label: "The atelier" },
];
const policies: Record<string, { title: string; text: string }> = {
  shipping: {
    title: "Delivery & returns",
    text: "Every piece arrives in our signature gift box. Complimentary tracked delivery on orders over $250; $15 below. Ready-to-ship pieces leave the atelier within 2–3 working days. Made-to-order lead times are shown on each piece. Unworn ready-to-ship pieces may be returned within 30 days. Bespoke and engraved pieces are final sale. This is a portfolio demo; no orders are processed.",
  },
  care: {
    title: "Caring for your jewelry",
    text: "Keep each piece in its soft pouch, away from direct sunlight and moisture. Remove jewelry before swimming, exercise, or applying fragrance. Gently polish metal with a soft, dry cloth. Clean stones with lukewarm water and a soft brush; avoid harsh chemicals and ultrasonic cleaners. Store chains separately to prevent tangling.",
  },
  privacy: {
    title: "Your privacy",
    text: "This independent portfolio demo has no server, tracking, real payment processing, or email service. Your theme, bag, wishlist, and newsletter preference stay in your browser’s local storage. Atelier form entries are used only for the on-screen confirmation and are never sent.",
  },
  contact: {
    title: "A little personal attention",
    text: "Have a question about a piece, a special occasion, or a design you have in mind? Visit our atelier to explore a personal commission and try the inquiry form. This is a demonstration storefront, so there is no live customer-service team or outgoing email.",
  },
};
export function Layout() {
  const { theme, toggleTheme, bag, wishlist, setDrawer, toast } = useStore();
  const [menu, setMenu] = useState(false);
  const [policy, setPolicy] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenu(false);
    if (!pathname.startsWith("/product/"))
      document.title =
        pathname === "/"
          ? "SAPPHELINE — A quiet kind of extraordinary"
          : `${pathname.startsWith("/product") ? "The piece" : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)} — SAPPHELINE`;
  }, [pathname]);
  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      localStorage.setItem(
        "sappheline-newsletter",
        JSON.stringify({ email: email.trim(), subscribed: true }),
      );
    } catch {
      /* Keep confirmation available. */
    }
    setSubscribed(true);
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <span>COMPLIMENTARY DELIVERY ON ORDERS OVER $250</span>
        <span className="announcement-divider">✧</span>
        <span className="announcement-second">
          MADE WITH INTENTION. WORN FOR A LIFETIME.
        </span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="wordmark" aria-label="Sappheline home">
            SAPPHELINE<span>FINE JEWELRY</span>
          </Link>
          <nav className="desktop-navigation" aria-label="Main navigation">
            {navigation.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
            <NavLink to="/shop?collection=Nocturne" className="nav-special">
              New: Nocturne <span>↗</span>
            </NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              className="icon-button"
              onClick={() => setDrawer("search")}
              aria-label="Search jewelry"
            >
              <Search size={19} />
            </button>
            <button
              className="icon-button header-wishlist"
              onClick={() => setDrawer("wishlist")}
              aria-label={`Open wishlist, ${wishlist.length} pieces`}
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="count-dot">{wishlist.length}</span>
              )}
            </button>
            <button
              className="icon-button bag-button"
              onClick={() => setDrawer("bag")}
              aria-label={`Open shopping bag, ${bag.reduce((a, b) => a + b.quantity, 0)} pieces`}
            >
              <ShoppingBag size={19} />
              <span className="bag-count">
                {bag.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-top container">
          <div className="footer-brand">
            <Link className="wordmark" to="/">
              SAPPHELINE<span>FINE JEWELRY, WITH FEELING.</span>
            </Link>
            <p>
              Considered forms. Meaningful details.
              <br /> Extraordinary, in your own quiet way.
            </p>
            <div className="social-links">
              <button onClick={() => setPolicy("contact")}>
                Instagram <ArrowUpRight size={13} />
              </button>
              <button onClick={() => setPolicy("contact")}>
                Pinterest <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
          <div className="footer-column">
            <h3>EXPLORE</h3>
            <Link to="/shop">All jewelry</Link>
            <Link to="/collections">Our collections</Link>
            <Link to="/shop?category=Rings">Rings</Link>
            <Link to="/shop?category=Necklaces">Necklaces</Link>
            <Link to="/shop?category=Earrings">Earrings</Link>
            <Link to="/atelier">The atelier</Link>
          </div>
          <div className="footer-column">
            <h3>HERE FOR YOU</h3>
            <button onClick={() => setPolicy("shipping")}>
              Delivery & returns
            </button>
            <button onClick={() => setPolicy("care")}>Jewelry care</button>
            <Link to="/product/nocturne-ring">Ring size guide</Link>
            <button onClick={() => setPolicy("contact")}>Get in touch</button>
            <button onClick={() => setPolicy("privacy")}>Privacy</button>
          </div>
          <div className="newsletter">
            <span className="eyebrow">LET’S STAY CLOSE</span>
            <h3>A note, now and then.</h3>
            <p>
              New collections, atelier stories, and little things
              <br className="desktop-break" /> we think you’ll love.
            </p>
            {subscribed ? (
              <div className="subscribe-success">
                <Check size={17} /> You’re on the list. A lovely place to be.
                <small>
                  Demo preference saved on this device. No emails are sent.
                </small>
              </div>
            ) : (
              <form onSubmit={subscribe}>
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" aria-label="Join the newsletter">
                  <ArrowRight size={19} />
                </button>
              </form>
            )}
            <small>
              By joining, you agree to our{" "}
              <button onClick={() => setPolicy("privacy")}>
                privacy policy
              </button>
              .
            </small>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>
            © {new Date().getFullYear()} Sappheline. Made with intention.
          </span>
          <span>
            PORTFOLIO DEMO <span className="tiny-star">✧</span> USD $
          </span>
        </div>
      </footer>
      <Overlay
        open={menu}
        onClose={() => setMenu(false)}
        title="Explore Sappheline"
        drawer
      >
        <nav className="mobile-navigation">
          {navigation.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setMenu(false)}>
              {n.label}
              <ArrowRight size={20} />
            </Link>
          ))}
          <Link to="/shop?collection=Nocturne" onClick={() => setMenu(false)}>
            The Nocturne collection
            <ArrowRight size={20} />
          </Link>
          <button
            onClick={() => {
              setMenu(false);
              setDrawer("wishlist");
            }}
          >
            Your wishlist <Heart size={20} />
          </button>
        </nav>
      </Overlay>
      <Overlay
        open={!!policy}
        onClose={() => setPolicy(null)}
        title={policy ? policies[policy].title : ""}
      >
        <div className="policy-content">
          <Gem size={34} strokeWidth={1} />
          <p>{policy ? policies[policy].text : ""}</p>
          {policy === "contact" && (
            <Link
              className="arrow-link"
              to="/atelier"
              onClick={() => setPolicy(null)}
            >
              Explore the atelier
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </Overlay>
      <GlobalPanels />
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Check size={16} />
            {toast}
          </>
        )}
      </div>
    </>
  );
}
function GlobalPanels() {
  const {
    drawer,
    setDrawer,
    bag,
    setQuantity,
    clearBag,
    wishlist,
    toggleWish,
    quickView,
    setQuickView,
  } = useStore();
  const [search, setSearch] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPieces, setOrderPieces] = useState(0);
  const subtotal = bag.reduce((a, b) => a + b.price * b.quantity, 0);
  const searchResults = products.filter((p) =>
    `${p.name} ${p.category} ${p.collection} ${p.stone} ${p.metals.join(" ")}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  useEffect(() => {
    if (drawer === "bag") setConfirmed(false);
  }, [drawer]);
  const close = () => setDrawer(null);
  return (
    <>
      <Overlay
        open={drawer === "bag"}
        onClose={close}
        title={
          confirmed
            ? "A lovely choice."
            : `Your bag (${bag.reduce((a, b) => a + b.quantity, 0)})`
        }
        drawer
      >
        {confirmed ? (
          <div className="confirmation">
            <PackageCheck size={52} strokeWidth={1} />
            <span className="eyebrow">DEMO ORDER CONFIRMED</span>
            <h3>
              Something extraordinary
              <br /> is coming your way.
            </h3>
            <p>
              You tried the complete bag experience with {orderPieces}{" "}
              {orderPieces === 1 ? "piece" : "pieces"}, totaling{" "}
              {money(orderTotal)}.
            </p>
            <p className="demo-note">
              This is a portfolio demonstration. No payment was taken, and no
              order will be shipped.
            </p>
            <button className="button primary" onClick={close}>
              Keep exploring <ArrowRight size={17} />
            </button>
          </div>
        ) : bag.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} strokeWidth={1} />
            <h3>A little room for something lovely.</h3>
            <p>Your bag is waiting for its first piece.</p>
            <Link className="button primary" to="/shop" onClick={close}>
              Explore all jewelry <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="bag-note">
              <Gem size={16} /> Each piece, beautifully gift-boxed.
            </div>
            <div className="drawer-list">
              {bag.map((item) => {
                const p = products.find((x) => x.id === item.id);
                if (!p) return null;
                return (
                  <div className="bag-item" key={item.key}>
                    <Link to={`/product/${p.id}`} onClick={close}>
                      <Photo
                        src={p.image}
                        alt={p.name}
                        style={{ objectPosition: p.position }}
                      />
                    </Link>
                    <div className="bag-item-details">
                      <Link to={`/product/${p.id}`} onClick={close}>
                        {p.name}
                      </Link>
                      <p>
                        {item.metal} · {item.size}
                      </p>
                      <span>{money(item.price)}</span>
                      <div className="bag-item-bottom">
                        <div className="quantity-control">
                          <button
                            aria-label={`Decrease ${p.name} quantity`}
                            onClick={() =>
                              setQuantity(item.key, item.quantity - 1)
                            }
                          >
                            <Minus size={13} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            aria-label={`Increase ${p.name} quantity`}
                            onClick={() =>
                              setQuantity(item.key, item.quantity + 1)
                            }
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          className="icon-button"
                          onClick={() => setQuantity(item.key, 0)}
                          aria-label={`Remove ${p.name} from bag`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bag-summary">
              <div>
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <p>
                {subtotal >= 250
                  ? "Your order qualifies for complimentary delivery."
                  : `Add ${money(250 - subtotal)} for complimentary delivery.`}
              </p>
              <div className="shipping-total">
                <span>Delivery</span>
                <span>{subtotal >= 250 ? "Complimentary" : money(15)}</span>
              </div>
              <button
                className="button primary"
                onClick={() => {
                  setOrderTotal(subtotal + (subtotal >= 250 ? 0 : 15));
                  setOrderPieces(bag.reduce((a, b) => a + b.quantity, 0));
                  setConfirmed(true);
                  clearBag();
                }}
              >
                Complete demo order <ArrowRight size={17} />
              </button>
              <small>
                Demo checkout · No payment or personal details needed.
              </small>
            </div>
          </>
        )}
      </Overlay>
      <Overlay
        open={drawer === "wishlist"}
        onClose={close}
        title={`Your wishlist (${wishlist.length})`}
        drawer
      >
        {wishlist.length === 0 ? (
          <div className="empty-state">
            <Heart size={40} strokeWidth={1} />
            <h3>Keep the pieces that speak to you.</h3>
            <p>Tap a heart to save something for later.</p>
            <Link className="button primary" to="/shop" onClick={close}>
              Find your next favorite <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <p className="drawer-intro">
              A collection of little possibilities. Saved for whenever you’re
              ready.
            </p>
            <div className="drawer-list">
              {products
                .filter((p) => wishlist.includes(p.id))
                .map((p) => (
                  <div className="saved-item" key={p.id}>
                    <Link to={`/product/${p.id}`} onClick={close}>
                      <Photo
                        src={p.image}
                        alt={p.name}
                        style={{ objectPosition: p.position }}
                      />
                    </Link>
                    <div>
                      <Link to={`/product/${p.id}`} onClick={close}>
                        {p.name}
                      </Link>
                      <p>{money(p.price)}</p>
                      <Link
                        className="text-button"
                        to={`/product/${p.id}`}
                        onClick={close}
                      >
                        Discover the piece <ArrowRight size={13} />
                      </Link>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={`Remove ${p.name} from wishlist`}
                      onClick={() => toggleWish(p.id)}
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}
      </Overlay>
      <Overlay
        open={drawer === "search"}
        onClose={close}
        title="Find something extraordinary"
        drawer
      >
        <div className="search-field">
          <Search size={19} />
          <label htmlFor="jewelry-search" className="sr-only">
            Search products
          </label>
          <input
            id="jewelry-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Try sapphire, rings, or silver…"
          />
        </div>
        <p className="search-caption">
          {search
            ? `${searchResults.length} pieces found`
            : "A few pieces you might love"}
        </p>
        <div className="drawer-list">
          {searchResults.slice(0, 8).map((p) => (
            <Link
              key={p.id}
              className="search-result"
              to={`/product/${p.id}`}
              onClick={close}
            >
              <Photo
                src={p.image}
                alt={p.name}
                style={{ objectPosition: p.position }}
              />
              <div>
                <span>{p.name}</span>
                <small>
                  {p.category} · {money(p.price)}
                </small>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
        {searchResults.length === 0 && (
          <div className="empty-state">
            <Gem size={34} />
            <h3>A different kind of discovery.</h3>
            <p>
              No pieces match “{search}”. Try a category, stone, or collection.
            </p>
            <button className="text-button" onClick={() => setSearch("")}>
              Clear search
            </button>
          </div>
        )}
      </Overlay>
      <Overlay
        open={!!quickView}
        onClose={() => setQuickView(null)}
        title="A closer look"
        className="quick-modal"
      >
        {quickView && (
          <div className="quick-modal-grid">
            <Photo
              src={quickView.image}
              alt={quickView.name}
              style={{ objectPosition: quickView.position }}
            />
            <div>
              <ProductOptions key={quickView.id} product={quickView} compact />
              <Link
                className="arrow-link quick-detail-link"
                to={`/product/${quickView.id}`}
                onClick={() => setQuickView(null)}
              >
                Explore the details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
}
