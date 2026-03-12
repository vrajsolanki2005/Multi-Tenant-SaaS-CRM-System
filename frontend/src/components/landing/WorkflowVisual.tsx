"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const tools = [
  { icon:"🔗", label:"CRM Sync",   desc:"Real-time data sync",     angle:0,   r:38 },
  { icon:"💬", label:"Slack",      desc:"Instant notifications",   angle:72,  r:38 },
  { icon:"📧", label:"Email",      desc:"Drip campaigns",          angle:144, r:38 },
  { icon:"📊", label:"Analytics",  desc:"Sales insights",          angle:216, r:38 },
  { icon:"💳", label:"Payments",   desc:"Stripe connect",          angle:288, r:38 },
  { icon:"🗓️", label:"Calendar",   desc:"Meeting scheduler",       angle:30,  r:82 },
  { icon:"📞", label:"Calls",      desc:"Call logging",            angle:150, r:82 },
  { icon:"📝", label:"Notes",      desc:"Auto summaries",          angle:270, r:82 },
];

export default function WorkflowVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 overflow-hidden" style={{ background:"var(--background)" }} data-scroll-section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0,y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:.6 }} className="text-center mb-16" data-scroll-title>
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color:"#818cf8", background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.2)" }}>
            Automation Engine
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color:"#f0f6fc" }}>
            Everything connected, <span className="text-gradient">automatically</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color:"#8b949e" }}>
            FlowSync sits at the center of your sales stack, routing data and triggering actions across all your tools without a single line of code.
          </p>
        </motion.div>

        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity:0, scale:.8 }} animate={inView?{opacity:1,scale:1}:{}} transition={{ duration:.7, delay:.2 }}
            className="relative w-[560px] h-[560px] max-w-full"
          >
            {/* Glow — parallax depth: drifts up slower than body */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full blur-3xl opacity-25 pointer-events-none animate-pulse-slow"
              data-parallax="-0.25"
              style={{ background:"radial-gradient(circle,rgba(99,102,241,.6),rgba(139,92,246,.3),transparent)" }} />

            {/* Rings */}
            <div className="absolute inset-0 rounded-full border-dashed animate-spin-slow" style={{ borderColor:"rgba(99,102,241,.2)", borderWidth:1 }} />
            <div className="absolute rounded-full border-dashed animate-spin-slow" style={{ inset:"14%", borderColor:"rgba(139,92,246,.15)", borderWidth:1, animationDirection:"reverse" }} />
            <div className="absolute rounded-full border" style={{ inset:"32%", borderColor:"rgba(99,102,241,.12)" }} />

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 560">
              <defs>
                <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {tools.map((tool, i) => {
                const rad = tool.angle * Math.PI / 180;
                const radius = (tool.r / 100) * 280;
                return (
                  <line key={i} x1="280" y1="280" x2={280+radius*Math.cos(rad)} y2={280+radius*Math.sin(rad)}
                    stroke="url(#lg1)" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.6"
                    className="animate-dash" style={{ animationDelay:`${i*.3}s` }} />
                );
              })}
            </svg>

            {/* Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-pulse-slow">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 flex flex-col items-center justify-center"
                style={{ boxShadow:"0 0 40px rgba(99,102,241,.5), 0 0 80px rgba(99,102,241,.2)", border:"2px solid rgba(99,102,241,.4)" }}>
                <span className="text-3xl">⚡</span>
                <span className="text-[9px] text-white font-bold mt-1 tracking-widest opacity-80">FLOWSYNC</span>
              </div>
            </div>

            {/* Tool cards */}
            {tools.map((tool, i) => {
              const rad = tool.angle * Math.PI / 180;
              const radius = (tool.r / 100) * 280;
              const x = 50 + (Math.cos(rad) * radius * 100) / 560;
              const y = 50 + (Math.sin(rad) * radius * 100) / 560;
              return (
                <motion.div key={tool.label}
                  initial={{ opacity:0, scale:0 }} animate={inView?{opacity:1,scale:1}:{}}
                  transition={{ delay:.4+i*.1, duration:.5, ease:"backOut" }}
                  className="absolute"
                  style={{ left:`${x}%`, top:`${y}%`, transform:"translate(-50%,-50%)", animation:`float ${4+i}s ease-in-out infinite`, animationDelay:`${i*.7}s` }}
                >
                  <div className="rounded-xl px-3 py-2 min-w-[80px] text-center cursor-default transition-all duration-200 hover:-translate-y-1"
                    style={{ background:"var(--surface-2)", border:"1px solid var(--border)", boxShadow:"0 4px 16px rgba(0,0,0,.3)" }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor="rgba(99,102,241,.4)"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor="var(--border)"; }}
                  >
                    <div className="text-xl mb-0.5">{tool.icon}</div>
                    <div className="text-xs font-bold" style={{ color:"#c9d1d9" }}>{tool.label}</div>
                    <div className="text-[9px] font-medium" style={{ color:"#484f58" }}>{tool.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
