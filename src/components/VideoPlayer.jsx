import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, ArrowLeft, Settings, Subtitles
} from "lucide-react";
import { getById } from "../data/catalog";
import { useApp } from "../context/AppContext";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToContinue } = useApp();
  const item = getById(id);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (item) addToContinue(item, 0);
  }, []);

  const resetControlsTimer = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (item) addToContinue(item, (v.currentTime / v.duration) * 100);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    v.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) videoRef.current.volume = vol;
    setMuted(vol === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (muted) { v.muted = false; v.volume = volume || 0.5; setMuted(false); }
    else { v.muted = true; setMuted(true); }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const skip = (seconds) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.currentTime + seconds, duration));
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Contenuto non trovato</p>
          <button onClick={() => navigate("/")} className="bg-red-600 text-white px-6 py-2 rounded-lg">
            Torna alla home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={resetControlsTimer}
      onClick={togglePlay}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={item.videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onEnded={() => { setPlaying(false); setShowControls(true); }}
        poster={item.backdrop}
      />

      {/* Buffering Spinner */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Center Play Icon */}
      {!playing && !buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
            <Play size={48} className="text-white" fill="white" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={24} />
            <span className="hidden sm:block text-sm font-medium">Indietro</span>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-lg md:text-xl truncate">{item.title}</h1>
            <p className="text-gray-400 text-xs">{item.year} • {item.type === "movie" ? item.duration : `Serie TV`}</p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 md:p-6">
          {/* Progress Bar */}
          <div
            className="relative h-1 bg-gray-600/60 rounded-full cursor-pointer group/progress mb-4 hover:h-2 transition-all"
            onClick={handleSeek}
          >
            <div
              className="absolute left-0 top-0 h-full bg-red-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:scale-110 transition-transform"
            >
              {playing ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
            </button>

            {/* Skip */}
            <button onClick={() => skip(-10)} className="text-white hover:text-gray-300 transition-colors hidden sm:block">
              <SkipBack size={22} />
            </button>
            <button onClick={() => skip(10)} className="text-white hover:text-gray-300 transition-colors hidden sm:block">
              <SkipForward size={22} />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
                {muted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="hidden sm:block w-20 accent-red-500 cursor-pointer"
              />
            </div>

            {/* Time */}
            <div className="text-gray-300 text-xs md:text-sm font-mono whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Quality Badge */}
            <span className="hidden md:block text-gray-400 text-xs border border-gray-600 px-2 py-0.5 rounded">
              {quality}
            </span>

            {/* Subtitles */}
            <button className="text-gray-400 hover:text-white transition-colors hidden md:block">
              <Subtitles size={20} />
            </button>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
              {showSettings && (
                <div className="absolute bottom-10 right-0 bg-gray-900 border border-gray-700 rounded-xl p-3 w-44 shadow-2xl">
                  <p className="text-gray-400 text-xs mb-2 font-semibold uppercase">Qualità</p>
                  {["4K Ultra HD", "1080p Full HD", "720p HD", "480p SD"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setQuality(q.split(" ")[0]); setShowSettings(false); }}
                      className={`block w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                        q.startsWith(quality) ? "text-red-400 bg-red-600/10" : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {fullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
