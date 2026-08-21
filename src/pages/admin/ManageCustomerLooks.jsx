import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Play, Film, AlertCircle } from 'lucide-react';
import { fetchAdminCustomerLooks, createCustomerLook, updateCustomerLook, deleteCustomerLook } from '../../api/customerLooks';
import { fetchProducts } from '../../api/products';
import { MediaUploader } from '../../components/admin/MediaUploader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

export const ManageCustomerLooks = () => {
  const [looks, setLooks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLook, setEditingLook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initialForm = {
    title: '',
    customerName: '',
    videoUrl: '',
    posterUrl: '',
    linkedProduct: '',
    order: 0,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [looksData, prodData] = await Promise.all([
        fetchAdminCustomerLooks(),
        fetchProducts({ limit: 100 }),
      ]);
      setLooks(looksData || []);
      setProducts(prodData.products || []);
    } catch (err) {
      console.error('Failed to load customer looks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingLook(null);
    setFormData({
      ...initialForm,
      linkedProduct: products[0]?._id || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (look) => {
    setEditingLook(look);
    setFormData({
      title: look.title || '',
      customerName: look.customerName || '',
      videoUrl: look.videoUrl || '',
      posterUrl: look.posterUrl || '',
      linkedProduct: look.linkedProduct?._id || look.linkedProduct || '',
      order: look.order || 0,
      isActive: Boolean(look.isActive),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer look video?')) {
      try {
        await deleteCustomerLook(id);
        setLooks(prev => prev.filter(l => l._id !== id));
        setFeedback({ type: 'success', text: 'Video look removed' });
      } catch (err) {
        setFeedback({ type: 'error', text: err.message });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (editingLook) {
        await updateCustomerLook(editingLook._id, formData);
        setFeedback({ type: 'success', text: 'Customer look updated' });
      } else {
        await createCustomerLook(formData);
        setFeedback({ type: 'success', text: 'Customer look created' });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Customer Looks Videos
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage the vertical (9:16) video reel carousel showcased on the homepage.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="text-xs font-bold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Video Look</span>
        </Button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border border-rose-800 text-rose-300'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Grid of video look cards */}
      {loading ? (
        <Loader text="Loading video reels..." />
      ) : looks.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center text-xs text-neutral-500">
          No customer looks added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {looks.map((look) => (
            <div
              key={look._id}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-soft flex flex-col justify-between"
            >
              {/* Media Preview Stage */}
              <div className="relative aspect-[9/16] bg-black">
                <img
                  src={look.posterUrl || '/uploads/IMG_4065.PNG'}
                  alt={look.title}
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                    {look.customerName || 'Ace Customer'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-heading font-bold text-sm truncate">{look.title}</h4>
                  <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                    Product: {look.linkedProduct?.name || 'Tagged Hair'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-neutral-950 flex items-center justify-between border-t border-neutral-800">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  look.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {look.isActive ? 'Active' : 'Hidden'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(look)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition"
                    title="Edit look"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(look._id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 transition"
                    title="Delete look"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="font-heading font-extrabold text-lg text-white">
                {editingLook ? 'Edit Customer Video Look' : 'Add Customer Video Look'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Headline / Caption *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Knotless Goddess in London"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Customer / Model Credit</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Tiwa A. (London, UK)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Tagged Product to Buy *</label>
                <select
                  required
                  value={formData.linkedProduct}
                  onChange={(e) => setFormData({ ...formData, linkedProduct: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                >
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} (£{p.price})</option>
                  ))}
                </select>
              </div>

              {/* Media Uploader */}
              <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <MediaUploader
                  label="Upload Video or Poster"
                  onUploadSuccess={(url, isVideo) => {
                    if (isVideo) {
                      setFormData(prev => ({ ...prev, videoUrl: url }));
                    } else {
                      setFormData(prev => ({ ...prev, posterUrl: url }));
                    }
                  }}
                />

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Video URL (MP4 / WebM) *</label>
                  <input
                    type="text"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="/uploads/my-video.mp4"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Poster / Thumbnail Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    placeholder="/uploads/poster.png or https://..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-neutral-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="accent-ace-pink w-4 h-4 rounded"
                  />
                  <span>Active & Visible on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={saving}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Save Look
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
