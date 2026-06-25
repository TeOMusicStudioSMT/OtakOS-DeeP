/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Download, 
  Sparkles, 
  Radio, 
  Heart, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCw, 
  Compass, 
  ExternalLink, 
  ShoppingBag, 
  Music, 
  Coins, 
  Hammer, 
  Palette, 
  FileText, 
  Flame, 
  Waves, 
  AlertCircle, 
  Wrench, 
  Printer, 
  Skull,
  Play,
  Square,
  BadgeAlert,
  QrCode
} from 'lucide-react';
import { SKINS_DATA, HOSTS_DATA, CRYPTO_DONATIONS, HARDWARE_STL } from './data';
import { ThemeId, Skin, PodcastHost, CryptoAddress, HardwareItem } from './types';
import { translations } from './translations';
import { IdentityService, NodeIdentity } from './services/IdentityService';
import NeuralMap from './components/NeuralMap';
import NodeSphere from './components/NodeSphere';
import UpdatesSection from './components/UpdatesSection';
import ArchitectWord from './components/ArchitectWord';
import AetherArena from './components/AetherArena';
import { FIAT_DONATIONS_CONFIG } from './config/wallets';

// Web Audio synthesizer for real-time retro tactile audio signals
class TermSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Lazy initialization on user interaction
  }

  toggle(state: boolean) {
    this.enabled = state;
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  beep(freq: number = 880, type: OscillatorType = 'sine', duration: number = 0.08, gainVal: number = 0.08) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      if (type === 'triangle') {
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);
      } else if (type === 'sawtooth') {
        osc.frequency.exponentialRampToValueAtTime(freq * 2.0, this.ctx.currentTime + duration);
      }

      gainNode.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignored for environments restricting sound context
    }
  }

  chord(freqs: number[], type: OscillatorType = 'sine', duration: number = 0.15) {
    if (!this.enabled) return;
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        this.beep(f, type, duration, 0.04);
      }, idx * 60);
    });
  }

  playDrone(hostId: 'iskra' | 'echo', stopCallback: () => void): { oscs: OscillatorNode[], gains: GainNode[], stop: () => void } | null {
    if (!this.enabled) return null;
    try {
      this.initCtx();
      if (!this.ctx) return null;

      const baseFreq = hostId === 'iskra' ? 140 : 85;
      const oscillators: OscillatorNode[] = [];
      const gainNodes: GainNode[] = [];
      
      const harmonics = hostId === 'iskra' ? [1, 1.5, 2] : [1, 2, 3];
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);

      harmonics.forEach((hMultiplier, index) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        o.type = hostId === 'iskra' ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(baseFreq * hMultiplier, this.ctx.currentTime);
        
        // Add subtle vibrato (LFO)
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = hostId === 'iskra' ? 6 : 3.5;
        lfoGain.gain.value = 2; // Hz depth
        lfo.connect(lfoGain);
        lfoGain.connect(o.frequency);
        lfo.start();

        g.gain.setValueAtTime(0.1 / (index + 1), this.ctx.currentTime);
        o.connect(g);
        g.connect(masterGain);
        
        o.start();
        
        oscillators.push(o);
        gainNodes.push(g);
      });

      const stop = () => {
        if (this.ctx) {
          masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            oscillators.forEach(o => {
              try { o.stop(); } catch (e) {}
            });
            stopCallback();
          }, 600);
        }
      };

      return { oscs: oscillators, gains: gainNodes, stop };
    } catch (e) {
      return null;
    }
  }
}

const synth = new TermSynth();

export default function App() {
  // Theme state representing sovereign screen protocol
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>('emerald');
  const activeSkin = useMemo(() => {
    return SKINS_DATA.find(s => s.id === activeThemeId) || SKINS_DATA[0];
  }, [activeThemeId]);

  // Audio mute/unmute
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Tab state for monetisation options
  const [activeTab, setActiveTab] = useState<'crypto' | 'hardware' | 'skins' | 'audio'>('crypto');

  // Clipboard notify and CAD toast states
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [cadNotification, setCadNotification] = useState<string | null>(null);

  // QR Code modal state
  const [selectedCryptoForQr, setSelectedCryptoForQr] = useState<CryptoAddress | null>(null);

  // CLI Command box copied state
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  // Language state representing 'pl' (Polish) or 'en' (English)
  const [lang, setLang] = useState<'pl' | 'en'>(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en';
    }
    return 'en';
  });

  const t = useMemo(() => translations[lang], [lang]);

  // Global VRAM counters and sliders
  const [globalVramCount, setGlobalVramCount] = useState<number>(18342948.33);
  const [sphereOpen, setSphereOpen] = useState<boolean>(false);
  const [userVramSlider, setUserVramSlider] = useState<number>(16); // default 16GB
  const [userVramContributed, setUserVramContributed] = useState<boolean>(false);

  // Dynamic localized VRAM status message
  const vramStatusMsg = useMemo(() => {
    if (userVramContributed) {
      return t.vramWidget.statusInjected.replace('{0}', userVramSlider.toString());
    }
    return t.vramWidget.statusDefault;
  }, [userVramContributed, userVramSlider, t]);

  // Download simulation variables
  const [showInstaller, setShowInstaller] = useState<boolean>(false);
  const [installProgress, setInstallProgress] = useState<number>(0);
  const [installLog, setInstallLog] = useState<string[]>([]);
  const [installerStatus, setInstallerStatus] = useState<'idle' | 'extracting' | 'optimizing' | 'completed'>('idle');

  // Co-hosts dynamic resonance logs states
  const [playingLogHost, setPlayingLogHost] = useState<'iskra' | 'echo' | null>(null);
  const [hostLogTimestamp, setHostLogTimestamp] = useState<number>(0);
  const [hostLogIndex, setHostLogIndex] = useState<number>(0);
  const activeDroneRef = useRef<{ stop: () => void } | null>(null);

  // Real-time metadata values for command terminal appearance
  const [localTimeStr, setLocalTimeStr] = useState<string>('');
  const [systemEntropy, setSystemEntropy] = useState<number>(0.0031);
  const [vramIgnited, setVramIgnited] = useState<boolean>(true);
  const [activePeers, setActivePeers] = useState<number>(1024);
  const [identity, setIdentity] = useState<NodeIdentity | null>(null);
  const [copiedIdentity, setCopiedIdentity] = useState<boolean>(false);
  const [grvBalance, setGrvBalance] = useState<string>('0.00');

  // 3D Custom hardware designer model state sliders
  const [hardwareId, setHardwareId] = useState<string>('heavy-armor-stl');
  const [stlDeform, setStlDeform] = useState<number>(20);
  const [stlWidth, setStlWidth] = useState<number>(44);
  const [stlScaling, setStlScaling] = useState<number>(1);
  const [stlPerspective, setStlPerspective] = useState<number>(12);

  const selectedHardware = useMemo(() => {
    return HARDWARE_STL.find(h => h.id === hardwareId) || HARDWARE_STL[0];
  }, [hardwareId]);

  // Handle local time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Soft fluctuate entropy and peers
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemEntropy(prev => {
        const delta = (Math.random() - 0.5) * 0.0004;
        return parseFloat(Math.max(0.0010, Math.min(0.0089, prev + delta)).toFixed(4));
      });
      setActivePeers(prev => {
        const delta = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(980, prev + delta);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Soft increment the global VRAM cluster count
  useEffect(() => {
    const vramInt = setInterval(() => {
      setGlobalVramCount(prev => {
        const delta = Math.random() * 2.14 + 0.12;
        return parseFloat((prev + delta).toFixed(2));
      });
    }, 1500);
    return () => clearInterval(vramInt);
  }, []);

  // Fetch sovereign node identity from backend or localStorage
  useEffect(() => {
    let active = true;
    const loadIdentity = async () => {
      try {
        const idData = await IdentityService.fetchIdentity();
        if (active) {
          setIdentity(idData);
        }
      } catch (err) {
        console.error('Error fetching node identity:', err);
      }
    };
    loadIdentity();
    return () => {
      active = false;
    };
  }, []);

  const handleCopyNodeAddress = () => {
    if (!identity) return;
    navigator.clipboard.writeText(identity.address);
    setCopiedIdentity(true);
    synth.beep(880, 'sine', 0.1, 0.05);
    setTimeout(() => setCopiedIdentity(false), 2000);
  };

  // Update sound controller integration
  useEffect(() => {
    synth.toggle(audioEnabled);
  }, [audioEnabled]);

  // Audio co-host log controller effect
  useEffect(() => {
    let timer: any;
    if (playingLogHost) {
      timer = setInterval(() => {
        setHostLogTimestamp(prev => {
          const nextVal = prev + 1;
          const matchedHost = HOSTS_DATA.find(h => h.id === playingLogHost);
          if (matchedHost) {
            // cycle through simulated audio quotes
            const totalDuration = playingLogHost === 'iskra' ? 40 : 50;
            if (nextVal >= totalDuration) {
              stopAudiolog();
              return 0;
            }
            // estimate log quote index
            const percentage = nextVal / totalDuration;
            const quoteIdx = Math.floor(percentage * matchedHost.transcripts.length);
            setHostLogIndex(Math.min(matchedHost.transcripts.length - 1, quoteIdx));
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [playingLogHost]);

  // Trigger a tactful sound on tab changes
  const switchTab = (tab: 'crypto' | 'hardware' | 'skins' | 'audio') => {
    setActiveTab(tab);
    if (tab === 'crypto') {
      synth.beep(880, 'sine', 0.06);
    } else if (tab === 'hardware') {
      synth.beep(980, 'sine', 0.06);
    } else if (tab === 'skins') {
      synth.beep(1100, 'sine', 0.06);
    } else {
      synth.beep(1200, 'sine', 0.06);
    }
  };

  // Switch skin action
  const selectSkinId = (id: ThemeId) => {
    setActiveThemeId(id);
    synth.chord([523.25, 659.25, 783.99], 'triangle', 0.12);
  };

  // Copy Web3 donation address safely
  const copyAddressToClipboard = (address: string, label: string) => {
    navigator.clipboard.writeText(address);
    setCopiedText(label);
    synth.beep(1760, 'sine', 0.15);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Copy mock CLI curl parameter
  const copyCliCommand = () => {
    navigator.clipboard.writeText('curl -fsSL https://otakos.wtf/v_zero.sh | bash');
    setCopiedCmd(true);
    synth.beep(1600, 'sine', 0.1);
    setTimeout(() => {
      setCopiedCmd(false);
    }, 2000);
  };

  // Spark User VRAM contribution
  const igniteVramContribution = () => {
    if (userVramContributed) {
      synth.beep(330, 'triangle', 0.12, 0.05);
      return;
    }
    setUserVramContributed(true);
    setGlobalVramCount(prev => prev + userVramSlider);
    synth.chord([440, 554.37, 659.25, 880], 'sawtooth', 0.22);
  };

  // Start co-host voice log simulation
  const playAudiolog = (hostId: 'iskra' | 'echo') => {
    if (playingLogHost === hostId) {
      stopAudiolog();
      return;
    }
    
    // Stop any current running drone
    stopAudiolog();
    
    setPlayingLogHost(hostId);
    setHostLogTimestamp(0);
    setHostLogIndex(0);
    
    synth.beep(660, 'sine', 0.1, 0.05);

    // Trigger high fidelity synthesizer drone sound for custom hosts!
    const drone = synth.playDrone(hostId, () => {
      setPlayingLogHost(null);
    });

    if (drone) {
      activeDroneRef.current = drone;
    }
  };

  const stopAudiolog = () => {
    if (activeDroneRef.current) {
      activeDroneRef.current.stop();
      activeDroneRef.current = null;
    }
    setPlayingLogHost(null);
    synth.beep(440, 'triangle', 0.08, 0.03);
  };

  // Download simulation trigger sequence
  const startBootstrappedZipDownload = () => {
    setShowInstaller(true);
    setInstallProgress(0);
    setInstallerStatus('extracting');
    setInstallLog(lang === 'pl' ? [
      'ROZPOCZĘCIE: Łączenie Suwerennego Tunelu z lokalnym jądrem VRAM...',
      `WĘZEŁ: Autoryzacja potwierdzona bezpiecznie na węźle lokalnym [${localTimeStr}]`,
      'V_ZERO: Przygotowywanie skompresowanego kontenera jądra bootowania 27.2MB...',
      'SYSTEM: Wyłączanie przesyłania pakietów analitycznych (0 telemetrii)',
    ] : [
      'INIT: Connecting Sovereign Tunnel to local VRAM kernel...',
      `NODE: Auth verified securely on node local-addr [${localTimeStr}]`,
      'V_ZERO: Preparing compressed 27.2MB boot kernel container...',
      'SYSTEM: Disabling analytics payload wrappers (0 telemetry)',
    ]);
    synth.beep(220, 'sawtooth', 0.25, 0.04);
  };

  // Simulate download execution timeline
  useEffect(() => {
    if (!showInstaller || installerStatus === 'idle') return;

    let stepTimer: any;
    const logs = lang === 'pl' ? [
      'X-ARCH: Standardowy lokalny loader x86_64 pomyślnie namierzony',
      'SYS: Wprowadzanie parametrów bloku sterownika lokalnej pamięci flash',
      'UNPACK: Montowanie obrazu /otakos_core.squashfs [18.2 MB]',
      'UNPACK: Rozszerzanie konfiguracji systemowych /etc/reso_kernel.conf',
      'ENV: Ustanawianie niezależnych sterowników kryptografii offline',
      'DOCKER: Zweryfikowano 0 połączeń zewnętrznych. Rdzeń działa w piaskownicy',
      'STL: Pakowanie schematu obudowy strukturalnej lokalnego USB (STL-V1.4)',
      'SYNC: Sygnatury systemowe OtakOS zweryfikowane [SHA256: 0xf92a3bb1a]',
      'SUKCES: Integralność kompresji zweryfikowana w 100%. Suwerenny rdzeń gotowy.',
    ] : [
      'X-ARCH: Standard x86_64 local-live loader targeted successfully',
      'SYS: Inoculating local flash driver block parameters',
      'UNPACK: Mount image /otakos_core.squashfs [18.2 MB]',
      'UNPACK: Expanding system configurations /etc/reso_kernel.conf',
      'ENV: Establishing independent offline cryptography drivers',
      'DOCKER: Zero external connections verified. Core running standard sandbox',
      'STL: Packing local USB structural casing blueprint (STL-V1.4)',
      'SYNC: OtakOS system signatures validated [SHA256: 0xf92a3bb1a]',
      'SUCCESS: Compression integrity 100% verified. Sovereign core ready.',
    ];

    if (installProgress < 100) {
      stepTimer = setTimeout(() => {
        setInstallProgress(prev => {
          const add = Math.floor(Math.random() * 15) + 3;
          const next = Math.min(100, prev + add);
          
          // periodic sound & logs while downloading
          if (next % 4 === 0) {
            synth.beep(400 + next * 4, 'sine', 0.03, 0.03);
          }
          
          if (next >= 50 && installerStatus === 'extracting') {
            setInstallerStatus('optimizing');
          }

          if (next >= 100) {
            setInstallerStatus('completed');
            synth.chord([523.25, 659.25, 783.99, 1046.5], 'sine', 0.25);
            // push final log messages
            setInstallLog(prevLogs => [...prevLogs, lang === 'pl' ? 'PEŁNA INSTALACJA! V_ZERO pobrany pomyślnie.' : 'BOOTSTRAP completo! V_ZERO downloaded successfully.']);
          }

          // add random real system log lines
          if (Math.random() > 0.5 && logs.length > 0) {
            const index = Math.floor(Math.random() * logs.length);
            setInstallLog(prevLogs => {
              if (prevLogs.includes(logs[index])) return prevLogs;
              return [...prevLogs, logs[index]];
            });
          }

          return next;
        });
      }, 250);
    }

    return () => clearTimeout(stepTimer);
  }, [showInstaller, installProgress, installerStatus, lang]);

  // Generate the real text parameters payload for user after simulation finishes
  const triggerActualDownloadBlob = async () => {
    synth.beep(1200, 'sine', 0.1);
    const ZIP = '/V_ZERO_archive.zip';
    // Źródło awaryjne: zip jest w repo OtakOS-DeeP (public/) — zawsze dostępny.
    const RAW = 'https://raw.githubusercontent.com/TeOMusicStudioSMT/OtakOS-DeeP/main/public/V_ZERO_archive.zip';
    try {
      // fetch+blob: realny błąd zamiast mylnego "brak internetu"; omija SPA-rewrite.
      const res = await fetch(ZIP, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('text/html')) throw new Error('host zwrocil HTML (rewrite) zamiast pliku');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'V_ZERO_archive.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e: any) {
      setInstallLog(prev => [...prev, lang === 'pl'
        ? `⚠ Host nie podał pliku (${e.message}) — otwieram źródło z GitHub (zapisz plik)...`
        : `⚠ Host failed to serve file (${e.message}) — opening GitHub source (save the file)...`]);
      window.open(RAW, '_blank');
    }
  };

  // Close simulation window
  const closeInstallerWin = () => {
    setShowInstaller(false);
    synth.beep(330, 'sine', 0.06);
  };

  // Generate a beautiful, deterministic QR code based on the address character sequence
  const renderProceduralQrSvg = (cryptoAddress: string) => {
    let hash = 0;
    for (let i = 0; i < cryptoAddress.length; i++) {
      hash = cryptoAddress.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const size = 19; // 19x19 clean grid
    const cells: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Finder patterns at the corners
    // Top-Left corner finder
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const isBorder = r === 0 || r === 5 || c === 0 || c === 5;
        const isCenter = r >= 2 && r <= 3 && c >= 2 && c <= 3;
        cells[r][c] = isBorder || isCenter;
      }
    }
    
    // Top-Right corner finder
    for (let r = 0; r < 6; r++) {
      for (let c = size - 6; c < size; c++) {
        const isBorder = r === 0 || r === 5 || c === size - 6 || c === size - 1;
        const isCenter = r >= 2 && r <= 3 && c >= size - 4 && c <= size - 3;
        cells[r][c] = isBorder || isCenter;
      }
    }
    
    // Bottom-Left corner finder
    for (let r = size - 6; r < size; r++) {
      for (let c = 0; c < 6; c++) {
        const isBorder = r === size - 6 || r === size - 1 || c === 0 || c === 5;
        const isCenter = r >= size - 4 && r <= size - 3 && c >= 2 && c <= 3;
        cells[r][c] = isBorder || isCenter;
      }
    }
    
    // Procedural pseudo-random matrix cells using hash
    let cellIndex = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip corner finder patterns
        if (r < 7 && c < 7) continue;
        if (r < 7 && c >= size - 7) continue;
        if (r >= size - 7 && c < 7) continue;
        
        const noise = Math.abs(Math.sin(hash + cellIndex++ * 1.7 + r * 1.3)) * 1000;
        cells[r][c] = (Math.floor(noise) % 7) > 2.8;
      }
    }
    
    const elements: React.ReactNode[] = [];
    const unit = 100 / size;
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (cells[r][c]) {
          elements.push(
            <rect
              key={`${r}-${c}`}
              x={c * unit}
              y={r * unit}
              width={unit - 0.6}
              height={unit - 0.6}
              className="transition-all duration-300"
              rx={0.6}
            />
          );
        }
      }
    }
    
    return (
      <svg 
        viewBox="0 0 100 100" 
        className={`w-40 h-40 max-w-full ${
          activeThemeId === 'kawaii' ? 'fill-pink-400 stroke-pink-500/10' : 
          activeThemeId === 'matrix' || activeThemeId === 'emerald' ? 'fill-emerald-400 stroke-emerald-500/10' : 
          'fill-purple-400 stroke-purple-500/10'
        }`}
      >
        {elements}
      </svg>
    );
  };

  return (
    <div className={`min-h-screen ${activeSkin.background} text-gray-200 transition-colors duration-700 font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-black`}>
      
      {/* Background terminal scanlines and overlay styling */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-transparent to-black" />
      <div className="absolute inset-0 pointer-events-none z-50 scanlines opacity-5 crt-flicker pointer-events-none" />

      {/* Cyber tactical ambient background light based on custom skin */}
      <div className={`absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-5 transition-all duration-1000 ${
        activeThemeId === 'emerald' || activeThemeId === 'matrix' ? 'bg-emerald-500/80' : 
        activeThemeId === 'kawaii' ? 'bg-pink-500/80' : 'bg-purple-600/80'
      }`} />

      {/* 1. TOP INTERACTIVE STATUS BAR (SOVEREIGN HEADING BAR) */}
      <div className="border-b border-zinc-800 bg-[#020204]/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          {/* Node Identity and Title */}
          <div className="flex items-center space-x-3 flex-wrap">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                activeThemeId === 'kawaii' ? 'bg-pink-500' : 'bg-emerald-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                activeThemeId === 'kawaii' ? 'bg-pink-600' : 'bg-emerald-500'
              }`}></span>
            </span>
            <span className="text-zinc-400">{lang === 'pl' ? 'WĘZEŁ KATEDRY:' : 'CATHEDRAL NODE:'}</span>
            <span 
              onClick={handleCopyNodeAddress}
              className={`font-semibold tracking-wider cursor-pointer hover:underline flex items-center space-x-1 ${activeSkin.textGlow}`}
              title={identity ? `Node ID: ${identity.p2pNodeId}\nWallet: ${identity.address}\nClick to copy address` : 'Loading node identity...'}
            >
              <span>{identity ? `${identity.address.slice(0, 6)}...${identity.address.slice(-4)}` : 'INICJALIZACJA...'}</span>
              {copiedIdentity ? (
                <span className="text-[10px] text-emerald-400 uppercase font-bold animate-pulse">(SKOPIOWANO)</span>
              ) : (
                <Copy className="h-3 w-3 opacity-50 hover:opacity-100 transition-opacity ml-1 text-zinc-400" />
              )}
            </span>
            <span className="text-zinc-600 font-bold ml-1 flex items-center">
              <span className="text-zinc-400 font-normal mr-1">{lang === 'pl' ? 'GRAWITACJA:' : 'GRAVITY:'}</span>
              <span className={activeSkin.textGlow}>{grvBalance} GRV</span>
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-zinc-500">Live Port: <strong className="text-zinc-400">3000</strong></span>
          </div>

          {/* Core Hardware Metrics to feel like a real cyber device */}
          <div className="flex items-center space-x-5 flex-wrap gap-y-1">
            <div className="flex items-center space-x-1.5" title="Decentralized peers connected">
              <span className="text-zinc-500">{t.header.peers}</span>
              <span className="text-zinc-300 font-bold">{activePeers}</span>
            </div>
            <div className="flex items-center space-x-1.5" title="Local workstation VRAM Status">
              <span className="text-zinc-500">{t.header.vram}</span>
              <button 
                onClick={() => {
                  setVramIgnited(!vramIgnited);
                  synth.beep(vramIgnited ? 350 : 750, 'sawtooth', 0.1, 0.05);
                }} 
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-tight transition-all cursor-pointer ${
                  vramIgnited 
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-700/50'
                }`}
              >
                {vramIgnited ? t.header.ignited : t.header.standby}
              </button>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-zinc-500">{t.header.entropy}</span>
              <span className={`${activeSkin.textGlow} font-mono`}>{systemEntropy} G</span>
            </div>
            <div className="hidden md:block text-zinc-400 font-mono">
              {localTimeStr}
            </div>

            {/* Language Switcher Selector */}
            <button
              onClick={() => {
                const nextLang = lang === 'pl' ? 'en' : 'pl';
                setLang(nextLang);
                synth.beep(nextLang === 'pl' ? 950 : 1200, 'sine', 0.1);
              }}
              className="p-1 px-2.5 rounded bg-zinc-900 border border-zinc-805 hover:border-zinc-700 text-zinc-400 hover:text-white transition font-mono text-[10px] uppercase font-bold cursor-pointer flex items-center space-x-1 shrink-0"
              title="Switch Language locale PL / EN"
            >
              <span className={lang === 'pl' ? (activeThemeId === 'kawaii' ? 'text-pink-400 font-extrabold' : 'text-emerald-400 font-extrabold') : 'text-zinc-650'}>PL</span>
              <span className="text-zinc-700">/</span>
              <span className={lang === 'en' ? (activeThemeId === 'kawaii' ? 'text-pink-400 font-extrabold' : 'text-emerald-400 font-extrabold') : 'text-zinc-650'}>EN</span>
            </button>

            {/* Micro Audio Synthesizer toggle controller */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-1 px-2 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition flex items-center space-x-1 cursor-pointer"
              title={audioEnabled ? "Mute" : "Unmute"}
            >
              {audioEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5 text-zinc-600" />}
              <span className="text-[10px] hidden sm:inline">{audioEnabled ? t.header.soundOn : t.header.soundOff}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 max-w-7xl mx-auto z-10 flex flex-col items-center">
        
        {/* Decorative Grid Frame */}
        <div className="absolute top-0 inset-x-4 h-full border-x border-dashed border-zinc-800/40 pointer-events-none" />

        {/* Tactical alert banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center space-x-2.5 bg-zinc-950/90 py-1.5 px-4 rounded-full border border-zinc-800 text-xs font-mono tracking-tight text-zinc-400"
        >
          <BadgeAlert className={`h-4 w-4 ${activeThemeId === 'kawaii' ? 'text-pink-400' : 'text-emerald-400'} animate-pulse`} />
          <span>{t.hero.tag}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500 uppercase">Version: V_ZERO.00_RESONANCE</span>
        </motion.div>

        {/* Hero Title & Subtitle styled with sovereign command aesthetic */}
        <div className="text-center max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 mb-1">
              KATEDRA OTAKOS PROJECT PRESENTATION
            </h2>
            
            {/* The main glowing title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7.5xl font-mono font-bold tracking-tighter uppercase relative">
              <span className="block text-zinc-100">{t.hero.titleLine1}</span>
              <span className={`block transition-all duration-700 bg-gradient-to-r ${
                activeThemeId === 'emerald' || activeThemeId === 'matrix' ? 'from-emerald-400 to-emerald-600' :
                activeThemeId === 'kawaii' ? 'from-pink-400 to-fuchsia-600' : 'from-purple-400 to-violet-600'
              } bg-clip-text text-transparent drop-shadow-sm`}>
                {t.hero.titleLine2}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            key={`sub-${lang}`}
            className="text-base sm:text-lg text-zinc-400 font-sans font-normal max-w-2xl mx-auto leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>
        </div>

        {/* Interactive download button with retro terminal feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-10 flex flex-col items-center space-y-4 w-full max-w-md px-4"
        >
          {/* Main Glowing CTA button */}
          <button
            onClick={startBootstrappedZipDownload}
            className={`w-full group relative py-4 px-6 rounded-lg font-mono font-medium text-black uppercase tracking-wider overflow-hidden hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer ${
              activeThemeId === 'emerald' || activeThemeId === 'matrix' ? 'bg-emerald-400 hover:bg-emerald-300' :
              activeThemeId === 'kawaii' ? 'bg-pink-400 hover:bg-pink-300' : 'bg-purple-400 hover:bg-purple-300'
            } shadow-[0_0_25px_rgba(16,185,129,0.25)]`}
          >
            {/* Ambient sliding neon lines inside button */}
            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            
            <div className="flex items-center justify-center space-x-3">
              <Download className="h-5 w-5 animate-bounce" />
              <span>{t.hero.downloadBtn}</span>
            </div>
          </button>

          {/* Tech metadata details about download package */}
          <div className="flex items-center space-x-4 text-[10px] font-mono text-zinc-500">
            <span>{t.hero.fileMeta}</span>
            <span className="text-zinc-700">•</span>
            <span>{t.hero.requirement}</span>
            <span className="text-zinc-700">•</span>
            <span>{t.hero.license}</span>
          </div>

          {/* CLI Terminal download box */}
          <div className="w-full bg-[#030305]/95 border border-zinc-800 rounded p-2 flex items-center justify-between text-[11px] font-mono shadow-inner space-x-2">
            <span className="text-[9px] text-zinc-500 border border-zinc-800 bg-[#07070c] px-1.5 py-0.5 rounded select-none uppercase font-bold shrink-0">WGET_BOOT</span>
            <div className="flex-1 overflow-x-auto scrollbar-none px-1 text-zinc-300 font-mono select-all text-left whitespace-nowrap">
              <span className="text-emerald-500 font-bold mr-1.5">$</span>curl -fsSL https://otakos.wtf/v_zero.sh | bash
            </div>
            <button
              onClick={copyCliCommand}
              className="p-1 px-2 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer flex items-center space-x-1 font-bold shrink-0"
              title="Copy Shell Trigger Command"
            >
              {copiedCmd ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400 font-bold" />
                  <span className="text-[9px] text-emerald-400 uppercase font-bold">OK</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-zinc-500" />
                  <span className="text-[9px] uppercase">COPY</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center text-xs text-zinc-500 max-w-sm">
            <span className="text-zinc-400">{t.hero.disclaimerHighlight}</span> {t.hero.disclaimerText}
          </div>
        </motion.div>

        {/* Cyber system specs banner layout */}
        <div key={`specs-${lang}`} className="w-full mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl">
          {[
            { label: t.hero.spec1, value: t.hero.spec1Val, icon: Cpu, comment: t.hero.spec1Comment },
            { label: t.hero.spec2, value: t.hero.spec2Val, icon: FileText, comment: t.hero.spec2Comment },
            { label: t.hero.spec3, value: t.hero.spec3Val, icon: Terminal, comment: t.hero.spec3Comment },
            { label: t.hero.spec4, value: t.hero.spec4Val, icon: Layers, comment: t.hero.spec4Comment }
          ].map((spec, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * i + 0.4 }}
              key={i}
              className="bg-zinc-950/90 border border-zinc-800/80 p-4 rounded-lg flex flex-col justify-between hover:border-zinc-700/80 transition-all font-mono"
            >
              <div className="flex items-center justify-between">
                <spec.icon className="h-4 w-4 text-zinc-500" />
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">SPEC_{i+1}</span>
              </div>
              <div className="mt-4">
                <div className="text-xs text-zinc-500">{spec.label}</div>
                <div className="text-base font-semibold text-zinc-200 tracking-tight">{spec.value}</div>
              </div>
              <div className="mt-1 text-[9px] text-zinc-600 uppercase">{spec.comment}</div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic global VRAM Unleashed widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full mt-10 p-6 bg-[#040407] border border-zinc-800/80 rounded-xl max-w-5xl text-left font-mono relative overflow-hidden"
        >
          {/* Glowing subtle background grids */}
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent select-none pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            {/* Left part: Live Tally & Slider description */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center space-x-2">
                <Cpu className={`h-4 w-4 animate-pulse ${
                  activeThemeId === 'kawaii' ? 'text-pink-400' : 'text-emerald-400'
                }`} />
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">{t.vramWidget.title}</span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-300 uppercase">
                  {t.vramWidget.resonanceLabel}
                </h3>
                <button onClick={() => setSphereOpen(true)} title={lang === 'pl' ? 'Kliknij — szklana sieć 3D węzłów' : 'Click — glass 3D node network'}
                  className="flex items-baseline space-x-2 group cursor-pointer hover:scale-[1.02] transition-transform origin-left">
                  <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    activeThemeId === 'kawaii' ? 'text-pink-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  }`}>
                    {globalVramCount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-zinc-500 text-xs">GB VRAM</span>
                  <span className="text-[10px] text-emerald-500/0 group-hover:text-emerald-400/80 transition-colors">🔮 {lang === 'pl' ? 'sieć 3D' : '3D net'}</span>
                </button>
                <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                  {t.vramWidget.desc}
                </p>
              </div>

              {/* Slider Input Row */}
              <div className="space-y-3 bg-[#08080f]/90 border border-zinc-900 rounded-lg p-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold">{t.vramWidget.sliderLabel}</span>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    activeThemeId === 'kawaii' ? 'bg-pink-950/80 text-pink-300' : 'bg-emerald-950/80 text-emerald-300'
                  }`}>
                    {userVramSlider} GB
                  </span>
                </div>

                <div className="relative pt-1">
                  <input
                    type="range"
                    min="4"
                    max="128"
                    step="4"
                    value={userVramSlider}
                    onChange={(e) => {
                      setUserVramSlider(parseInt(e.target.value));
                      synth.beep(400 + parseInt(e.target.value) * 6, 'sine', 0.05);
                    }}
                    className={`w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-current ${
                      activeThemeId === 'kawaii' ? 'text-pink-500' : 'text-emerald-500'
                    }`}
                  />
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-1 font-mono">
                    <span>4GB ({t.vramWidget.tier1})</span>
                    <span>16GB ({t.vramWidget.tier2})</span>
                    <span>24GB ({t.vramWidget.tier3})</span>
                    <span>48GB ({t.vramWidget.tier4})</span>
                    <span>128GB ({t.vramWidget.tier5})</span>
                  </div>
                </div>

                {/* Ignite Button & Status message */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={igniteVramContribution}
                    className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none text-black ${
                      userVramContributed 
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent' 
                        : activeThemeId === 'kawaii' 
                          ? 'bg-pink-400 hover:bg-pink-300 active:scale-[0.98]' 
                          : 'bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98]'
                    }`}
                  >
                    {userVramContributed ? t.vramWidget.btnCommitted : t.vramWidget.btnIgnite}
                  </button>
                  <div className="text-[10px] text-zinc-400 truncate flex-1 flex items-center space-x-1.5 bg-black/40 p-2 rounded border border-zinc-950">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="truncate">{vramStatusMsg}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right part: Peer Simulation Grid Graphics mapping */}
            <div className="md:col-span-5 flex flex-col justify-between p-4 bg-[#07070b] border border-zinc-900 rounded-lg text-xs relative">
              <div className="absolute top-2 right-2 flex items-center space-x-1 text-[9px] text-zinc-600">
                <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                <span>ACTIVE PEERS: {activePeers}</span>
              </div>
              
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-900 pb-2 mb-2">
                Decentralized Resonance Map
              </div>

              {/* Grid drawing illustrating local-node alignment */}
              <div className="grid grid-cols-8 gap-1.5 py-2.5 flex-1 items-center justify-items-center">
                {Array.from({ length: 32 }).map((_, nodeI) => {
                  const isUserActiveNode = nodeI === 14;
                  const intensity = Math.sin(nodeI * 0.15 + globalVramCount * 0.05);
                  let bgCol = "bg-zinc-900";
                  if (isUserActiveNode && userVramContributed) {
                    bgCol = activeThemeId === 'kawaii' ? "bg-pink-400 border border-pink-300/50 shadow-[0_0_8px_rgba(244,63,94,0.8)]" : "bg-emerald-400 border border-emerald-300/50 shadow-[0_0_8px_rgba(16,185,129,0.8)]";
                  } else if (intensity > 0.4) {
                    bgCol = activeThemeId === 'kawaii' ? "bg-pink-950 text-pink-500/80 border border-pink-900" : "bg-emerald-950 text-emerald-500/80 border border-emerald-900";
                  } else if (intensity > -0.1) {
                    bgCol = "bg-zinc-805 text-zinc-700";
                  }
                  return (
                    <div 
                      key={nodeI} 
                      className={`h-3 w-3 rounded-sm transition-all duration-700 ${bgCol}`} 
                      title={`Node Cluster_${nodeI} (Weights: ${12 + (nodeI % 5) * 8} GB)`}
                    />
                  );
                })}
              </div>

              <div className="text-[9px] text-zinc-500 leading-relaxed font-sans mt-2 pt-2 border-t border-zinc-900 flex justify-between items-center">
                <span>RESONANCE COEFFICIENT:</span>
                <span className={`font-mono font-bold ${
                  activeThemeId === 'kawaii' ? 'text-pink-400' : 'text-emerald-400'
                }`}>
                  {userVramContributed ? (0.852 + userVramSlider * 0.0014).toFixed(3) : '0.852'} MATCH
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2.4 SŁOWO OD ARCHITEKTA */}
      <section className="py-8 max-w-3xl mx-auto px-4 z-10 relative">
        <ArchitectWord lang={lang} />
      </section>

      {/* 2.5 LIVE NEURAL MAP — LOKALNA AGI 0.00G */}
      <section className="py-12 max-w-7xl mx-auto px-4 z-10 relative">
        <NeuralMap lang={lang} />
      </section>

      {/* 2.55 AETHER — wspólna arena Katedr (login przez TOST) */}
      <section className="py-12 max-w-7xl mx-auto px-4 z-10 relative">
        <AetherArena lang={lang} />
      </section>

      {/* 2.6 KRONIKA UPDATE — wg sektorów ekosystemu */}
      <section className="py-12 max-w-7xl mx-auto px-4 z-10 relative">
        <UpdatesSection lang={lang} />
      </section>

      {/* Szklana sieć 3D węzłów (modal po kliknięciu licznika VRAM) */}
      {sphereOpen && <NodeSphere lang={lang} onClose={() => setSphereOpen(false)} />}

      {/* 3. DISCOVERY LOGS: ISKRA & ECHO */}
      <section className="py-16 max-w-7xl mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto border-t border-zinc-800/70 pt-16">
          
          <div key={`discovery-${lang}`} className="mb-10 text-center">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
              {t.discovery.tag}
            </h2>
            <h3 className="text-2xl sm:text-3.5xl font-mono font-bold uppercase tracking-tight text-zinc-100">
              {t.discovery.title}
            </h3>
            <p className="text-zinc-400 font-sans text-sm max-w-xl mx-auto mt-2">
              {t.discovery.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Host Loop Mapping */}
            {HOSTS_DATA.map((host) => {
              const matchesHostActive = playingLogHost === host.id;
              const localizedHost = host.id === 'iskra' ? t.hosts.iskra : t.hosts.echo;
              
              return (
                <div 
                  key={host.id}
                  className={`bg-zinc-950/95 border transition-all duration-300 rounded-xl overflow-hidden flex flex-col justify-between ${
                    matchesHostActive 
                      ? activeThemeId === 'kawaii' ? 'border-pink-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Host banner with dynamic colors */}
                  <div className="p-6 border-b border-zinc-800/60 relative">
                    <div className="absolute top-4 right-4 text-3xl select-none">
                      {host.emoji}
                    </div>

                    <div className="flex items-center space-x-1 mb-2">
                      <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full ${
                        host.id === 'iskra' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-400/30'
                      }`}>
                        {t.discovery.hostBadge}
                      </span>
                    </div>

                    <h4 className="text-2xl font-mono font-bold text-zinc-100">
                      {host.name}
                    </h4>
                    <span className="text-xs text-zinc-400 block font-mono">
                      {localizedHost.title}
                    </span>

                    <p className="text-zinc-400 text-xs mt-3 leading-relaxed font-sans">
                      {localizedHost.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-500">
                        {t.discovery.trait} <strong className="text-zinc-300 font-normal">{localizedHost.trait}</strong>
                      </div>
                      <div className="text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-500">
                        {t.discovery.freq} <strong className="text-zinc-300 font-normal">{host.ambientFreq} Hz</strong>
                      </div>
                    </div>
                  </div>

                  {/* Interactive simulated audiolog transcript block */}
                  <div className="p-6 bg-zinc-950 flex-1 flex flex-col justify-between">
                    
                    {/* Transcript screen container */}
                    <div className="bg-[#030304]/80 border border-zinc-900 rounded p-4 font-mono text-xs text-zinc-400 h-44 overflow-y-auto mb-4 relative flex flex-col">
                      <div className="text-[10px] text-zinc-600 mb-2 border-b border-zinc-900 pb-1 flex justify-between items-center whitespace-nowrap">
                        <span>{t.discovery.liveTranscription}</span>
                        <span className="text-emerald-500 font-bold animate-pulse">{t.discovery.recording}</span>
                      </div>

                      {/* Display dialogue transcript lines */}
                      <div className="space-y-3 flex-1 font-mono">
                        {host.transcripts.map((line, lineIdx) => {
                          const isCurrentlyHighlighted = matchesHostActive && hostLogIndex === lineIdx;
                          const lineText = localizedHost.transcripts[lineIdx] || line.text;
                          return (
                            <div 
                              key={lineIdx} 
                              className={`transition-all duration-300 border-l px-2 py-1 ${
                                isCurrentlyHighlighted 
                                  ? 'border-emerald-400 bg-emerald-950/20 text-zinc-100' 
                                  : 'border-zinc-800 text-zinc-500'
                              }`}
                            >
                              <span className="text-[10px] text-zinc-600 mr-1.5 font-bold">[{line.timestamp}]</span>
                              <span>{lineText}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Prompt to play audio if idle */}
                      {!matchesHostActive && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-center p-4">
                          <button 
                            onClick={() => playAudiolog(host.id)}
                            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded cursor-pointer transition text-[11px] text-zinc-300 hover:text-white flex items-center space-x-1.5"
                          >
                            <Play className="h-3 w-3" />
                            <span>{t.discovery.triggerBtn}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Controls & dynamic wave design indicator representing play progress */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => playAudiolog(host.id)}
                        className={`font-mono text-xs flex items-center space-x-2 py-2 px-4 rounded border transition-all cursor-pointer ${
                          matchesHostActive 
                            ? 'bg-red-950/80 text-red-300 border-red-500/50 hover:bg-red-900/60' 
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {matchesHostActive ? (
                          <>
                            <Square className="h-3.5 w-3.5 fill-red-400" />
                            <span>{t.discovery.stopBtn.replace('{0}', hostLogTimestamp.toString())}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            <span>{t.discovery.listenBtn.replace('{0}', host.audioDuration)}</span>
                          </>
                        )}
                      </button>

                      {/* Dynamic simulated moving bars of voice frequency */}
                      <div className="flex items-end space-x-1 h-5 select-none">
                        {[4, 8, 2, 9, 5, 2, 7, 3, 6, 8, 4].map((h, barIdx) => {
                          const factor = matchesHostActive ? Math.sin(hostLogTimestamp + barIdx) * 10 + 12 : 3;
                          return (
                            <div 
                              key={barIdx} 
                              style={{ height: `${Math.max(3, Math.min(22, factor))}px` }} 
                              className={`w-0.5 rounded-full transition-all duration-300 ${
                                matchesHostActive 
                                  ? host.id === 'iskra' ? 'bg-amber-500' : 'bg-indigo-400'
                                  : 'bg-zinc-800'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          <div className="mt-6 text-center text-xs font-mono text-zinc-600">
            <span>{t.discovery.specComment}</span>
          </div>

        </div>
      </section>

      {/* 4. ECOSYSTEM MONETYZATION TABS */}
      <section className="py-16 bg-[#020203]/95 border-y border-zinc-950 max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Tab section container with distinct cyberpunk neon borders */}
        <div className="max-w-4xl mx-auto">
          
          <div key={`ecosystem-${lang}`} className="mb-10 text-center">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
              {t.ecosystem.tag}
            </h2>
            <h3 className="text-2xl sm:text-3.5xl font-mono font-bold uppercase tracking-tight text-zinc-100">
              {t.ecosystem.title}
            </h3>
            <p className="text-zinc-400 font-sans text-sm max-w-xl mx-auto mt-2">
              {t.ecosystem.desc}
            </p>
          </div>

          {/* Navigation Tabs Header */}
          <div className="flex flex-wrap border-b border-zinc-800 bg-[#060609] p-1.5 rounded-t-lg gap-1">
            {[
              { id: 'crypto', label: t.ecosystem.tabCrypto, icon: Coins },
              { id: 'hardware', label: t.ecosystem.tabHardware, icon: Hammer },
              { id: 'skins', label: t.ecosystem.tabSkins, icon: Palette },
              { id: 'audio', label: t.ecosystem.tabAudio, icon: Music }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id as any)}
                  className={`flex-1 min-w-[150px] font-mono text-xs font-medium py-3 px-4 rounded transition-all cursor-pointer flex items-center justify-center space-x-2 border uppercase ${
                    isSelected 
                      ? activeThemeId === 'kawaii' 
                        ? 'bg-pink-950/80 text-pink-300 border-pink-500/50 shadow-[0_0_10px_rgba(244,63,94,0.1)]' 
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                      : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB DECK CONTAINER */}
          <div className="bg-zinc-950 border-x border-b border-zinc-800 p-6 rounded-b-lg">
            
            {/* TAB 1: WEB3 DONATIONS */}
            {activeTab === 'crypto' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-6"
              >
                <div>
                  <h4 className="text-sm font-mono uppercase text-zinc-400 mb-1 border-l-2 border-emerald-500 pl-2">
                    {t.crypto.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-sans">
                    {t.crypto.desc}
                  </p>
                </div>

                <div className="space-y-4">
                  {CRYPTO_DONATIONS.map((crypto, idx) => (
                    <div 
                      key={idx}
                      className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800/80 hover:border-zinc-700/80 transition-all font-mono"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2 mb-2">
                        <span className="text-xs font-bold text-zinc-200">
                          {crypto.network}
                        </span>
                        <span className="text-[10px] bg-zinc-950 px-2 py-0.5 rounded text-zinc-400">
                          {crypto.symbol}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs w-full">
                        <span className="text-zinc-400 leading-relaxed break-all font-mono select-all bg-black/40 p-2.5 rounded border border-zinc-950 flex-1 text-left">
                          {crypto.address}
                        </span>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Scan QR Button */}
                          <button
                            onClick={() => {
                              setSelectedCryptoForQr(crypto);
                              synth.beep(880, 'sine', 0.1);
                            }}
                            className="px-3 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 hover:text-white transition cursor-pointer flex items-center justify-center space-x-1.5"
                            title="Scan Crypto QR Code"
                          >
                            <QrCode className={`h-3.5 w-3.5 ${
                              activeThemeId === 'kawaii' ? 'text-pink-400' : 'text-emerald-400'
                            }`} />
                            <span className="text-[10px] uppercase font-bold">{t.crypto.qrScan}</span>
                          </button>

                          {/* Copy Link Button */}
                          <button
                            onClick={() => copyAddressToClipboard(crypto.address, crypto.symbol)}
                            className="px-3 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded text-zinc-400 hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                          >
                            {copiedText === crypto.symbol ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400 font-bold" />
                                <span className="text-emerald-400 font-bold uppercase text-[10px]">{t.crypto.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 text-zinc-500" />
                                <span className="text-[10px] uppercase">{t.crypto.copyLink}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fiat / Regular Donations */}
                <div className="pt-5 border-t border-zinc-900 space-y-4">
                  <div>
                    <h4 className="text-sm font-mono uppercase text-zinc-400 mb-1 border-l-2 border-emerald-500 pl-2">
                      {lang === 'pl' ? 'TRADYCYJNE METODY WSPARCIA' : 'REGULAR SUPPORT CHANNELS'}
                    </h4>
                    <p className="text-xs text-zinc-500 font-sans">
                      {lang === 'pl' 
                        ? 'Jeśli nie korzystasz z kryptowalut Web3, możesz wesprzeć Katedrę poprzez standardowe bramki płatnicze.' 
                        : 'If you do not use Web3 cryptocurrencies, you can support the Cathedral via standard payment gateways.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* PayPal */}
                    <a
                      href={FIAT_DONATIONS_CONFIG.PAYPAL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all font-mono flex items-center justify-between group cursor-pointer"
                      onClick={() => synth.beep(750, 'sine', 0.08)}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">PayPal</span>
                        <span className="text-[10px] text-zinc-500 mt-1 font-sans leading-relaxed">
                          {lang === 'pl' ? 'Szybka darowizna fiat (karta/konto).' : 'Direct fiat support (card/account).'}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400 transition-colors ml-2" />
                    </a>

                    {/* Buy Me a Coffee */}
                    <a
                      href={FIAT_DONATIONS_CONFIG.BUY_ME_A_COFFEE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all font-mono flex items-center justify-between group cursor-pointer"
                      onClick={() => synth.beep(750, 'sine', 0.08)}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">Buy Me a Coffee</span>
                        <span className="text-[10px] text-zinc-500 mt-1 font-sans leading-relaxed">
                          {lang === 'pl' ? 'Ufunduj symboliczną kawę twórcom projektu.' : 'Support the creators with a virtual coffee.'}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400 transition-colors ml-2" />
                    </a>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-amber-900/40 p-3.5 rounded-lg flex items-start space-x-3 text-xs text-amber-500 font-mono">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <span className="font-bold">{t.crypto.warningTitle}</span> {t.crypto.warningDesc}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: CUSTOM HARDWARE CAD VIEWER */}
            {activeTab === 'hardware' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-6"
              >
                <div>
                  <h4 className="text-sm font-mono uppercase text-zinc-400 mb-1 border-l-2 border-emerald-500 pl-2">
                    {t.hardware.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-sans">
                    {t.hardware.desc}
                  </p>
                </div>

                {/* Sub Hardware selection checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {HARDWARE_STL.map((hw) => {
                    const isSelectedHw = hardwareId === hw.id;
                    return (
                      <button
                        key={hw.id}
                        onClick={() => {
                          setHardwareId(hw.id);
                          synth.beep(800, 'sine', 0.05);
                        }}
                        className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                          isSelectedHw 
                            ? 'bg-zinc-900 border-emerald-500 text-zinc-100' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold uppercase text-zinc-500 mb-1">
                          {isSelectedHw ? 'SELECTED' : 'STANDBY'}
                        </div>
                        <div className="text-xs font-mono font-bold truncate">
                          {hw.name}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">
                          {hw.cost}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Simulated 3D STL visualizer pane */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/60 border border-zinc-800 p-5 rounded-lg">
                  
                  {/* Interactive STL CAD wireframe */}
                  <div className="bg-black border border-zinc-950 p-4 rounded-md relative flex flex-col justify-between overflow-hidden min-h-[220px]">
                    <div className="text-[9px] font-mono text-zinc-600 border-b border-zinc-950 pb-1.5 flex justify-between">
                      <span>{t.hardware.wireTitle}</span>
                      <span className="text-emerald-500 font-bold">{t.hardware.solidStats}</span>
                    </div>

                    {/* Sliced vector grid visualizing CAD design */}
                    <div className="flex-1 flex items-center justify-center py-6 relative">
                      {/* CSS grid backdrop */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                      
                      <svg 
                        viewBox="0 0 100 100" 
                        className="w-40 h-40 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-300"
                        style={{
                          transform: `rotate(${stlPerspective * 15}deg) scale(${stlScaling})`,
                        }}
                      >
                        {/* Dynamic casing body based on sliders and hardwares */}
                        <path 
                          d={selectedHardware.meshStructure}
                          fill="none" 
                          stroke={activeThemeId === 'kawaii' ? '#f43f5e' : '#10b981'} 
                          strokeWidth={stlDeform / 10} 
                          className="transition-all duration-300 opacity-80"
                        />
                        {/* Core internal Chip VRAM anchor */}
                        <rect 
                          x={35} 
                          y={40} 
                          width={stlWidth / 1.5} 
                          height="20" 
                          fill="none" 
                          stroke={activeThemeId === 'kawaii' ? '#c084fc' : '#a855f7'} 
                          strokeWidth="1.5"
                          strokeDasharray="2,2"
                        />
                        {/* Geometric crosshair markings */}
                        <line x1="50" y1="5" x2="50" y2="95" stroke="#2a2a2a" strokeWidth="0.5" strokeDasharray="1,6" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="#2a2a2a" strokeWidth="0.5" strokeDasharray="1,6" />
                        
                        {/* Coordinate metrics text */}
                        <text x="8" y="16" fill="#10b981" fontSize="5" fontFamily="monospace">x86_A1</text>
                        <text x="75" y="90" fill="#a855f7" fontSize="5" fontFamily="monospace">z_0</text>
                      </svg>
                    </div>

                    <div className="text-[10px] font-mono text-zinc-500 flex justify-between border-t border-zinc-950 pt-1.5">
                      <span>MODEL ID: {selectedHardware.stlName}</span>
                      <span>{t.hardware.perspective} {stlPerspective * 15}°</span>
                    </div>
                  </div>

                  {/* Slicing CAD control sliders */}
                  <div className="space-y-4 font-mono text-xs flex flex-col justify-between">
                    <div>
                      <span className="text-zinc-400 font-bold uppercase block mb-1">
                        STL Slicing Parameters
                      </span>
                      <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                        Fine-tune local nozzle diameter extrusion density parameters before downloading raw STL coordinates.
                      </p>
                    </div>

                    <div className="space-y-3 font-mono">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-zinc-500">{t.hardware.deformLimit}</span>
                          <span className="text-zinc-300">{stlDeform / 10} mm</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="40" 
                          value={stlDeform}
                          onChange={(e) => {
                            setStlDeform(parseFloat(e.target.value));
                            synth.beep(500 + stlDeform * 5, 'sine', 0.02, 0.02);
                          }}
                          className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer" 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-zinc-500">{t.hardware.vramWidth}</span>
                          <span className="text-zinc-300">{stlWidth} px</span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="60" 
                          value={stlWidth} 
                          onChange={(e) => {
                            setStlWidth(parseFloat(e.target.value));
                            synth.beep(400 + stlWidth * 8, 'sine', 0.02, 0.02);
                          }}
                          className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer" 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-zinc-500">{t.hardware.perspective}</span>
                          <span className="text-zinc-300">{stlPerspective * 15}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="24" 
                          value={stlPerspective} 
                          onChange={(e) => {
                            setStlPerspective(parseFloat(e.target.value));
                            synth.beep(300 + stlPerspective * 20, 'sine', 0.02, 0.02);
                          }}
                          className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer" 
                        />
                      </div>
                    </div>

                    {/* STL download actions */}
                    <div className="pt-2 flex gap-2 font-mono">
                      <button 
                        onClick={() => {
                          synth.chord([600, 800, 1000], 'sine', 0.2);
                          setCadNotification(t.hardware.stlNotification.replace('{0}', selectedHardware.stlName).replace('{1}', (stlDeform/10).toString()));
                          setTimeout(() => {
                            setCadNotification(null);
                          }, 4500);
                        }}
                        className="flex-1 text-center py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition rounded font-bold uppercase text-[10px] cursor-pointer"
                      >
                        {t.hardware.downloadStl}
                      </button>
                      <a 
                        href="https://otakos.wtf" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-emerald-400 rounded transition flex items-center justify-center cursor-pointer"
                        title={t.hardware.orderedPhysical}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: SOVEREIGN SKINS PREVIEW (THEME TUNER) */}
            {activeTab === 'skins' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-6"
              >
                <div>
                  <h4 className="text-sm font-mono uppercase text-zinc-400 mb-1 border-l-2 border-emerald-500 pl-2">
                    {t.skins.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-sans">
                    {t.skins.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SKINS_DATA.map((skin) => {
                    const isSkinActive = activeThemeId === skin.id;
                    const skinName = lang === 'pl' 
                      ? skin.id === 'matrix' ? 'Klasyczny Matrix'
                        : skin.id === 'cyberneon' ? 'Sovereign Fiolet LP'
                        : skin.id === 'kawaii' ? 'Kawaii Hakerka-Chan v1.0'
                        : 'Szmaragdowy Protokół (Domyślny)'
                      : skin.name;

                    const skinDesc = lang === 'pl'
                      ? skin.id === 'matrix' ? 'Klasyczna fosforowa zieleń CRT. Czysty cyberpunkowy styl retro dla hakerów.'
                        : skin.id === 'cyberneon' ? 'Głęboki fioletowo-cyjanowy schemat zoptymalizowany pod kątem nocnego kodowania.'
                        : skin.id === 'kawaii' ? 'Śliczny, różowy i pastelowy motyw z łagodniejszym brzmieniem.'
                        : 'Domyślny bezpieczny interfejs. Ochrona wzroku podczas długich, nocnych sesji dekompilacji.'
                      : skin.description;

                    return (
                      <div 
                        key={skin.id}
                        onClick={() => selectSkinId(skin.id)}
                        className={`p-4 rounded-lg border-2 text-left cursor-pointer transition-all duration-300 bg-zinc-900/60 ${
                          isSkinActive 
                            ? skin.borderColors + ' ring-1 ring-offset-2 ring-offset-black ring-' + skin.primary + '-500' 
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2">
                          <span className="font-mono text-xs font-bold text-zinc-200">
                            {skinName}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border ${skin.badge}`}>
                            {isSkinActive ? t.skins.applied : (lang === 'pl' ? 'KLIKNIJ ABY WYBRAĆ' : 'READY TO DECODE')}
                          </span>
                        </div>

                        <p className="text-xs font-sans text-zinc-500 leading-normal mb-3">
                          {skinDesc}
                        </p>

                        <div className="flex space-x-1.5 select-none">
                          <span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400" />
                          <span className="w-4 h-4 rounded bg-emerald-950 border border-emerald-800" />
                          <span className="w-4 h-4 rounded bg-[#050508] border border-zinc-800" />
                          <span className="w-4 h-4 rounded bg-purple-500 border border-purple-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center font-mono text-[10px] text-zinc-600">
                  <span>{lang === 'pl' ? 'Suwerenne warstwy skórek są natywnie kompilowane wewnątrz woluminu Live boot.' : 'Sovereign skin layers are compiled inside the 27MB V_ZERO Live boot volume natively.'}</span>
                </div>
              </motion.div>
            )}

            {/* TAB 4: CYBER-MERCH & DISTROKID AUDIO */}
            {activeTab === 'audio' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-6"
              >
                <div>
                  <h4 className="text-sm font-mono uppercase text-zinc-400 mb-1 border-l-2 border-emerald-500 pl-2">
                    {t.audio.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-sans">
                    {t.audio.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Physical Merchandise Block */}
                  <div className="bg-zinc-900/60 p-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition">
                    <div className="flex items-center space-x-2 text-zinc-200 mb-2 font-mono text-xs font-bold">
                      <ShoppingBag className="h-4 w-4 text-emerald-400" />
                      <span>{t.audio.buyMerch}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                      {t.audio.merchDesc}
                    </p>
                    <a 
                      href="https://otakos.wtf" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase py-2.5 px-4 bg-zinc-950 rounded border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition cursor-pointer"
                    >
                      <span>{t.audio.merchBtn}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Audio Soundtrack Block */}
                  <div className="bg-zinc-900/60 p-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition">
                    <div className="flex items-center space-x-2 text-zinc-200 mb-2 font-mono text-xs font-bold">
                      <Music className="h-4 w-4 text-purple-400" />
                      <span>{t.audio.streamOst}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                      {t.audio.streamDesc}
                    </p>
                    <div className="flex gap-2">
                      <a 
                        href="https://otakos.wtf" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 text-center py-2.5 bg-zinc-950 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition rounded font-mono font-bold uppercase text-[10px] cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <span>{t.audio.streamSpotify}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <a 
                        href="https://otakos.wtf" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 text-center py-2.5 bg-zinc-950 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition rounded font-mono font-bold uppercase text-[10px] cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <span>{t.audio.streamYt}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                </div>

                {/* Simulated ambient sound board playground */}
                <div className="bg-black/80 border border-zinc-900 p-4 rounded-lg">
                  <div className="text-[10px] font-mono text-zinc-600 mb-2 flex justify-between uppercase">
                    <span>{lang === 'pl' ? 'OtakOS Ambient Frequency Test-Pad' : 'OtakOS Ambient Frequency Test-Pad'}</span>
                    <span>{lang === 'pl' ? 'Generuj akustyczne fale sinusoidalne' : 'Oscillate waveform nodes'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { freq: 110, label: lang === 'pl' ? 'ECHO SUBBAS (110Hz)' : 'ECHO SUB (110Hz)' },
                      { freq: 220, label: lang === 'pl' ? 'DECYBEL POWIETRZA (220Hz)' : 'AIR DAMPENCE (220Hz)' },
                      { freq: 440, label: lang === 'pl' ? 'STANDARD ISO (440Hz)' : 'ISO STANDARD (440Hz)' },
                      { freq: 523, label: lang === 'pl' ? 'DOMINANTA C5 (523Hz)' : 'DOMINANT C5 (523Hz)' },
                      { freq: 880, label: lang === 'pl' ? 'AKORD ZAPŁONU (880Hz)' : 'IGNITION CHORD (880Hz)' }
                    ].map((pad, idx) => (
                      <button
                        key={idx}
                        onClick={() => synth.beep(pad.freq, 'sine', 0.25, 0.08)}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 py-1.5 px-3 rounded text-[10px] font-mono text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                      >
                        {pad.label}
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </div>

        </div>
      </section>

      {/* 5. SPECIFICATION HARDENING DETAILS */}
      <section className="py-16 max-w-7xl mx-auto px-4 z-10 relative border-t border-zinc-900">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono">
          
          <div className="space-y-2">
            <div className="text-zinc-500 uppercase font-bold text-[10px] tracking-wider">
              {lang === 'pl' ? '[PROTOKOŁY SKARBCÓW PANIKI]' : '[PANIC SECURE PROTOCOLS]'}
            </div>
            <p className="text-zinc-400 font-sans leading-relaxed">
              {lang === 'pl' 
                ? 'Wyciągnięcie fizycznego Live-USB aktywuje ekstremalny awaryjny cykl czyszczenia pamięci podręcznej. Natychmiastowo rozmagnesowuje ulotne rejestry pamięci przy użyciu wysokiej entropii.'
                : 'Pulling the physical Live-USB activates the extreme emergency cache wipe cycle. Instantly degausses transient registers using high-entropy memory corruption.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-zinc-500 uppercase font-bold text-[10px] tracking-wider">
              {lang === 'pl' ? '[ROZRUCH ODPORNY KWANTOWO]' : '[QUANTUM RESISTANT BOOT]'}
            </div>
            <p className="text-zinc-400 font-sans leading-relaxed">
              {lang === 'pl'
                ? 'Całkowicie omija sieci publiczne przy użyciu lokalnych tuneli peer-to-peer. Wszystkie procesy modeli AI pozostają ściśle odizolowane w warstwach pamięci podręcznej L3.'
                : 'Bypasses public networks entirely using localized peer-to-peer tunnels. All AI model processes remain isolated strictly within your system L3 cache layers.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-zinc-500 uppercase font-bold text-[10px] tracking-wider">
              {lang === 'pl' ? '[ZOBOWIĄZANIE ZERO EMISJI TOKENÓW]' : '[ZERO TOKENS COMMITMENT]'}
            </div>
            <p className="text-zinc-400 font-sans leading-relaxed">
              {lang === 'pl'
                ? 'OtakOS nie korzysta z centralnych węzłów API. Uruchamiaj głębokie wagi modeli na aktywnej lokalnej pamięci VRAM bez centralnych limitów i opłat chmurowych.'
                : 'OtakOS does not use central API nodes. Run deep model weights on your active local hardware VRAM with absolutely no central quotas or monetization chokes.'}
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-black/60 py-10 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="text-xs font-mono text-zinc-500">
            <span>{lang === 'pl' 
              ? 'WOLNY PROJEKT KATEDRA OTAKOS • OPROGRAMOWANIE COGNITIVE COMMON SENSE LICENCJI GPL' 
              : 'KATEDRA OTAKOS PROJECT INCORPORATED • ALL SOFTWARE IS HIGH-LEVEL GPL COGNITIVE COMMON SENSE'}</span>
          </div>

          <div className="flex justify-center space-x-6 text-[10px] font-mono">
            <a href="https://otakos.wtf" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 transition">
              PORTAL: OTAKOS.WTF
            </a>
            <span className="text-zinc-700">|</span>
            <a href="https://otakos.wtf" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 transition">
              {lang === 'pl' ? 'MAGNETY TORRENTÓW' : 'TORRENT MAGNETS'}
            </a>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-600">SHA256: fc9a103c88bb7123992fae208b098defa214</span>
          </div>

          {/* Clean modest credit matching human visual style guidelines */}
          <div className="text-[9px] text-zinc-600 font-mono">
            {lang === 'pl' ? 'SUWERENNY TERMINAL MOCY • SKOMPILOWANO Z NAJWYŻSZĄ INTEGRALNOŚCIĄ' : 'SOVEREIGN POWER TERMINAL • COMPILED WITH INTEGRITY'}
          </div>
        </div>
      </footer>

      {/* 6. DOWNLOAD COMPRESSION SIMULATOR OVERLAY WINDOW */}
      <AnimatePresence>
        {showInstaller && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg bg-zinc-950 border ${activeSkin.borderColors} rounded-lg ${activeSkin.glowClass} overflow-hidden font-mono text-xs flex flex-col justify-between`}
            >
              {/* Window Title Bar */}
              <div className="bg-[#0c0c11] border-b border-zinc-900 p-3 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>{lang === 'pl' ? 'DEKODOWANIE ARCHIWUM V_ZERO_ARCHIVE.ZIP' : 'DECRYPTING V_ZERO_ARCHIVE.ZIP'}</span>
                </div>
                <button 
                  onClick={closeInstallerWin}
                  className="text-zinc-600 hover:text-zinc-100 font-bold transition text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar & Status */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                  <span>{lang === 'pl' ? 'DEKOMPRESJA STRUMIENIOWA PAMIĘCI KATEDRY' : 'RESONANCE CACHE STREAM DECRYPTION'}</span>
                  <span className={`font-bold ${activeSkin.textGlow}`}>{installProgress}% {lang === 'pl' ? 'UKOŃCZONO' : 'COMPLETED'}</span>
                </div>

                <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${
                      activeThemeId === 'kawaii' ? 'bg-pink-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${installProgress}%` }}
                  />
                </div>

                {/* Console Log output with real-time scrolling logs */}
                <div className="bg-[#030305] border border-zinc-900 rounded p-3 h-48 overflow-y-auto text-zinc-500 scrollbar font-mono text-[10px] space-y-1.5 leading-relaxed">
                  {installLog.map((log, logIdx) => (
                    <div key={logIdx} className="flex items-start space-x-2">
                      <span className="text-zinc-700">[{logIdx + 1}]</span>
                      <span className={log.includes('SUKCES') || log.includes('SUCCESS') || log.includes('BOOSTRAP') || log.includes('PEŁNA') ? activeSkin.textGlow : 'text-zinc-400'}>
                        {log}
                      </span>
                    </div>
                  ))}
                  {installerStatus !== 'completed' && (
                    <div className="animate-pulse text-emerald-500 font-bold">
                      ▋ {lang === 'pl' ? 'DESZYFROWANIE PLIKÓW ARCHIWUM Z PRĘDKOŚCIĄ 27.2MB/S...' : 'DECODING SOURCE FILES AT 27.2MB/S...'}
                    </div>
                  )}
                </div>
              </div>

              {/* Trigger Raw Parameters File Download on completed status */}
              <div className="bg-[#07070a] border-t border-zinc-950 p-4 flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">
                  {lang === 'pl' ? 'SPÓJNOŚĆ_ZAPEWNIONA: sha256-fc9a103c88' : 'INTEGRITY_VERIFIED: sha256-fc9a103c88'}
                </span>

                {installerStatus === 'completed' ? (
                  <button
                    onClick={triggerActualDownloadBlob}
                    className="py-2 px-4 rounded text-black font-bold uppercase hover:scale-[1.01] transition duration-200 cursor-pointer text-[10px] flex items-center space-x-1.5 bg-emerald-400 hover:bg-emerald-300"
                  >
                    <span>{lang === 'pl' ? 'URUCHOM PAKIET RDZENIA' : 'ACTIVATE CORE PAYLOAD'}</span>
                    <Download className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="py-2 px-4 rounded bg-zinc-900 border border-zinc-800 text-zinc-600 font-bold uppercase text-[10px]"
                  >
                    {lang === 'pl' ? 'ROZPISYWANIE KANAŁÓW SYSTEMU...' : 'DECODING INTEGRAL CHANNELS...'}
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive custom CAD / System Alerts Toast */}
      <AnimatePresence>
        {cadNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#050508] border border-emerald-500/60 neon-glow-green text-zinc-100 p-4 rounded-lg shadow-2xl max-w-sm font-mono text-xs flex items-start space-x-3"
          >
            <div className="bg-emerald-950 text-emerald-400 p-1 rounded">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-bold text-emerald-400 uppercase tracking-wider flex justify-between">
                <span>{lang === 'pl' ? 'URUCHOMIENIE SYSTEMU_WĘZŁA' : 'SYSTEM_NODE EXECUTION'}</span>
                <span className="text-[9px] text-zinc-500">{lang === 'pl' ? 'BEZPIECZNY' : 'SECURE'}</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                {cadNotification}
              </p>
            </div>
            <button 
              onClick={() => setCadNotification(null)}
              className="text-zinc-500 hover:text-white transition font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Web3 Neon QR Code Modal Pop-up */}
      <AnimatePresence>
        {selectedCryptoForQr && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm bg-[#040407] border ${
                activeThemeId === 'kawaii' ? 'border-pink-500/80 shadow-[0_0_20px_rgba(244,63,94,0.35)]' : 
                activeThemeId === 'matrix' || activeThemeId === 'emerald' ? 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.35)]' : 
                'border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
              } rounded-xl overflow-hidden font-mono text-xs flex flex-col justify-between`}
            >
              {/* Modal Header */}
              <div className="bg-[#09090e] border-b border-zinc-900 p-4 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <QrCode className={`h-4 w-4 ${
                    activeThemeId === 'kawaii' ? 'text-pink-400' : 'text-emerald-400'
                  }`} />
                  <span className="font-bold">{lang === 'pl' ? 'KODY Skanowania QR RESONANCE_' : 'QR RESONANCE CODES_'}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCryptoForQr(null);
                    synth.beep(330, 'sine', 0.05);
                  }}
                  className="text-zinc-500 hover:text-white transition font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body / QR Canvas */}
              <div className="p-6 flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'pl' ? 'Standard sieci' : 'Network standard'}</div>
                  <div className="text-sm font-bold text-zinc-100 uppercase">{selectedCryptoForQr.network} ({selectedCryptoForQr.symbol})</div>
                </div>

                {/* Elegant QR matrix display slot */}
                <div className="relative p-4 bg-black border border-zinc-900 rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
                  {/* Sliding laser scanner line */}
                  <motion.div 
                    animate={{ y: [0, 160, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className={`absolute left-0 right-0 h-[1.5px] opacity-75 pointer-events-none z-10 ${
                      activeThemeId === 'kawaii' ? 'bg-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 
                      activeThemeId === 'matrix' || activeThemeId === 'emerald' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 
                      'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                    }`}
                  />
                  {renderProceduralQrSvg(selectedCryptoForQr.address)}
                </div>

                <div className="w-full space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase text-center">{lang === 'pl' ? 'Współrzędne adresu docelowego' : 'Destination address coord'}</div>
                  <div className="p-2.5 bg-black/50 border border-zinc-900 rounded break-all text-[11px] text-zinc-300 leading-relaxed max-w-full text-center font-mono">
                    {selectedCryptoForQr.address}
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="bg-[#06060a] border-t border-zinc-950 p-4 flex gap-2">
                <button
                  onClick={() => {
                    copyAddressToClipboard(selectedCryptoForQr.address, selectedCryptoForQr.symbol);
                  }}
                  className={`flex-1 text-center py-2.5 rounded font-bold uppercase text-[10px] cursor-pointer transition ${
                    copiedText === selectedCryptoForQr.symbol 
                      ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                      : activeThemeId === 'kawaii' 
                        ? 'bg-pink-400 text-black hover:bg-pink-300' 
                        : 'bg-emerald-400 text-black hover:bg-emerald-300'
                  }`}
                >
                  {copiedText === selectedCryptoForQr.symbol 
                    ? (lang === 'pl' ? 'SKOPIOWANO ADRES!' : 'COPIED TO NEON CUP!') 
                    : (lang === 'pl' ? 'SKOPIUJ KLUCZ ODBIORCY' : 'COPY DESTINATION KEY')}
                </button>
                <button
                  onClick={() => {
                    setSelectedCryptoForQr(null);
                    synth.beep(330, 'sine', 0.05);
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 hover:text-white rounded border border-zinc-800 text-xs font-bold text-zinc-400 transition cursor-pointer"
                >
                  {lang === 'pl' ? 'ZAMKNIJ' : 'CLOSE'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
