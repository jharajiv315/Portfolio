import { useState, useEffect } from "react";
import OverlayMenu from "./overlaymenue";
import Logo from "../assets/Logo.png";
import { Menu } from "lucide-react";

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 sm:px-10 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
            : "bg-transparent py-4"
        }`}
      >
        {/* LEFT - Logo + Name */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Logo"
            className="w-8 h-8 object-contain"
          />

          <span className="text-base sm:text-lg font-heading font-semibold text-white tracking-normal">
            {user?.fullName || "Rajiv Jha"}
          </span>
        </div>

        {/* CENTER - Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute left-1/2 -translate-x-1/2 text-white hover:text-cyan-400 transition-colors cursor-pointer p-1"
          aria-label="Open Menu"
        >
          <Menu size={28} />
        </button>

        {/* RIGHT - Reach Out */}
        <a
          href="#contact"
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-5 sm:px-6 py-2 rounded-full font-body font-medium shadow-lg hover:opacity-90 transition-opacity duration-300 text-sm whitespace-nowrap"
        >
          Reach Out
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
