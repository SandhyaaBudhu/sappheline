import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Diamond,
  Leaf,
  Hammer,
  Gift,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { JewelryExperience } from "../components/JewelryExperience";
import { ArrowLink, Photo, Reveal, SectionHeading } from "../components/ui";

const testimonials = [
  {
    quote:
      "“It has that rare feeling of being both beautifully simple and completely unlike anything else. I haven’t taken it off.”",
    name: "Emma L.",
    piece: "THE NOCTURNE RING",
  },
  {
    quote:
      "“From the first sketch to opening the box, it felt so personal. A small piece of our story, made into something we can keep.”",
    name: "Isabel R.",
    piece: "A BESPOKE COMMISSION",
  },
  {
    quote:
      "“The kind of earrings that make an ordinary Tuesday feel a little special. Beautifully made, with every detail considered.”",
    name: "Sophie M.",
    piece: "THE ENTWINE HOOPS",
  },
];
export function Home() {
  const [review, setReview] = useState(0);
  return (
    <>
      <section className="hero">
        <Photo
          className="hero-photo"
          src={`${import.meta.env.BASE_URL}images/hero.png`}
          alt="A sculptural silver sapphire ring resting on dark natural stone"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-content container">
          <span className="eyebrow">
            <Sparkles size={13} strokeWidth={1} /> SCULPTURAL FINE JEWELRY
          </span>
          <h1>
            A quiet kind of
            <br /> <em>extraordinary.</em>
          </h1>
          <p>
            Considered forms. Exceptional stones.
            <br /> Jewelry that feels like you.
          </p>
          <div className="hero-buttons">
            <Link to="/shop?collection=Nocturne" className="button light">
              Discover Nocturne <ArrowRight size={18} strokeWidth={1.4} />
            </Link>
            <Link className="hero-secondary" to="/atelier">
              Inside the atelier <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="hero-bottom container">
          <a className="hero-index" href="#studio-360">
            <span>01</span>
            <i />
            <span>EXPLORE IN 360° ↗</span>
          </a>
          <Link to="/collections" className="hero-caption">
            <span>
              THE NOCTURNE COLLECTION
              <small>A study in blue. A feeling that stays.</small>
            </span>
            <span className="circle-arrow">
              <ArrowUpRight size={20} strokeWidth={1.2} />
            </span>
          </Link>
        </div>
        <span className="hero-side">DESIGNED TO BECOME PART OF YOU</span>
      </section>
      <div className="values-strip">
        <div>
          <Diamond size={17} strokeWidth={1.2} />
          <span>Exceptional stones</span>
        </div>
        <div>
          <Hammer size={17} strokeWidth={1.2} />
          <span>Made slowly, by hand</span>
        </div>
        <div>
          <Leaf size={17} strokeWidth={1.2} />
          <span>Thoughtfully sourced</span>
        </div>
        <div>
          <Gift size={17} strokeWidth={1.2} />
          <span>Beautifully gift-boxed</span>
        </div>
      </div>
      <section className="section container">
        <Reveal>
          <SectionHeading
            eyebrow="THE PIECES YOU COME BACK TO"
            title="Objects of affection."
            text="Small works of art. For your every day, and your always."
            link="Explore all jewelry"
            to="/shop"
          />
          <div className="product-grid featured-grid">
            {[products[0], products[3], products[2], products[1]].map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </Reveal>
      </section>
      <JewelryExperience />
      <section className="category-section container">
        <Reveal>
          <SectionHeading
            eyebrow="FIND YOUR OWN EXPRESSION"
            title="A piece of you."
          />
          <div className="category-grid">
            {[
              {
                name: "Rings",
                image: `${import.meta.env.BASE_URL}images/ring.jpg`,
                text: "Little sculptures. Lasting feelings.",
                position: "52% 45%",
              },
              {
                name: "Necklaces",
                image: `${import.meta.env.BASE_URL}images/necklace.jpg`,
                text: "Keep something beautiful close.",
                position: "50% 52%",
              },
              {
                name: "Earrings",
                image: `${import.meta.env.BASE_URL}images/model.jpg`,
                text: "An everyday kind of statement.",
                position: "50% 72%",
              },
            ].map((c) => (
              <Link
                key={c.name}
                to={`/shop?category=${c.name}`}
                className="category-card"
              >
                <Photo
                  src={c.image}
                  alt={`${c.name} in the Sappheline collection`}
                  style={{ objectPosition: c.position }}
                  loading="lazy"
                />
                <div className="category-shade" />
                <div>
                  <span>
                    {c.name}
                    <ArrowUpRight size={25} strokeWidth={1} />
                  </span>
                  <p>{c.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="atelier-story">
        <div className="atelier-photo">
          <Photo
            src={`${import.meta.env.BASE_URL}images/model.jpg`}
            alt="Sculptural hoops arranged on pale stone in soft studio light"
            loading="lazy"
          />
          <span className="photo-note">
            FORM, FEELING & A LITTLE HUMAN TOUCH.
          </span>
        </div>
        <Reveal className="atelier-story-copy">
          <span className="eyebrow">THE SAPPHELINE ATELIER</span>
          <h2>
            Some things
            <br /> can’t be <em>rushed.</em>
          </h2>
          <p>
            A curve perfected by hand. A stone chosen for its character. A quiet
            detail only you will notice.
          </p>
          <p>
            We believe the most meaningful pieces are made with intention —
            slowly, thoughtfully, and with a little of the maker left in every
            one.
          </p>
          <ArrowLink to="/atelier">Meet the atelier</ArrowLink>
          <div className="atelier-signature">
            Made with intention.<span>THE SAPPHELINE WAY</span>
          </div>
        </Reveal>
      </section>
      <section className="craft-section container">
        <Reveal>
          <div className="craft-heading">
            <span className="eyebrow">BEAUTY, BELOW THE SURFACE</span>
            <h2>
              Good things.
              <br /> <em>At every level.</em>
            </h2>
            <p>
              What your jewelry is made of matters.
              <br /> How it’s made matters just as much.
            </p>
          </div>
          <div className="craft-details">
            <div>
              <span className="craft-number">01</span>
              <div>
                <h3>Precious, by nature.</h3>
                <p>
                  Recycled precious metals. Carefully selected natural
                  gemstones. Materials with a past, ready for a new story.
                </p>
              </div>
              <Diamond size={27} strokeWidth={1} />
            </div>
            <div>
              <span className="craft-number">02</span>
              <div>
                <h3>The human touch.</h3>
                <p>
                  Shaped, set, and polished by skilled hands. Small-batch
                  craftsmanship that celebrates the details.
                </p>
              </div>
              <Hammer size={27} strokeWidth={1} />
            </div>
            <div>
              <span className="craft-number">03</span>
              <div>
                <h3>Made for the long story.</h3>
                <p>
                  Enduring designs you’ll reach for for years. Because the most
                  sustainable piece is the one you keep.
                </p>
              </div>
              <Leaf size={27} strokeWidth={1} />
            </div>
            <ArrowLink to="/atelier#craft">Our materials & process</ArrowLink>
          </div>
        </Reveal>
      </section>
      <section className="lookbook">
        <div className="lookbook-copy">
          <span className="eyebrow">THE SAPPHELINE JOURNAL / VOL. 01</span>
          <h2>
            In the
            <br /> <em>quiet moments.</em>
          </h2>
          <p>
            Soft light. A familiar gesture.
            <br /> Beauty in the spaces between.
          </p>
          <ArrowLink to="/collections">Explore the lookbook</ArrowLink>
          <span className="lookbook-number">01 — 03</span>
        </div>
        <Link to="/product/nocturne-ring" className="lookbook-image">
          <Photo
            src={`${import.meta.env.BASE_URL}images/editorial.png`}
            alt="Our sculptural silver sapphire ring worn with ivory linen and a navy sleeve"
            loading="lazy"
          />
          <span>
            NOCTURNE, IN A DIFFERENT LIGHT <ArrowUpRight size={18} />
          </span>
        </Link>
        <Link
          to="/product/serein-chain"
          className="lookbook-image lookbook-small"
        >
          <Photo
            src={`${import.meta.env.BASE_URL}images/jewelry.jpg`}
            alt="Sculptural gold links resting on the pages of an art book"
            loading="lazy"
          />
          <span>
            AN EVERYDAY RITUAL <ArrowUpRight size={18} />
          </span>
        </Link>
      </section>
      <section className="gifting container">
        <Gift size={37} strokeWidth={0.85} />
        <div>
          <span className="eyebrow">FOR SOMEONE. FOR SOMETHING. FOR YOU.</span>
          <h2>A small box. A big feeling.</h2>
          <p>
            Meaningful pieces, wrapped with care. Ready for a moment worth
            remembering.
          </p>
        </div>
        <Link to="/shop?gift=true" className="button secondary">
          Find a thoughtful gift <ArrowRight size={17} />
        </Link>
      </section>
      <section className="testimonials">
        <div className="container">
          <span className="eyebrow">FROM THEIR JEWELRY BOX TO YOURS</span>
          <div className="review-stars" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <blockquote key={review}>{testimonials[review].quote}</blockquote>
          <div className="review-author">
            {testimonials[review].name}
            <span> {testimonials[review].piece}</span>
          </div>
          <div className="review-controls">
            <button
              className="icon-button"
              aria-label="Previous testimonial"
              onClick={() => setReview((review + 2) % 3)}
            >
              <ChevronLeft size={17} />
            </button>
            {testimonials.map((_, i) => (
              <button
                className={`review-dot ${review === i ? "active" : ""}`}
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                aria-pressed={review === i}
                onClick={() => setReview(i)}
              />
            ))}
            <button
              className="icon-button"
              aria-label="Next testimonial"
              onClick={() => setReview((review + 1) % 3)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
          <small className="testimonial-note">
            Illustrative stories from our demo community.
          </small>
        </div>
      </section>
    </>
  );
}
