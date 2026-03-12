import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { NavButton } from "./ui/nav-button";

const CRM_URL = "http://localhost:5173";

const navLinks = [
  { href: "#features",  label: "Features" },
  { href: "/services",  label: "Services" },
  { href: "#pricing",   label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all .3s",
        background: scrolled ? "rgba(8,10,15,0.90)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : undefined,
        borderBottom: scrolled ? "1px solid #21262d" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "#f0f6fc" }}>
              Flow<span style={{ color: "#86efac" }}>CRM</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{ color: "#8b949e" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c9d1d9"; (e.currentTarget as HTMLElement).style.background = "rgba(134,239,172,.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#8b949e"; (e.currentTarget as HTMLElement).style.background = ""; }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <NavButton
              label="Sign In"
              href={`${CRM_URL}/login`}
            />
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg transition-colors" style={{ color: "#8b949e" }}
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#161b22"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            style={{ background: "rgba(8,10,15,.97)", borderTop: "1px solid #21262d" }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium rounded-lg transition-all"
                  style={{ color: "#8b949e" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2" style={{ borderTop: "1px solid #21262d" }}>
                <NavButton
                  label="Sign In"
                  href={`${CRM_URL}/login`}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
