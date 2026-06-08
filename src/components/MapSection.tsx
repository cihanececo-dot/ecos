import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Esnaf } from '../types';
import { motion, useSpring, useTransform } from 'motion/react';
import { getFallbackImage } from '../imageHelper';

interface MapSectionProps {
  filteredArtisans: Esnaf[];
  activeId: string | null;
  onSelectArtisan: (id: string) => void;
  theme?: 'light' | 'dark';
}

/**
 * Custom dynamic marker styling using Tailwind and pure divs. This bypasses Vite asset hashing failure bugs with Leaflet default pins.
 */
function getMarkerIcon(isActive: boolean, category: string): L.DivIcon {
  const pingEffect = isActive
    ? '<div class="absolute w-12 h-12 rounded-full bg-accent/30 animate-ping"></div>'
    : '<div class="absolute w-8 h-8 rounded-full bg-accent-light/30 animate-ping"></div>';

  const pinColor = isActive
    ? 'bg-accent border-root scale-125 z-[500]'
    : 'bg-accent hover:bg-accent-hover border-root scale-100 z-10';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        ${pingEffect}
        <div class="relative w-4.5 h-4.5 rounded-full border-2 shadow-lg transition-all duration-300 transform ${pinColor}"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function RollingNumber({ value }: { value: number }) {
  const springValue = useSpring(value, { stiffness: 60, damping: 15, restDelta: 0.5 });
  
  useEffect(() => {
    springValue.set(value);
  }, [springValue, value]);

  const display = useTransform(springValue, (latest) => Math.round(latest).toString());

  return <motion.span>{display}</motion.span>;
}

function YilCounter({ yil }: { yil?: string | number }) {
  const [lastYil, setLastYil] = React.useState<string | number>('');

  React.useEffect(() => {
    if (yil) setLastYil(yil);
  }, [yil]);

  const activeYil = yil || lastYil || '—';
  const isNumber = activeYil !== '—' && String(activeYil).trim() !== '' && !isNaN(Number(activeYil));

  return (
    <div className="absolute top-6 right-6 z-[500] pointer-events-none group rounded-full">
      <div className="relative flex items-center justify-center w-28 h-28 bg-surface/80 border border-border-strong rounded-full shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
        
        {/* Dairesel Akan Sayaç Çizgisi (Circular Flowing Dashed Ring) */}
        <svg className="absolute inset-0 w-full h-full text-accent animate-[spin_10s_linear_infinite] opacity-40 mix-blend-overlay" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" strokeWidth="1.5" stroke="currentColor" strokeDasharray="6 6" />
          <circle cx="50" cy="50" r="41" fill="none" strokeWidth="0.5" stroke="currentColor" strokeDasharray="4 8" className="animate-[spin_15s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
        </svg>

        {/* İçerik */}
        <div className="relative flex flex-col items-center justify-center z-10">
          <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-content-muted uppercase mb-0.5">Kuruluş</span>
          <div className="flex items-center justify-center">
            {isNumber ? (
              <span className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-hover tracking-tighter drop-shadow-sm">
                <RollingNumber value={Number(activeYil)} />
              </span>
            ) : (
              <motion.span 
                key={String(activeYil)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-xl font-serif italic text-accent px-2 text-center leading-tight drop-shadow-sm"
              >
                {activeYil}
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapSection({ filteredArtisans, activeId, onSelectArtisan, theme = 'light' }: MapSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Update theme dynamically
  useEffect(() => {
    if (tileLayerRef.current) {
      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current.setUrl(tileUrl);
    }
  }, [theme]);

  // 1. Initialize map on mount once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Centered at historical Sultanahmet area of Istanbul
      mapRef.current = L.map(mapContainerRef.current, {
        center: [41.0125, 28.9750],
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });

      // Light vs Dark map tiles based on standard OpenStreetMap to retain proper styling (or custom logic)
      // Note: We use the CartoDB voyager/dark_all to match light/dark modes
      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      });
      tileLayerRef.current.addTo(mapRef.current);

      // Re-position zoom controls to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }

    // Leaflet map needs a resize trigger after mount is complete
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 2. Refresh / Synchronize markers when filtered list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker: any) => {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    });
    markersRef.current = {};

    // Put new markers on the map
    filteredArtisans.forEach((artisan) => {
      const latLng: [number, number] = [artisan.enlem, artisan.boylam];
      const isCurrentlyActive = artisan.no === activeId;

      const marker = L.marker(latLng, {
        icon: getMarkerIcon(isCurrentlyActive, artisan.kategori),
      }).addTo(map);

      // Assemble customized editorial HTML inside Leaflet popup container
      const popupContentDiv = document.createElement('div');
      popupContentDiv.className = 'p-1 text-content max-w-xs font-sans text-left';
      
      const displayImage = getFallbackImage(artisan);

      popupContentDiv.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wide text-accent bg-accent-soft border border-border-strong rounded">
              SIRA #${artisan.no}
            </span>
            <span class="text-[9px] font-semibold text-content-muted capitalize">
              ${artisan.kategori}
            </span>
          </div>
          <h4 class="text-sm font-bold text-content tracking-tight leading-tight">${artisan.mekan}</h4>
          <p class="text-[11px] text-content-sec leading-snug">${artisan.adres}</p>
          ${
            artisan.telefon
              ? `<p class="text-[11px] font-mono text-accent mt-1">📞 ${artisan.telefon}</p>`
              : ''
          }
          <div class="w-full max-h-44 overflow-hidden rounded border border-border mt-2 flex justify-center bg-surface-hover">
            <img src="${displayImage}" class="w-full h-auto object-contain max-h-44" referrerpolicy="no-referrer" />
          </div>
          <button class="w-full mt-2 bg-accent hover:bg-accent-hover text-root text-[10px] font-bold py-1.5 rounded cursor-pointer transition text-center focus-view-btn pointer-events-auto">
            HİKAYEYE GİT →
          </button>
        </div>
      `;

      // Listen for click on "Hikayeye Git" button inside popup
      popupContentDiv.querySelector('.focus-view-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectArtisan(artisan.no);
        // Scroll target card in left panel
        const cardElement = document.getElementById(`artisan-card-${artisan.no}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      marker.bindPopup(popupContentDiv, {
        className: 'custom-leaflet-popup',
        closeButton: false,
        offset: L.point(0, -6),
        autoPan: true,
      });

      // Handle marker direct click
      marker.on('click', () => {
        onSelectArtisan(artisan.no);
      });

      markersRef.current[artisan.no] = marker;
    });

    // Fit map bounds to encompass all filtered points
    if (filteredArtisans.length > 0) {
      const bounds = L.featureGroup(Object.values(markersRef.current)).getBounds();
      map.fitBounds(bounds.pad(0.15), {
        maxZoom: 15,
        animate: true,
        duration: 1.2,
      });
    }
  }, [filteredArtisans, onSelectArtisan]);

  // 3. Sync flying to/selecting active marker when activeId updates
  useEffect(() => {
    if (!activeId) return;
    const map = mapRef.current;
    if (!map) return;

    const targetMarker = markersRef.current[activeId];
    if (targetMarker) {
      // Zoom & pan to marker
      const latLng = targetMarker.getLatLng();
      map.setView(latLng, 16, {
        animate: true,
        duration: 1.5,
      });

      // Open target's popup
      if (!targetMarker.isPopupOpen()) {
        targetMarker.openPopup();
      }
    }

    // Update active vs inactive statuses on markers visually
    Object.keys(markersRef.current).forEach((no) => {
      const marker = markersRef.current[no];
      const artisan = filteredArtisans.find((a) => a.no === no);
      if (artisan) {
        marker.setIcon(getMarkerIcon(no === activeId, artisan.kategori));
      }
    });
  }, [activeId, filteredArtisans]);

  const activeArtisan = filteredArtisans.find((a) => a.no === activeId);

  const districtName = React.useMemo(() => {
    if (!activeArtisan?.adres) return "Tarihi Yarımada";
    const parts = activeArtisan.adres.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 1].replace(/istanbul|İstanbul/i, '').trim() || "İstanbul";
    }
    return "Tarihi Yarımada";
  }, [activeArtisan]);

  const latStr = activeArtisan ? `${activeArtisan.enlem.toFixed(4)}° K` : "41.0125° K";
  const lngStr = activeArtisan ? `${activeArtisan.boylam.toFixed(4)}° D` : "28.9750° D";

  return (
    <div className="w-full h-full relative group">
      {/* Visual map outline edge shimmer */}
      <div className="absolute inset-0 border border-border pointer-events-none rounded-xl z-20" />
      <div className="absolute top-4 left-4 bg-surface/90 border border-border px-3 py-1.5 rounded-md text-xs font-mono font-bold text-accent z-10 pointer-events-none shadow-lg backdrop-blur-sm">
        İstanbul Kültür Atlası
      </div>

      {/* Scale & Info Overlay aligning with Elegant Dark specification */}
      {activeArtisan && (
        <div className="absolute bottom-4 left-4 p-3 bg-surface border border-border-strong rounded-lg backdrop-blur-md z-[400] shadow-2xl transition-all duration-500 animate-fade-in pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <p className="text-[9px] font-mono text-content-muted uppercase tracking-widest">Koordinatlar</p>
              <p className="text-[11px] text-content-sec font-mono tracking-tighter">{latStr}, {lngStr}</p>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex flex-col">
              <p className="text-[9px] font-mono text-content-muted uppercase tracking-widest">ODAKLANILAN SEMT</p>
              <p className="text-[11px] text-accent font-medium font-mono uppercase">{districtName}</p>
            </div>
          </div>
        </div>
      )}
      
      <YilCounter yil={activeArtisan?.yil} />

      {/* Actual Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
        style={{ minHeight: '350px' }}
      />
    </div>
  );
}
