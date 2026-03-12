import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ClipboardList, UserCheck, BarChart3, Bell, Shield,
} from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";
import { cn } from "../../lib/utils";

const items = [
  {
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    icon: ClipboardList,
    title: "Service Request Intake",
    desc: "Clients submit service or order requests through a clean, branded portal. Every request is logged, timestamped, and instantly visible to your team.",
    accent: "#27f060ff",
  },
  {
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    icon: UserCheck,
    title: "Role-Based Assignment",
    desc: "Admins, Managers, and Sales employees each see their own queue. Assign requests internally based on expertise, capacity, or priority.",
    accent: "#bbf804ff",
  },
  {
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    icon: BarChart3,
    title: "Real-Time Dashboard & Analytics",
    desc: "Track open requests, response times, resolution rates, and team performance from a single dashboard. Identify bottlenecks before they become problems and make data-driven decisions.",
    accent: "#67e8f9",
  },
  {
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    icon: Bell,
    title: "Instant Notifications & Updates",
    desc: "Clients and teams receive real-time updates at every stage — from request acknowledgment to status changes and final resolution.",
    accent: "#34d399",
  },
  {
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
    icon: Shield,
    title: "Multi-Tenant Security",
    desc: "Each company operates in a fully isolated environment with role-based access control, ensuring data privacy and compliance across all tenants.",
    accent: "#f472b6",
  },
];

interface BentoCardProps {
  area: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
  delay: number;
  inView: boolean;
}

function BentoCard({ area, icon: Icon, title, desc, accent, delay, inView }: BentoCardProps) {
  return (
    <motion.li
      className={cn("min-h-[14rem] list-none", area)}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-full rounded-[1.25rem] p-[1px] md:rounded-[1.5rem]"
        style={{ background: "var(--border)" }}>
        <GlowingEffect spread={44} glow disabled={false} proximity={72} inactiveZone={0.01} borderWidth={2} />
        <div
          className="relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-[1.2rem] p-6 md:p-7"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20"
            style={{ background: accent }}
          />
          <div
            className="w-fit rounded-xl p-2.5 border"
            style={{ background: `${accent}18`, borderColor: `${accent}30` }}
          >
            <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.8} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold leading-snug tracking-tight" style={{ color: "#f0f6fc" }}>
              {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#8b949e" }}>
              {desc}
            </p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color: "#0cf537ff", background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)" }}
          >
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: "#f0f6fc" }}>
            Everything you need to <span className="text-gradient">manage requests</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            From client intake to resolution — every feature designed for seamless service management.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          {items.map((item, i) => (
            <BentoCard
              key={item.title}
              area={item.area}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              accent={item.accent}
              delay={i * 0.09}
              inView={inView}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
