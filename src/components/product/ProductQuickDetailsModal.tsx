import React, { useEffect } from 'react';
import { Product } from '../../types';
import { ProductFullDetailsSection } from './ProductFullDetailsSection';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickDetailsModal: React.FC<Props> = ({ product, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Full Details Section */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          <ProductFullDetailsSection product={product} onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  );
};
