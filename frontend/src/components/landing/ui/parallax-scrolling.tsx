'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up GSAP, ScrollTrigger and Lenis instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-green-950 to-amber-950" ref={parallaxRef}>
      <section className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div data-parallax-layers className="relative w-full h-full flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80" 
              loading="eager" 
              width="800" 
              data-parallax-layer="1" 
              alt="" 
              className="absolute w-full h-full object-cover opacity-30" 
            />
            <img 
              src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80" 
              loading="eager" 
              width="800" 
              data-parallax-layer="2" 
              alt="" 
              className="absolute w-full h-full object-cover opacity-40" 
            />
            <div data-parallax-layer="3" className="relative z-10">
              <h2 className="text-6xl md:text-8xl font-extrabold text-gradient">FlowSync</h2>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80" 
              loading="eager" 
              width="800" 
              data-parallax-layer="4" 
              alt="" 
              className="absolute w-full h-full object-cover opacity-20" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
