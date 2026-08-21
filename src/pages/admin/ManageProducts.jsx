import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, AlertCircle, Image as ImageIcon, Video } from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { fetchCategories } from '../../api/categories';
import { MediaUploader } from '../../components/admin/MediaUploader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useCurrency } from '../../context/CurrencyContext';

export const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { format } = useCurrency();

  // Form State
  const initialForm = {
    name: '',
    slug: '',
    category: '',
    description: '',
    price: '',
    discountPrice: '',
    isFeatured: false,
    isNewArrival: false,
    isSoldOut: false,
    images: [{ url: '', alt: '' }],
    videos: [{ url: '', posterUrl: '' }],
    variants: [
      { label: '1B Natural Black / 30 Inch', color: '1B Natural Black', length: '30 Inch', capSize: 'Medium', stock: 15, sku: '' }
    ]
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchCategories(),
      ]);
      setProducts(prodData.products || []);
      setCategories(catData || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      category: prod.category?._id || prod.category || '',
      description: prod.description || '',
      price: prod.price || '',
      discountPrice: prod.discountPrice || '',
      isFeatured: Boolean(prod.isFeatured),
      isNewArrival: Boolean(prod.isNewArrival),
      isSoldOut: Boolean(prod.isSoldOut),
      images: prod.images?.length > 0 ? prod.images : [{ url: '', alt: '' }],
      videos: prod.videos?.length > 0 ? prod.videos : [{ url: '', posterUrl: '' }],
      variants: prod.variants?.length > 0 ? prod.variants : [
        { label: '1B Natural Black / 30 Inch', color: '1B Natural Black', length: '30 Inch', capSize: 'Medium', stock: 15, sku: '' }
      ],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(prev => prev.filter(p => p._id !== id));
        setFeedback({ type: 'success', text: 'Product deleted successfully' });
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Failed to delete' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const cleanData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        images: formData.images.filter(img => img.url.trim()),
        videos: formData.videos.filter(v => v.url.trim()),
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, cleanData);
        setFeedback({ type: 'success', text: 'Product updated successfully' });
      } else {
        await createProduct(cleanData);
        setFeedback({ type: 'success', text: 'Product created successfully' });
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error saving product' });
    } finally {
      setSaving(false);
    }
  };

  // Variant helper
  const addVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { label: '', color: '1B Natural Black', length: '30 Inch', capSize: 'Medium', stock: 10, sku: '' }
      ]
    }));
  };

  const removeVariantRow = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Manage Products
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create, edit styles, configure lengths, colors and upload imagery.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="text-xs font-bold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Product</span>
        </Button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border border-rose-800 text-rose-300'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Search Filter */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter products by name or slug..."
          className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-ace-pink"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader text="Loading catalog..." />
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Variants</th>
                  <th className="py-3.5 px-4 font-semibold">Flags</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-neutral-800/40 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={prod.images?.[0]?.url || '/uploads/IMG_4065.PNG'}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded-xl border border-neutral-700 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm font-heading line-clamp-1">{prod.name}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">/{prod.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-400">
                      {prod.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {format(prod.price)}
                      {prod.discountPrice && (
                        <span className="block text-[10px] text-emerald-400 font-normal">Sale: {format(prod.discountPrice)}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-neutral-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        {prod.variants?.length || 0} option(s)
                      </span>
                    </td>
                    <td className="py-4 px-4 space-x-1">
                      {prod.isFeatured && (
                        <span className="bg-pink-950 text-ace-pink border border-pink-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Featured
                        </span>
                      )}
                      {prod.isNewArrival && (
                        <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          New
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 hover:text-white transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <h3 className="font-heading font-extrabold text-lg text-white">
                {editingProduct ? 'Edit Hair Product' : 'Create New Hair Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Empress HD Boho Braided Wig"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-if-empty"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Price (£ GBP) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="199.99"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Discount / Sale Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="179.99"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Description *</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed luxury hair styling features, fiber blend, lace quality..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-ace-pink"
                  />
                </div>
              </div>

              {/* Media Upload Helper */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product Imagery & Media</h4>
                <MediaUploader
                  label="Upload Photos or Videos to Server"
                  onUploadSuccess={(url, isVideo) => {
                    if (isVideo) {
                      setFormData(prev => ({
                        ...prev,
                        videos: [{ url, posterUrl: prev.images[0]?.url || '' }]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        images: [{ url, alt: prev.name }, ...prev.images.filter(i => i.url)]
                      }));
                    }
                  }}
                />

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Main Image URL</label>
                  <input
                    type="text"
                    value={formData.images[0]?.url || ''}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[0] = { url: e.target.value, alt: formData.name };
                      setFormData({ ...formData, images: newImages });
                    }}
                    placeholder="/uploads/... or https://..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Variants (Colors, Lengths, Stock)</h4>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="text-xs font-bold text-ace-pink hover:underline"
                  >
                    + Add Variant
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-xs">
                      <input
                        type="text"
                        placeholder="Color (1B, #27, etc)"
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].color = e.target.value;
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="col-span-3 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Length (28 Inch)"
                        value={v.length}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].length = e.target.value;
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="col-span-3 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-white text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].stock = Number(e.target.value);
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="col-span-2 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Cap Size"
                        value={v.capSize}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].capSize = e.target.value;
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="col-span-3 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(idx)}
                        disabled={formData.variants.length <= 1}
                        className="col-span-1 text-neutral-500 hover:text-rose-400 text-center"
                      >
                        <X className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 text-xs text-neutral-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-ace-pink w-4 h-4 rounded"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-ace-pink w-4 h-4 rounded"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  {editingProduct ? 'Save Changes' : 'Publish Style'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
