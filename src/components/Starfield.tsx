"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Starfield background rendered with Three.js.
 * Fixed, full-screen canvas that stays behind UI (pointer-events: none).
 */
export default function Starfield() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Transparent clear so any CSS background can show through if needed
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    // Stars
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const radius = 100; // spread radius
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * radius;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      // Subtle movement for a calm, mystical feel
      stars.rotation.y += 0.0005;
      stars.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden
    />
  );
}

