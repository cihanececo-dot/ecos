import React, { useMemo } from 'react';
import { MapPin, Phone, Video, ExternalLink, Award, Sparkles } from 'lucide-react';
import { Esnaf } from '../types';

interface ArtisanCardProps {
  artisan: Esnaf;
  isActive: boolean;
  onFocus: (id: string) => void;
}

/**
 * Extracts YouTube video ID and forms a valid embed link
 */
function getYoutubeEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0&hl=tr&modestbranding=1`;
  }
  return null;
}

export function ArtisanCard({ artisan, isActive, onFocus }: ArtisanCardProps) {
  const youtubeUrl = useMemo(() => getYoutubeEmbedUrl(artisan.video), [artisan.video]);

  // Handle card click to focus and trigger map panning
  const handleClick = () => {
    onFocus(artisan.no);
  };

  return (
    <article
      id={`artisan-card-${artisan.no}`}
      data-id={artisan.no}
      onClick={handleClick}
      className={`artisan-card-scroll p-6 rounded-xl border transition-all duration-500 cursor-pointer text-left relative overflow-hidden group ${
        isActive
          ? 'bg-root border-accent shadow-xl shadow-accent/10 scale-[1.01]'
          : 'bg-surface border-border hover:border-border-strong hover:bg-surface-hover hover:scale-[1.005]'
      }`}
    >
      {/* Decorative award crest in the background */}
      <div className={`absolute -right-6 -bottom-6 transition-all duration-700 pointer-events-none ${
        isActive ? 'text-accent-soft scale-110 rotate-12' : 'text-accent-soft/30 group-hover:text-accent-soft'
      }`}>
        <Award className="w-32 h-32" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header row: Status tags & counts matching the layout blueprint */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {isActive ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-accent-soft text-accent border border-accent/40 rounded text-[9px] font-bold tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                AKTİF DURAK
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-root text-content-muted border border-border rounded text-[9px] font-medium tracking-wide uppercase">
                MUTEMET DURAK
              </span>
            )}
            <span className="text-[10px] font-mono text-content-sec">
              {artisan.no} / 100
            </span>
          </div>

          {/* Elegant serif italic styling for names */}
          <h3 className="font-serif text-2xl font-bold italic text-content group-hover:text-accent transition-colors mb-4 leading-tight">
            {artisan.mekan}
          </h3>

          {/* Description narrative paragraph */}
          <p className="text-content-sec text-[13.5px] leading-relaxed font-serif mb-5">
            İstanbul'un asırlık bellek birikimini temsil eden bu güzide değerimiz, el emeği ve alın terini zanaat geleneklerinin kılavuzluğunda yaşatmaktadır.
          </p>

          {/* Grid Layout containing metadata attributes matching layout spec */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-5 pb-5">
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-content-muted font-bold tracking-widest">ADRES / KONUM</p>
              <p className="text-xs text-content-sec font-sans flex items-start gap-1 line-clamp-2">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                {artisan.adres}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-content-muted font-bold tracking-widest">ZANAAT KATEGORİSİ</p>
              <p className="text-xs text-accent font-sans font-semibold">
                {artisan.kategori}
              </p>
            </div>
          </div>
        </div>

        {/* Media Block Section */}
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Display image if present with fine subtle grayscale filter effects */}
          {artisan.gorsel && (
            <div className="w-full aspect-video overflow-hidden rounded-xl border border-border-strong relative group-hover:border-accent/40 transition">
              <img
                src={artisan.gorsel}
                alt={artisan.mekan}
                loading="lazy"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  isActive ? 'scale-105 sepia-0 grayscale-0' : 'sepia-20 grayscale-30 opacity-90 group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100 group-hover:scale-[1.03]'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Display Video Iframe Player if valid Youtube embed URL found */}
          {youtubeUrl && (
            <div className="w-full rounded-xl border border-border overflow-hidden bg-black transition group-hover:border-border-strong font-sans">
              <div className="flex items-center gap-2 p-2.5 bg-root border-b border-border text-xs font-mono text-content-sec">
                <Video className="w-4 h-4 text-rose-700" />
                <span>Tanıtım Belgeseli</span>
              </div>
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src={youtubeUrl}
                  title={`${artisan.mekan} Belgeseli`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Telephone and coordination stats row */}
        {artisan.telefon && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
            <span className="text-content-muted">{artisan.enlem.toFixed(4)}° K, {artisan.boylam.toFixed(4)}° D</span>
            <div className="flex items-center gap-1.5 text-accent">
              <Phone className="w-3.5 h-3.5" />
              <a
                href={`tel:${artisan.telefon.replace(/\s+/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline hover:text-accent-hover transition-all"
              >
                {artisan.telefon}
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
