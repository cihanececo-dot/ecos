/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import papa from 'papaparse';
import { Search, Filter, RefreshCw, AlertCircle, Compass, MapPin, Sparkles } from 'lucide-react';
import { Esnaf } from './types';
import { Header } from './components/Header';
import { ArtisanCard } from './components/ArtisanCard';
import { MapSection } from './components/MapSection';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQuAMeW0sBg_sGwT0sMshAYlKdAMmO8qF_JiNXrOuqxEOgXKDDEry-Glse-eP-RRKP9OFOhoSdW671/pub?output=csv';

export default function App() {
  const [artisans, setArtisans] = useState<Esnaf[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Scroll lock ref to prevent observer collisions when scrolling programmatically
  const isScrollingRef = useRef<boolean>(false);

  // Initial theme detection
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 1. Fetch live CSV data and parse
  const fetchAndParseCSV = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(CSV_URL);
      if (!response.ok) {
        throw new Error(`Veri çekilemedi: Sunucu hatası (${response.status})`);
      }
      const text = await response.text();
      
      papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          
          // Map raw sheets columns to typed Esnaf entities safely
          const mapped: Esnaf[] = results.data
            .map((row: any) => {
              const lat = parseFloat(row.enlem);
              const lng = parseFloat(row.boylam);
              
              let videoUrl = row.videourl || row.video || '';
              const mekanName = row.mekan || '';
              
              if (mekanName.toLowerCase().includes('berber cavit')) {
                videoUrl = videoUrl || 'https://www.youtube.com/embed/JQAiQT1J0Cc';
              }

              return {
                no: row.no || '',
                mekan: mekanName,
                enlem: lat,
                boylam: lng,
                kategori: row.kategori || '',
                adres: row.adres || '',
                telefon: row.telefon || '',
                gorsel: row['görsel'] || row.gorsel || '',
                video: videoUrl,
              };
            })
            // Filter out corrupt lines that don't have valid locations
            .filter((item) => {
              const hasName = item.mekan && item.mekan.trim().length > 0;
              const hasCoordinates = !isNaN(item.enlem) && !isNaN(item.boylam);
              return hasName && hasCoordinates;
            });

          setArtisans(mapped);
          
          // Set initial active artisan if loaded
          if (mapped.length > 0) {
            setActiveId(mapped[0].no);
          }
          setLoading(false);
        },
        error: (err: any) => {
          setError(`CSV parse edilirken hata oluştu: ${err.message || err}`);
          setLoading(false);
        }
      });
    } catch (err: any) {
      setError(err.message || 'Harita veritabanına bağlanırken beklenmedik bir hata oluştu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndParseCSV();
  }, []);

  // 2. Compute dynamic category list directly from data
  const categories = useMemo(() => {
    const allCategories = artisans.map((artisan) => artisan.kategori).filter(Boolean);
    const unique = Array.from(new Set(allCategories));
    return ['Tümü', ...unique];
  }, [artisans]);

  // 3. Filtered subset based on category pills and search inputs
  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const matchesCategory = selectedCategory === 'Tümü' || artisan.kategori === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchesSearch =
        artisan.mekan.toLowerCase().includes(cleanSearch) ||
        artisan.adres.toLowerCase().includes(cleanSearch) ||
        artisan.kategori.toLowerCase().includes(cleanSearch);
      
      return matchesCategory && matchesSearch;
    });
  }, [artisans, selectedCategory, searchQuery]);

  // Adjust active ID if current selection gets excluded by filter changes
  useEffect(() => {
    if (filteredArtisans.length > 0) {
      const isStillAvailable = filteredArtisans.some((a) => a.no === activeId);
      if (!isStillAvailable) {
        setActiveId(filteredArtisans[0].no);
      }
    } else {
      setActiveId(null);
    }
  }, [filteredArtisans, activeId]);

  // 4. Scrollytelling scroll observer: detects cards scroll to focus and centers map fly-to
  useEffect(() => {
    if (loading || filteredArtisans.length === 0) return;

    const observerOptions = {
      root: null, // observation is relative to the browser viewport
      rootMargin: '-20% 0px -55% 0px', // focused when card centers around upper-middle
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Bypass when user manually clicked to zoom (prevent jitter jumps)
      if (isScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          if (id) {
            setActiveId(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe each story card
    const cards = document.querySelectorAll('.artisan-card-scroll');
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, [filteredArtisans, loading]);

  // 5. Dual correlation link: selecting an artisan triggers scroll aligning with scroll locks
  const handleSelectArtisan = (id: string) => {
    setActiveId(id);
    
    // Lock observer action
    isScrollingRef.current = true;

    const el = document.getElementById(`artisan-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Release scroll lock after animating
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-root text-content flex flex-col font-sans selection:bg-accent selection:text-root">
      
      {/* Branding Header Banner */}
      <Header 
        filteredCount={filteredArtisans.length} 
        selectedCategory={selectedCategory}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Control center: Category Pill bar & Searching box */}
      <section className="bg-surface/60 border-b border-border py-4 px-6 md:px-8 z-30 sticky top-0 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Category Scroller */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none w-full lg:w-auto">
            <span className="text-content-muted font-mono text-[10px] font-bold tracking-widest flex items-center gap-1.5 shrink-0 bg-root px-2.5 py-1 rounded border border-border-strong">
              <Filter className="w-3.5 h-3.5 text-accent" />
              KATEGORİLER:
            </span>
            <div className="flex gap-2 bg-root/80 p-1 rounded-lg border border-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-4 py-1.5 rounded-md font-medium cursor-pointer transition-all duration-300 shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-accent text-root font-semibold shadow-sm'
                      : 'text-content-sec hover:text-content hover:bg-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search container */}
          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-content-muted">
              <Search className="w-4 h-4 group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Esnaf adı, adres veya semt ara..."
              className="w-full bg-root text-sm pl-10 pr-4 py-2 rounded-lg border border-border text-content placeholder-content-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all shadow-inner"
            />
          </div>

        </div>
      </section>

      {/* Main Content Area: Split layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch relative">
        
        {/* Loading overlay spinner */}
        {loading && (
          <div className="col-span-12 flex flex-col items-center justify-center py-24 space-y-4 bg-overlay backdrop-blur-sm z-30 rounded-xl">
            <RefreshCw className="w-10 h-10 text-accent animate-spin" />
            <h3 className="font-serif text-lg text-content font-medium">Asırlık Çınarların Kayıtları Canlı Çekiliyor...</h3>
            <p className="text-sm text-content-sec max-w-xs text-center leading-relaxed">
              Google Sheets üzerinden İstanbul'un yaşayan esnaf ve zanaatkar kaydı PapaParse ile aktarılıyor.
            </p>
          </div>
        )}

        {/* Failed fetch retry panel */}
        {error && !loading && (
          <div className="col-span-12 bg-rose-950/20 border border-rose-900 rounded-xl p-8 max-w-2xl mx-auto text-center space-y-4 my-12 shadow-lg w-full">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-rose-100">Kültürel Miras Haritası Yüklenemedi</h3>
            <p className="text-content-sec text-sm leading-relaxed">{error}</p>
            <p className="text-xs text-content-muted">Cihazınızın internet bağlantısını doğrulayın veya tekrar deneyin.</p>
            <button
              onClick={fetchAndParseCSV}
              className="bg-accent hover:bg-accent-hover text-root font-medium text-sm px-6 py-2 rounded-lg transition-all shadow-lg"
            >
              Yeniden Deneyin
            </button>
          </div>
        )}

        {/* Successful data load rendering */}
        {!loading && !error && (
          <>
            {/* LEFT STREAM: Narrative scrollytelling column (Grid 5/12 width) */}
            <section className="col-span-12 md:col-span-5 flex flex-col space-y-6 order-2 md:order-1 pt-4">
              
              {/* Dynamic status statement */}
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-content-muted uppercase border-b border-border pb-3">
                <Compass className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>KAYDIRMAİLE HİKAYELERDE GEZİNİN</span>
              </div>

              {/* Empty state when filters output nothing */}
              {filteredArtisans.length === 0 ? (
                <div className="text-center py-16 bg-surface border border-border rounded-xl p-6">
                  <p className="text-content-sec text-sm mb-4">Arama kriterlerinize veya kategori seçiminize uygun esnaf bulunamadı.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('Tümü');
                      setSearchQuery('');
                    }}
                    className="text-xs text-accent hover:underline hover:text-accent-hover font-medium font-mono"
                  >
                    Kriterleri Temizle
                  </button>
                </div>
              ) : (
                <div className="space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-24 scroll-smooth">
                  {filteredArtisans.map((artisan) => (
                    <ArtisanCard
                      key={artisan.no}
                      artisan={artisan}
                      isActive={artisan.no === activeId}
                      onFocus={handleSelectArtisan}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN: Sticky Dynamic Map (Grid 7/12 width) */}
            <section className="col-span-12 md:col-span-7 md:sticky md:top-24 max-h-[50vh] md:max-h-[calc(100vh-140px)] order-1 md:order-2 self-start w-full z-10 transition-all duration-300">
              <div className="h-[40vh] md:h-[calc(100vh-160px)] w-full rounded-2xl overflow-hidden bg-surface border border-border shadow-2xl relative">
                <MapSection
                  filteredArtisans={filteredArtisans}
                  activeId={activeId}
                  onSelectArtisan={handleSelectArtisan}
                  theme={theme}
                />
              </div>
            </section>
          </>
        )}

      </main>

      {/* Footer Status Bar aligning with Elegant Dark specification */}
      <footer className="px-8 py-4 bg-root border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[10px] text-content-sec font-medium uppercase tracking-widest font-mono">Veri Bağlantısı: Aktif</span>
          </div>
          <span className="text-border-strong text-[10px] hidden sm:inline">|</span>
          <span className="text-[10px] text-content-muted font-mono uppercase tracking-widest">{artisans.length} Kayıt Envanterde</span>
        </div>
        <div className="flex gap-6 text-[10px] text-content-sec font-medium uppercase tracking-widest font-mono">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors">Proje Hakkında</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors">Katkıda Bulun</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors">İletişim</a>
        </div>
      </footer>

    </div>
  );
}
