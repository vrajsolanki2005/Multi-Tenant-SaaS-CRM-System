import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";
import { getLandingSection } from "../../api/landing";

const CRM_URL = "http://localhost:5173";

interface Plan {
  id: string; name: string; price: string; period: string;
  desc: string; featured: boolean; features: string[];
}

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    getLandingSection<Plan>('pricing').then(setPlans).catch(() => {});
  }, []);

  return (
    <section id="pricing" ref={ref} className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color: "#86efac", background: "rgba(134,239,172,.12)", border: "1px solid rgba(134,239,172,.2)" }}>
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: "#f0f6fc" }}>
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8b949e" }}>
            Start free, scale as you grow. No hidden fees, no surprise bills.
          </p>
        </motion.div>

        <ul className="grid lg:grid-cols-3 gap-4 items-start list-none">
          {plans.map((plan, i) => (
            <motion.li key={plan.id} id={`plan-${plan.id}`}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .12, duration: .6, ease: [.22, 1, .36, 1] }}
              className="relative rounded-2xl p-[1px]"
              style={{
                background: plan.featured
                  ? "linear-gradient(135deg,rgba(134,239,172,.5),rgba(251,191,36,.3))"
                  : "var(--border)",
              }}
            >
              <GlowingEffect spread={44} glow disabled={false} proximity={72} inactiveZone={0.01} borderWidth={plan.featured ? 2 : 1.5} />

              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                  style={{ background: "linear-gradient(135deg,#22c55e,#fbbf24)", boxShadow: "0 4px 16px rgba(134,239,172,.4)" }}>
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="relative rounded-[calc(1rem-1px)] p-8"
                style={{
                  background: plan.featured ? "rgba(134,239,172,.06)" : "var(--surface-2)",
                  boxShadow: plan.featured ? "0 24px 48px rgba(0,0,0,.4)" : undefined,
                }}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#f0f6fc" }}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-4xl font-extrabold" style={{ color: "#f0f6fc" }}>{plan.price}</span>
                    <span className="text-sm pb-1" style={{ color: "#484f58" }}>{plan.period}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#8b949e" }}>{plan.desc}</p>
                </div>

                <a href={plan.id === "enterprise" ? "#" : `${CRM_URL}/register`}
                  id={`plan-${plan.id}-cta`}
                  className="block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 mb-6"
                  style={plan.featured
                    ? { background: "linear-gradient(135deg,#22c55e,#fbbf24)", color: "#fff", boxShadow: "0 4px 20px rgba(134,239,172,.35)" }
                    : { background: "var(--surface)", border: "1px solid var(--border)", color: "#c9d1d9" }}
                >
                  {plan.id === "enterprise" ? "Contact Sales" : "Get Started"}
                </a>

                <div className="space-y-3">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "#8b949e" }}>
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .6 }}
          className="text-center text-sm mt-8" style={{ color: "#484f58" }}>
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
