import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Sparkles, Flame, Move, Utensils, ArrowRight, Clock, Star } from 'lucide-react';

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
  onScrollToMenu,
  onOpenHoursModal,
  onSelectFeaturedItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pizzaContainerRef = useRef<HTMLDivElement>(null);
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

    const settleObj = { val: 0 };
    gsap.to(settleObj, {
      val: 1,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        settleProgressRef.current = settleObj.val;
      }
    });

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.hero-fade-in'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }
      );
    }
  }, [assetsLoaded]);

  // 3. Canvas Frame Renderer with 3D Tilt & FX
  const renderFrame = useCallback((scrollProgress: number, timeMs: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const frames = imagesRef.current;
    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (displayWidth === 0 || displayHeight === 0) return;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    if (!frames || frames.length === 0) {
      if (baseBackupRef.current && baseBackupRef.current.complete) {
        const maxDim = Math.min(displayWidth * 0.94, displayHeight * 0.94);
        ctx.drawImage(baseBackupRef.current, (displayWidth - maxDim) / 2, (displayHeight - maxDim) / 2, maxDim, maxDim);
      }
      ctx.restore();
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const settle = settleProgressRef.current;
    const maxPizzaDim = Math.min(displayWidth * 0.96, displayHeight * 0.96);
    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;

    // Smooth 3D tilt lerp
    const tilt = mouseTiltRef.current;
    tilt.x += (tilt.targetX - tilt.x) * 0.1;
    tilt.y += (tilt.targetY - tilt.y) * 0.1;

    const tiltedCenterX = centerX + tilt.x * 12;
    const tiltedCenterY = centerY + tilt.y * 10;
    const destX = tiltedCenterX - maxPizzaDim / 2;
    const destY = tiltedCenterY - maxPizzaDim / 2;

    // Sage Hearth Glow behind canvas
    const sageHearthGlow = ctx.createRadialGradient(
      tiltedCenterX,
      tiltedCenterY,
      maxPizzaDim * 0.10,
      tiltedCenterX,
      tiltedCenterY,
      maxPizzaDim * 0.65
    );
    sageHearthGlow.addColorStop(0, `rgba(139, 197, 61, ${0.30 * settle})`);
    sageHearthGlow.addColorStop(0.4, `rgba(78, 135, 82, ${0.18 * settle})`);
    sageHearthGlow.addColorStop(0.75, `rgba(1, 47, 19, ${0.12 * settle})`);
    sageHearthGlow.addColorStop(1, 'rgba(1, 18, 7, 0)');

    ctx.fillStyle = sageHearthGlow;
    ctx.beginPath();
    ctx.arc(tiltedCenterX, tiltedCenterY, maxPizzaDim * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Frame Interpolation
    const effectiveProgress = Math.max(0, Math.min(1, scrollProgress + manualPullRef.current));
    const totalFrames = frames.length;
    const floatIndex = effectiveProgress * (totalFrames - 1);
    const baseIndex = Math.floor(floatIndex);
    const nextIndex = Math.min(totalFrames - 1, baseIndex + 1);
    const blendAlpha = floatIndex - baseIndex;

    const primaryFrame = frames[baseIndex];
    const secondaryFrame = frames[nextIndex];

    ctx.save();
    ctx.translate(tiltedCenterX, tiltedCenterY);
    ctx.rotate(tilt.x * 0.035);
    ctx.translate(-tiltedCenterX, -tiltedCenterY);

    if (primaryFrame && primaryFrame.complete) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, settle * 1.2);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 16;
      ctx.drawImage(primaryFrame, destX, destY, maxPizzaDim, maxPizzaDim);
      ctx.restore();
    }

    if (blendAlpha > 0.005 && secondaryFrame && secondaryFrame.complete && baseIndex !== nextIndex) {
      ctx.save();
      ctx.globalAlpha = blendAlpha * Math.min(1, settle * 1.2);
      ctx.drawImage(secondaryFrame, destX, destY, maxPizzaDim, maxPizzaDim);
      ctx.restore();
    }

    // Specular Sheen on tilt
    if (Math.abs(tilt.x) > 0.05 || Math.abs(tilt.y) > 0.05) {
      const sheenGrad = ctx.createLinearGradient(
        destX + tilt.x * 40,
        destY,
        destX + maxPizzaDim,
        destY + maxPizzaDim
      );
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.05 * Math.abs(tilt.x + tilt.y)})`);
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.arc(tiltedCenterX, tiltedCenterY, maxPizzaDim * 0.46, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // restore tilt rotation

    // FX: Culinary Herbs & Volumetric Steam
    const pList = particlesRef.current;
    
    // Spawn Steam
    if (Math.random() < 0.22 && settle > 0.6) {
      pList.push({
        x: tiltedCenterX + (Math.random() - 0.5) * (maxPizzaDim * 0.35),
        y: tiltedCenterY - maxPizzaDim * 0.06 - effectiveProgress * 15,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.7 - Math.random() * 0.5,
        alpha: 0.25,
        size: 12 + Math.random() * 16,
        maxLife: 60 + Math.random() * 30,
        life: 0,
        type: 'steam'
      });
    }

    // Spawn Culinary Herb Flake / Pepper Sparkle
    if (Math.random() < 0.07 && settle > 0.8) {
      const isRed = Math.random() > 0.5;
      pList.push({
        x: tiltedCenterX + (Math.random() - 0.5) * (maxPizzaDim * 0.5),
        y: tiltedCenterY + (Math.random() - 0.5) * (maxPizzaDim * 0.3),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.3 - Math.random() * 0.35,
        alpha: 0.8,
        size: 2 + Math.random() * 2,
        maxLife: 75 + Math.random() * 35,
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
      p.x += p.vx + Math.sin(timeMs * 0.003 + i) * 0.2;
      p.y += p.vy;
      const lifeRatio = p.life / p.maxLife;

      if (lifeRatio >= 1) {
        pList.splice(i, 1);
        continue;
      }

      if (p.type === 'steam') {
        p.size += 0.2;
        const currentAlpha = p.alpha * (1 - lifeRatio) * settle;
        ctx.save();
        const steamGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        steamGrad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.4})`);
        steamGrad.addColorStop(0.5, `rgba(139, 197, 61, ${currentAlpha * 0.12})`);
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

    ctx.restore();
  }, []);

  // 4. Render Loop with Visibility Caching
  useEffect(() => {
    if (!assetsLoaded) return;

    let isRunning = true;

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
        const target = scrollTargetRef.current;
        const current = smoothProgressRef.current;
        const diff = target - current;
        smoothProgressRef.current = current + diff * 0.15;

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

  // 5. Scroll-driven cheese pull progress
  useEffect(() => {
    if (!assetsLoaded || !containerRef.current) return;

    const el = containerRef.current;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, -rect.top / (windowHeight * 0.65)));
      scrollTargetRef.current = progress;
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
    if (!pizzaContainerRef.current) return;
    const rect = pizzaContainerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseTiltRef.current.targetX = Math.max(-1, Math.min(1, nx * 2));
    mouseTiltRef.current.targetY = Math.max(-1, Math.min(1, ny * 2));
  };

  const handleMouseLeave = () => {
    mouseTiltRef.current.targetX = 0;
    mouseTiltRef.current.targetY = 0;
    setIsPullingDirectly(false);
  };

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
        manualPullRef.current = Math.min(1, deltaY / 160);
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
    setIsPullingDirectly(false);
  };

  const handleScrollToNext = () => {
    if (onScrollToMenu) {
      onScrollToMenu();
    } else if (containerRef.current) {
      const heroBottom = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({
        top: heroBottom,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative w-full min-h-[90vh] lg:min-h-[94vh] bg-[#011207] text-[#E2F0CC] overflow-hidden select-none flex flex-col justify-center items-center py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Sage Green Screen Backdrop & Ambient Glow Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[580px] md:w-[680px] h-[320px] sm:h-[580px] md:h-[680px] bg-[#8BC53D]/16 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[440px] h-[240px] sm:h-[440px] bg-[#4E8752]/20 rounded-full blur-[80px] sm:blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(1,18,7,0.85)_85%)]" />
      </div>

      {/* Main Content Layout Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* 1. Top Badges & Live Status */}
        <div className="hero-fade-in flex flex-wrap items-center justify-center gap-2.5 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#011207]/80 backdrop-blur-md border border-[#8BC53D]/40 text-[#8BC53D] text-xs font-black uppercase tracking-widest shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <Sparkles className="w-3.5 h-3.5 fill-current text-[#8BC53D]" />
            <span>Artisan Woodfired Experience</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#012F13]/80 border border-[#8BC53D]/25 text-[#E2F0CC] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#8BC53D] animate-ping" />
            <span>450°C Stone Oven Live</span>
          </div>

          {manualPullRef.current > 0.05 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/50 text-amber-400 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{Math.round(manualPullRef.current * 100)}% Cheese Pull</span>
            </div>
          )}
        </div>

        {/* 2. Main High-Contrast Headline */}
        <div className="hero-fade-in mb-3 sm:mb-5">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white lowercase italic tracking-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] leading-none select-text">
            smash & <span className="text-[#8BC53D] drop-shadow-[0_0_40px_rgba(139,197,61,0.65)]">woodfire</span>
          </h1>
        </div>

        {/* 3. Prominent Floating Pizza Container with Drop-Shadow & Fluid Scaling */}
        <div className="hero-fade-in relative my-2 sm:my-4 flex flex-col items-center">
          {/* Outer floating wrapper with 4s breathing animation and radial drop-shadow */}
          <div
            ref={pizzaContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-[280px] min-[400px]:w-[320px] sm:w-[380px] md:w-[460px] lg:w-[500px] aspect-square mx-auto cursor-grab active:cursor-grabbing touch-pan-y animate-float-pizza [filter:drop-shadow(0_20px_25px_rgba(0,0,0,0.5))]"
            title="Scroll or drag to stretch mozzarella cheese pull"
          >
            {/* Interactive Canvas Renderer */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
            />

            {/* High-Performance Animated WebP Image Component */}
            <img
              src={animatedWebpFeathered}
              alt="Artisan woodfired pizza with molten mozzarella cheese pull"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0"
              loading="eager"
            />

            {/* Subtle Outer Crust Accent Ring */}
            <div className="absolute inset-2 sm:inset-3 rounded-full border border-[#8BC53D]/20 pointer-events-none" />
          </div>

          {/* Radial ground contact shadow that pulses with floating animation */}
          <div className="w-44 min-[400px]:w-56 sm:w-72 md:w-84 h-5 sm:h-7 bg-black/65 rounded-full blur-md sm:blur-lg animate-float-shadow -mt-4 sm:-mt-6 pointer-events-none z-0" />
        </div>

        {/* 4. High-Contrast Subtext */}
        <div className="hero-fade-in max-w-xl sm:max-w-2xl mx-auto px-2 mt-2 sm:mt-4">
          <p className="text-base sm:text-lg md:text-xl text-[#E2F0CC] font-medium tracking-wide lowercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed">
            slow-fermented 48h sourdough crust, San Marzano reduction & molten buffalo mozzarella pulled to perfection.
          </p>
        </div>

        {/* 5. Call-To-Action (CTA) Action Buttons */}
        <div className="hero-fade-in flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          {/* Primary CTA: Explore Menu */}
          <button
            onClick={onScrollToMenu}
            className="group px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#8BC53D] hover:bg-[#9de045] text-[#011207] font-black text-sm sm:text-base tracking-wide flex items-center gap-2.5 transition-all duration-300 shadow-[0_10px_25px_rgba(139,197,61,0.4)] active:scale-95 cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#011207]" />
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA: Chef's Specials */}
          {onSelectFeaturedItem && (
            <button
              onClick={onSelectFeaturedItem}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#012F13]/90 hover:bg-[#012F13] text-white hover:text-[#8BC53D] border border-[#8BC53D]/40 hover:border-[#8BC53D] font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.5)] backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8BC53D]" />
              <span>Chef's Specials</span>
            </button>
          )}

          {/* Info Modal CTA */}
          {onOpenHoursModal && (
            <button
              onClick={onOpenHoursModal}
              className="px-4 py-2 rounded-full bg-[#011207]/80 hover:bg-[#012F13] text-[#8BC53D] text-xs font-medium border border-[#8BC53D]/25 transition-all cursor-pointer flex items-center gap-1.5 hover:border-[#8BC53D]/50"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Hours & Location</span>
            </button>
          )}
        </div>

        {/* 6. Quick Delivery & Trust Indicators */}
        <div className="hero-fade-in flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-[#E2F0CC]/80">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BC53D]" />
            <span>25–35 Min Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-[#8BC53D] text-[#8BC53D]" />
            <span>4.9 ★ (500+ Reviews)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BC53D]" />
            <span>100% Halal Certified</span>
          </div>
        </div>

        {/* 7. Scroll / Drag Interactive Prompt */}
        <div className="hero-fade-in mt-8 sm:mt-10 flex flex-col items-center gap-2">
          <button
            ref={indicatorBtnRef}
            onClick={handleScrollToNext}
            className="group px-6 py-3 rounded-full bg-[#012F13]/90 hover:bg-[#8BC53D] text-white hover:text-[#011207] border border-[#8BC53D]/50 hover:border-[#8BC53D] text-xs sm:text-sm font-black lowercase tracking-wider transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center gap-2.5 cursor-pointer active:scale-95 backdrop-blur-md"
            title="scroll to see more."
          >
            <span>scroll to see more.</span>
            <ChevronDown className="w-4 h-4 text-[#8BC53D] group-hover:text-[#011207] transition-transform duration-300 group-hover:translate-y-1" />
          </button>
          
          <div className="flex items-center gap-2 text-[10px] lowercase tracking-widest text-[#8BC53D]/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            <Move className="w-3 h-3 animate-pulse" />
            <span>scroll or drag pizza to pull cheese</span>
          </div>
        </div>
      </div>

      {/* Frame Loading Spinner */}
      {!assetsLoaded && (
        <div className="absolute inset-0 z-30 bg-[#011207] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-[#8BC53D]/20 border-t-[#8BC53D] rounded-full animate-spin" />
          <span className="text-xs text-[#8BC53D]">Loading HD Pizza Engine ({loadPercent}%)</span>
        </div>
      )}
    </section>
  );
};


