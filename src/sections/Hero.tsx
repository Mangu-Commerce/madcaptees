'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '@/lib/data';
import type { AppView, FilterState } from '@/types';

interface HeroProps {
  onNavigate: (view: AppView) => void;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

export function Hero({ onNavigate, onFilterChange }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % HERO_SLIDES.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[55vh] sm:h-[62vh] lg:h-[72vh] overflow-hidden bg-[#0A0A0A]">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Image with Ken Burns effect */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-[#0A0A0A]/20" />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1
              className={`text-4xl sm:text-5xl lg:text-7xl text-white mb-3 drop-shadow-lg transition-all duration-700 ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.01em', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
            >
              {slide.title}
            </h1>
            <p
              className={`text-base sm:text-lg lg:text-xl text-white/75 mb-8 max-w-lg transition-all duration-700 delay-100 ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif", textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
            >
              {slide.subtitle}
            </p>
            <button
              onClick={() => { onFilterChange({}); onNavigate('shop'); }}
              className={`px-8 py-4 text-white text-[13px] uppercase tracking-[0.15em] transition-all duration-500 delay-200 hover:translate-y-[-3px] hover:shadow-[0_8px_24px_rgba(196,30,58,0.4)] ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              {slide.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
