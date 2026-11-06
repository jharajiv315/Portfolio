import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  ["home", "Home"],
  ["projects", "Work"],
  ["about", "About"],
  ["skills", "Toolkit"],
  ["experience", "Journey"],
  ["contact", "Contact"],
];
export default function Navbar({ user }) {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState("home");
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
  return (
    <header className="studio-nav">
      <nav className="studio-nav-inner" aria-label="Main navigation">
        <a className="studio-brand" href="#home" onClick={close}>
          <span>R.</span>
          {user?.fullName || "Rajiv Jha"}
        </a>
        <div className="studio-desktop-links">
          {links.map(([id, label]) => (
            <a
              href={`#${id}`}
              key={id}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </div>
        <a className="studio-nav-contact" href="#contact">
          Let’s talk <ArrowUpRight size={15} />
        </a>
        <button
          ref={toggle}
          className="studio-menu-toggle"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div id="mobile-navigation" ref={panel} className="studio-mobile-links">
          <p>Explore the portfolio</p>
          {links.map(([id, label]) => (
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
        </div>
      )}
    </header>
  );
}
