import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadMediaFile } from '../../api/upload';

export const MediaUploader = ({ onUploadSuccess, label = 'Upload Image or Video' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successUrl, setSuccessUrl] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccessUrl(null);

    try {
      const data = await uploadMediaFile(file);
      if (data.url) {
        setSuccessUrl(data.url);
        if (onUploadSuccess) {
          onUploadSuccess(data.url, data.isVideo);
        }
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
        {label}
      </label>

      <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-700 hover:border-ace-pink/70 rounded-2xl cursor-pointer bg-neutral-900/60 transition group">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-ace-pink transition mb-2" />
          <span className="text-xs font-semibold text-neutral-300 group-hover:text-white">
            {uploading ? 'Uploading media...' : 'Click to browse image or video'}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1">
            PNG, JPG, WEBP, MP4, MOV (up to 100MB)
          </span>
        </div>
      </label>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {successUrl && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Uploaded: <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-[11px]">{successUrl}</code></span>
        </div>
      )}
    </div>
  );
};
