import React, { useMemo } from 'react';
import { MapPin, Phone, Video, ExternalLink, Award, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Esnaf } from '../types';

interface ArtisanCardProps {
  artisan: Esnaf;
  isActive: boolean;
  onFocus: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
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

import { getFallbackImage } from '../imageHelper';

/**
 * Dynamically generates a nostalgic story snippet based on artisan details
 */
function generateNostalgicStory(artisan: Esnaf): string {
  const { mekan, kategori, yil, no } = artisan;
  const seedStr = no || mekan || "default";
  
  // Seeded Random Generator using a simple hash based on artisan ID/Name
  // Ensures the story stays consistent for the same artisan across renders
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) { h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0; }
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 1 | h);
    h = h ^ (h + Math.imul(h ^ (h >>> 7), 61 | h));
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };

  const pick = (arr: string[]) => arr[Math.floor(rand() * arr.length)];

  const hasYear = yil && String(yil).trim() !== '' && !isNaN(Number(yil));
  
  // Varied ways to mention the starting year
  const yearPhrases = hasYear ? [
    `${yil} yılından beri`,
    `${yil} senesinde kapılarını açtığı günden bu yana`,
    `${yil} yılından günümüze uzanan tarihiyle`,
    `Tarihler ${yil} yılını gösterdiğinde başlayan serüveniyle`,
    `${yil} senesinden miras kalan duruşuyla`,
    `Temellerinin atıldığı ${yil} yılından bugüne`,
    `${yil} senesinden beri mahallenin vazgeçilmezi olarak`,
    `İlk kez kepenk açtığı ${yil} yılından itibaren`
  ] : [
    `uzun yıllardır`,
    `geçmişten günümüze uzanan köklü tarihiyle`,
    `kuşaklardır süregelen serüveniyle`,
    `asırlık geleneğiyle`,
    `zamana meydan okuyan duruşuyla`,
    `yılların getirdiği derin tecrübesiyle`,
    `eski İstanbul'dan miras kalan nezaketiyle`,
    `geçmişin tozlu sayfalarından bugüne ulaşan emeğiyle`
  ];

  const yearText = pick(yearPhrases);
  const cat = (kategori || '').toLowerCase();

  // CATEGORY 1: Food & Culinary
  if (cat.includes('tatlı') || cat.includes('şeker') || cat.includes('lokum') || cat.includes('lezzet') || cat.includes('fırın') || cat.includes('pasta') || cat.includes('helva') || cat.includes('boza') || cat.includes('turşu') || cat.includes('kebap') || cat.includes('köfte') || cat.includes('balık') || cat.includes('lokanta') || cat.includes('gıda') || cat.includes('pastane') || cat.includes('kuruyemiş')) {
    const introlar = [
      `${mekan}, ${yearText} İstanbul'un değişmeyen damak hafızasını temsil ediyor.`,
      `${yearText} İstanbulluları ağırlayan ${mekan}, kuşaktan kuşağa aktarılan reçeteleriyle nam salmıştır.`,
      `${mekan}, ${yearText} şehrin gastronomik mirasının en samimi ve köklü duraklarından biri olmayı sürdürüyor.`,
      `${yearText} mutfaktan yükselen kokularıyla ${mekan}, geleneksel lezzetlerin güvenilir bir kalesi konumundadır.`,
      `Özgün tariflerini ticari kaygılardan uzak tutan ${mekan}, ${yearText} gerçek lezzet arayanların sığınağıdır.`,
      `İstanbul sokaklarında tarihi bir lezzet molası sunan ${mekan}, ${yearText} damaklarda eşsiz izler bırakıyor.`
    ];
    const gelismeler = [
      `Her sabah aynı sevgi ve özenle hazırlanan lezzetler, köklü ocakların ateşinde harmanlanarak eski zamanların o tarifsiz tadını bugüne taşıyor.`,
      `Burası sadece bir dükkan değil, aynı zamanda müdavimlerinin anılarıyla yoğrulmuş, mahallenin ruhunu yansıtan yaşayan bir mutfak müzesidir.`,
      `Eski İstanbulluların çok iyi bildiği bu eşsiz tat, değişen çağa ve hazır tüketim kültürüne inat kendi geleneksel tarifinden zerre taviz vermiyor.`,
      `Hızlı tüketim alışkanlıklarına meydan okuyan bu mutfak, ustalık gerektiren menüsüyle adeta eski İstanbul'un bereketini sofralara sunuyor.`,
      `Katkısız ve doğal ritüellerle pişirilen aşlar, sadece fiziki bir doygunluk değil, damağa işleyen bir sevgi ve aidiyet duygusu aşılıyor.`,
      `Raflarında ve tezgahında sergilenen her ürün, dünden bugüne değişmeden gelen bir mutfak ahlakının en net ve lezzetli kanıtıdır.`
    ];
    const sonuclar = [
      `Köklü lezzet mirasımız, bu tarihi duvarlar arasında nefes almaya ve koca şehri beslemeye devam ediyor.`,
      `Yolunuz buraya düşerse, sadece menüdeki bir tatla değil, koskoca bir şehrin zaman içindeki sofra hatırasıyla tanışacaksınız.`,
      `Bu kıymetli mutfak geleneği, İstanbul'un eşsiz damak tadını yarınlara taşıyan sarsılmaz ve samimi bir köprüdür.`,
      `Damağınızda kalan o leziz tortuyla beraber, somut olmayan bir kültürel mirasın korunmasına da şahitlik etmiş olacaksınız.`,
      `Gelecek nesiller bu asırlık tatlarla büyümeye devam ettikçe, İstanbul'un kadim ruhu asla kaybolmayacak.`,
      `Nihayetinde burası, şehrin yemek kültürünü bir abide gibi dimdik ayakta tutan müstesna bir değerdir.`
    ];
    return `${pick(introlar)} ${pick(gelismeler)} ${pick(sonuclar)}`;
  }

  // CATEGORY 2: Culture / Music / Books
  if (cat.includes('müzik') || cat.includes('plak') || cat.includes('saz') || cat.includes('enstrüman') || cat.includes('kitap') || cat.includes('sahaf') || cat.includes('matbaa') || cat.includes('kırtasiye') || cat.includes('fotograf') || cat.includes('fotoğraf')) {
    const introlar = [
      `İstanbul'un fikir, sanat ve duygu dünyasına yön veren ${mekan}, ${yearText} semtin eşsiz bir kültür vahasıdır.`,
      `${yearText} şehre nefes aldıran ${mekan}, tozlu rafları ve nostaljik tınılarıyla İstanbul'un entelektüel vizyonunu temsil eder.`,
      `Eski zamanların ince ruhunu günümüze taşıyan ${mekan}, ${yearText} şerefle yaşattığı bilgi ve sanat birikimiyle kalpleri fetheder.`,
      `Sanatın ve bilginin nabzını tutan ${mekan}, ${yearText} İstanbul'un kültürel belleğinin en sağlam bekçilerindendir.`,
      `${yearText} meraklılarına kapılarını aralayan ${mekan}, edebiyatın, tınının ve vizörden yansıyan hatıraların sarsılmaz bir mabedidir.`,
      `Kendine has kokusu ve ambiyansıyla ${mekan}, ${yearText} her gelenin ruhunda derin bir sanatsal iz bırakır.`
    ];
    const gelismeler = [
      `Sayfaların arasına, plakların yivlerine veya eski fotoğrafların sararmış dokusuna saklanmış koskoca bir devrim, bu mekanda tüm canlılığıyla yaşamaktadır.`,
      `Aydınların, sanatçıların ve semt sakinlerinin değişmez buluşma noktası olan bu müstesna dükkan, basit bir ticarethane olmanın çok ötesinde derin bir arşividir.`,
      `Mekanın raflarından süzülen o eşsiz yaşanmışlık hissi, sanat tutkunları için zamanda benzersiz bir yolculuk yapmanın en güzel ve zarif anahtarıdır.`,
      `İçeride yankılanan sessiz kelimeler veya derinden gelen nostaljik bir melodi, şehirden kaçıp dinginliğe sığınmak isteyenler için bir liman görevi görür.`,
      `Modern dünyanın yüzeysel akışında, burada bulacağınız el yazmaları, antika objeler veya nadir plaklar, geçmiş zamanın derinliğiyle yüzleşmenizi sağlar.`,
      `Ziyaretçilerini daima bir keşif heyecanıyla karşılayan mekan, objelerin ve fikirlerin etrafında örülmüş sıcacık bir sohbete kucak açar.`
    ];
    const sonuclar = [
      `Manevi ve kültürel mirasımız, ${mekan} çatısı altında zamanın yıpratıcı değişim rüzgarlarına güçlü bir kalkan olmaktadır.`,
      `Şehrin hafızası, işte bu köklü çınarın gölgesinde okunan her kitap veya dinlenen her melodiyle yeniden yeşermeye devam ediyor.`,
      `Dijital hıza inat, dokunarak ve hissederek el üstünde tutulan bu hazine, gelecekteki nesillere bırakılmış en anlamlı mektuptur.`,
      `Bu entelektüel ve ruhsal sığınak, İstanbul'un betonlaşan çehresinde açan nadide bir sanat çiçeğidir.`,
      `Hatıraları taze tutan bu adres, ziyaret eden herkesin içsel dünyasına çok zarif bir dokunuş bırakmayı başarıyor.`,
      `Somut olmayan mirasımızın en düşünsel boyutu, bu dükkanın kepenkleri açık kaldığı müddetçe korunacaktır.`
    ];
    return `${pick(introlar)} ${pick(gelismeler)} ${pick(sonuclar)}`;
  }

  // CATEGORY 3: Crafts & Makers
  if (cat.includes('terzi') || cat.includes('kumaş') || cat.includes('dokuma') || cat.includes('giyim') || cat.includes('şapka') || cat.includes('kundura') || cat.includes('ayakkabı') || cat.includes('deri') || cat.includes('yorgancı') || cat.includes('tuhafiye') || cat.includes('çanta') || cat.includes('demir') || cat.includes('bakır') || cat.includes('kalay') || cat.includes('marangoz') || cat.includes('ahşap') || cat.includes('mobilya') || cat.includes('cam') || cat.includes('cilt') || cat.includes('zenaat') || cat.includes('saat') || cat.includes('çilingir') || cat.includes('soba')) {
    const introlar = [
      `Zanaatın ve ehil ellerin simgesi olan ${mekan}, ${yearText} usta-çırak geleneğinin ve emsalsiz bir sabrın kalesidir.`,
      `${yearText} el emeğinin en saf ve katıksız halini İstanbullulara sunan ${mekan}, alın terinin şehirdeki paha biçilmez adreslerinden biridir.`,
      `Metropolün mekanik gürültüsü içinde, ${yearText} ritmik ustalık seslerinin yankılandığı ${mekan}, şahsiyetli bir zanaat ocağıdır.`,
      `${mekan}, ${yearText} maharetli parmakların ustalıkla şekillendirdiği nadide eserlerin vücut bulduğu, emeğin başkentidir.`,
      `Her bir köşesinde tecrübenin kokusu duyulan ${mekan}, ${yearText} zanaatkar onurunun ve dürüstlüğünün vitrinidir.`,
      `${yearText} malzemenin ruha ve forma kavuştuğu yer olan ${mekan}, incelikli işçiliğiyle şehre büyük bir katma değer sağlar.`
    ];
    const gelismeler = [
      `Dükkânın raflarında, tezgâhlarında ve alet edevatında biriken yılların izleri, aslında zanaata adanmış onurlu bir ömrün en somut şahididir.`,
      `Fabrikasyon ve seri üretime inat, insan elinin sıcaklığını ve ruhunu her bir işe ilmek ilmek işleyen nadide bir sığınaktır.`,
      `Her bir köşesi alın teriyle ve anılarla dolu olan bu dükkanda, mesleğin getirdiği derin tecrübe adeta yaşayan bir sanat formuna dönüşür.`,
      `O ufacık atölyeden çıkan her parça, sadece bir eşya değil; ustanın ömründen kopardığı zamanla yoğrulmuş hikayeli bir şaheserdir.`,
      `El becerisinin, ahlaki kuralların ve sabrın bir araya geldiği bu kutsal mekân, yeni nesil zanaatkarlar için de bir okul niteliğindedir.`,
      `Çıraklıktan ustalığa uzanan uzun yolculuğun tüm çileli ama gururlu evreleri, duvarlara sinmiş usta öğütlerinde yankılanır.`
    ];
    const sonuclar = [
      `Bu kıymetli zanaat noktası, değişen üretim biçimlerine inat direnerek İstanbul'un emeğe dayalı hafızasını kudretle ayakta tutmaktadır.`,
      `Kültürel mirasımızın altın bileziği olan paha biçilmez üretim öğretileri, işte bu dükkanın sınırları içinde yarınların ustalarına aktarılıyor.`,
      `Tek tipleşen şehirleşmeye rağmen estetik direnişini sürdüren ${mekan}, şehrin ruhunu bir zanaatkar titizliğiyle nakış gibi işliyor.`,
      `Mahir ellerin ortaya çıkardığı güzellikler var oldukça, bu şehrin kadim zanaat mirası asla unutulmayacaktır.`,
      `Maddi ve manevi emeğin böylesine iç içe geçtiği bu kıymetli adresler, bizi biz yapan en temel insani değerlerimizdir.`,
      `İstanbul, alın terini ve geleneği böylesine onurlandıran bu ulu çınarlarla gerçek kimliğini muhafaza ediyor.`
    ];
    return `${pick(introlar)} ${pick(gelismeler)} ${pick(sonuclar)}`;
  }

  // CATEGORY 4: General / Fallback
  const introlarFallback = [
    `${mekan}, ${yearText} İstanbullulara sunduğu değişmez hizmetle, semtin ve şehrin ortak belleğinde çok önemli bir yer edinmiştir.`,
    `${yearText} aynı sokakta, aynı güler yüzlü tevazu ile kapılarını açan ${mekan}, şehrin yaşanmışlıklarla dolu uzun hikayesinin son derece ferah bir parçasıdır.`,
    `Günden güne çehresi daha da hızlanarak değişen dev şehirde ${mekan}, ${yearText} köklerine bağlı kalarak dimdik ayakta duran nadide sivil duraklardan biridir.`,
    `Geleneksel ahlakı ve nezaketi benimseyen ${mekan}, ${yearText} şehrin sosyal dokusunda çok sağlam bir düğüm olmuştur.`,
    `${yearText} kapısından giren herkesi bir müşteri değil, ev sahibi gibi hissettiren ${mekan}, İstanbullu olmanın hakkını vermektedir.`,
    `Bir dükkandan öte bir aidiyet merkezi olan ${mekan}, ${yearText} hatıralarla dolu geçmişini bugüne taşıyan değerli bir kurumdur.`
  ];
  const gelismelerFallback = [
    `Kapısından içeri adım attığınız anda sizi saran o eski İstanbul havası, ahiliğin ve esnaflık adabının hala sarsılmaz biçimde yaşadığını derinden hissettirir.`,
    `Sadece bir işletme olmanın ötesinde komşuluk ilişkilerinin, güvenin ve güler yüzün eksik olmadığı çok samimi bir sosyal buluşma noktası olma özelliğini korur.`,
    `Dükkanın her bir köşesinde yılların yıpratıcı yorgunluğu değil, aksine değişen zamana inat şahsiyetini ve kimliğini koruyabilmiş olmanın haklı gururu sezilir.`,
    `Burada esnaflık, para kazanmanın ötesine geçerek insana ve çevreye sevgiyle dokunan, dayanışmayı yücelten soylu bir prensibe dönüşür.`,
    `Eskilerin 'önce hal hatır' dediği o ince medeniyet tasavvuru, bu işletmenin ahşap duvarlarında ve sıcak bakışlarında hala canlıdır.`,
    `Mekânın yıllara göğüs geren duruşu, modern yalnızlaşmaya karşı kurulan o sıcacık mahalle bağlarının da en somut kanıtı gibidir.`
  ];
  const sonuclarFallback = [
    `Mahalle geleneğinin en güzel örneklerinden olan bu değerli mekan, somut olmayan eşsiz kültürel mirasımızın mutlaka korunması gereken kalelerindendir.`,
    `Yeni nesillere eski pazar yerlerinin samimi sıcaklığını ve ticaretin dürüstlüğünü anlatan ${mekan}, geleceğe bırakılacak en kıymetli hazinelerden biridir.`,
    `Şehrin gürültüsü içinde çoğumuzun unuttuğu o "tanıdık esnaf" sıcaklığı, işte tam olarak burada, bu ahşap pervazın ardında yaşamaya inatla devam ediyor.`,
    `Bizi millet yapan sağlam köklerin böylesine ufak ama güçlü dükkanlarda yaşadığını görmek, İstanbul’a dair umutlarımızı taze tutuyor.`,
    `Zamansız tecrübelerin durağı olan bu yapı, İstanbul kültür tarihinin altın sayfalarında daima saygıyla anılacaktır.`,
    `İstanbullu olma şuurunu her sabah dükkanını açarken yeniden yeşerten bu koca değer, esnaflık geleneğimizin onur abidesidir.`
  ];

  return `${pick(introlarFallback)} ${pick(gelismelerFallback)} ${pick(sonuclarFallback)}`;
}

export function ArtisanCard({ artisan, isActive, onFocus, isFavorite, onToggleFavorite }: ArtisanCardProps) {
  const youtubeUrl = useMemo(() => getYoutubeEmbedUrl(artisan.video), [artisan.video]);
  const storyNarrative = useMemo(() => generateNostalgicStory(artisan), [artisan]);

  // Handle card click to focus and trigger map panning
  const handleClick = () => {
    onFocus(artisan.no);
  };

  const experienceYears = artisan.yil && !isNaN(Number(artisan.yil)) 
    ? Math.max(0, 2026 - Number(artisan.yil)) 
    : 0;
  
  // Cap at 100 for visual percentage display
  const experiencePercentage = Math.min(100, Math.max(0, experienceYears));

  const displayImage = getFallbackImage(artisan);

  return (
    <article
      id={`artisan-card-${artisan.no}`}
      data-id={artisan.no}
      onClick={handleClick}
      className={`artisan-card-scroll px-6 pb-6 pt-16 mt-12 rounded-xl border transition-all duration-500 cursor-pointer text-left relative group ${
        isActive
          ? 'bg-root border-accent shadow-xl shadow-accent/10 scale-[1.01]'
          : 'bg-surface border-border hover:border-border-strong hover:bg-surface-hover hover:scale-[1.005]'
      }`}
    >
      {/* Avatar Overlay at the top center */}
      <img
        src={displayImage}
        alt={artisan.mekan}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-root shadow-lg object-cover z-20 group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Decorative award crest in the background (wrapped by overflow-hidden to clip cleanly) */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0">
        <div className={`absolute -right-6 -bottom-6 transition-all duration-700 ${
          isActive ? 'text-accent-soft scale-110 rotate-12' : 'text-accent-soft/30 group-hover:text-accent-soft'
        }`}>
          <Award className="w-32 h-32" />
        </div>
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
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(artisan.no);
                }}
                className="group/fav p-1 hover:bg-surface rounded-full transition-colors flex items-center justify-center"
                aria-label="Favorilere Ekle"
              >
                <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-content-muted group-hover/fav:text-rose-400 group-hover/fav:scale-110'}`} />
              </button>
            </div>
          </div>

          {/* Elegant serif italic styling for names */}
          <h3 className="font-serif text-2xl font-bold italic text-content group-hover:text-accent transition-colors mb-4 leading-tight">
            {artisan.mekan}
          </h3>

          {/* Description narrative paragraph with experience gauge */}
          <div className="relative pl-[4rem] min-h-[140px] mb-4 flex items-center">
            {/* Gauge Sub-system */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col py-1">
              <div className="relative flex-1 w-full">
                {/* Scale Numbers */}
                <div className="absolute left-0 top-0 bottom-0 right-5 flex flex-col justify-between items-end">
                  <span className="text-[8px] font-mono font-bold text-accent leading-none -mt-1">100+</span>
                  <span className="text-[8px] font-mono font-medium text-content-muted leading-none">75</span>
                  <span className="text-[8px] font-mono font-medium text-content-muted leading-none">50</span>
                  <span className="text-[8px] font-mono font-medium text-content-muted leading-none">25</span>
                  <span className="text-[8px] font-mono font-medium text-content-muted leading-none translate-y-1">0</span>
                </div>
                
                {/* Bar / Track */}
                <div className="absolute right-1 top-0 bottom-0 w-3 bg-surface border border-border-strong rounded-full overflow-hidden shadow-inner isolate">
                  <motion.div 
                    className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-accent to-accent-hover w-full rounded-full origin-bottom"
                    initial={{ height: "0%" }}
                    whileInView={{ height: `${experiencePercentage}%` }}
                    viewport={{ once: false, margin: "-10px" }}
                    transition={{ type: "spring", bounce: 0.35, duration: 1.8 }} 
                  >
                    {/* Subtle shine on the liquid fill to make it look full */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-white/40 rounded-full" />
                    <div className="absolute inset-y-0 right-0 w-[2px] bg-white/20" />
                  </motion.div>
                </div>
              </div>

              {/* Tecrübe Text */}
              <div className="mt-2 flex flex-col items-center justify-center text-center">
                <span className="text-[6.5px] font-mono font-bold text-content-muted tracking-widest uppercase">Tecrübe</span>
                <span className="text-[8.5px] font-mono font-bold text-accent">{experienceYears > 0 ? `${experienceYears} Yıl` : '-'}</span>
              </div>
            </div>

            <p className="text-content-sec text-[13.5px] leading-relaxed font-serif py-2">
              {storyNarrative}
            </p>
          </div>

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
        <div className="space-y-4 mt-4" onClick={(e) => e.stopPropagation()}>
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
