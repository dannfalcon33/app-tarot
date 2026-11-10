"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Fondo cósmico de partículas renderizado con Three.js (Optimizado en Fase 6).
 * - Adapta la densidad de partículas en móviles o equipos de bajo consumo.
 * - Respeta `prefers-reduced-motion: reduce` (renderiza un fotograma estático sin bucle continuo).
 * - Pausa el bucle WebGL automáticamente cuando la pestaña pasa a segundo plano (`document.hidden`).
 */
export default function Starfield() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isLowPowerDevice =
      window.innerWidth < 768 ||
      (typeof navigator !== "undefined" &&
        navigator.hardwareConcurrency !== undefined &&
        navigator.hardwareConcurrency <= 4);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isLowPowerDevice,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      // Si el navegador no dispone de contexto WebGL, el degradado CSS de fondo mantiene la estética
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isLowPowerDevice ? 1.5 : 2),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 1;

    const starCount = isLowPowerDevice ? 850 : 1800;
    const positions = new Float32Array(starCount * 3);
    const radius = 100;
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * radius;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isLowPowerDevice ? 0.8 : 0.7,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.88,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    let raf = 0;
    let isRunning = false;

    const renderSingleFrame = () => {
      renderer.render(scene, camera);
    };

    const animate = () => {
      if (!isRunning) return;
      raf = requestAnimationFrame(animate);
      stars.rotation.y += 0.00045;
      stars.rotation.x += 0.00018;
      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (prefersReducedMotion || document.hidden || isRunning) return;
      isRunning = true;
      animate();
    };

    const stopLoop = () => {
      isRunning = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    renderSingleFrame();
    if (!prefersReducedMotion) {
      startLoop();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion || !isRunning) {
        renderSingleFrame();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      stopLoop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
      aria-hidden="true"
    />
  );
}
