import Navbar from "../Navbar";
import Footer from "../Footer";

export default function AboutPage() {
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
            style={{ color: "#818cf8", background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)" }}
          >
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6" style={{ color: "#f0f6fc" }}>
            Simplifying how businesses{" "}
            <span className="text-gradient">manage service requests</span>
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            FlowCRM was built to bridge the gap between clients who need help
            and companies who deliver it — replacing scattered emails, lost tickets,
            and manual spreadsheets with one unified platform.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20" style={{ borderTop: "1px solid #21262d" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl font-extrabold mb-5" style={{ color: "#f0f6fc" }}>Our Mission</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#8b949e" }}>
                We believe every service request deserves a clear, trackable path from
                submission to resolution. Our mission is to empower businesses of all sizes
                with a platform that brings transparency, speed, and accountability to
                client-company communication.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#8b949e" }}>
                Whether you&apos;re a small team handling 50 requests a month or an enterprise
                processing thousands daily, FlowCRM adapts to your workflow — not the other way around.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "3,200+", label: "Companies" },
                { val: "120K+", label: "Requests / month" },
                { val: "96%", label: "Resolution rate" },
                { val: "99.9%", label: "Uptime" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-5 text-center"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <div className="text-2xl font-extrabold mb-1" style={{ color: "#f0f6fc" }}>{s.val}</div>
                  <div className="text-xs" style={{ color: "#484f58" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ borderTop: "1px solid #21262d" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-12 text-center" style={{ color: "#f0f6fc" }}>How FlowCRM Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Client Submits Request", desc: "Clients send service or order requests through a branded portal — no email clutter, no lost messages." },
              { step: "02", title: "Company Reviews & Assigns", desc: "Admins and managers review incoming requests and assign them to the right team member based on role, expertise, or capacity." },
              { step: "03", title: "Track, Resolve & Respond", desc: "Teams manage the request lifecycle, send status updates, and resolve issues — all with full visibility for both sides." },
            ].map(s => (
              <div key={s.step} className="rounded-2xl p-6"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <span className="text-3xl font-extrabold block mb-3" style={{ color: "rgba(134,239,172,.4)" }}>{s.step}</span>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#f0f6fc" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8b949e" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ borderTop: "1px solid #21262d" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-12 text-center" style={{ color: "#f0f6fc" }}>Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🎯", title: "Simplicity", desc: "Complex problems deserve simple solutions." },
              { icon: "🔒", title: "Security", desc: "Multi-tenant isolation and role-based access by default." },
              { icon: "⚡", title: "Speed", desc: "Every request handled faster than the last." },
              { icon: "🤝", title: "Transparency", desc: "Full visibility for clients and companies at every stage." },
            ].map(v => (
              <div key={v.title} className="rounded-2xl p-5 text-center"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-base font-bold mb-1" style={{ color: "#f0f6fc" }}>{v.title}</h3>
                <p className="text-sm" style={{ color: "#8b949e" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
