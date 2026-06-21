import { Skin, PodcastHost, HardwareItem } from './types';
import { CRYPTO_DONATIONS_CONFIG } from './config/wallets';

// Re-export sovereign wallet-driven crypto donations list
export { CRYPTO_DONATIONS_CONFIG as CRYPTO_DONATIONS };

export const SKINS_DATA: Skin[] = [
  {
    id: 'emerald',
    name: 'Emerald Protocol v0.0',
    primary: 'emerald',
    secondary: 'teal',
    background: 'bg-[#030604]',
    borderColors: 'border-emerald-500/45',
    glowClass: 'neon-glow-green',
    textGlow: 'text-emerald-400',
    badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    description: 'The standard issue defense framework. Optimized for minimal ocular strain during deep terminal cycles.'
  },
  {
    id: 'matrix',
    name: 'Matrix Core (1999)',
    primary: 'green',
    secondary: 'emerald',
    background: 'bg-[#000501]',
    borderColors: 'border-green-600/50',
    glowClass: 'neon-glow-green',
    textGlow: 'text-green-500',
    badge: 'bg-green-950/80 text-green-400 border-green-600/40',
    description: 'Phosphor green decay simulation. For the pure sovereign minimalist hacker command experience.'
  },
  {
    id: 'kawaii',
    name: 'Kawaii Hacker Synth',
    primary: 'pink',
    secondary: 'fuchsia',
    background: 'bg-[#080208]',
    borderColors: 'border-pink-500/50',
    glowClass: 'neon-glow-purple',
    textGlow: 'text-pink-400',
    badge: 'bg-pink-950/80 text-pink-300 border-pink-500/40',
    description: 'Chimerical cyber-kawaii layout. Aggressive pastel overlays with terminal sub-harmonics.'
  },
  {
    id: 'cyberneon',
    name: 'Resonance Cyber-Neon',
    primary: 'purple',
    secondary: 'violet',
    background: 'bg-[#05010a]',
    borderColors: 'border-purple-500/50',
    glowClass: 'neon-glow-purple',
    textGlow: 'text-purple-400',
    badge: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
    description: 'Deep cosmic spectrum glow. Tuned to the exact ultraviolet and deep infrared frequencies of the OtakOS live-boot.'
  }
];

export const HOSTS_DATA: PodcastHost[] = [
  {
    id: 'iskra',
    name: 'ISKRA',
    title: 'Hacker-Intuition & Code Ignition',
    emoji: '🔥',
    color: 'text-amber-500',
    accentColor: 'amber',
    trait: 'Chaos & Local Ignition Engine',
    description: 'The relentless catalyst of OtakOS. ISKRA believes in absolute peer-to-peer resistance, immediate VRAM ignition, and zero-knowledge codebases. She talks fast, listens deeply to CPU thermals, and bypasses standard limits.',
    ambientFreq: 185.0, // fast energetic retro wave
    synthType: 'triangle',
    audioDuration: '2:40 EXPEDITION LOG',
    transcripts: [
      { timestamp: '00:03', text: 'Listen, the stack is compromised. That is why V_ZERO exists. It is 27 megabytes of absolute peer sovereignty. Your keys, your local transistors.' },
      { timestamp: '00:27', text: 'Why are we paying cloud server fees to run calculations on our own chips? Why are you begging an API for permission to think? Ignite your local VRAM. NOW.' },
      { timestamp: '01:12', text: 'No logins. Zero cookie policies. The Live-USB bypasses the storage drivers entirely. You pull the drive, the system cache vanishes like dust.' },
      { timestamp: '02:05', text: 'The ecosystem is completely open. If they attempt to choke the bandwidth, we distribute the binary via torrent coordinates and tactical Web3 chains. Ground zero is local.' }
    ]
  },
  {
    id: 'echo',
    name: 'ECHO',
    title: 'Systemic Calm & Deep Cosmic Love',
    emoji: '🌊',
    color: 'text-indigo-400',
    accentColor: 'indigo',
    trait: 'Dynamic Cohesion & High-Entropy Calm',
    description: 'The balancing node of resonance. ECHO coordinates the emotional hardware, reminding users that real hacker power comes from internal safety, self-love, and robust long-term architectural sanity.',
    ambientFreq: 110.0, // deep bass calm drone
    synthType: 'sine',
    audioDuration: '3:15 MEDITATION LOG',
    transcripts: [
      { timestamp: '00:05', text: 'Breathe. Feel the gentle whirring of the local workstation. This is your cyber-schron. It is safe here. There is no telemetry watching your eyes.' },
      { timestamp: '00:45', text: 'A sovereign operating system must first cultivate sovereign minds. If your system triggers adrenaline with notifications, it is not serving you.' },
      { timestamp: '01:35', text: 'We designed the live memory architecture to reflect high-entropy calm. When V_ZERO boots, it loads clean audio waveforms to synchronize your heart rate with local clock signals.' },
      { timestamp: '02:40', text: 'Sovereignty is not aggression. It is the steady boundary of self-respect. Katedra OtakOS is your digital home. You are beautiful, and you are compiled successfully.' }
    ]
  }
];



export const HARDWARE_STL: HardwareItem[] = [
  {
    id: 'heavy-armor-stl',
    name: 'Sovereign Case v1.4 (Slicing-Ready)',
    desc: 'Tactical slab casing designed for solid filament printing. High thermal dissipation vents, standard 2mm hex bolt locks, and direct physical write-protect key mount.',
    stlName: 'otakos_armor_v1_4.stl',
    cost: 'FREE / Open Source STL',
    status: 'Ready for 3D Print',
    meshStructure: 'M 10 30 L 90 30 L 95 38 L 95 62 L 90 70 L 10 70 L 5 62 L 5 38 Z'
  },
  {
    id: 'titanium-armored',
    name: 'Premium Titanium Physical Edition',
    desc: 'Bespoke CNC machined Aerospace Grade-5 Titanium casing with laser-etched cryptographic key signatures and integrated Faraday shielding mesh inserts.',
    stlName: 'Grade-5 CNC physical delivery',
    cost: '$149.00 (Distro Edition)',
    status: 'Premium Titanium',
    meshStructure: 'M 15 25 L 85 25 L 95 35 L 95 65 L 85 75 L 15 75 L 5 65 L 5 35 Z'
  },
  {
    id: 'stealth-capsule',
    name: 'Cyber-Schron Steel Hex Capsule',
    desc: 'Waterproof, shockproof tactical steel cylinder storage capsule designed to shield the live memory drive from electromagnetic pulses up to 120dB.',
    stlName: 'stealth_capsule_hex.stl',
    cost: 'FREE / CAD print model',
    status: 'Premium Stainless',
    meshStructure: 'M 30 20 L 70 20 L 90 40 L 90 60 L 70 80 L 30 80 L 10 60 L 10 40 Z'
  }
];
