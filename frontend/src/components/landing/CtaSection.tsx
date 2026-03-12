"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HoverActionButton } from "@/components/ui/hover-button-1";

const CRM_URL = "http://localhost:5173";

export default function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-amber-600 to-green-700" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl opacity-5" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-300 rounded-full blur-3xl opacity-10" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              Ready to Close More{" "}
              <span className="text-green-200">Deals?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-lg text-green-200 mb-10 max-w-xl mx-auto"
            >
              Get your team up and running in minutes. No credit card required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <HoverActionButton
                label="Start Free Trial"
                href={`${CRM_URL}/register`}
                className="w-full sm:w-48"
              />
              <a
                href={`${CRM_URL}/login`}
                id="cta-signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-200 w-full sm:w-48"
              >
                Sign In →
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
