import { motion, useInView } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, ClipboardCheck, Users, Building2, User, Shield, Clipboard, Briefcase, Inbox } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { HoverActionButton } from "./ui/hover-button-1";
import { getLandingSection } from "../../api/landing";

const CRM_URL = "http://localhost:5173";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const roles = [
  { icon: User, label: "Client",   color: "from-blue-600 to-blue-700",    glow: "shadow-blue-900",   cls: "animate-float" },
  { icon: Shield, label: "Admin",    color: "from-violet-600 to-violet-700", glow: "shadow-violet-900", cls: "animate-float-delay" },
  { icon: Clipboard, label: "Manager",  color: "from-emerald-600 to-emerald-700", glow: "shadow-emerald-900", cls: "animate-float" },
  { icon: Briefcase, label: "Sales",    color: "from-orange-600 to-orange-700", glow: "shadow-orange-900", cls: "animate-float-delay-2" },
  { icon: Inbox, label: "Requests", color: "from-pink-600 to-pink-700",    glow: "shadow-pink-900",   cls: "animate-float-delay" },
];

const badges = ["99.9% Uptime SLA", "SOC2 Certified", "GDPR Compliant"];

interface HeroStat { label: string; value: string; sub: string; color: string; }

const STAT_ICONS: Record<string, React.ReactNode> = {
  "Requests handled": <ClipboardCheck className="w-3.5 h-3.5" />,
  "Active companies": <Users className="w-3.5 h-3.5" />,
  "Client satisfaction": <Building2 className="w-3.5 h-3.5" />,
};

function Counter({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}
export default function HeroSection() {
  const [glowPos, setGlowPos] = useState({ x: -600, y: -600 });
  const [glowVis, setGlowVis] = useState(false);
  const [metrics, setMetrics] = useState<HeroStat[]>([]);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  useEffect(() => {
    getLandingSection<HeroStat>('hero_stats').then(setMetrics).catch(() => {});
  }, []);

  return (
    <section
      className="relative min-h-screen pt-24 pb-16 overflow-hidden"
      style={{ background: "var(--background)" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setGlowVis(true)}
      onMouseLeave={() => setGlowVis(false)}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-30" />

      {/* Mouse-tracking glow orb */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 700, height: 700,
          left: glowPos.x - 350, top: glowPos.y - 350,
          background: "radial-gradient(circle, rgba(134,239,172,.12) 0%, rgba(251,191,36,.07) 40%, transparent 70%)",
          opacity: glowVis ? 1 : 0,
          transition: "opacity .3s",
        }}
      />

      {/* Static ambient orbs */}
      <div className="absolute top-1/4 -left-56 w-96 h-96 bg-green-950 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute top-1/3 -right-56 w-[32rem] h-[32rem] bg-amber-950 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-40 bg-green-950/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[84vh]">

          {/* ── Left copy ───────────────────────── */}
          <div className="pt-8 lg:pt-0">
            <motion.div
              custom={0} initial="hidden" animate="show" variants={fadeUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-950/80 border border-green-800/60 text-green-300 text-xs font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              New: Real-time request tracking is now live
              <ArrowRight className="w-3 h-3 opacity-60" />
            </motion.div>

            <motion.h1
              custom={1} initial="hidden" animate="show" variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.04] mb-6"
              style={{ color: "#f0f6fc" }}
            >
              Manage Service{" "}
              <span className="text-gradient">Requests</span><br />
              Seamlessly
            </motion.h1>

            <motion.p
              custom={2} initial="hidden" animate="show" variants={fadeUp}
              className="text-lg sm:text-xl leading-relaxed mb-8 max-w-xl"
              style={{ color: "#8b949e" }}
            >
              One platform where clients send requests and companies handle them
              through Admin, Manager, and Sales roles — with full visibility at every step.
            </motion.p>

            <motion.div
              custom={3} initial="hidden" animate="show" variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <HoverActionButton
                label="Start Free Trial"
                href={`${CRM_URL}/register`}
                className="sm:w-auto"
              />
              <a href={`${CRM_URL}/login`} id="hero-sign-in"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl border transition-all duration-200 group"
                style={{ color: "#c9d1d9", borderColor: "#30363d", background: "rgba(22,27,34,.8)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#22c55e"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#30363d"; }}
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Sign In
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div custom={4} initial="hidden" animate="show" variants={fadeUp}
              className="flex flex-wrap items-center gap-5 mb-10"
            >
              {badges.map(b => (
                <div key={b} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#6e7681" }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{b}
                </div>
              ))}
            </motion.div>

            {/* Metrics */}
            <motion.div custom={5} initial="hidden" animate="show" variants={fadeUp}
              className="flex flex-wrap gap-6 pt-6"
              style={{ borderTop: "1px solid #21262d" }}
            >
              {metrics.map(m => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${m.color} mb-0.5`}>{STAT_ICONS[m.label]}{m.label}</div>
                  <div className="text-2xl font-extrabold" style={{ color: "#f0f6fc" }}>{m.value}</div>
                  <div className="text-xs" style={{ color: "#484f58" }}>{m.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right widget ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              {/* Centre hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-600 to-amber-600 flex flex-col items-center justify-center text-white animate-pulse-slow border-2 border-green-500/30">
                  <ClipboardCheck className="w-8 h-8" strokeWidth={2.5} />
                  <span className="text-[9px] font-bold mt-1 tracking-widest uppercase opacity-70">Hub</span>
                </div>
              </div>

              {/* Orbit rings */}
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 rounded-full border border-green-900/60 border-dashed animate-spin-slow" />
                <div className="absolute inset-6 rounded-full border border-amber-900/40 border-dashed animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "14s" }} />
                <div className="absolute inset-12 rounded-full border border-green-900/30 border-dashed animate-spin-slow" style={{ animationDuration: "8s" }} />

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {[0, 72, 144, 216, 288].map((angle, i) => {
                    const rad = angle * Math.PI / 180;
                    return (
                      <line key={i} x1="160" y1="160" x2={160 + 120 * Math.cos(rad)} y2={160 + 120 * Math.sin(rad)}
                        stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4,6"
                        className="animate-dash" style={{ animationDelay: `${i * .4}s` }} />
                    );
                  })}
                </svg>

                {roles.map((role, i) => {
                  const a = i * 72 * Math.PI / 180;
                  return (
                    <div key={role.label} className={`absolute ${role.cls}`}
                      style={{ left: `${50 + 42 * Math.cos(a)}%`, top: `${50 + 42 * Math.sin(a)}%`, transform: "translate(-50%,-50%)" }}
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} shadow-lg ${role.glow} flex flex-col items-center justify-center text-white border border-white/10`}>
                        <role.icon className="w-5 h-5" />
                        <span className="text-[8px] font-bold mt-0.5">{role.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating stat cards */}
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 rounded-2xl px-4 py-3 shadow-xl"
                style={{ background: "rgba(13,17,23,.95)", border: "1px solid #21262d" }}
              >
                <div className="text-[11px] font-medium mb-0.5" style={{ color: "#484f58" }}>Requests this week</div>
                <div className="text-xl font-extrabold" style={{ color: "#f0f6fc" }}>+1,240</div>
                <div className="text-[11px] font-semibold mt-0.5 text-emerald-400">↑ 18% vs last week</div>
              </motion.div>

              <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 rounded-2xl px-4 py-3 shadow-xl"
                style={{ background: "rgba(13,17,23,.95)", border: "1px solid #21262d" }}
              >
                <div className="text-[11px] font-medium mb-0.5" style={{ color: "#484f58" }}>Resolved today</div>
                <div className="text-xl font-extrabold text-green-400"><Counter to={347} /></div>
                <div className="text-[11px] mt-0.5" style={{ color: "#484f58" }}>avg 2.4 hr response</div>
              </motion.div>

              <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-8 -translate-y-1/2 rounded-2xl px-3 py-2.5 shadow-lg"
                style={{ background: "rgba(13,17,23,.95)", border: "1px solid #21262d" }}
              >
                <div className="text-[10px] font-medium" style={{ color: "#484f58" }}>Resolution rate</div>
                <div className="text-lg font-extrabold" style={{ color: "#f0f6fc" }}>96%</div>
                <div className="w-16 h-1 rounded mt-1" style={{ background: "#21262d" }}>
                  <div className="h-1 rounded bg-green-500" style={{ width: "96%" }} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: .6 }}
        className="mt-16 pt-8" style={{ borderTop: "1px solid #21262d" }}
      >
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#484f58" }}>
          Trusted by businesses worldwide
        </p>
        <div className="ticker-wrap">
          <div className="ticker">
            {["TechServ Co", "GlobalOps", "ServicePro", "ClientBridge", "OmniDesk", "FlexCare", "SwiftResolve", "CoreManage", "PrimeService", "CloudOps",
              "TechServ Co", "GlobalOps", "ServicePro", "ClientBridge", "OmniDesk", "FlexCare", "SwiftResolve", "CoreManage", "PrimeService", "CloudOps"].map((name, i) => (
              <span key={i} className="inline-flex items-center px-8 text-sm font-semibold" style={{ color: "#484f58" }}>{name}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
