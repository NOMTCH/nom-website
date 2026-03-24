"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
      requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      cursor.style.transform += " scale(3)";
      follower.style.opacity = "0";
    };
    const onLeaveLink = () => {
      follower.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    animate();

    const links = document.querySelectorAll("a, button, [data-cursor]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-[99999] transition-transform duration-75"
        style={{ willChange: "transform" }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-accent pointer-events-none z-[99998] opacity-60"
        style={{ willChange: "transform", transition: "opacity 0.3s ease" }}
      />
    </>
  );
}
