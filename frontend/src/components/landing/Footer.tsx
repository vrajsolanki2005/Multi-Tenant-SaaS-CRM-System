import { Zap, Twitter, Linkedin, Github, Youtube } from "lucide-react";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Product:   [{ label:"Features",href:"#features" },{ label:"Pricing",href:"#pricing" }],
  Company:   [{ label:"About",href:"/about" },{ label:"Contact",href:"#" }],
  Legal:     [{ label:"Privacy",href:"/legal#privacy" },{ label:"Terms",href:"/legal#terms" },{ label:"Cookies",href:"#" }],
};

export default function Footer() {
  return (
    <footer style={{ background:"#080a0f", borderTop:"1px solid #161b22", color:"#484f58" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo & Small Blurb */}
          <div className="flex-1 max-w-sm space-y-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-base tracking-tight" style={{ color:"#f0f6fc" }}>
                Flow<span style={{ color:"#86efac" }}>CRM</span>
              </span>
            </a>
            <p className="text-[12px] leading-relaxed max-w-[240px]" style={{ color:"#6e7681" }}>
              Automating sales workflows for high-performing modern teams.
            </p>
          </div>

          {/* Links Grid - Tighter gaps */}
          <div className="flex-[1.5] grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color:"#c9d1d9", opacity: 0.6 }}>{category}</h4>
                <ul className="space-y-1.5">
                  {links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-[12px] transition-colors hover:text-[#86efac]" style={{ color:"#8b949e" }}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Reduced spacing */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6" style={{ borderTop:"1px solid #161b22" }}>
          <div className="flex items-center gap-4">
            <p className="text-[10px]" style={{ color:"#484f58" }}>
              © {new Date().getFullYear()} FlowCRM, Inc.
            </p>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color:"#484f58" }}>
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span style={{ opacity: 0.8 }}>All systems operational</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Github, label: "GitHub" },
              { icon: Youtube, label: "YouTube" },
            ].map((social, i) => (
              <a key={i} href="#"
                className="transition-colors"
                style={{ color:"#484f58" }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.color="#f0f6fc"; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.color="#484f58"; }}
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
