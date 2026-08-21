import React, { useState } from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';

export const ProductGallery = ({ images = [], videos = [], productName = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);

  // Combine images and videos for gallery navigation
  const validImages = images.length > 0 ? images : [{ url: '/uploads/IMG_4065.PNG', alt: productName }];
  const activeImage = validImages[selectedIndex] || validImages[0];
  const activeVideo = videos.length > 0 ? videos[0] : null;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Selector Strip */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto no-scrollbar py-1 lg:py-0 flex-shrink-0">
        {validImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedIndex(idx);
              setIsVideoMode(false);
            }}
            className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-ace-alt ${
              !isVideoMode && selectedIndex === idx
                ? 'border-ace-pink shadow-md scale-95'
                : 'border-ace-border/80 hover:border-ace-pink/50 opacity-80 hover:opacity-100'
            }`}
          >
            <img
              src={img.url}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=200&q=80';
              }}
            />
          </button>
        ))}

        {/* Video Thumbnail if product has video */}
        {activeVideo && (
          <button
            type="button"
            onClick={() => setIsVideoMode(true)}
            className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-black flex items-center justify-center ${
              isVideoMode
                ? 'border-ace-pink shadow-md scale-95'
                : 'border-ace-border/80 hover:border-ace-pink/50 opacity-80'
            }`}
          >
            {activeVideo.posterUrl ? (
              <img
                src={activeVideo.posterUrl}
                alt="Video poster"
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="w-full h-full bg-neutral-900" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-ace-pink text-white flex items-center justify-center shadow-lg">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Main Display Stage */}
      <div className="flex-1 relative aspect-[3/4] sm:aspect-[4/5] bg-ace-alt rounded-3xl overflow-hidden border border-ace-border/60 shadow-sm">
        {isVideoMode && activeVideo ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video
              src={activeVideo.url}
              poster={activeVideo.posterUrl}
              controls
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full group overflow-hidden">
            <img
              src={activeImage.url}
              alt={activeImage.alt || productName}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
