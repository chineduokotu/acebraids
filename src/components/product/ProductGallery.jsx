import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export const ProductGallery = ({ images = [], videos = [], productName = '' }) => {
  const hasVideos = Array.isArray(videos) && videos.length > 0;
  const validImages = Array.isArray(images) && images.length > 0 ? images : [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(hasVideos);

  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedVideoIndex(0);
    setIsVideoMode(Array.isArray(videos) && videos.length > 0);
  }, [productName, videos, images]);

  const activeImage = validImages[selectedImageIndex] || (validImages.length > 0 ? validImages[0] : { url: '/uploads/IMG_4065.PNG', alt: productName });
  const activeVideo = hasVideos ? (videos[selectedVideoIndex] || videos[0]) : null;

  const totalThumbnails = validImages.length + (hasVideos ? videos.length : 0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Selector Strip */}
      {totalThumbnails > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto no-scrollbar py-1 md:py-0 flex-shrink-0">
          {validImages.map((img, idx) => (
            <button
              key={`img-${idx}`}
              type="button"
              onClick={() => {
                setSelectedImageIndex(idx);
                setIsVideoMode(false);
              }}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border transition-all flex-shrink-0 bg-neutral-100 ${
                !isVideoMode && selectedImageIndex === idx
                  ? 'border-neutral-900 opacity-100 ring-1 ring-neutral-900'
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

          {/* Video Thumbnails */}
          {hasVideos && videos.map((vid, vIdx) => (
            <button
              key={`vid-${vIdx}`}
              type="button"
              onClick={() => {
                setSelectedVideoIndex(vIdx);
                setIsVideoMode(true);
              }}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border transition-all flex-shrink-0 bg-neutral-900 flex items-center justify-center ${
                isVideoMode && selectedVideoIndex === vIdx
                  ? 'border-neutral-900 opacity-100 ring-1 ring-neutral-900'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {vid.posterUrl ? (
                <img
                  src={vid.posterUrl}
                  alt={`${productName} video ${vIdx + 1}`}
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
          ))}
        </div>
      )}

      {/* Main Stage */}
      <div className="flex-1 relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {isVideoMode && activeVideo ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video
              key={activeVideo.url}
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
