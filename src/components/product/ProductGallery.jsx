import React, { useState } from 'react';
import { Play } from 'lucide-react';

export const ProductGallery = ({ images = [], videos = [], productName = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);

  const validImages = images.length > 0 ? images : [{ url: '/uploads/IMG_4065.PNG', alt: productName }];
  const activeImage = validImages[selectedIndex] || validImages[0];
  const activeVideo = videos.length > 0 ? videos[0] : null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Selector Strip */}
      {(validImages.length > 1 || activeVideo) && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto no-scrollbar py-1 md:py-0 flex-shrink-0">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setIsVideoMode(false);
              }}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border transition-all flex-shrink-0 bg-neutral-100 ${
                !isVideoMode && selectedIndex === idx
                  ? 'border-neutral-900 opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={`${productName} view ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/uploads/IMG_4065.PNG';
                }}
              />
            </button>
          ))}

          {/* Video Thumbnail */}
          {activeVideo && (
            <button
              type="button"
              onClick={() => setIsVideoMode(true)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border transition-all flex-shrink-0 bg-neutral-900 flex items-center justify-center ${
                isVideoMode
                  ? 'border-neutral-900 opacity-100'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {activeVideo.posterUrl ? (
                <img
                  src={activeVideo.posterUrl}
                  alt="Video reel preview"
                  className="w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Main Stage */}
      <div className="flex-1 relative aspect-[3/4] bg-neutral-100 overflow-hidden">
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
          <div className="w-full h-full">
            <img
              src={activeImage.url}
              alt={activeImage.alt || productName}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = '/uploads/IMG_4065.PNG';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
