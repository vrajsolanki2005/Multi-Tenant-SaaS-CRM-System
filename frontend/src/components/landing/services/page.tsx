"use client";

import Navbar from "../Navbar";
import Footer from "../Footer";


const services = [
  {
    icon: "📩",
    title: "Client Request Portal",
    desc: "Give your clients a clean, branded interface to submit service requests, order enquiries, and support tickets — available 24/7.",
    features: ["Custom request forms", "File attachments", "Real-time status tracking", "Email confirmation"],
    accent: "#818cf8",
  },
  {
    icon: "📋",
    title: "Order & Request Management",
    desc: "Centralise all incoming requests in one dashboard. Filter, search, and prioritise work across your entire team effortlessly.",
    features: ["Unified request queue", "Priority levels & SLAs", "Custom categories & tags", "Bulk actions"],
    accent: "#67e8f9",
  },
  {
    icon: "👥",
    title: "Role-Based Team Management",
    desc: "Assign different permissions to Admins, Managers, and Sales employees. Everyone sees exactly what they need — nothing more, nothing less.",
    features: ["Admin, Manager & Sales roles", "Permission-based views", "Internal assignment & handoff", "Team workload visibility"],
    accent: "#a78bfa",
  },
  {
    icon: "📊",
    title: "Analytics & Reporting",
    desc: "Track response times, resolution rates, team performance, and client satisfaction from a single real-time dashboard.",
    features: ["Real-time metrics", "Custom report builder", "Export to CSV/PDF", "Trend analysis"],
    accent: "#34d399",
  },
  {
    icon: "🔔",
    title: "Notifications & Communication",
    desc: "Keep everyone in the loop with instant notifications at every stage — from request acknowledgment to final resolution.",
    features: ["Email & in-app alerts", "Status change notifications", "Client response updates", "Escalation alerts"],
    accent: "#fb923c",
  },
  {
    icon: "🔒",
    title: "Multi-Tenant Platform",
    desc: "Each company operates in a fully isolated environment with its own data, users, and configurations — secure by design.",
    features: ["Data isolation per tenant", "SSO & SCIM support", "Role-based access control", "GDPR compliance"],
    accent: "#f472b6",
  },
];

export default function ServicesPage() {
  return (
    <main className="overflow-x-hidden" style={{ background: "var(--background)" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-20" />
        <div className="absolute top-1/4 -left-56 w-96 h-96 bg-green-950 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-1/3 -right-56 w-[28rem] h-[28rem] bg-amber-950 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{ color: "#86efac", background: "rgba(134,239,172,.12)", border: "1px solid rgba(134,239,172,.2)" }}
          >
            Our Services
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6" style={{ color: "#f0f6fc" }}>
            Everything your team needs to{" "}
            <span className="text-gradient">deliver exceptional service</span>
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            From client-facing request portals to internal team management — 
            FlowCRM covers the full service lifecycle.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20" style={{ borderTop: "1px solid #21262d" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <div key={s.title} className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${s.accent}50`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${s.accent}20, 0 20px 40px rgba(0,0,0,.3)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <div className="text-3xl">{s.icon}</div>
                <h3 className="text-lg font-bold" style={{ color: "#f0f6fc" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#8b949e" }}>{s.desc}</p>
                <ul className="space-y-1.5 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "#6e7681" }}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ borderTop: "1px solid #21262d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "#f0f6fc" }}>
            Ready to streamline your service operations?
          </h2>
          <p className="text-lg mb-8" style={{ color: "#8b949e" }}>
            Start your 14-day free trial — no credit card required.
          </p>
          <a href="http://localhost:5173/register"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#22c55e,#fbbf24)", boxShadow: "0 4px 20px rgba(134,239,172,.35)" }}
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
