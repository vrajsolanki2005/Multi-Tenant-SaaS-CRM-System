"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const nodes = [
  { id:"trigger", label:"New Lead",     sub:"Trigger",     icon:"🎯", x:2,  y:38, accent:"#34d399" },
  { id:"score",   label:"Score Lead",   sub:"Smart Action", icon:"🎯", x:26, y:12, accent:"#60a5fa" },
  { id:"route",   label:"Route to Rep", sub:"Logic",       icon:"🔀", x:26, y:64, accent:"#a78bfa" },
  { id:"enrich",  label:"Enrich Data",  sub:"Integration", icon:"🔗", x:52, y:12, accent:"#fb923c" },
  { id:"email",   label:"Send Email",   sub:"Action",      icon:"📧", x:52, y:64, accent:"#f472b6" },
  { id:"notify",  label:"Slack Alert",  sub:"Notify",      icon:"💬", x:76, y:38, accent:"#818cf8" },
  { id:"crm",     label:"Update CRM",   sub:"Sync",        icon:"☁️", x:94, y:38, accent:"#2dd4bf" },
];

const edges = [
  { from:"trigger",to:"score" },{ from:"trigger",to:"route" },
  { from:"score",to:"enrich" },{ from:"route",to:"email" },
  { from:"enrich",to:"notify" },{ from:"email",to:"notify" },
  { from:"notify",to:"crm" },
];

function getNodePos(id: string, w: number, h: number) {
  const n = nodes.find(n => n.id === id);
  if (!n) return { x:0, y:0 };
  return { x:(n.x/100)*w+60, y:(n.y/100)*h+40 };
}

export default function WorkflowBuilderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const W = 820, H = 260;

  return (
    <section ref={ref} className="py-24" style={{ background:"var(--background)" }} data-scroll-section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0,y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:.6 }} className="text-center mb-16" data-scroll-title>
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color:"#818cf8", background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.2)" }}>
            Workflow Builder
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color:"#f0f6fc" }}>
            Build automations <span className="text-gradient">visually</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color:"#8b949e" }}>
            Drag, drop, and connect. Build powerful multi-step workflows that run 24/7 without writing a single line of code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity:0,y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:.7, delay:.2 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ border:"1px solid var(--border)", background:"var(--surface)", boxShadow:"0 24px 64px rgba(0,0,0,.5)" }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface-2)" }}>
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-xs font-semibold tracking-wide" style={{ color:"#484f58" }}>
              FlowSync Workflow Builder — New Lead Automation.flow
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md" style={{ color:"#34d399", background:"rgba(52,211,153,.12)" }}>● Active</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md" style={{ color:"#484f58", background:"rgba(72,79,88,.2)" }}>Save</span>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative w-full overflow-x-auto">
            <div className="bg-dot-pattern min-w-[820px] relative" style={{ height:`${H+80}px`, opacity:.5 }} />
            <div className="absolute inset-0 min-w-[820px]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${W} ${H+80}`} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#6366f1" />
                  </marker>
                </defs>
                {edges.map((e, i) => {
                  const from = getNodePos(e.from, W, H);
                  const to   = getNodePos(e.to,   W, H);
                  const mx   = (from.x + to.x) / 2;
                  const d    = `M${from.x+52},${from.y+20} C${mx},${from.y+20} ${mx},${to.y+20} ${to.x},${to.y+20}`;
                  return (
                    <motion.path key={i} d={d} fill="none" stroke="#6366f1" strokeWidth="1.5"
                      strokeOpacity="0.5" strokeDasharray="5 3" markerEnd="url(#arrow)"
                      initial={{ pathLength:0 }} animate={inView?{pathLength:1}:{}}
                      transition={{ delay:.6+i*.12, duration:.5 }} />
                  );
                })}
              </svg>

              {nodes.map((node, i) => {
                const px = (node.x/100)*W;
                const py = (node.y/100)*H+40;
                return (
                  <motion.div key={node.id} id={`node-${node.id}`}
                    initial={{ opacity:0, scale:.8 }} animate={inView?{opacity:1,scale:1}:{}}
                    transition={{ delay:.3+i*.07, duration:.4, ease:"backOut" }}
                    className="absolute cursor-pointer group"
                    style={{ left:px, top:py, transform:"translate(0,-50%)" }}
                  >
                    <div className="rounded-xl px-3 py-2 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 min-w-[108px]"
                      style={{ background:"var(--surface-2)", border:`1px solid ${node.accent}30` }}
                      onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor=`${node.accent}60`; (e.currentTarget as HTMLElement).style.boxShadow=`0 0 12px ${node.accent}20`; }}
                      onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor=`${node.accent}30`; (e.currentTarget as HTMLElement).style.boxShadow=""; }}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base">{node.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color:node.accent }}>{node.sub}</span>
                      </div>
                      <div className="text-xs font-bold" style={{ color:"#c9d1d9" }}>{node.label}</div>
                    </div>
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2" style={{ background:node.accent, borderColor:"var(--surface)" }} />
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2" style={{ background:"var(--surface-2)", borderColor:"var(--border)" }} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-3 px-5 py-3" style={{ borderTop:"1px solid var(--border)", background:"var(--surface-2)" }}>
            {["Trigger","Action","Logic","Integration","Notify"].map(t => (
              <span key={t} className="px-3 py-1 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                style={{ color:"#484f58", background:"rgba(72,79,88,.2)" }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.color="#818cf8"; (e.currentTarget as HTMLElement).style.background="rgba(99,102,241,.12)"; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.color="#484f58"; (e.currentTarget as HTMLElement).style.background="rgba(72,79,88,.2)"; }}
              >
                + {t}
              </span>
            ))}
            <span className="ml-auto text-[10px]" style={{ color:"#484f58" }}>7 nodes · 7 connections · Last run 2 min ago</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
