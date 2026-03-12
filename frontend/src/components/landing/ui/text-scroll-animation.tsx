"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

import React, { useRef } from "react";
import { cn } from "../../../lib/utils";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;

};

// ──────────────────────────────────────────────
// Variant 1 – text characters fan in from sides
// ──────────────────────────────────────────────
const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);

  return (
    <motion.span
      className={cn("inline-block text-orange-500", isSpace && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

// ──────────────────────────────────────────────
// Variant 2 – icons fan in from below
// ──────────────────────────────────────────────
const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 50, 0]);

  return (
    <motion.img
      src={char}
      alt=""
      className="h-16 w-16 shrink-0 object-contain will-change-transform"
      style={{ x, scale, y, transformOrigin: "center" }}
    />
  );
};

// ──────────────────────────────────────────────
// Variant 3 – icons fan in with rotation
// ──────────────────────────────────────────────
const CharacterV3 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 90, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [-Math.abs(distanceFromCenter) * 20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  return (
    <motion.img
      src={char}
      alt=""
      className="h-16 w-16 shrink-0 object-contain will-change-transform"
      style={{ x, rotate, y, scale, transformOrigin: "center" }}
    />
  );
};

// ──────────────────────────────────────────────
// Bracket SVG
// ──────────────────────────────────────────────
const Bracket = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className}>
    <path
      fill="currentColor"
      d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
    />
  </svg>
);

// ──────────────────────────────────────────────
// Main section component – drop-in for landing page
// Note: ReactLenis is intentionally NOT used here.
// framer-motion's useScroll(target) tracks scroll
// relative to each sticky block independently —
// no wrapper needed and no conflict with Next.js layout.
// ──────────────────────────────────────────────
const Skiper31 = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const targetRef2 = useRef<HTMLDivElement | null>(null);
  const targetRef3 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: targetRef2,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: scrollYProgress3 } = useScroll({
    target: targetRef3,
    offset: ["start end", "end start"],
  });

  const text = "see more from ";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  const techIcons = [
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/discord.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/figma.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/framer.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/mongodb.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/notion.svg",
  ];
  const iconCenterIndex = Math.floor(techIcons.length / 2);

  return (
    <section id="scroll-animation" className="w-full bg-[#f5f4f3] overflow-hidden">
      {/* Block 1 – animated text characters */}
      <div
        ref={targetRef}
        className="relative flex h-[200vh] items-center justify-center overflow-hidden bg-[#f5f4f3]"
      >
        {/* Sticky inner so animation plays while user scrolls through the 200vh block */}
        <div className="sticky top-0 flex h-screen w-full items-center justify-center">
          <div
            className="w-full max-w-4xl px-6 text-center text-6xl font-extrabold uppercase tracking-tighter text-black"
            style={{ perspective: "500px" }}
          >
            {characters.map((char, index) => (
              <CharacterV1
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Block 2 – icons fan in from below */}
      <div
        ref={targetRef2}
        className="relative flex h-[200vh] items-center justify-center overflow-hidden bg-[#f5f4f3]"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-10">
          <p className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <Bracket className="h-10 text-black" />
            <span className="font-medium">integrate with your fav tech stack</span>
            <Bracket className="h-10 scale-x-[-1] text-black" />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {techIcons.map((src, index) => (
              <CharacterV2
                key={index}
                char={src}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress2}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Block 3 – icons with rotation */}
      <div
        ref={targetRef3}
        className="relative flex h-[200vh] items-center justify-center overflow-hidden bg-[#f5f4f3]"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-10">
          <p className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <Bracket className="h-10 text-black" />
            <span className="font-medium">powered by your full stack</span>
            <Bracket className="h-10 scale-x-[-1] text-black" />
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-8"
            style={{ perspective: "500px" }}
          >
            {techIcons.map((src, index) => (
              <CharacterV3
                key={index}
                char={src}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress3}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { CharacterV1, CharacterV2, CharacterV3, Skiper31 };
