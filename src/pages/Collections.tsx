import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { collections, products } from "../data/products";
import { Photo, Reveal } from "../components/ui";

export function Collections() {
  return (
    <>
      <div className="page-intro container">
        <span className="eyebrow">A LANGUAGE OF FORM & FEELING</span>
        <h1>
          Distinct worlds.
          <br /> <em>A shared soul.</em>
        </h1>
        <p>
          Each collection begins with a feeling.
          <br /> Find the one that speaks to you.
        </p>
      </div>
      <div className="collections-list container">
        {collections.map((c, i) => (
          <Reveal
            key={c.name}
            className={`collection-editorial ${i % 2 ? "reverse" : ""}`}
          >
            <Link
              to={`/shop?collection=${c.name}`}
              className="collection-photo"
            >
              <Photo
                src={c.image}
                alt={`${c.name} jewelry collection`}
                style={{ objectPosition: c.position }}
                loading={i ? "lazy" : "eager"}
              />
              <span className="collection-photo-label">
                SAPPHELINE / {c.name.toUpperCase()}
                <ArrowUpRight size={23} />
              </span>
            </Link>
            <div className="collection-copy">
              <span className="eyebrow">
                COLLECTION {c.number} /{" "}
                {products.filter((p) => p.collection === c.name).length} PIECES
              </span>
              <h2>{c.name}</h2>
              <h3>{c.subtitle}</h3>
              <p>{c.description}</p>
              <Link
                className="button primary"
                to={`/shop?collection=${c.name}`}
              >
                Discover {c.name}
                <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
      <section className="custom-callout container">
        <span className="eyebrow">SOMETHING ENTIRELY YOUR OWN</span>
        <h2>
          Some stories need
          <br /> <em>a new beginning.</em>
        </h2>
        <p>Let’s make a piece that exists only for you.</p>
        <Link to="/atelier#inquiry" className="button secondary">
          Begin a personal commission
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
