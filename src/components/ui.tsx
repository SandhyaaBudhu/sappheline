import { useEffect, useId, useRef, useState } from "react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function Photo({
  src,
  alt,
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return failed ? (
    <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
      <span>✧</span>
      <small>SAPPHELINE</small>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
export function ArrowLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`arrow-link ${className}`}>
      {children}
      <ArrowRight size={17} strokeWidth={1.4} />
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  text,
  link,
  to,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  link?: string;
  to?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {link && to && <ArrowLink to={to}>{link}</ArrowLink>}
    </div>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.div>
  );
}
export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="accordion">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        {title}
        <ChevronDown size={16} className={open ? "rotate-180" : ""} />
      </button>
      <div id={id} hidden={!open} className="accordion-content">
        {children}
      </div>
    </div>
  );
}
export function Overlay({
  open,
  onClose,
  title,
  children,
  drawer = false,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const id = useId();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const initialFocus =
      ref.current?.querySelector<HTMLElement>(
        'input:not([type="checkbox"]), textarea, select',
      ) || ref.current?.querySelector<HTMLElement>("button, a[href]");
    initialFocus?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab") return;
      const elements = Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, select, textarea, a[href], [tabindex="0"]',
        ) || [],
      ).filter((el) => el.offsetParent !== null);
      const first = elements[0],
        last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <div className="overlay">
          <motion.div
            className="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={id}
            className={`${drawer ? "drawer" : "modal"} ${className}`}
            initial={
              reduced ? false : drawer ? { x: "100%" } : { opacity: 0, y: 16 }
            }
            animate={drawer ? { x: 0 } : { opacity: 1, y: 0 }}
            exit={drawer ? { x: "100%" } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="overlay-heading">
              <h2 id={id}>{title}</h2>
              <button
                className="icon-button"
                onClick={onClose}
                aria-label={`Close ${title}`}
              >
                <X size={21} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
