export const categoryColorMap: Record<string, string> = {
  'Kadim Zanaat': 'bg-blue-400',
  'Kadim Zanaatlar': 'bg-blue-400',
  'Asırlık Çınar': 'bg-green-500',
  'Asırlık Çınarlar': 'bg-green-500',
  'Geleneksel Lezzet': 'bg-yellow-400',
  'Geleneksel Lezzetler': 'bg-yellow-400',
  'Hafıza Mekan': 'bg-purple-500',
  'Hafıza Mekanları': 'bg-purple-500',
  'Gıda': 'bg-rose-500',
  'Yeme & İçme': 'bg-rose-500',
  'Tatlı': 'bg-orange-400',
  'Lokanta': 'bg-red-500',
  'Fırın': 'bg-amber-600',
  'Zanaat': 'bg-teal-500',
  'Zanaatkâr': 'bg-teal-500',
  'Terzi': 'bg-cyan-600',
  'Giyim': 'bg-indigo-500',
  'Müzik': 'bg-blue-500',
  'Sahaf': 'bg-purple-600',
  'Kitap': 'bg-purple-600',
  'Kırtasiye': 'bg-fuchsia-500',
  'Saat': 'bg-slate-700',
  'Antika': 'bg-stone-600',
  'Berber': 'bg-sky-500',
  'Demir': 'bg-gray-600',
  'Ahşap': 'bg-yellow-700',
  'Kozmetik': 'bg-pink-500',
};

const rainbowColors = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

export function getCategoryColor(category: string): string {
  if (!category) return 'bg-accent';
  
  // Try direct match
  for (const [key, color] of Object.entries(categoryColorMap)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }

  // Fallback to a deterministic color based on hash
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % rainbowColors.length;
  return rainbowColors[index];
}
