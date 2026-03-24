"use client";

// GSAP animation helpers for NOM Studio
// These functions wrap common GSAP patterns for reuse across components

export const initScrollAnimations = () => {
  if (typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("anim-visible");
          entry.target.classList.remove("anim-hidden");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
  );

  const elements = document.querySelectorAll(".scroll-anim");
  elements.forEach((el) => {
    el.classList.add("anim-hidden");
    observer.observe(el);
  });

  return () => observer.disconnect();
};

export const staggerDelay = (index: number, base: number = 0.1): string => {
  return `${index * base}s`;
};

export const gsapTextReveal = async (selector: string) => {
  if (typeof window === "undefined") return;
  const { gsap } = await import("gsap");

  gsap.fromTo(
    selector,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: 0.1,
    }
  );
};

export const gsapFadeIn = async (selector: string, delay: number = 0) => {
  if (typeof window === "undefined") return;
  const { gsap } = await import("gsap");

  gsap.fromTo(
    selector,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
    }
  );
};

export const gsapScrollTrigger = async (
  trigger: string,
  animation: Record<string, unknown>
) => {
  if (typeof window === "undefined") return;
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");

  gsap.registerPlugin(ScrollTrigger);

  return gsap.fromTo(trigger, { opacity: 0, y: 60 }, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start: "top 80%",
      end: "bottom 20%",
      ...animation,
    },
  });
};

export const gsapCountUp = async (selector: string, end: number) => {
  if (typeof window === "undefined") return;
  const { gsap } = await import("gsap");

  const obj = { val: 0 };
  gsap.to(obj, {
    val: end,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      const el = document.querySelector(selector);
      if (el) el.textContent = Math.round(obj.val).toString();
    },
  });
};
