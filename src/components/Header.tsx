import React from 'react';
import { Compass, Heart, Moon, Sun, LayoutGrid, Map } from 'lucide-react';

interface HeaderProps {
  filteredCount: number;
  selectedCategory: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  viewMode: 'map' | 'archive';
  onViewModeChange: (mode: 'map' | 'archive') => void;
  projectLogo?: string;
}

export function Header({ filteredCount, selectedCategory, theme, onToggleTheme, viewMode, onViewModeChange, projectLogo }: HeaderProps) {
  return (
    <header className="border-b border-border bg-overlay backdrop-blur-md p-6 md:p-8 relative overflow-hidden z-20">
      {/* Decorative backdrop patterns from the design */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-soft rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-soft/50 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div className="flex items-start md:items-center gap-4">
          {/* Elegant Dark Brand Icon */}
          <div className="w-14 h-14 md:w-20 md:h-20 bg-root rounded-full flex items-center justify-center shadow-lg shadow-accent/20 shrink-0 select-none overflow-hidden border-2 border-border/50">
            {projectLogo ? (
              <img src={projectLogo} alt="Logo" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-2xl md:text-4xl font-bold italic text-content">İ</span>
            )}
          </div>
          <div>
            {/* Tagline / Subtitle */}
            <div className="flex items-center gap-2 mb-1 text-content-muted font-mono text-[10px] font-bold tracking-widest">
              <Compass className="w-3.5 h-3.5 text-accent animate-spin-slow" />
              <span>KÜRESELLEŞMEYE DİRENEN EFSANELER</span>
            </div>
            
            {/* Main Editorial Title Small */}
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-content">
              İstanbul'un <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Yaşayan Zanaatkarları</span>
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {selectedCategory !== 'Tümü' && (
            <div className="bg-surface-hover border border-border-strong rounded-lg px-4 py-2 flex items-center gap-3 animate-fade-in shadow-inner hidden sm:flex">
              <Heart className="w-5 h-5 text-accent" />
              <div>
                <div className="text-content-muted text-[9px] font-mono uppercase tracking-wider">{selectedCategory}</div>
                <div className="text-content font-bold font-serif text-base leading-tight">{filteredCount} Gösteriliyor</div>
              </div>
            </div>
          )}

          {/* View Mode Toggle Button */}
          <div className="flex bg-surface border border-border-strong rounded-lg p-1 shadow-inner">
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase transition-all duration-300 ${
                viewMode === 'map' 
                  ? 'bg-accent text-root shadow' 
                  : 'text-content-sec hover:text-content hover:bg-surface-hover'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Harita</span>
            </button>
            <button
              onClick={() => onViewModeChange('archive')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase transition-all duration-300 ${
                viewMode === 'archive' 
                  ? 'bg-accent text-root shadow' 
                  : 'text-content-sec hover:text-content hover:bg-surface-hover'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Arşiv</span>
            </button>
          </div>
          
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 border border-border-strong bg-surface hover:bg-surface-hover rounded-full flex items-center justify-center text-accent transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
