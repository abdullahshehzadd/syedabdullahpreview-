import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Sparkles, Flame, Move } from 'lucide-react';

import animatedWebpFeathered from '../assets/images/pizza_cheese_pull_feathered.webp';
import animatedWebpUltra from '../assets/images/pizza_cheese_pull_ultra.webp';
import seqFrame1 from '../assets/images/feathered/pizza_seq_01_1788086514135.png';
import seqFrame2 from '../assets/images/feathered/pizza_seq_02_1788086529705.png';
import seqFrame3 from '../assets/images/feathered/pizza_seq_03_1788086548938.png';
import seqFrame4 from '../assets/images/feathered/pizza_seq_04_1788086563500.png';
import seqFrame5 from '../assets/images/feathered/pizza_seq_05_1788086577157.png';
import seqFrame6 from '../assets/images/feathered/pizza_seq_06_1788086592358.png';
import artisanBase from '../assets/images/artisan_pizza_base_1788027693738.jpg';

gsap.registerPlugin(ScrollTrigger);

const FRAME_SOURCES = [
  seqFrame1,
  seqFrame2,
  seqFrame3,
  seqFrame4,
  seqFrame5,
  seqFrame6,
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  maxLife: number;
  life: number;
  type: 'steam' | 'herb' | 'ember';
  color?: string;
  rotation?: number;
  vRot?: number;
}

interface HeroSectionProps {
  onScrollToMenu?: () => void;
  onOpenHoursModal?: () => void;
  onSelectFeaturedItem?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToMenu
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centeredOverlayRef = useRef<HTMLDivElement>(null);
  const indicatorBtnRef = useRef<HTMLButtonElement>(null);

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isPullingDirectly, setIsPullingDirectly] = useState(false);

  // References for render loop & frame interpolation
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const baseBackupRef = useRef<HTMLImageElement | null>(null);
  const webpRef = useRef<HTMLImageElement | null>(null);

  // Smooth interpolated scroll state & 3D tilt
  const scrollTargetRef = useRef(0);
  const manualPullRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const settleProgressRef = useRef(0); // 0 -> 1 entrance settle
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);

  // Mouse & Touch 3D Tilt Coordinates
  const mouseTiltRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const touchStartYRef = useRef<number | null>(null);

  // 1. Asset Preloading
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    // Preload backup base image & animated webp
    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.src = artisanBase;
    baseImg.onload = () => {
      baseBackupRef.current = baseImg;
    };

    const webpImg = new Image();
    webpImg.crossOrigin = 'anonymous';
    webpImg.src = animatedWebpFeathered || animatedWebpUltra;
    webpImg.onload = () => {
      webpRef.current = webpImg;
    };

    FRAME_SOURCES.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        loadedCount++;
        setLoadPercent(Math.round((loadedCount / FRAME_SOURCES.length) * 100));
        if (loadedCount === FRAME_SOURCES.length) {
          imagesRef.current = loadedImages;
          setAssetsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_SOURCES.length) {
          setAssetsLoaded(true);
        }
      };
      loadedImages[idx] = img;
    });
  }, []);

  // 2. Initial Appear & Settle Animation (GSAP)
  useEffect(() => {
    if (!assetsLoaded) return;

    // Animate settleProgressRef from 0 to 1 with smooth power3 settle
    const settleObj = { val: 0 };
    gsap.to(settleObj, {
      val: 1,
      duration: 1.4,
      ease: 'power3.out',
      onUpdate: () => {
        settleProgressRef.current = settleObj.val;
      }
    });

    // Animate centered text overlay entrance
    if (centeredOverlayRef.current) {
      gsap.fromTo(
        centeredOverlayRef.current,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [assetsLoaded]);

  // 3. High-Performance Canvas Video-Like Frame Renderer with 3D Tilt & FX
  const renderFrame = useCallback((scrollProgress: number, timeMs: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const frames = imagesRef.current;
    if (!frames || frames.length === 0) {
      if (baseBackupRef.current && baseBackupRef.current.complete) {
        const dpr = Math.min(window.devicePixelRatio || 2, 3);
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
          canvas.width = displayWidth * dpr;
          canvas.height = displayHeight * dpr;
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        const isMobile = displayWidth < 640;
        const maxDim = isMobile
          ? Math.min(displayWidth * 0.90, displayHeight * 0.54, 420)
          : Math.min(displayWidth * 0.88, displayHeight * 0.72, 620);
        ctx.drawImage(baseBackupRef.current, (displayWidth - maxDim) / 2, (displayHeight - maxDim) / 2, maxDim, maxDim);
        ctx.restore();
      }
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Composition Math: Centered nicely on mobile & desktop viewports
    const isMobile = displayWidth < 640;
    const settle = settleProgressRef.current; // 0 -> 1 entrance settle
    const settleScale = 0.88 + 0.12 * settle;
    
    // Scale appropriately per viewport
    const maxPizzaDim = (isMobile
      ? Math.min(displayWidth * 0.92, displayHeight * 0.52, 420)
      : Math.min(displayWidth * 0.88, displayHeight * 0.72, 620)) * settleScale;
    
    // Exact Geometric Center with optical balance
    const centerX = displayWidth / 2;
    const verticalOffset = isMobile ? (displayHeight * 0.02) : 0;
    const centerY = (displayHeight / 2) + verticalOffset + (1 - settle) * 30;
    
    // Smooth 3D tilt lerp
    const tilt = mouseTiltRef.current;
    tilt.x += (tilt.targetX - tilt.x) * 0.1;
    tilt.y += (tilt.targetY - tilt.y) * 0.1;

    // Apply 3D perspective shift on center
    const tiltedCenterX = centerX + tilt.x * 16;
    const tiltedCenterY = centerY + tilt.y * 12;
    const destX = tiltedCenterX - maxPizzaDim / 2;
    const destY = tiltedCenterY - maxPizzaDim / 2;

    // A. Sage Green Atmospheric Hearth Ambient Underglow
    const sageHearthGlow = ctx.createRadialGradient(
      tiltedCenterX,
      tiltedCenterY + 10,
      maxPizzaDim * 0.10,
      tiltedCenterX,
      tiltedCenterY + 10,
      maxPizzaDim * 0.75
    );
    sageHearthGlow.addColorStop(0, `rgba(139, 197, 61, ${0.35 * settle})`);
    sageHearthGlow.addColorStop(0.35, `rgba(78, 135, 82, ${0.24 * settle})`);
    sageHearthGlow.addColorStop(0.70, `rgba(1, 47, 19, ${0.16 * settle})`);
    sageHearthGlow.addColorStop(1, 'rgba(1, 18, 7, 0)');

    ctx.fillStyle = sageHearthGlow;
    ctx.beginPath();
    ctx.arc(tiltedCenterX, tiltedCenterY + 10, maxPizzaDim * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // B. Sub-frame Video Interpolation Calculation across frames
    const effectiveProgress = Math.max(0, Math.min(1, scrollProgress + manualPullRef.current));
    const totalFrames = frames.length;
    const floatIndex = effectiveProgress * (totalFrames - 1);
    const baseIndex = Math.floor(floatIndex);
    const nextIndex = Math.min(totalFrames - 1, baseIndex + 1);
    const blendAlpha = floatIndex - baseIndex;

    const primaryFrame = frames[baseIndex];
    const secondaryFrame = frames[nextIndex];

    // C. Render Primary Base Frame with Soft Depth Shadow & 3D Tilt Transform
    ctx.save();
    ctx.translate(tiltedCenterX, tiltedCenterY);
    ctx.rotate((tilt.x * 0.04));
    ctx.translate(-tiltedCenterX, -tiltedCenterY);

    if (primaryFrame && primaryFrame.complete) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, settle * 1.2);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      ctx.drawImage(primaryFrame, destX, destY, maxPizzaDim, maxPizzaDim);
      ctx.restore();
    }

    // D. Smooth Cross-Dissolve Sub-frame for Liquid Video-Like Playback
    if (blendAlpha > 0.005 && secondaryFrame && secondaryFrame.complete && baseIndex !== nextIndex) {
      ctx.save();
      ctx.globalAlpha = blendAlpha * Math.min(1, settle * 1.2);
      ctx.drawImage(secondaryFrame, destX, destY, maxPizzaDim, maxPizzaDim);
      ctx.restore();
    }

    // Specular Sheen on tilt
    if (Math.abs(tilt.x) > 0.05 || Math.abs(tilt.y) > 0.05) {
      const sheenGrad = ctx.createLinearGradient(
        destX + tilt.x * 50,
        destY,
        destX + maxPizzaDim,
        destY + maxPizzaDim
      );
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.06 * Math.abs(tilt.x + tilt.y)})`);
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.arc(tiltedCenterX, tiltedCenterY, maxPizzaDim * 0.46, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // restore tilt rotation

    // E. Dynamic FX: Culinary Herbs (Oregano/Chili) & Volumetric Steam
    const pList = particlesRef.current;
    
    // Spawn Steam
    if (Math.random() < 0.24 && settle > 0.6) {
      pList.push({
        x: tiltedCenterX + (Math.random() - 0.5) * (maxPizzaDim * 0.38),
        y: tiltedCenterY - maxPizzaDim * 0.06 - effectiveProgress * 20,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.75 - Math.random() * 0.65,
        alpha: 0.28,
        size: 14 + Math.random() * 18,
        maxLife: 65 + Math.random() * 35,
        life: 0,
        type: 'steam'
      });
    }

    // Spawn Culinary Herb Flake / Pepper Sparkle
    if (Math.random() < 0.08 && settle > 0.8) {
      const isRed = Math.random() > 0.5;
      pList.push({
        x: tiltedCenterX + (Math.random() - 0.5) * (maxPizzaDim * 0.55),
        y: tiltedCenterY + (Math.random() - 0.5) * (maxPizzaDim * 0.3),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.35 - Math.random() * 0.4,
        alpha: 0.85,
        size: 2 + Math.random() * 2.5,
        maxLife: 80 + Math.random() * 40,
        life: 0,
        type: 'herb',
        color: isRed ? '#EF4444' : '#8BC53D',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.08
      });
    }

    // Update & Render Particles
    for (let i = pList.length - 1; i >= 0; i--) {
      const p = pList[i];
      p.life++;
      p.x += p.vx + Math.sin(timeMs * 0.003 + i) * 0.22;
      p.y += p.vy;
      const lifeRatio = p.life / p.maxLife;

      if (lifeRatio >= 1) {
        pList.splice(i, 1);
        continue;
      }

      if (p.type === 'steam') {
        p.size += 0.22;
        const currentAlpha = p.alpha * (1 - lifeRatio) * settle;
        ctx.save();
        const steamGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        steamGrad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.45})`);
        steamGrad.addColorStop(0.5, `rgba(139, 197, 61, ${currentAlpha * 0.15})`);
        steamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'herb') {
        if (p.rotation !== undefined && p.vRot !== undefined) {
          p.rotation += p.vRot;
        }
        const currentAlpha = p.alpha * (1 - lifeRatio * 0.8);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = p.color || '#8BC53D';
        ctx.globalAlpha = currentAlpha;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      }
    }

    // F. Subtle Outer Crust Ambient Ring
    ctx.save();
    ctx.strokeStyle = `rgba(139, 197, 61, ${0.18 * settle})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(tiltedCenterX, tiltedCenterY, maxPizzaDim * 0.48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }, []);

  // 4. Optimized 60–120FPS Render Loop with Visibility Caching
  useEffect(() => {
    if (!assetsLoaded) return;

    let isRunning = true;

    // IntersectionObserver to sleep RAF when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const tick = (now: number) => {
      if (!isRunning) return;

      if (isVisibleRef.current) {
        // Spring lerp smoothing for liquid frame updates
        const target = scrollTargetRef.current;
        const current = smoothProgressRef.current;
        const diff = target - current;
        smoothProgressRef.current = current + diff * 0.15;

        // Manual stretch spring return when released
        if (!isPullingDirectly && manualPullRef.current > 0.001) {
          manualPullRef.current *= 0.90;
        }

        renderFrame(smoothProgressRef.current, now);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      observer.disconnect();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [assetsLoaded, renderFrame, isPullingDirectly]);

  // 5. Scroll-driven cheese pull progress via scroll listener & safe ScrollTrigger
  useEffect(() => {
    if (!assetsLoaded || !containerRef.current) return;

    const el = containerRef.current;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || 1;
      // Calculate how far through the hero section the user has scrolled
      const progress = Math.max(0, Math.min(1, -rect.top / (windowHeight * 0.75)));
      scrollTargetRef.current = progress;

      // 30% Scroll Fade: once user scrolls past 30%, smoothly fade out centered overlay
      if (centeredOverlayRef.current) {
        if (progress >= 0.3) {
          const fadeRatio = Math.min(1, (progress - 0.3) / 0.18);
          const opacity = 1 - fadeRatio;
          centeredOverlayRef.current.style.opacity = `${opacity}`;
          centeredOverlayRef.current.style.transform = `translateY(${-35 * fadeRatio}px) scale(${1 - 0.05 * fadeRatio})`;
          centeredOverlayRef.current.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
        } else {
          const enterRatio = progress / 0.3;
          const opacity = 1 - enterRatio * 0.15;
          centeredOverlayRef.current.style.opacity = `${opacity}`;
          centeredOverlayRef.current.style.transform = 'translateY(0) scale(1)';
          centeredOverlayRef.current.style.pointerEvents = 'auto';
        }
      }
    };

    const handleResize = () => {
      renderFrame(smoothProgressRef.current, performance.now());
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [assetsLoaded, renderFrame]);

  // 6. Interactive Mouse & Touch 3D Tilt Listeners
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseTiltRef.current.targetX = nx * 2;
    mouseTiltRef.current.targetY = ny * 2;
  };

  const handleMouseLeave = () => {
    mouseTiltRef.current.targetX = 0;
    mouseTiltRef.current.targetY = 0;
    setIsPullingDirectly(false);
  };

  // Direct Touch Drag / Pull Interaction on Pizza
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      touchStartYRef.current = e.touches[0].clientY;
      setIsPullingDirectly(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current !== null && e.touches.length > 0) {
      const deltaY = e.touches[0].clientY - touchStartYRef.current;
      if (deltaY > 0) {
        manualPullRef.current = Math.min(1, deltaY / 180);
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
    setIsPullingDirectly(false);
  };

  const handleScrollToNext = () => {
    if (containerRef.current) {
      const heroBottom = containerRef.current.offsetTop + containerRef.current.offsetHeight * 1.4;
      window.scrollTo({
        top: heroBottom,
        behavior: 'smooth'
      });
    } else if (onScrollToMenu) {
      onScrollToMenu();
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-screen bg-[#011207] text-[#E2F0CC] overflow-hidden select-none touch-pan-y"
    >
      {/* Sage Green Screen Backdrop & Ambient Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft Sage Green Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[340px] sm:h-[620px] bg-[#8BC53D]/18 rounded-full blur-[90px] sm:blur-[140px]" />
        {/* Secondary Emerald Hearth Radiance */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[460px] h-[260px] sm:h-[460px] bg-[#4E8752]/20 rounded-full blur-[80px] sm:blur-[110px]" />
        {/* Subtle Vignette for High Text Contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(1,18,7,0.85)_85%)]" />
      </div>

      {/* High-Definition Retina Canvas: Animated WebP Pizza & Scroll-Driven Frame Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
      />

      {/* Direct Animated WebP Fallback & Preloader for Instant Rendering */}
      <div className="sr-only" aria-hidden="true">
        <img
          src={animatedWebpFeathered}
          alt="Animated woodfired pizza cheese pull"
          loading="eager"
        />
      </div>

      {/* Overlay Text (Centered): Heading: "demo restaurant", Subheading: "scroll to see more." with Smooth Green-Screen Contrast */}
      <div
        ref={centeredOverlayRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-between pt-24 sm:pt-28 pb-10 px-4 pointer-events-auto transition-transform will-change-transform"
      >
        {/* Top Tag & Active Stretch Indicator */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#011207]/80 backdrop-blur-md border border-[#8BC53D]/40 text-[#8BC53D] text-xs font-black uppercase tracking-widest shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Artisan Woodfired Experience</span>
          </div>

          {manualPullRef.current > 0.05 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/50 text-amber-400 text-xs font-mono font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{Math.round(manualPullRef.current * 100)}% Stretch</span>
            </div>
          )}
        </div>

        {/* Centered Heading & Subheading with High Contrast Dark Backdrops & Glows */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center my-auto px-2">
          {/* Requested Heading: "demo restaurant" */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white lowercase italic tracking-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] leading-none select-text">
            demo <span className="text-[#8BC53D] drop-shadow-[0_0_40px_rgba(139,197,61,0.65)]">restaurant</span>
          </h1>

          {/* Requested Subheading: "scroll to see more." */}
          <div className="mt-4 px-4 py-1.5 rounded-full bg-[#011207]/60 backdrop-blur-sm border border-[#8BC53D]/20 shadow-lg flex items-center gap-2">
            <p className="text-sm sm:text-lg md:text-xl text-[#E2F0CC] font-medium tracking-wide lowercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              scroll to see more.
            </p>
          </div>
        </div>

        {/* Bottom Interactive Scroll Indicator Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            ref={indicatorBtnRef}
            onClick={handleScrollToNext}
            className="group px-6 py-3.5 rounded-full bg-[#012F13]/90 hover:bg-[#8BC53D] text-white hover:text-[#011207] border border-[#8BC53D]/50 hover:border-[#8BC53D] text-xs sm:text-sm font-black lowercase tracking-wider transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center gap-2.5 cursor-pointer active:scale-95 backdrop-blur-md"
            title="scroll to see more."
          >
            <span>scroll to see more.</span>
            <ChevronDown className="w-4 h-4 text-[#8BC53D] group-hover:text-[#011207] transition-transform duration-300 group-hover:translate-y-1" />
          </button>
          
          <div className="flex items-center gap-2 text-[10px] lowercase font-mono tracking-widest text-[#8BC53D]/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            <Move className="w-3 h-3 animate-pulse" />
            <span>scroll or drag pizza to pull cheese</span>
          </div>
        </div>
      </div>

      {/* Frame Loading Spinner */}
      {!assetsLoaded && (
        <div className="absolute inset-0 z-30 bg-[#011207] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-[#8BC53D]/20 border-t-[#8BC53D] rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#8BC53D]">Loading HD Pizza Engine ({loadPercent}%)</span>
        </div>
      )}
    </section>
  );
};


