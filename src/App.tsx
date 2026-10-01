import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Collections } from "./pages/Collections";
import { Shop } from "./pages/Shop";
import { Product } from "./pages/Product";
import { Atelier } from "./pages/Atelier";
import { StoreProvider } from "./store";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MotionConfig reducedMotion="user">
        <StoreProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/atelier" element={<Atelier />} />
              <Route
                path="*"
                element={
                  <div className="empty-state not-found">
                    <span className="eyebrow">A LITTLE DETOUR</span>
                    <h1>Let’s find your way back.</h1>
                    <p>This page is still a blank canvas.</p>
                    <Link className="button primary" to="/">
                      Return to Sappheline
                    </Link>
                  </div>
                }
              />
            </Route>
          </Routes>
        </StoreProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}
