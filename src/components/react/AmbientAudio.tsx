import { useState, useRef, useEffect } from "react";
import { VolumeX, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FIXED_VOLUME = 0.28;

const AmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      try {
        audioRef.current.volume = FIXED_VOLUME;
      } catch {
        // Some browser contexts can reject volume assignment; playback should still work.
      }
    }
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      try {
        audio.volume = FIXED_VOLUME;
      } catch {
        // Keep playback available even when the browser controls volume itself.
      }
      audio.load();
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient-stream.mp3" preload="metadata" />

      <motion.button
        type="button"
        onClick={toggleAudio}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause creek sound" : "Play creek sound"}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-14 items-center justify-center rounded-full",
          "border border-border bg-background/85 text-muted-foreground shadow-lg backdrop-blur-md",
          "transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isPlaying && "text-primary"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </motion.button>
    </>
  );
};

export default AmbientAudio;
