export interface WishCardContent {
  id: number;
  icon: 'heart' | 'star' | 'flower' | 'sparkle';
  frontText: string;
  backText: string;
}

export interface GalleryPhotoContent {
  id: number;
  imageUrl: string;
  caption: string;
  rotation: number; // angle in degrees for polaroid scatter
}

export const GREETINGS = {
  title: "Happy Birthday, Priya! 🎂",
  subtitle: "A special melody and message for you...",
  message: "To the one who fills my heart with endless joy and laughter, may your day be as beautiful, warm, and radiant as your smile. Here's a little memory lane and some wishes made just for you. Happy Birthday, my love!",
};

export const MUSIC_TRACK = {
  title: "Golden Hour (Acoustic)",
  artist: "Lofi Birthday Dedication",
  albumArtUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=400&fit=crop",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
};

export const GALLERY_PHOTOS: GalleryPhotoContent[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&h=600&fit=crop",
    caption: "For the beautiful moments we share 🌸",
    rotation: -4,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&h=600&fit=crop",
    caption: "To more sunsets together 🌅",
    rotation: 3,
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&h=600&fit=crop",
    caption: "You light up my entire world ✨",
    rotation: -2,
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&h=600&fit=crop",
    caption: "Cozy days and happy smiles 🧺",
    rotation: 5,
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1528826722805-8b18a9777739?q=80&w=600&h=600&fit=crop",
    caption: "Fields of lavender and endless laughs 💜",
    rotation: -3,
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1533782650771-a5905a9c403d?q=80&w=600&h=600&fit=crop",
    caption: "A very sweet day for a very sweet person 🍰",
    rotation: 2,
  },
];

export const WISH_CARDS: WishCardContent[] = [
  {
    id: 1,
    icon: 'heart',
    frontText: "Tap to reveal a wish",
    backText: "I wish for your days to be filled with the same laughter, warmth, and joy you bring into my life every day. ❤️",
  },
  {
    id: 2,
    icon: 'star',
    frontText: "Tap to reveal a wish",
    backText: "I wish that every dream in your beautiful heart finds its path to coming true this year. 🌟",
  },
  {
    id: 3,
    icon: 'flower',
    frontText: "Tap to reveal a wish",
    backText: "I wish for us to share endless more birthdays, hand-in-hand, creating sweet memories together. 🌸",
  },
  {
    id: 4,
    icon: 'sparkle',
    frontText: "Tap to reveal a wish",
    backText: "I wish that you always see yourself through my eyes—as the most wonderful and beloved person. ✨",
  },
];

export const LETTER_CONTENT = {
  heading: "Dearest Priya,",
  paragraphs: [
    "Happy Birthday! Today is a celebration of the day the world became a brighter, more beautiful place because you were born. I wanted to create something special, just for you, to remind you of how much you mean to me.",
    "From the quiet moments we share to the big adventures, every second with you is a gift. Your kindness, your laugh, and your beautiful spirit inspire me every single day. You make my world feel warm and complete, and I am so incredibly grateful to have you in my life.",
    "I hope this little surprise brings a smile to your face, just like you always do for me. May this year ahead be filled with all the love, peace, and happiness you so deeply deserve."
  ],
  closing: "With all my love,",
  sender: "Anmol ❤️",
};
