import React, { useState, useRef, useEffect } from 'react';
import { cn } from './ui/utils'; // Make sure you have this utility or adapt as needed

interface HoverVideoPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  videoSrc: string; // Path to the video file
  posterSrc: string; // Path to the image file to show initially
  videoClassName?: string; // Optional classes for the <video> tag itself
}

export function HoverVideoPlayer({
  videoSrc,
  posterSrc,
  className, // Classes for the outer container div
  videoClassName, // Classes for the <video> tag
  ...props
}: HoverVideoPlayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Play or pause the video based on hover state
    if (videoRef.current) {
      if (isHovered) {
        // Attempt to play when hovered
        videoRef.current.play().catch(error => {
          console.error("Video play failed:", error);
        });
      } else {
        // Pause and reset when not hovered
        videoRef.current.pause();
        // Set the current time back to the start
        videoRef.current.currentTime = 0;
        // Optional but recommended: Call load() to reset and show poster reliably
        // Some browsers might not show the poster just by setting currentTime to 0
        videoRef.current.load();
      }
    }
  }, [isHovered]);

  return (
    // Outer div handles hover and elevation effect
    <div
      className={cn(
        'relative overflow-hidden cursor-pointer', // Base styles
        'transition-all duration-300 ease-in-out', // Smooth transition
        isHovered ? 'scale-105 -translate-y-1 shadow-2xl' : 'shadow-xl', // Hover effect
        className // Allow custom container styles (like rounded corners, border)
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Video element */}
      <video
      ref={videoRef}
      src={videoSrc}
      poster={posterSrc}
      loop
      muted
      playsInline
      preload="metadata" // <-- Add this preload hint
      className={cn(
        "w-full h-full object-cover block", // Stays the same - fills container
        videoClassName
      )}
    >
      Your browser does not support the video tag.
    </video>
    </div>
  );
}