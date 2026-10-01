# SAPPHELINE

An original contemporary fine-jewelry storefront demo built with React, Vite, TypeScript, Tailwind CSS, React Router, lucide-react, and restrained Framer Motion transitions.

## Run

```sh
npm install
npm run dev
npm run build
npm run test
```

The development server runs at http://localhost:5173. `npm run preview` serves the production build. Node 22 or newer is recommended for the development and test tools.

## Routes

| Route          | Experience                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/`            | Editorial home, featured pieces, categories, atelier story, materials, lookbook, gifting edit, testimonials          |
| `/collections` | Three editorial collection stories: Nocturne, Forme, Heirloom                                                        |
| `/shop`        | Eight mock products, category/metal/stone/collection/price filters, sorting, wishlist, quick view, mobile filters    |
| `/product/:id` | Gallery, zoom/lightbox, metal finishes and pricing, ring size guide, add to bag, product information, related pieces |
| `/atelier`     | Craftsmanship, four-step custom process, validated inquiry form and confirmation                                     |

Shop filters are reflected in URL parameters and survive a refresh. Category links, collection links, and the gift edit use the same filtering system. Unknown routes and products have recovery links.

## Interactive 360° studio

The home page includes a studio at `/#studio-360`, with three genuine, locally generated Three.js models: a sculptural sapphire ring, an oval stone pendant on a linked chain, and a pair of intertwined hoops. Product pages include the corresponding design study at `#piece-360`, accessible through the link below the gallery.

Visitors can drag to orbit the piece, pinch to zoom on touch devices, use the rotation/zoom buttons, start and pause auto-rotation, and reset the view. When the canvas is focused, arrow keys rotate, plus/minus zoom, and Home resets. Page scrolling remains available over the viewer until it is deliberately focused. Auto-rotation starts off, and rendering pauses when the studio is off-screen or the tab is hidden.

Finishes change the actual 3D material. On product pages the studio finish is synchronized with the purchase options, price, and bag variant. Procedural gemstone colors follow the product's stone. The previews are illustrative design studies, not scans or production CAD of each photographed product; this distinction is shown in the interface.

The renderer and Three.js engine are loaded only when the studio approaches the viewport or a visitor chooses to open it. The engine is split into separate production chunks. Geometry, materials, environment textures, observers, controls, animation frames, and the WebGL context are released when the viewer unmounts. No model files, HDR downloads, or external 3D service are needed. WebGL 2 is required; unavailable or lost contexts fall back to local product photography with disabled 3D controls.

## Demo behavior

- Theme, wishlist, bag contents, and the newsletter preference are stored in localStorage. No server, external API, tracking, authentication, or payment integration.
- Metal selections update the selected variant and price. Product photography shows the sample finish; the selected finish is identified in the UI and bag. Some gallery views intentionally reuse a product photograph with a different crop.
- Bag quantities, removals, delivery eligibility, and subtotals are functional. Completing the demo checkout displays a confirmation and clears the bag. No purchase, payment, or shipment occurs.
- Inquiry validation checks all required fields, email format, and a minimum-length project description. The confirmation summarizes the selected project. Nothing is sent or stored remotely.
- Newsletter signup saves a local preference and provides confirmation; it sends no emails. Social/contact controls display demo contact information rather than linking to nonexistent brand accounts.
- Product, material, delivery, testimonial, and brand claims are illustrative creative content for the portfolio demo.

## Design and structure

Deep sapphire and ivory, locally hosted Cormorant Garamond and DM Sans, cool silver accents, editorial photography, and deliberately simple grids. Both themes have tuned surfaces, contrast, borders, and imagery. Responsive layouts cover mobile, tablet, desktop, and wide displays.

`src/data/products.ts` contains the mock catalog. `src/store.tsx` manages persistent state. Reusable UI, product cards, product options, and global shopping panels live in `src/components/`. Route composition lives in `src/pages/`. Styling tokens and responsive rules are in `src/styles.css`.

Dialogs have focus trapping, initial focus, Escape dismissal, backdrop dismissal, and focus restoration. Gallery lightboxes also support left/right arrow keys. Other accessibility provisions include a skip link, labeled inputs, field-level validation, reduced-motion support, meaningful alt text, and a live status toast.

## Verification

Vitest and React Testing Library exercise route rendering, faceted filtering and sorting, empty states, wishlist persistence, variant pricing, required ring sizes, bag updates and delivery calculations, demo checkout, the size helper, gallery/lightbox controls, quick view, search, inquiry validation/confirmation, persistent theme, mobile filter controls, mobile navigation, and accordion state.

Additional studio tests cover loading on demand, model/finish changes, rotation/zoom/reset control dispatch, auto-rotation toggling, resource cleanup, product/price/bag finish synchronization, and the WebGL fallback. Geometry tests inspect all three actual models for finite vertices and normals, consistent framing, mesh depth, metal material properties, and faceted gemstone surfaces. There are 19 passing tests. The viewer control tests mock the GPU scene; they do not verify actual WebGL rendering or shader appearance.

The production build and development server were checked. Browser surfaces were unavailable in the implementation session, so visual browser QA and device-specific layout inspection have not been performed. DOM interaction tests do not substitute for that visual check.

## Assets

All photography and fonts are local in `public/`; no remote image or font requests are needed at runtime. A styled sapphire fallback replaces an image if it fails to load.

Original hero and wearable editorial photography were generated with the built-in imagegen tool. Saved files and the complete prompts are documented in [ASSETS.md](./ASSETS.md).

Sample product photos are from Unsplash, downloaded from these source image IDs: `1605100804763-247f67b3557e`, `1617038220319-276d3cfab638`, `1599643477877-530eb83abc8e`, `1535632066927-ab7c9ab60908`, `1602173574767-37ac01994b2a`, `1602751584552-8ba73aad10e1`. They are demonstration photography and do not depict products available for purchase.

Cormorant Garamond and DM Sans are hosted locally under the SIL Open Font License; their license files are in `public/fonts/`.

For deployment, serve `dist/` and configure the host to rewrite unknown paths to `index.html` so React Router links work on direct visits.
