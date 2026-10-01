import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Rotate3D,
  Play,
  Pause,
  Plus,
  Minus,
  Move,
  LoaderCircle,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { ModelConfig } from "./jewelry/models";
import type { JewelryScene } from "./jewelry/scene";
import { useStore } from "../store";
import { Photo } from "./ui";

export function JewelryViewer({
  config,
  image,
  name,
}: {
  config: ModelConfig;
  image: string;
  name: string;
}) {
  const host = useRef<HTMLDivElement>(null),
    api = useRef<JewelryScene | null>(null);
  const current = useRef(config);
  current.current = config;
  const { theme } = useStore();
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const [activated, setActivated] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "unavailable"
  >("idle");
  const [spinning, setSpinning] = useState(false);
  const reduced = useReducedMotion();
  const helpId = useId();
  useEffect(() => {
    if (!host.current || activated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActivated(true);
      },
      { rootMargin: "180px" },
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [activated]);
  useEffect(() => {
    if (!activated || !host.current) return;
    let cancelled = false;
    let scene: JewelryScene | undefined;
    if (typeof window.WebGL2RenderingContext === "undefined") {
      setStatus("unavailable");
      return;
    }
    setStatus("loading");
    import("./jewelry/scene")
      .then(({ createJewelryScene }) => {
        if (cancelled || !host.current) return;
        scene = createJewelryScene(host.current, current.current, () => {
          setStatus("unavailable");
          setSpinning(false);
          api.current = null;
          scene?.dispose();
        });
        if (cancelled) {
          scene.dispose();
          return;
        }
        scene.setTheme(themeRef.current === "dark");
        api.current = scene;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });
    return () => {
      cancelled = true;
      api.current = null;
      scene?.dispose();
    };
  }, [activated]);
  useEffect(
    () => api.current?.setModel(config),
    [config.shape, config.metal, config.stone],
  );
  useEffect(() => api.current?.setTheme(theme === "dark"), [theme]);
  useEffect(() => {
    if (reduced) setSpinning(false);
  }, [reduced]);
  useEffect(() => api.current?.setSpinning(spinning), [spinning]);
  const ready = status === "ready";
  return (
    <div className="jewelry-viewer">
      <div className="jewelry-stage">
        <div className="viewer-studio-label">
          <span className="viewer-live-dot" />
          <span>THE 360° STUDIO</span>
          <span>DESIGN STUDY</span>
        </div>
        <div ref={host} className="jewelry-canvas" aria-describedby={helpId} />
        {!ready && (
          <div className="viewer-cover">
            <Photo
              src={image}
              alt={`${name} photographic preview`}
              style={{ objectPosition: "72% 50%" }}
            />
            <div className="viewer-cover-shade" />
            <div className="viewer-cover-message">
              {status === "loading" ? (
                <>
                  <LoaderCircle size={22} className="viewer-loader" />
                  <span>Preparing your private view…</span>
                </>
              ) : status === "unavailable" ? (
                <>
                  <Rotate3D size={28} strokeWidth={1} />
                  <span>Explore the photographic view.</span>
                  <small>
                    Interactive 3D needs a browser with WebGL 2 enabled.
                  </small>
                </>
              ) : (
                <button
                  className="button light"
                  onClick={() => setActivated(true)}
                >
                  <Rotate3D size={17} /> Explore in 360°
                </button>
              )}
            </div>
          </div>
        )}
        <div className="viewer-gesture" id={helpId}>
          <Move size={13} />
          <span>
            {ready
              ? "Drag to rotate · Pinch to zoom"
              : "A closer look at the form & the feeling"}
          </span>
        </div>
        <span className="viewer-watermark">S</span>
      </div>
      <div className="viewer-toolbar" aria-label="3D view controls">
        <div className="viewer-control-group">
          <button
            aria-label="Rotate jewelry left"
            title="Rotate left"
            disabled={!ready}
            onClick={() => api.current?.rotate(-Math.PI / 6)}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            aria-label="Rotate jewelry right"
            title="Rotate right"
            disabled={!ready}
            onClick={() => api.current?.rotate(Math.PI / 6)}
          >
            <ChevronRight size={17} />
          </button>
          <span className="viewer-control-divider" />
          <button
            aria-label="Zoom out jewelry"
            title="Zoom out"
            disabled={!ready}
            onClick={() => api.current?.zoom(-1)}
          >
            <Minus size={16} />
          </button>
          <button
            aria-label="Zoom in jewelry"
            title="Zoom in"
            disabled={!ready}
            onClick={() => api.current?.zoom(1)}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="viewer-control-group">
          <button
            className="viewer-spin"
            aria-label={
              spinning ? "Pause jewelry rotation" : "Start jewelry rotation"
            }
            aria-pressed={spinning}
            disabled={!ready}
            onClick={() => setSpinning(!spinning)}
          >
            {spinning ? <Pause size={13} /> : <Play size={13} />}
            <span>{spinning ? "Pause" : "Auto-rotate"}</span>
          </button>
          <span className="viewer-control-divider" />
          <button
            aria-label="Reset jewelry view"
            title="Reset view"
            disabled={!ready}
            onClick={() => {
              api.current?.reset();
              setSpinning(false);
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <p className="viewer-status sr-only" role="status">
        {status === "ready"
          ? `${name} 3D preview ready. ${config.metal}. Use the view controls or focus the model and press arrow keys to rotate.`
          : status === "unavailable"
            ? "3D preview unavailable. Product photograph is shown."
            : status === "loading"
              ? "Loading interactive 3D preview."
              : "3D preview loads when visible, or choose Explore in 360 degrees."}
      </p>
    </div>
  );
}
