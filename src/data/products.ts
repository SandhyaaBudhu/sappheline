export type Category = "Rings" | "Necklaces" | "Earrings";
export type Metal = "Sterling silver" | "14k yellow gold" | "14k white gold";
export interface Product {
  id: string;
  name: string;
  category: Category;
  collection: string;
  price: number;
  metals: Metal[];
  stone: string;
  image: string;
  position?: string;
  tag?: string;
  description: string;
  leadTime: string;
  images?: string[];
}
export const products: Product[] = [
  {
    id: "nocturne-ring",
    name: "Nocturne Sapphire Ring",
    category: "Rings",
    collection: "Nocturne",
    price: 485,
    metals: ["Sterling silver", "14k white gold"],
    stone: "Sapphire",
    image: `${import.meta.env.BASE_URL}images/hero.png`,
    position: "73% 55%",
    tag: "SIGNATURE PIECE",
    description:
      "A moment of midnight, held in silver. An oval blue sapphire rests within a sculptural, hand-polished setting — a quietly distinctive piece to keep close, every day.",
    leadTime: "Made to order · 3–4 weeks",
  },
  {
    id: "halo-ring",
    name: "Halo Diamond Ring",
    category: "Rings",
    collection: "Heirloom",
    price: 720,
    metals: ["14k white gold", "14k yellow gold"],
    stone: "Diamond",
    image: `${import.meta.env.BASE_URL}images/ring.jpg`,
    tag: "A FUTURE HEIRLOOM",
    description:
      "Light, gathered into a circle. A brilliant-cut center stone is embraced by a delicate halo and a beautifully detailed band. A modern keepsake with a little old-world soul.",
    leadTime: "Made to order · 4–6 weeks",
  },
  {
    id: "tide-pendant",
    name: "Tide Stone Pendant",
    category: "Necklaces",
    collection: "Nocturne",
    price: 295,
    metals: ["14k yellow gold", "Sterling silver"],
    stone: "Sapphire",
    image: `${import.meta.env.BASE_URL}images/necklace.jpg`,
    position: "50% 50%",
    tag: "BEST LOVED",
    description:
      "The shifting color of deep water, caught in a faceted blue stone. Suspended from a fine, adjustable chain, Tide moves with you and catches the unexpected light.",
    leadTime: "Ready to ship · 2–3 working days",
  },
  {
    id: "entwine-hoops",
    name: "Entwine Sculptural Hoops",
    category: "Earrings",
    collection: "Forme",
    price: 185,
    metals: ["14k yellow gold", "Sterling silver"],
    stone: "No stone",
    image: `${import.meta.env.BASE_URL}images/model.jpg`,
    position: "50% 75%",
    description:
      "Two flowing lines, forever in conversation. Softly twisted hoops with a pleasing weight and a high-polish finish. An understated statement for the everyday.",
    leadTime: "Ready to ship · 2–3 working days",
  },
  {
    id: "astral-drops",
    name: "Astral Sapphire Drops",
    category: "Earrings",
    collection: "Nocturne",
    price: 395,
    metals: ["Sterling silver", "14k white gold"],
    stone: "Sapphire",
    image: `${import.meta.env.BASE_URL}images/earrings.jpg`,
    position: "50% 55%",
    tag: "LIMITED EDITION",
    description:
      "A constellation of light frames two deep-blue stones. These intricate drops bring a little ceremony to an ordinary evening. Finished by hand, and designed to be remembered.",
    leadTime: "Made to order · 3–4 weeks",
  },
  {
    id: "bloom-pendant",
    name: "Bloom Gemstone Pendant",
    category: "Necklaces",
    collection: "Heirloom",
    price: 340,
    metals: ["Sterling silver", "14k white gold"],
    stone: "Amethyst",
    image: `${import.meta.env.BASE_URL}images/pendant.jpg`,
    description:
      "An abstract bloom of amethyst and citrine, each stone selected for its individual character. A small celebration of nature’s beautiful irregularity.",
    leadTime: "Made to order · 3–4 weeks",
  },
  {
    id: "serein-chain",
    name: "Serein Link Chain",
    category: "Necklaces",
    collection: "Forme",
    price: 225,
    metals: ["14k yellow gold", "Sterling silver"],
    stone: "No stone",
    image: `${import.meta.env.BASE_URL}images/jewelry.jpg`,
    position: "50% 55%",
    description:
      "Generous links, a gentle rhythm. This sculptural short chain sits softly at the collarbone — equally lovely on its own or as part of your personal collection.",
    leadTime: "Ready to ship · 2–3 working days",
  },
  {
    id: "stillwater-ring",
    name: "Stillwater Bespoke Ring",
    category: "Rings",
    collection: "Nocturne",
    price: 650,
    metals: ["14k white gold", "Sterling silver"],
    stone: "Sapphire",
    image: `${import.meta.env.BASE_URL}images/hero.png`,
    position: "78% 50%",
    tag: "MADE FOR YOU",
    description:
      "Our signature sapphire silhouette, interpreted just for you. A more substantial setting with a brushed inner band. Personal, expressive, and impossible to rush.",
    leadTime: "Made to order · 5–6 weeks",
  },
];
export const collections = [
  {
    name: "Nocturne",
    number: "01",
    subtitle: "A study in blue.",
    description:
      "Midnight sapphires, luminous silver, and the beauty of the hours in between. Our signature collection finds its poetry in the quiet.",
    image: `${import.meta.env.BASE_URL}images/hero.png`,
    position: "72% 50%",
  },
  {
    name: "Forme",
    number: "02",
    subtitle: "The shape of simplicity.",
    description:
      "Fluid lines and sculptural silhouettes. Beautifully considered pieces that become part of you, without ever asking for attention.",
    image: `${import.meta.env.BASE_URL}images/model.jpg`,
    position: "50% 75%",
  },
  {
    name: "Heirloom",
    number: "03",
    subtitle: "For the stories still to come.",
    description:
      "Exceptional stones and meaningful details, made for the moments that matter. Something to treasure. Something to pass on.",
    image: `${import.meta.env.BASE_URL}images/ring.jpg`,
    position: "50% 50%",
  },
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const priceFor = (product: Product, metal: Metal) =>
  product.price +
  (metal.startsWith("14k") && product.metals[0] === "Sterling silver"
    ? 220
    : metal === "Sterling silver" && product.metals[0].startsWith("14k")
      ? -60
      : 0);
