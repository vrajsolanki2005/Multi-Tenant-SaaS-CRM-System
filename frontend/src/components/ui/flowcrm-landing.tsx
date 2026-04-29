import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, Float, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { Box, Settings, Lock, Sparkles, Search, Zap, CheckCircle, Crown, Shield, Clipboard, Briefcase, Inbox, SearchIcon, Target, Cog, CheckSquare } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";

/* =========================
🔮 HERO 3D ICOSAHEDRON
========================= */
const IcosahedronMesh = ({ progress }: { progress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  return (
    <mesh ref={meshRef} scale={1.2 + progress * 0.6}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial
        color="#818cf8"
        speed={1.5 + progress * 2}
        distort={0.1 + progress * 0.4}
        radius={1}
        wireframe
        emissive="#6366f1"
        emissiveIntensity={3}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
};

const Hero3D = ({ progress }: { progress: number }) => (
  <Canvas style={{ background: "transparent" }}>
    <PerspectiveCamera makeDefault position={[0, 0, 4]} />
    <ambientLight intensity={0.3} />
    <pointLight position={[5, 5, 5]} intensity={2} color="#6366f1" />
    <pointLight position={[-5, -5, -5]} intensity={2} color="#a855f7" />
    <pointLight position={[0, 5, 0]} intensity={1} color="#00BFFF" />
    <Stars radius={60} depth={30} count={3000} factor={3} saturation={0} fade speed={0.5} />
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1}>
      <IcosahedronMesh progress={progress} />
    </Float>
  </Canvas>
);

/* =========================
🌊 FLUID LINE ART (SVG)
========================= */
const FluidLines = () => (
  <svg viewBox="0 0 600 600" fill="none" className="w-full h-full opacity-50">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#3B82F6" /></linearGradient>
      <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" /><stop offset="100%" stopColor="#7C3AED" stopOpacity="0.4" /></linearGradient>
    </defs>
    {[...Array(18)].map((_, i) => {
      const r = 40 + i * 26;
      return <ellipse key={i} cx={300 + (i % 3 - 1) * 12} cy={300 + (i % 4 - 2) * 10} rx={r} ry={r * 0.55} stroke={i % 2 === 0 ? "url(#g1)" : "url(#g2)"} strokeWidth={0.6} fill="none" transform={`rotate(${i * 11}, 300, 300)`} opacity={1 - i * 0.04} />;
    })}
  </svg>
);

/* =========================
🚀 MAIN LANDING PAGE
========================= */
export default function FlowCRMLanding() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrollY / maxScroll, 1));
      setNavScrolled(scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-black text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.4 }} />

      {/* ─── NAVBAR ─────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-16 py-4 flex items-center justify-between transition-all duration-300 ${navScrolled ? "backdrop-blur-xl bg-black/70 border-b border-white/5" : ""}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight">Flow<span style={{ color: "#00BFFF" }}>CRM</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#platform" className="hover:text-white transition-colors">Platform</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
        </div>
        <Link to="/register" className="hidden md:flex items-center px-5 py-2.5 rounded-full text-sm font-bold text-black transition-all hover:scale-105" style={{ background: "#00BFFF", boxShadow: "0 0 20px rgba(0,191,255,0.35)" }}>
          Start Free Trial
        </Link>
      </nav>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 md:px-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #7C3AED, transparent)", filter: "blur(120px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #3B82F6, transparent)", filter: "blur(120px)" }} />
        <div className="relative z-10 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
              <Sparkles className="w-3 h-3" style={{ color: "#00BFFF" }} /> New: Real-time request tracking is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
              Manage<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #7C3AED, #3B82F6, #00BFFF)" }}>Service Requests</span><br />
              Seamlessly
            </h1>
            <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
              FlowCRM is a multi-tenant B2B platform built for service organizations that can't afford chaos. Centralize every client request, automate intelligent routing, and give your entire team — from Sales to SuperAdmin — the visibility they need to act fast and deliver exceptional results.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/register" className="flex items-center gap-2 px-7 py-4 rounded-full font-bold text-black text-base transition-transform hover:scale-105" style={{ background: "#00BFFF", boxShadow: "0 0 30px rgba(0,191,255,0.4)" }}>
                Start Free Trial →
              </Link>
              <Link to="/login" className="flex items-center gap-2 px-7 py-4 rounded-full font-bold text-white text-base border border-white/20 hover:bg-white/5 transition-all">
                Sign In
              </Link>
            </div>
            <div className="flex gap-6 flex-wrap text-sm">
              {["99.9% Uptime", "SOC2 Certified", "GDPR Ready"].map(t => (
                <span key={t} className="flex items-center gap-2 text-zinc-500"><CheckCircle className="w-4 h-4 font-bold" style={{ color: "#00BFFF" }} /> {t}</span>
              ))}
            </div>
          </div>
          <div className="relative w-full h-[480px] md:h-[600px]">
            <div className="absolute inset-0 opacity-40 pointer-events-none"><FluidLines /></div>
            <div className="absolute inset-0"><Hero3D progress={scrollProgress} /></div>
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ───────────────────────────── */}
      <section id="about" className="px-6 md:px-16 py-28 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, #3B82F6, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#00BFFF" }}>What Is FlowCRM?</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">The Operating System for Client Services</h2>
            <p className="text-zinc-400 leading-relaxed text-base">
              FlowCRM was built from the ground up to solve a problem every service business faces: as you scale, coordination breaks down. Requests fall through cracks, team members duplicate effort, and clients are left waiting for answers.
            </p>
            <p className="text-zinc-400 leading-relaxed text-base">
              We replaced scattered spreadsheets, disconnected inboxes, and ad-hoc processes with a single, unified platform. FlowCRM gives every stakeholder — clients submitting requests, sales reps tracking opportunities, managers reviewing workloads, and admins overseeing compliance — a tailored view and the exact tools they need.
            </p>
            <p className="text-zinc-400 leading-relaxed text-base">
              The result: faster resolution, fewer miscommunications, happier clients, and a team that can focus on delivering value instead of fighting fires.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "< 2.4hrs", label: "Average Resolution Time", color: "#00BFFF" },
              { stat: "99.9%", label: "Platform Availability SLA", color: "#a855f7" },
              { stat: "Multi-Tenant", label: "Fully Isolated Per Org", color: "#6366f1" },
              { stat: "4 Roles", label: "Purpose-Built Views", color: "#22c55e" },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl border" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-3xl font-black mb-2" style={{ color: s.color }}>{s.stat}</div>
                <div className="text-zinc-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────── */}
      <section className="px-6 md:px-16 py-24 border-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#00BFFF" }}>How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black">Simple. Powerful. Fast.</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">From first request to final resolution — FlowCRM handles every step.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Client Submits a Request", desc: "Clients use a clean intake form to describe their need. The system auto-tags priority, category, and urgency — no manual sorting required." },
              { num: "02", title: "Intelligent Routing", desc: "FlowCRM's routing engine assigns the request to the right team member based on skills, workload, and availability — instantly and without manager intervention." },
              { num: "03", title: "Track, Resolve & Report", desc: "The assigned agent handles the request in a structured workspace. Managers see live progress dashboards, and clients receive automated status updates." },
            ].map(s => (
              <div key={s.num} className="space-y-4">
                <div className="text-5xl font-black" style={{ color: "rgba(99,102,241,0.3)" }}>{s.num}</div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM ARCHITECTURE ───────────────────── */}
      <section id="platform" className="px-6 md:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#00BFFF" }}>Platform Architecture</p>
            <h2 className="text-4xl md:text-5xl font-black">Built for Every Role</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed">FlowCRM uses a layered, role-based architecture. Every tier of your organization gets a purpose-built experience — no bloat, no missing context.</p>
          </div>

          {/* Central Hub Visual */}
          <div className="relative rounded-3xl border p-12 mb-12 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #6366f1, transparent)", filter: "blur(60px)" }} />
            
            {/* Hub center */}
            <div className="flex flex-col items-center mb-12">
              <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center border mb-3" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.5)", boxShadow: "0 0 40px rgba(99,102,241,0.25)" }}>
                <Zap className="w-8 h-8 text-indigo-400" />
              </div>
              <span className="text-lg font-black tracking-tight">Flow<span style={{ color: "#00BFFF" }}>CRM</span></span>
              <span className="text-zinc-600 text-xs mt-1">Central Request Engine</span>
              
              {/* Connection line down */}
              <div className="w-px h-8 mt-4" style={{ background: "linear-gradient(to bottom, rgba(99,102,241,0.6), transparent)" }} />
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { role: "SuperAdmin", icon: Crown, color: "#f59e0b", desc: "Full system control. Manages organizations, billing, global settings, and cross-tenant audit logs.", perms: ["All permissions", "Tenant management", "Global audit log"] },
                { role: "Admin", icon: Shield, color: "#3B82F6", desc: "Controls their organization's users, workflows, and configurations without cross-tenant access.", perms: ["User management", "Org configuration", "All reports"] },
                { role: "Manager", icon: Clipboard, color: "#a855f7", desc: "Assigns and monitors team workloads, reviews KPIs, and escalates critical requests in real-time.", perms: ["Assign requests", "View team metrics", "Escalation control"] },
                { role: "Sales", icon: Briefcase, color: "#22c55e", desc: "Manages their personal lead pipeline, contacts customers, and logs updates on active requests.", perms: ["Own requests", "Lead management", "Customer contact"] },
              ].map(n => (
                <div key={n.role} className="p-5 rounded-2xl border flex flex-col gap-3 transition-all hover:-translate-y-1 duration-200 group" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${n.color}22` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = n.color + "55"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${n.color}11`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = n.color + "22"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <div className="flex items-center gap-2">
                    <n.icon className="w-5 h-5" style={{ color: n.color }} />
                    <span className="font-bold" style={{ color: n.color }}>{n.role}</span>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">{n.desc}</p>
                  <ul className="mt-auto space-y-1">
                    {n.perms.map(p => (
                      <li key={p} className="text-xs flex items-center gap-1.5 text-zinc-600">
                        <span style={{ color: n.color }}>›</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Request lifecycle */}
          <div className="rounded-3xl border p-10" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-xl font-black mb-8 text-center text-zinc-300">Request Lifecycle</h3>
            <div className="flex flex-col md:flex-row items-center gap-0">
              {[
                { label: "Intake", icon: Inbox, color: "#00BFFF" },
                { label: "Triage", icon: SearchIcon, color: "#6366f1" },
                { label: "Assign", icon: Target, color: "#a855f7" },
                { label: "Execute", icon: Cog, color: "#f59e0b" },
                { label: "Resolve", icon: CheckSquare, color: "#22c55e" },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border" style={{ background: `${s.color}15`, border: `1px solid ${s.color}40` }}>
                      <s.icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:block flex-1 h-px max-w-[80px]" style={{ background: `linear-gradient(to right, ${s.color}44, ${arr[i+1].color}44)` }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────── */}
      <section id="features" className="px-6 md:px-16 py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#00BFFF" }}>Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black">Everything You Need to Scale</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed">FlowCRM is not a generic CRM. It's purpose-built for service-oriented businesses that need structure, speed, and visibility at every stage of their client lifecycle.</p>
          </div>
          
          {/* Glowing Effect Grid from Aceternity */}
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
            <GridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Sparkles className="h-5 w-5 text-indigo-400" />}
              title="Smart Request Intake"
              description="Every incoming request is instantly analyzed, categorized, and routed. Our engine considers skill tags, workload, and SLA priority — cutting assignment time from hours to seconds."
            />
            <GridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<Search className="h-5 w-5 text-purple-400" />}
              title="Intelligent Routing & Search"
              description="AI-assisted assignment logic maps each request to the best-fit team member based on expertise, past performance, and real-time availability."
            />
            <GridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Box className="h-5 w-5 text-cyan-400" />}
              title="Live Manager Dashboard"
              description="Real-time KPI monitoring for request volumes, team performance, resolution rates, and SLA compliance. Drill into workload in a single click."
            />
            <GridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Settings className="h-5 w-5 text-green-400" />}
              title="Real-Time Collaboration"
              description="Co-assign requests, leave internal notes, escalate to senior agents, and track every handoff. Full context always travels with the request."
            />
            <GridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Lock className="h-5 w-5 text-amber-400" />}
              title="Enterprise Audit Trail & Multi-Tenancy"
              description="Every action is logged with timestamp, actor, and context. Each organization is fully isolated with granular role-based permissions."
            />
          </ul>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────── */}
      <section id="pricing" className="px-6 md:px-16 py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#00BFFF" }}>Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black">Simple, Transparent Plans</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">Start free. Scale as you grow. No per-seat surprises or hidden platform fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$29", period: "/mo", desc: "Perfect for small teams launching their first service operation.", features: ["Up to 5 team members", "1,000 requests/month", "Standard dashboards", "Email support", "Basic audit logs"], highlight: false },
              { name: "Growth", price: "$89", period: "/mo", desc: "For growing organizations with complex workflows and compliance needs.", features: ["Up to 25 team members", "10,000 requests/month", "Advanced analytics & KPIs", "Full role-based access control", "Priority support (4hr SLA)", "Full audit trail"], highlight: true },
              { name: "Enterprise", price: "Custom", period: "", desc: "Tailored for large organizations needing dedicated infrastructure and SLAs.", features: ["Unlimited team members", "Unlimited requests", "Custom workflow builder", "Dedicated SLA guarantee", "Dedicated success manager", "Custom integrations"], highlight: false },
            ].map(p => (
              <div key={p.name} className="relative p-8 rounded-2xl border space-y-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background: p.highlight ? "rgba(0,191,255,0.05)" : "rgba(255,255,255,0.03)", border: p.highlight ? "1px solid rgba(0,191,255,0.4)" : "1px solid rgba(255,255,255,0.08)", boxShadow: p.highlight ? "0 0 40px rgba(0,191,255,0.1)" : "none", backdropFilter: "blur(12px)" }}>
                {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black" style={{ background: "#00BFFF" }}>Most Popular</div>}
                <div>
                  <div className="text-zinc-400 text-sm font-semibold mb-2">{p.name}</div>
                  <div className="text-4xl font-black mb-1">{p.price}<span className="text-zinc-600 text-lg font-medium">{p.period}</span></div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
                <ul className="space-y-3">
                  {p.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-zinc-300"><CheckCircle className="w-4 h-4" style={{ color: "#00BFFF" }} />{f}</li>)}
                </ul>
                <Link to="/register" className="block w-full py-3 rounded-xl font-bold text-center text-sm transition-all hover:opacity-90"
                  style={p.highlight ? { background: "#00BFFF", color: "#000", boxShadow: "0 0 20px rgba(0,191,255,0.3)" } : { background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {p.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer className="px-6 md:px-16 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black">Flow<span style={{ color: "#00BFFF" }}>CRM</span></span>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs">The operating system for client service teams. Built for clarity, speed, and scale.</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-zinc-400">All systems operational</span>
            </div>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Security", "Changelog", "API Docs"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press Kit"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-white font-bold text-sm mb-5">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map(l => <li key={l}><a href="#" className="text-zinc-500 text-sm hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-sm border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span>© 2026 FlowCRM Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-zinc-800 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-zinc-800 bg-[#0a0a0a] p-6 shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6" style={{ zIndex: 10 }}>
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-zinc-800 bg-zinc-900 p-2 text-white">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-white">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-zinc-400">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

