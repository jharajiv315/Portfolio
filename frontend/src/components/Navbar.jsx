import { useState, useEffect } from "react";
import OverlayMenu from "./overlaymenue";
import Logo from "../assets/Logo.png";
import { Menu, ArrowRight } from "lucide-react";

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["home", "about", "skills", "projects", "experience", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Experience", href: "#experience", id: "experience" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 sm:px-10 lg:px-14 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#E8E1D5]/80 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        {/* LEFT - Logo + Name */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-black text-xl text-[#1C1917] tracking-tight group-hover:text-[#B84A1C] transition-colors">
            <span className="font-serif italic font-bold text-2xl leading-none">R</span>
          </div>

          <span className="text-base sm:text-lg font-heading font-bold text-[#1C1917] tracking-normal">
            {user?.fullName || "Rajiv Jha"}
          </span>
        </a>

        {/* CENTER - Desktop Nav Links (As in Mockup) */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-sm font-body font-medium transition-colors duration-200 py-1 ${
                  isActive ? "text-[#1C1917] font-semibold" : "text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#B84A1C] rounded-full flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-[#B84A1C] -top-[1px] absolute" />
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-[#1C1917] hover:text-[#B84A1C] transition-colors cursor-pointer p-1.5 rounded-lg bg-white/70 border border-[#E8E1D5]"
          aria-label="Open Menu"
        >
          <Menu size={22} />
        </button>

        {/* RIGHT - Reach Out (Terracotta pill button from reference mockup) */}
        <a
          href="#contact"
          className="hidden sm:inline-flex items-center gap-2 bg-[#B84A1C] hover:bg-[#9C3E16] text-white px-5 sm:px-6 py-2 rounded-full font-body font-medium shadow-md shadow-[#B84A1C]/20 hover:shadow-lg hover:shadow-[#B84A1C]/30 transition-all duration-300 text-sm whitespace-nowrap active:scale-95"
        >
          <span>Reach Out</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </nav>

      {/* FULL SCREEN MENU */}
      <OverlayMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
