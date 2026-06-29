export interface InvitationTheme {
  id: string;
  name: string;
  style: string;
  coverImage: string;
  description: string;
}

export const invitationThemes: InvitationTheme[] = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    style: 'Elegant & Timeless',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
    description: 'Sentuhan warna emas klasik dengan tipografi serif yang anggun.'
  },
  {
    id: 'brutalist-bold',
    name: 'Brutalist Bold',
    style: 'Edgy & Modern',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    description: 'Desain asimetris, tipografi brutal, dan warna kontras tinggi.'
  },
  {
    id: 'minimalist-sage',
    name: 'Minimalist Sage',
    style: 'Clean & Natural',
    coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400',
    description: 'Estetika minimalis dengan warna hijau sage yang lembut.'
  },
  {
    id: 'dark-romance',
    name: 'Dark Romance',
    style: 'Mysterious & Elegant',
    coverImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400',
    description: 'Tema gelap dengan sentuhan warna mawar merah.'
  }
];
