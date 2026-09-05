import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Product, Category } from '../../types';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/format';

const PRESET_IMAGES = [
  { label: 'Ayam Crispy Golden', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80' },
  { label: 'Ayam Spicy Merah', url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=80' },
  { label: 'Ayam Drumstick', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80' },
  { label: 'Burger Crispy', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
  { label: 'Nasi Chicken Box', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80' },
  { label: 'French Fries', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80' },
  { label: 'Nugget Crispy', url: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500&auto=format&fit=crop&q=80' },
  { label: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80' },
  { label: 'Jus Jeruk Segar', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80' },
  { label: 'Paket Combo Komplit', url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80' },
];

export const MenuManagementView: React.FC = () => {
  const { products, addProduct, editProduct, deleteProduct, toggleProductStatus } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<Category>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<Category, 'Semua'>>('Fried Chicken');
  const [formPrice, setFormPrice] = useState<string>('15000');
  const [formCostPrice, setFormCostPrice] = useState<string>('8000');
  const [formStock, setFormStock] = useState<string>('50');
  const [formImage, setFormImage] = useState(PRESET_IMAGES[0].url);
  const [formDescription, setFormDescription] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);

  const categories: Category[] = ['Semua', 'Fried Chicken', 'Burger', 'Rice', 'Snack', 'Drinks', 'Paket'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Fried Chicken');
    setFormPrice('18000');
    setFormCostPrice('10000');
    setFormStock('40');
    setFormImage(PRESET_IMAGES[0].url);
    setFormDescription('Menu lezat dan renyah khas KAF Chicken.');
    setFormIsAvailable(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormCostPrice(String(product.costPrice || 0));
    setFormStock(String(product.stock));
    setFormImage(product.image);
    setFormDescription(product.description || '');
    setFormIsAvailable(product.isAvailable);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const priceNum = Math.max(0, Number(formPrice) || 0);
    const costPriceNum = Math.max(0, Number(formCostPrice) || 0);
    const stockNum = Math.max(0, Number(formStock) || 0);

    if (editingProduct) {
      editProduct(editingProduct.id, {
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        costPrice: costPriceNum,
        stock: stockNum,
        image: formImage.trim() || PRESET_IMAGES[0].url,
        description: formDescription.trim(),
        isAvailable: formIsAvailable,
      });
    } else {
      addProduct({
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        costPrice: costPriceNum,
        stock: stockNum,
        image: formImage.trim() || PRESET_IMAGES[0].url,
        description: formDescription.trim(),
        isAvailable: formIsAvailable,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-6 space-y-4 font-mono text-zinc-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            CATALOG_MANAGEMENT // MENU RESTORAN
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
            Konfigurasi harga jual, HPP, stok unit, ketersediaan, dan visual KAF Chicken
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          id="btn-add-new-menu"
          className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg border border-red-500/60 shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>TAMBAH_MENU</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
                  ${selectedCategory === cat
                    ? 'bg-zinc-800 border-red-500 text-white ring-1 ring-red-500/40'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_CATALOG..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            id={`menu-item-row-${product.id}`}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div className="flex gap-3">
              {/* Product Photo */}
              <div className="relative w-18 h-18 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center">
                    <span className="text-[9px] font-bold uppercase text-red-400 bg-red-950/80 border border-red-800 px-1.5 py-0.5 rounded">
                      OUT_OF_STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 font-mono">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/60 px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    STK: <strong className="text-zinc-100 font-bold">{product.stock}</strong>
                  </span>
                </div>

                <h3 className="text-xs font-bold text-zinc-100 mt-1 truncate">
                  {product.name}
                </h3>
                <p className="text-xs font-black text-red-400 mt-0.5 font-mono">
                  {formatRupiah(product.price)}
                </p>

                <p className="text-[10px] text-zinc-500 line-clamp-1 mt-1 font-sans">
                  {product.description || 'Tanpa deskripsi'}
                </p>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
              {/* Availability status toggle */}
              <button
                type="button"
                onClick={() => toggleProductStatus(product.id)}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer
                  ${product.isAvailable ? 'text-emerald-400' : 'text-zinc-500'}
                `}
              >
                {product.isAvailable ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px]">ACTIVE</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-zinc-500" />
                    <span className="text-[11px]">DISABLED</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(product)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Edit Menu"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(product.id)}
                  className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Hapus Menu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                {editingProduct ? 'EDIT_MENU_ITEM' : 'ADD_NEW_ITEM'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 p-1 rounded cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  ITEM_NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: KAF Chicken Garlic Parmesan"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    CATEGORY *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-hidden focus:border-red-500"
                  >
                    <option value="Fried Chicken">Fried Chicken</option>
                    <option value="Burger">Burger</option>
                    <option value="Rice">Rice</option>
                    <option value="Snack">Snack</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Paket">Paket</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    AVAILABILITY
                  </label>
                  <select
                    value={formIsAvailable ? 'true' : 'false'}
                    onChange={(e) => setFormIsAvailable(e.target.value === 'true')}
                    className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-hidden focus:border-red-500"
                  >
                    <option value="true">ACTIVE (READY)</option>
                    <option value="false">OUT_OF_STOCK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    PRICE (RP) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-red-400 outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    COST (HPP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-300 outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    STOCK_QTY
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              {/* Photo selection with presets */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  IMAGE_URL / ASSET
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-hidden focus:border-red-500"
                  />
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-8 h-8 rounded object-cover border border-zinc-800 shrink-0"
                    />
                  )}
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className={`text-[9px] px-2 py-0.5 rounded border font-semibold transition-all cursor-pointer
                        ${formImage === preset.url
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                        }
                      `}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Deskripsi bahan atau rasa lezat..."
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-hidden focus:border-red-500 font-sans"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-xs font-bold transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold border border-red-500/60 shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'SAVE_CHANGES' : 'CREATE_MENU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100">
          <div className="bg-zinc-900 rounded-xl p-5 max-w-sm w-full border border-zinc-800 shadow-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-zinc-100 uppercase">DELETE_CONFIRMATION</h3>
              <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                Menu ini akan dihapus permanen dari katalog dan antrean kasir.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-1.5 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 cursor-pointer"
              >
                BATAL
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 border border-red-500/60 cursor-pointer"
              >
                HAPUS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
