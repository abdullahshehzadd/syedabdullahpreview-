import { useEffect } from 'react';

/**
 * Reusable reveal system using IntersectionObserver (threshold: 0.15).
 * When a section or element enters the viewport, it adds class "revealed"
 * and immediately unobserves the element so it animates exactly ONCE.
 */
export function useReveal(dependency?: any) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    elements.forEach((el) => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [dependency]);
}
