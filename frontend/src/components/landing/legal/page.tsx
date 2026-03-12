"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, FileText, Lock } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#080a0f] text-[#f0f6fc]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#86efac] transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </a>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Legal Center</h1>
          <p className="text-lg text-[#8b949e] mb-12">
            Our commitment to your privacy and the terms governing our relationship.
          </p>

          <div className="space-y-16">
            {/* Privacy Policy Section */}
            <section id="privacy" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6 text-[#86efac]">
                <Shield size={24} />
                <h2 className="text-2xl font-bold">Privacy Policy</h2>
              </div>
              <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-[#8b949e] space-y-4">
                <p>
                  At FlowCRM, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our services.
                </p>
                <h3 className="text-[#f0f6fc] font-semibold mt-6">1. Data Collection</h3>
                <p>
                  We collect information necessary to provide our CRM services, including company names, email addresses of team members, and CRM data you choose to upload or input into the system.
                </p>
                <h3 className="text-[#f0f6fc] font-semibold mt-6">2. Data Usage</h3>
                <p>
                  Your data is used strictly for providing the service, improving user experience, and communicating essential system updates. We do not sell your personal or business data to third parties.
                </p>
                <h3 className="text-[#f0f6fc] font-semibold mt-6">3. Security</h3>
                <p>
                  We implement industry-standard security measures, including SOC2 compliant practices and advanced encryption, to ensure your data remains isolated and protected within our multi-tenant architecture.
                </p>
              </div>
            </section>

            <div className="h-px bg-[#21262d]" />

            {/* Terms of Service Section */}
            <section id="terms" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6 text-[#fbbf24]">
                <FileText size={24} />
                <h2 className="text-2xl font-bold">Terms of Service</h2>
              </div>
              <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-[#8b949e] space-y-4">
                <p>
                  By using FlowCRM, you agree to the following terms and conditions. Please read them carefully.
                </p>
                <h3 className="text-[#f0f6fc] font-semibold mt-6">1. Account Responsibility</h3>
                <p>
                  You are responsible for maintaining the security of your account and passwords. FlowCRM cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                </p>
                <h3 className="text-[#f0f6fc] font-semibold mt-6">2. Acceptable Use</h3>
                <p>
                  You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.
                </p>
                <h3 className="text-[#f0f6fc] font-semibold mt-6">3. Service Availability</h3>
                <p>
                  We strive for 99.9% uptime. However, we reserve the right to modify or terminate the Service for any reason, without notice at any time, especially in cases of breach of these terms.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
