import React, { useEffect, useRef, useState, useCallback } from 'react';

// --- TYPY I INTERFEJSY ---
export type LayoutMode = 'GRID' | 'FOCUS_SELF' | 'FOCUS_GUEST' | 'FOCUS_ORB';

export interface PodcastCoreProps {
  /** Adres serwera WebSocket przekaźnika RTMP (np. Node.js + FFmpeg -> YouTube Live API) */
  wsUrl?: string;
  /** Callback powiadamiający o stanie transmisji na żywo */
  onStreamStateChange?: (isBroadcasting: boolean) => void;
  /** Zewnętrzny strumień wideo od Gościa Live (WebRTC Peer) */
  guestStream?: MediaStream | null;
  /** Opcjonalne zewnętrzne źródło dźwięku modelu AI */
  audioStreamSource?: MediaStream | AudioNode | null;
}

export const PodcastCore: React.FC<PodcastCoreProps> = ({
  wsUrl = 'wss://relay.teo.studio/rtmp-out',
  onStreamStateChange,
  guestStream = null,
  audioStreamSource = null,
}) => {
  // --- STANY SYSTEMOWE ---
  const [layout, setLayout] = useState<LayoutMode>('GRID');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [isCamActive, setIsCamActive] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'SELF' | 'GUEST' | 'ORB'>('SELF');

  // --- REFERENCJE DO ELEMENTÓW I STRUMIENI ---
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const guestVideoRef = useRef<HTMLVideoElement | null>(null);
  const orbCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const compositeAnimRef = useRef<number | null>(null);

  // 1. WEBRTC LOCAL CAMERA CAPTURE (Widok Siebie)
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 60 } },
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsCamActive(true);
      initAudioAnalyser(stream);
    } catch (err) {
      console.error('[PodcastCore] Błąd dostępu do kamery/mikrofonu:', err);
    }
  }, []);

  const stopLocalStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setIsCamActive(false);
  }, []);

  // 2. AUDIO ORB (Web Audio API Analyser dla PCM Modelu AI)
  const initAudioAnalyser = (streamSource: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      
      const source = audioCtx.createMediaStreamSource(streamSource);
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      drawOrb();
    } catch (e) {
      console.warn('[PodcastCore] Inicjalizacja AudioContext wstrzymana:', e);
    }
  };

  const drawOrb = () => {
    const canvas = orbCanvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Płynny impuls spoczynkowy (Fallback Idle Pulse)
        for (let i = 0; i < bufferLength; i++) dataArray[i] = Math.sin(Date.now() * 0.005 + i) * 20 + 30;
      }

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
      const avgAmplitude = sum / bufferLength;

      if (avgAmplitude > 70 && activeSpeaker !== 'ORB') {
        setActiveSpeaker('ORB');
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 60 + (avgAmplitude / 255) * 45;

      // Aura świetlna (Glow Gradient)
      const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.2, centerX, centerY, baseRadius * 1.8);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Dynamiczny Rdzeń AI
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pierścień Widmowy Waveform
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * Math.PI * 2;
        const offset = (dataArray[i] / 255) * 20;
        const x = centerX + Math.cos(angle) * (baseRadius + 12 + offset);
        const y = centerY + Math.sin(angle) * (baseRadius + 12 + offset);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // 3. GOŚĆ LIVE (Podłączenie zewnętrznego strumienia wideo)
  useEffect(() => {
    if (guestVideoRef.current && guestStream) {
      guestVideoRef.current.srcObject = guestStream;
    }
  }, [guestStream]);

  // 4. RTMP BROADCAST ENGINE (Offscreen Canvas 1080p 60FPS -> WebSocket Ingest)
  const startRTMPBroadcast = useCallback(() => {
    const canvas = compositeCanvasRef.current;
    if (!canvas) return;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[PodcastCore] Połączono z przekaźnikiem RTMP WebSocket');
        setIsBroadcasting(true);
        onStreamStateChange?.(true);

        const stream = canvas.captureStream(60); // 60 FPS 1080p Stream
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8,opus',
          videoBitsPerSecond: 4500000,
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };

        mediaRecorder.start(250); // Pakiety wysyłane co 250ms
        mediaRecorderRef.current = mediaRecorder;
      };

      ws.onerror = (err) => {
        console.error('[PodcastCore] Błąd WebSocket RTMP Relay:', err);
        stopRTMPBroadcast();
      };

      ws.onclose = () => {
        stopRTMPBroadcast();
      };
    } catch (e) {
      console.error('[PodcastCore] Nieudana inicjalizacja WebSocket RTMP:', e);
    }
  }, [wsUrl, onStreamStateChange]);

  const stopRTMPBroadcast = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
    mediaRecorderRef.current = null;
    setIsBroadcasting(false);
    onStreamStateChange?.(false);
  }, [onStreamStateChange]);

  // 5. RENDERING KOMPOZYTOWY CANVASA DLA TRANSMISJI YOUTUBE RTMP
  useEffect(() => {
    const canvas = compositeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawComposite = () => {
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (localVideoRef.current && isCamActive) {
        ctx.drawImage(localVideoRef.current, 0, 0, canvas.width / 2, canvas.height);
      }
      if (guestVideoRef.current && guestStream) {
        ctx.drawImage(guestVideoRef.current, canvas.width / 2, 0, canvas.width / 2, canvas.height);
      }
      if (orbCanvasRef.current) {
        ctx.drawImage(orbCanvasRef.current, canvas.width / 2 - 150, canvas.height - 320, 300, 300);
      }

      compositeAnimRef.current = requestAnimationFrame(drawComposite);
    };

    drawComposite();

    return () => {
      if (compositeAnimRef.current) cancelAnimationFrame(compositeAnimRef.current);
    };
  }, [isCamActive, guestStream]);

  useEffect(() => {
    initLocalStream();
    return () => {
      stopLocalStream();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [initLocalStream, stopLocalStream]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[650px] bg-[#050608] text-white flex flex-col justify-between p-4 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Ukryty Canvas kompozytowy 1080p 60FPS dla Ingestu RTMP */}
      <canvas ref={compositeCanvasRef} width={1920} height={1080} className="hidden" />

      {/* --- PAN INFORMACYJNY I BROADCAST CONTROL --- */}
      <div className="flex items-center justify-between z-10 bg-black/40 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-cyan-300">TeO Studio // Podcast 1/1</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-gray-400">LAYOUT:</span>
            <span className="text-cyan-400 font-bold">{layout}</span>
          </div>

          <button
            onClick={isBroadcasting ? stopRTMPBroadcast : startRTMPBroadcast}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg ${
              isBroadcasting
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/50 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/30'
            }`}
          >
            {isBroadcasting ? '● LIVE RTMP' : 'START BROADCAST'}
          </button>
        </div>
      </div>

      {/* --- SCENA DYNAMICZNA / GRID --- */}
      <div className="relative flex-1 my-4 grid gap-4 transition-all duration-500 ease-out grid-cols-1 md:grid-cols-2">
        {/* 1. WIDOK SIEBIE */}
        <div
          onClick={() => setLayout('FOCUS_SELF')}
          className={`relative rounded-xl overflow-hidden border transition-all duration-500 cursor-pointer bg-black/60 flex items-center justify-center ${
            layout === 'FOCUS_SELF'
              ? 'col-span-2 row-span-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.3)]'
              : 'border-white/10 hover:border-cyan-500/50'
          } ${layout === 'FOCUS_GUEST' || layout === 'FOCUS_ORB' ? 'absolute bottom-4 right-4 w-48 h-32 z-20 border-cyan-400 shadow-2xl' : ''}`}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
          <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-md text-xs font-mono border border-white/10 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isCamActive ? 'bg-green-400' : 'bg-red-500'}`} />
            <span>JA (LOKALNY)</span>
          </div>
        </div>

        {/* 2. GOŚĆ LIVE */}
        <div
          onClick={() => setLayout('FOCUS_GUEST')}
          className={`relative rounded-xl overflow-hidden border transition-all duration-500 cursor-pointer bg-black/60 flex items-center justify-center ${
            layout === 'FOCUS_GUEST'
              ? 'col-span-2 row-span-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
              : 'border-white/10 hover:border-purple-500/50'
          } ${layout === 'FOCUS_SELF' ? 'absolute bottom-4 right-4 w-48 h-32 z-20 border-purple-400 shadow-2xl' : ''}`}
        >
          {guestStream ? (
            <video ref={guestVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center text-xs font-mono">
                +
              </div>
              <span className="text-xs font-mono tracking-wider">WAITING FOR LIVE GUEST</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-md text-xs font-mono border border-white/10 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${guestStream ? 'bg-green-400' : 'bg-amber-400 animate-ping'}`} />
            <span>GOŚĆ LIVE</span>
          </div>
        </div>

        {/* 3. AI ORB */}
        <div
          onClick={() => setLayout(layout === 'FOCUS_ORB' ? 'GRID' : 'FOCUS_ORB')}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-30 cursor-pointer ${
            layout === 'FOCUS_ORB' ? 'scale-150' : 'scale-100 hover:scale-110'
          }`}
        >
          <div className="relative flex flex-col items-center justify-center">
            <canvas ref={orbCanvasRef} width={240} height={240} className="rounded-full" />
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[10px] font-mono tracking-widest text-cyan-300 shadow-lg">
              AI MODEL ORB
            </span>
          </div>
        </div>
      </div>

      {/* --- PANEL STEROWANIA URZĄDZENIAMI I UŁOŻENIEM --- */}
      <div className="flex items-center justify-between z-10 bg-black/40 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-lg border transition-all ${
              isMicMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isMicMuted ? 'MIC OFF' : 'MIC ON'}
          </button>
          <button
            onClick={isCamActive ? stopLocalStream : initLocalStream}
            className={`p-2.5 rounded-lg border transition-all ${
              !isCamActive ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isCamActive ? 'CAM ON' : 'CAM OFF'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {(['GRID', 'FOCUS_SELF', 'FOCUS_GUEST', 'FOCUS_ORB'] as LayoutMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-mono transition-all ${
                layout === mode
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {mode.replace('FOCUS_', '')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastCore;
