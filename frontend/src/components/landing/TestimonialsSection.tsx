import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";

const testimonials = [
  {
    id: "t1",
    quote: "FlowCRM transformed how we handle client requests. Our response time dropped from hours to minutes, and clients love the real-time status updates.",
    author: "Sarah Chen", role: "Operations Director", company: "TechServ Co",
    avatar: "👩‍💼", avatarBg: "from-violet-400 to-violet-600", stars: 5,
  },
  {
    id: "t2",
    quote: "We manage over 500 service requests daily across three departments. FlowCRM's role-based queues mean nothing falls through the cracks anymore.",
    author: "Marcus Rivera", role: "Service Manager", company: "GlobalOps Inc",
    avatar: "👨‍💻", avatarBg: "from-blue-400 to-blue-600", stars: 5,
  },
  {
    id: "t3",
    quote: "The dashboard alone saved us 15 hours a week of manual reporting. We can finally see bottlenecks in real-time and resolve them proactively.",
    author: "Priya Mehta", role: "Head of Client Success", company: "ServicePro",
    avatar: "👩‍🔬", avatarBg: "from-emerald-400 to-emerald-600", stars: 5,
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .6 }} className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color: "#818cf8", background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)" }}>
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: "#f0f6fc" }}>
            Loved by service <span className="text-gradient">teams worldwide</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8b949e" }}>
            Join 3,200+ companies who use FlowCRM to streamline service requests and delight their clients.
          </p>
        </motion.div>

        <ul className="grid md:grid-cols-3 gap-4 list-none">
          {testimonials.map((t, i) => (
            <motion.li key={t.id} id={t.id}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .15, duration: .6, ease: [.22, 1, .36, 1] as const }}
              className="relative rounded-2xl p-[1px]"
              style={{ background: "var(--border)" }}
            >
              <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
              <div className="relative h-full p-6 rounded-[calc(1rem-1px)] flex flex-col gap-4 cursor-default"
                style={{ background: "var(--surface-2)" }}>
                <div className="absolute top-4 right-5 text-5xl font-serif leading-none select-none"
                  style={{ color: "rgba(99,102,241,.15)" }}>&ldquo;</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#8b949e" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-xl shadow-md`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: "#f0f6fc" }}>{t.author}</div>
                    <div className="text-xs" style={{ color: "#484f58" }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm"
          style={{ color: "#484f58" }}
        >
          {[["3,200+", "companies"], ["120K+", "requests handled"], ["96%", "resolution rate"], ["99.9%", "uptime"]].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-2xl font-extrabold" style={{ color: "#f0f6fc" }}>{val}</span>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
