import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
const links = [
  ["home", "Home"],
  ["projects", "Work"],
  ["about", "About"],
  ["skills", "Toolkit"],
  ["experience", "Journey"],
  ["contact", "Contact"],
];
export default function Navbar({ user, sections = {} }) {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState("home");
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const toggle = useRef(null),
    panel = useRef(null);
  useEffect(() => {
    const observe = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    links.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observe.observe(el);
    });
    return () => observe.disconnect();
  }, [user]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("a")?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = [toggle.current, ...panel.current.querySelectorAll("a")];
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  const close = () => setOpen(false);
  const visibleLinks = links.filter(([id]) => sections[id] !== false);
  return (
    <header
      className={`studio-nav refined-nav${scrolled ? " is-scrolled" : ""}${open ? " is-menu-open" : ""}`}
    >
      <nav className="studio-nav-inner" aria-label="Main navigation">
        <a className="studio-brand" href="#home" onClick={close}>
          <span>R.</span>
          {user?.fullName || "Rajiv Jha"}
        </a>
        <div className="studio-desktop-links">
          {visibleLinks.map(([id, label]) => (
            <a
              href={`#${id}`}
              key={id}
              aria-current={active === id ? "location" : undefined}
            >
              {active === id && (
                <motion.span
                  className="nav-active-pill"
                  layoutId="navbar-active-section"
                  aria-hidden="true"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 38 }
                  }
                />
              )}
              <span className="nav-link-label">{label}</span>
            </a>
          ))}
        </div>
        {sections.contact !== false && (
          <a className="studio-nav-contact" href="#contact">
            Let’s talk <ArrowUpRight size={15} />
          </a>
        )}
        <button
          ref={toggle}
          className="studio-menu-toggle"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span className="nav-menu-lines" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </nav>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-navigation"
            id="mobile-navigation"
            ref={panel}
            className="studio-mobile-links"
            initial={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{
              duration: reducedMotion ? 0 : 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p>Explore the portfolio</p>
            {visibleLinks.map(([id, label]) => (
              <a
                href={`#${id}`}
                key={id}
                onClick={close}
                aria-current={active === id ? "location" : undefined}
              >
                {label}
                <ArrowUpRight size={20} />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
