import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, AlertCircle, Layers, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import { MediaUploader } from '../../components/admin/MediaUploader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initialForm = {
    name: '',
    slug: '',
    image: '',
    description: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setFeedback({ type: 'error', text: 'Failed to load categories from server' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      image: cat.image || '',
      description: cat.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (cat) => {
    const confirmMessage = cat.itemCount > 0
      ? `Warning: "${cat.name}" has ${cat.itemCount} attached product(s). Are you sure you want to delete this category?`
      : `Are you sure you want to delete "${cat.name}"?`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteCategory(cat._id);
        setCategories(prev => prev.filter(c => c._id !== cat._id));
        setFeedback({ type: 'success', text: `Category "${cat.name}" deleted successfully` });
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Failed to delete category' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (!formData.name.trim()) {
        throw new Error('Category name is required');
      }
      if (!formData.image.trim()) {
        throw new Error('Cover image is required');
      }

      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        setFeedback({ type: 'success', text: `Category "${formData.name}" updated successfully` });
      } else {
        await createCategory(formData);
        setFeedback({ type: 'success', text: `Category "${formData.name}" created successfully` });
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error saving category' });
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-ace-pink" />
            <span>Category Management</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Organize catalog collections, banner imagery, and live filter taxonomies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-ace-pink hover:bg-ace-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-pink-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border border-rose-800 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Filter Strip */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ace-pink"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs font-semibold text-neutral-400">
          Total Collections: <strong className="text-white">{categories.length}</strong>
        </span>
      </div>

      {/* Categories Grid / Cards */}
      {loading ? (
        <div className="py-20"><Loader text="Loading collections..." /></div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-16 text-center bg-neutral-900 rounded-3xl border border-neutral-800">
          <Layers className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No collections found</h3>
          <p className="text-xs text-neutral-500 mb-4">Click "Add New Category" to create your first collection.</p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            + Create Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition group"
            >
              {/* Cover Image Header */}
              <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                
                {/* Product Count Pill */}
                <div className="absolute top-3 right-3 bg-neutral-900/90 backdrop-blur border border-neutral-700 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                  {cat.itemCount || 0} product(s)
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    {cat.name}
                  </h3>
                  <code className="text-[11px] text-ace-pink font-mono block mt-0.5">
                    /shop?category={cat.slug}
                  </code>
                  {cat.description && (
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">
                    ID: {cat._id?.slice(-6)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Create/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-ace-pink" />
                <span>{editingCategory ? 'Edit Category' : 'Create New Collection'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exquisite Cap Braided Wigs"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: editingCategory ? prev.slug : autoSlug,
                    }));
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  placeholder="exquisite-cap-braided-wigs"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 font-mono text-ace-pink rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description for category banner and SEO..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Cover / Banner Image *
                </label>
                
                {formData.image && (
                  <div className="relative mb-3 h-32 rounded-xl overflow-hidden border border-neutral-800">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 bg-neutral-950/80 text-rose-400 p-1.5 rounded-full hover:bg-neutral-950"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <MediaUploader
                  label="Upload Banner Media"
                  onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))}
                />

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Or paste direct image URL (https://...)"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-ace-pink"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  className="text-xs font-bold uppercase tracking-wider px-6 py-2.5 shadow-pink-glow"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
