import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  RotateCcw,
  Move
} from 'lucide-react';

interface Props {
  images: string[];
  productName: string;
}

export const ProductImageGallery: React.FC<Props> = ({ images, productName }) => {
  const validImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'];
  const [activeIdx, setActiveIdx] = useState(0);

  // Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);

  // Reset zoom & pan
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Cycle Next / Prev
  const handlePrev = useCallback(() => {
    resetZoom();
    setActiveIdx((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    setActiveIdx((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length, resetZoom]);

  // Open Lightbox
  const openLightbox = (initialScale = 1) => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
    setIsLightboxOpen(true);
  };

  // Close Lightbox
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    resetZoom();
  }, [resetZoom]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') handlePrev();
        else if (e.key === 'ArrowRight') handleNext();
        else if (e.key === '+' || e.key === '=') setScale((s) => Math.min(4, s + 0.3));
        else if (e.key === '-' || e.key === '_') setScale((s) => Math.max(1, s - 0.3));
        else if (e.key === '0') resetZoom();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isLightboxOpen, closeLightbox, handlePrev, handleNext, resetZoom]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setScale((prev) => {
      const next = Math.min(4, Math.max(1, prev + delta));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartDistRef.current;
      setScale((prev) => Math.min(4, Math.max(1, prev * (ratio > 1 ? 1.05 : 0.95))));
      touchStartDistRef.current = dist;
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistRef.current = null;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop / Tablet: Horizontal Flex with Left Thumbnails & Right Main Image */}
      <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-4">
        {/* Thumbnail Column (Left on desktop, bottom scroll on mobile) */}
        {validImages.length > 1 && (
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[360px] pb-1 sm:pb-0 scrollbar-thin">
            {validImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveIdx(i);
                  resetZoom();
                }}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl p-1.5 bg-white shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                  activeIdx === i
                    ? 'border-2 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                    : 'border border-slate-200/90 hover:border-slate-400 opacity-80 hover:opacity-100'
                }`}
                title={`View angle ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${i + 1}`}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image Display Box matching Reference Image 2 */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="relative w-full aspect-square sm:aspect-auto sm:h-[350px] rounded-2xl bg-white border border-slate-200/90 p-4 flex items-center justify-center group overflow-hidden shadow-2xs">
            {/* Previous Image Chevron Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                title="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Main Interactive Product Image */}
            <div
              onClick={() => openLightbox(1.5)}
              className="w-full h-full flex items-center justify-center cursor-zoom-in"
              title="Click to zoom and view full screen"
            >
              <img
                src={validImages[activeIdx]}
                alt={productName}
                className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            {/* Next Image Chevron Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                title="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Magnifying Glass Indicator Button at bottom-right */}
            <button
              type="button"
              onClick={() => openLightbox(2)}
              className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-slate-50 transition-transform active:scale-90 cursor-pointer"
              title="Open full-screen image preview"
            >
              <Maximize2 className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Under-Image Zoom Controls matching Reference Image 2: [Zoom In] [Zoom Out] */}
          <div className="flex items-center justify-center gap-3 mt-3 w-full">
            <button
              type="button"
              onClick={() => openLightbox(2)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Zoom In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isLightboxOpen) resetZoom();
                else openLightbox(1);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Zoom Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN INTERACTIVE LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/92 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Lightbox Top Action Bar */}
          <div className="w-full px-4 sm:px-6 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between text-white z-20">
            {/* Left: Image counter */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-300">
                Image {activeIdx + 1} of {validImages.length}
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold">
                {Math.round(scale * 100)}% Zoom
              </span>
            </div>

            {/* Center: Zoom In, Zoom Out, Reset controls */}
            <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(1, s - 0.25))}
                disabled={scale <= 1}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={resetZoom}
                className="px-2 py-1 rounded-lg hover:bg-white/20 text-xs font-bold flex items-center gap-1 text-slate-200 transition-colors"
                title="Reset zoom and position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setScale((s) => Math.min(4, s + 0.25))}
                disabled={scale >= 4}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer"
              title="Close preview (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Center: Image Canvas with Drag & Wheel Zoom */}
          <div
            className="flex-1 w-full relative overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Previous Chevron Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                title="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Zoomed & Pannable Image */}
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
              className="max-w-[85vw] max-h-[75vh] flex items-center justify-center pointer-events-auto"
            >
              <img
                src={validImages[activeIdx]}
                alt={`${productName} zoomed`}
                draggable={false}
                className="max-h-[75vh] max-w-[85vw] object-contain drop-shadow-2xl rounded-lg"
              />
            </div>

            {/* Next Chevron Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                title="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Helper Hint: Pan when zoomed */}
            {scale > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white/80 border border-white/10 text-xs flex items-center gap-1.5 pointer-events-none">
                <Move className="w-3.5 h-3.5" />
                <span>Drag to pan • Scroll to zoom</span>
              </div>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          {validImages.length > 1 && (
            <div className="w-full py-3 bg-black/40 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto px-4 z-20">
              {validImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveIdx(i);
                    resetZoom();
                  }}
                  className={`w-12 h-14 rounded-lg p-1 bg-white/10 shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                    activeIdx === i
                      ? 'border-2 border-blue-500 shadow-md ring-2 ring-blue-400/40'
                      : 'border border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  title={`Select image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
