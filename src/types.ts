export type ThemeId = 'emerald' | 'matrix' | 'kawaii' | 'cyberneon';

export interface Skin {
  id: ThemeId;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  borderColors: string;
  glowClass: string;
  textGlow: string;
  badge: string;
  description: string;
}

export interface PodcastHost {
  id: 'iskra' | 'echo';
  name: string;
  title: string;
  emoji: string;
  color: string;
  accentColor: string;
  trait: string;
  description: string;
  ambientFreq: number; // Hz for WebAudio synthesizer
  synthType: OscillatorType;
  audioDuration: string;
  transcripts: {
    timestamp: string;
    text: string;
  }[];
}

export interface CryptoAddress {
  network: string;
  symbol: string;
  address: string;
  color: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  desc: string;
  stlName: string;
  cost: string;
  status: 'Ready for 3D Print' | 'Premium Stainless' | 'Premium Titanium';
  meshStructure: string; // Describes geometric details for drawing/animating
}
