import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onDiscover: () => void;
}

export function Hero({ onDiscover }: HeroProps) {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-root text-content border-b border-border">
      {/* Elegantly styled background patterns - soft radial gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[50rem] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-accent-hover/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl px-4 sm:px-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 border border-border-strong rounded-full bg-surface/50 backdrop-blur-sm mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] text-content-muted">
            KÜRESELLEŞMEYE DİRENEN EFSANELER
          </span>
          <Sparkles className="w-4 h-4 text-accent" />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1] text-content drop-shadow-sm">
          İstanbul'un <br/>
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-accent-hover to-accent pr-2">
            Yaşayan Zanaatkarları
          </span>
        </h1>

        <p className="font-serif text-lg md:text-xl text-content-sec max-w-2xl mb-12 leading-relaxed opacity-90">
          Yüzyıllardır dar sokaklarda yankılanan çekiç sesleri, ateşin nefesi ve sabrın izleri... Şehrin ruhunu ayakta tutan asırlık ustaların hikayelerini koruyor, kaybolmaya yüz tutan bu değerli mirası dijital hafızamıza kazıyoruz.
        </p>

        <button
          onClick={onDiscover}
          className="group relative inline-flex items-center justify-center px-10 py-4 font-sans font-semibold text-lg tracking-wide text-root bg-accent hover:bg-accent-hover rounded-full transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-accent/40 overflow-hidden outline-none focus:ring-4 focus:ring-accent/50"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-3">
            Haydi Keşfet
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </span>
        </button>
      </div>

      <button
        onClick={onDiscover}
        className="absolute bottom-12 animate-bounce p-3 text-content-muted hover:text-accent transition-colors hidden md:block"
        aria-label="Aşağı kaydır"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </section>
  );
}
