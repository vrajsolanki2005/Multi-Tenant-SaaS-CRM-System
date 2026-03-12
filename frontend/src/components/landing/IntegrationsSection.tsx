"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const integrations = [
  { id:"slack",         name:"Slack",         emoji:"💬", accent:"#a78bfa", desc:"Instant deal alerts" },
  { id:"salesforce",    name:"Salesforce",     emoji:"☁️", accent:"#60a5fa", desc:"Two-way CRM sync" },
  { id:"hubspot",       name:"HubSpot",        emoji:"🧲", accent:"#fb923c", desc:"Marketing alignment" },
  { id:"stripe",        name:"Stripe",         emoji:"💳", accent:"#818cf8", desc:"Revenue tracking" },
  { id:"notion",        name:"Notion",         emoji:"📝", accent:"#c9d1d9", desc:"Deal documentation" },
  { id:"google-sheets", name:"Google Sheets",  emoji:"📊", accent:"#34d399", desc:"Data export & reports" },
];

const secondRow = [
  { id:"zoom",     name:"Zoom",     emoji:"📹" },
  { id:"gmail",    name:"Gmail",    emoji:"📮" },
  { id:"calendly", name:"Calendly", emoji:"🗓️" },
  { id:"linkedin", name:"LinkedIn", emoji:"🔗" },
  { id:"apollo",   name:"Apollo",   emoji:"🚀" },
];

export default function IntegrationsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="integrations" ref={ref} className="py-24" style={{ background: "var(--background)" }} data-scroll-section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0,y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:.6 }} className="text-center mb-16" data-scroll-title>
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color:"#86efac", background:"rgba(134,239,172,.12)", border:"1px solid rgba(134,239,172,.2)" }}>
            Integrations
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color:"#f0f6fc" }}>
            Works with your <span className="text-gradient">entire stack</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color:"#8b949e" }}>
            Connect to 100+ tools your team already uses. No complex setup, no engineering required.
          </p>
        </motion.div>

        {/* Primary grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6" data-scroll-grid>
          {integrations.map((item, i) => (
            <motion.div key={item.id} id={`integration-${item.id}`}
              initial={{ opacity:0, scale:.9 }} animate={inView?{opacity:1,scale:1}:{}}
              transition={{ delay:i*.07, duration:.4, ease:"easeOut" }}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl cursor-default transition-all duration-300"
              data-scroll-card
              style={{ background:"var(--surface-2)", border:"1px solid var(--border)" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${item.accent}40`;
                el.style.boxShadow = `0 0 0 1px ${item.accent}18, 0 12px 32px rgba(0,0,0,.3)`;
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "";
                el.style.transform = "";
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-200"
                style={{ background:`${item.accent}18`, border:`1px solid ${item.accent}30` }}>
                {item.emoji}
              </div>
              <span className="text-sm font-bold" style={{ color:"#c9d1d9" }}>{item.name}</span>
              <span className="text-[10px] text-center leading-tight" style={{ color:"#484f58" }}>{item.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* Secondary row */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {secondRow.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity:0, y:10 }} animate={inView?{opacity:1,y:0}:{}}
              transition={{ delay:.5+i*.05, duration:.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-default transition-all duration-200"
              style={{ background:"var(--surface-2)", border:"1px solid var(--border)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(134,239,172,.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm font-semibold" style={{ color:"#8b949e" }}>{item.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:.8 }}
          className="text-center text-sm" style={{ color:"#484f58" }}>
          + 90 more integrations via our open API and Zapier connector
        </motion.p>
      </div>
    </section>
  );
}
