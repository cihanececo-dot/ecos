import React from 'react';
import { Esnaf } from '../types';
import { getFallbackImage } from '../imageHelper';
import { Award, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ArchiveViewProps {
  artisans: Esnaf[];
  onGoToStory: (id: string) => void;
}

export function ArchiveView({ artisans, onGoToStory }: ArchiveViewProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {artisans.map((artisan, index) => {
          const displayImage = getFallbackImage(artisan);
          const experienceYears = artisan.yil && !isNaN(Number(artisan.yil)) 
            ? Math.max(0, 2026 - Number(artisan.yil)) 
            : 0;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={artisan.no} 
              className="bg-surface rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-colors flex flex-col group relative"
            >
              {/* Photo Area */}
              <div className="w-full aspect-[4/3] bg-surface-hover relative overflow-hidden">
                <img 
                  src={displayImage} 
                  alt={artisan.mekan} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-root/90 backdrop-blur text-accent px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase border border-border shadow-md">
                  {artisan.kategori}
                </div>

                {/* Experience Badge */}
                {experienceYears > 0 && (
                  <div className="absolute top-3 right-3 bg-accent text-root px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shadow-md flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {experienceYears} YIL
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif text-lg font-bold text-content leading-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-accent-light transition-all">
                  {artisan.mekan}
                </h3>
                
                <div className="mt-auto pt-4 flex justify-end">
                  <button 
                    onClick={() => onGoToStory(artisan.no)}
                    className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors font-mono uppercase tracking-wide group/btn"
                  >
                    Hikayeye Git
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {artisans.length === 0 && (
          <div className="col-span-full py-20 text-center text-content-sec">
            Aradığınız kriterlere uygun esnaf bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
