"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import type { CardVisualState } from "@/types/tarot";

export interface UseCardAnimationOptions {
  isRevealed?: boolean;
  visualStateOverride?: CardVisualState;
  flipDurationMs?: number;
  maxTilt?: number;
  enableTilt?: boolean;
  onRevealComplete?: () => void;
}

export interface CardTiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
  isPointerOver: boolean;
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function useCardAnimation({
  isRevealed = true,
  visualStateOverride,
  flipDurationMs = 620,
  maxTilt = 14,
  enableTilt = true,
  onRevealComplete,
}: UseCardAnimationOptions = {}) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [showRevealFlash, setShowRevealFlash] = useState<boolean>(false);
  const prevRevealedRef = useRef<boolean>(isRevealed);
  const onRevealCompleteRef = useRef(onRevealComplete);

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete;
  }, [onRevealComplete]);

  const [tilt, setTilt] = useState<CardTiltState>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isPointerOver: false,
  });

  useEffect(() => {
    const wasRevealed = prevRevealedRef.current;
    prevRevealedRef.current = isRevealed;

    if (!wasRevealed && isRevealed) {
      if (prefersReducedMotion) {
        onRevealCompleteRef.current?.();
        return;
      }

      const startTimer = setTimeout(() => {
        setIsFlipping(true);
        setShowRevealFlash(true);
      }, 0);

      const flipTimer = setTimeout(() => {
        setIsFlipping(false);
        onRevealCompleteRef.current?.();
      }, flipDurationMs);

      const flashTimer = setTimeout(() => {
        setShowRevealFlash(false);
      }, flipDurationMs + 350);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(flipTimer);
        clearTimeout(flashTimer);
      };
    }
  }, [isRevealed, flipDurationMs, prefersReducedMotion]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enableTilt || prefersReducedMotion) return;

      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;

      const clampedX = Math.max(0, Math.min(1, relX));
      const clampedY = Math.max(0, Math.min(1, relY));

      const rotateY = (clampedX - 0.5) * 2 * maxTilt;
      const rotateX = (0.5 - clampedY) * 2 * maxTilt;

      setTilt({
        rotateX: Number(rotateX.toFixed(2)),
        rotateY: Number(rotateY.toFixed(2)),
        glareX: Math.round(clampedX * 100),
        glareY: Math.round(clampedY * 100),
        isPointerOver: true,
      });
    },
    [enableTilt, maxTilt, prefersReducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isPointerOver: false,
    });
  }, []);

  const derivedVisualState: CardVisualState = isRevealed
    ? isFlipping
      ? "flipping"
      : "face_up"
    : "face_down";

  const visualState: CardVisualState =
    visualStateOverride ?? derivedVisualState;

  return {
    visualState,
    showRevealFlash,
    prefersReducedMotion,
    tilt,
    handlePointerMove,
    handlePointerLeave,
  };
}
