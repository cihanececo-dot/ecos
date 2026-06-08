import { Esnaf } from './types';

const fallbackImages = {
  food: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
    "https://images.unsplash.com/photo-1621285250485-b9f1d06e2ea9?w=400&q=80",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=80"
  ],
  music: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    "https://images.unsplash.com/photo-1485038101637-2d4833df1b35?w=400&q=80",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80",
    "https://images.unsplash.com/photo-1605612505504-2ee6bf3b908e?w=400&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
  ],
  crafts: [
    "https://images.unsplash.com/photo-1542154188-7e3e9d8e5f21?w=400&q=80",
    "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400&q=80",
    "https://images.unsplash.com/photo-1534947990595-c192276587c1?w=400&q=80",
    "https://images.unsplash.com/photo-1587823528751-2ea5642a8b94?w=400&q=80",
    "https://images.unsplash.com/photo-1605333190892-a16972cb7bca?w=400&q=80",
    "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&q=80"
  ],
  books: [
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?w=400&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1533090360078-4c6ec41aeb6c?w=400&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
    "https://images.unsplash.com/photo-1521714161819-15534968fc5f?w=400&q=80",
    "https://images.unsplash.com/photo-1444458319343-6c6b3bb5fbc2?w=400&q=80",
    "https://images.unsplash.com/photo-1549488344-c6b75f50ea72?w=400&q=80"
  ]
};

export function getFallbackImage(artisan: Esnaf): string {
  if (artisan.gorsel) return artisan.gorsel;

  const cat = (artisan.kategori || '').toLowerCase();
  let categoryImages = fallbackImages.general;

  if (cat.includes('tatlı') || cat.includes('şeker') || cat.includes('lokum') || cat.includes('lezzet') || cat.includes('fırın') || cat.includes('pasta') || cat.includes('helva') || cat.includes('boza') || cat.includes('turşu') || cat.includes('kebap') || cat.includes('köfte') || cat.includes('balık') || cat.includes('lokanta') || cat.includes('gıda') || cat.includes('pastane') || cat.includes('kuruyemiş')) {
    categoryImages = fallbackImages.food;
  } else if (cat.includes('müzik') || cat.includes('plak') || cat.includes('saz') || cat.includes('enstrüman')) {
    categoryImages = fallbackImages.music;
  } else if (cat.includes('kitap') || cat.includes('sahaf') || cat.includes('matbaa') || cat.includes('kırtasiye') || cat.includes('fotograf') || cat.includes('fotoğraf')) {
    categoryImages = fallbackImages.books;
  } else if (cat.includes('terzi') || cat.includes('kumaş') || cat.includes('dokuma') || cat.includes('giyim') || cat.includes('şapka') || cat.includes('kundura') || cat.includes('ayakkabı') || cat.includes('deri') || cat.includes('yorgancı') || cat.includes('tuhafiye') || cat.includes('çanta') || cat.includes('demir') || cat.includes('bakır') || cat.includes('kalay') || cat.includes('marangoz') || cat.includes('ahşap') || cat.includes('mobilya') || cat.includes('cam') || cat.includes('cilt') || cat.includes('zenaat') || cat.includes('saat') || cat.includes('çilingir') || cat.includes('soba')) {
    categoryImages = fallbackImages.crafts;
  }

  // Use a simple hash of the artisan no / name to consistently pick a random image
  const seedStr = artisan.no || artisan.mekan || "default";
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) { h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0; }
  h = Math.imul(h ^ (h >>> 15), 1 | h);
  h = h ^ (h + Math.imul(h ^ (h >>> 7), 61 | h));
  const rand = ((h ^ (h >>> 14)) >>> 0) / 4294967296;

  return categoryImages[Math.floor(rand * categoryImages.length)];
}
