import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Rotate3D, Check } from "lucide-react";
import { products } from "../data/products";
import type { Metal, Product } from "../data/products";
import type { JewelryShape } from "./jewelry/models";
import { JewelryViewer } from "./JewelryViewer";

const studies = [
  { shape: "ring" as const, product: products[0], label: "The ring" },
  { shape: "pendant" as const, product: products[2], label: "The pendant" },
  { shape: "hoops" as const, product: products[3], label: "The hoops" },
];
export function JewelryExperience({
  product,
  selectedMetal,
  onMetalChange,
}: {
  product?: Product;
  selectedMetal?: Metal;
  onMetalChange?: (metal: Metal) => void;
}) {
  const [study, setStudy] = useState<JewelryShape>("ring");
  const [previewMetal, setPreviewMetal] = useState<Metal>("Sterling silver");
  const active = studies.find((s) => s.shape === study)!;
  const piece = product || active.product;
  const shape: JewelryShape = product
    ? product.category === "Rings"
      ? "ring"
      : product.category === "Necklaces"
        ? "pendant"
        : "hoops"
    : study;
  const metal = selectedMetal || previewMetal;
  const chooseMetal = (value: Metal) => {
    setPreviewMetal(value);
    onMetalChange?.(value);
  };
  return (
    <section
      className={`immersive-section ${product ? "product-immersive" : ""}`}
      id={product ? "piece-360" : "studio-360"}
      aria-labelledby={product ? "product-studio-title" : "home-studio-title"}
    >
      <div className="container immersive-grid">
        <div className="immersive-copy">
          <span className="eyebrow">
            <Rotate3D size={15} strokeWidth={1.1} /> A NEW PERSPECTIVE
          </span>
          <h2 id={product ? "product-studio-title" : "home-studio-title"}>
            Beauty, from
            <br /> <em>every angle.</em>
          </h2>
          <p>
            Turn it. Tilt it. Follow the light.
            <br />
            Discover the little details that make a piece feel extraordinary.
          </p>
          {!product && (
            <div
              className="jewelry-study-tabs"
              role="group"
              aria-label="Choose a jewelry model"
            >
              {studies.map((s, i) => (
                <button
                  key={s.shape}
                  onClick={() => {
                    setStudy(s.shape);
                    setPreviewMetal(s.product.metals[0]);
                  }}
                  aria-pressed={study === s.shape}
                  className={study === s.shape ? "active" : ""}
                >
                  <span>0{i + 1}</span>
                  {s.label}
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          )}
          <div className="viewer-piece-name">
            <span className="eyebrow">
              {piece.collection} / {piece.category}
            </span>
            <h3>{piece.name}</h3>
          </div>
          <fieldset className="viewer-finishes">
            <legend>
              {product ? "EXPLORE THE FINISH" : "PREVIEW FINISH"}
              <span>{metal}</span>
            </legend>
            <div>
              {piece.metals.map((m) => (
                <button
                  key={m}
                  className={`metal-choice ${m.includes("yellow") ? "gold" : "silver"} ${metal === m ? "active" : ""}`}
                  onClick={() => chooseMetal(m)}
                  aria-label={`Preview in ${m}`}
                  aria-pressed={metal === m}
                >
                  {metal === m && <Check size={14} />}
                </button>
              ))}
            </div>
          </fieldset>
          {!product && (
            <Link className="arrow-link" to={`/product/${piece.id}`}>
              Discover the piece
              <ArrowRight size={16} />
            </Link>
          )}
          <p className="model-disclosure">
            Interactive design studies, inspired by our collection.
            <br />
            See product photography for the exact design and details.
          </p>
        </div>
        <JewelryViewer
          config={{ shape, metal, stone: piece.stone }}
          image={piece.image}
          name={piece.name}
        />
      </div>
    </section>
  );
}
