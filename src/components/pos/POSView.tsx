import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Utensils, 
  Percent, 
  CreditCard, 
  Flame, 
  X,
  Check,
  Coffee,
  Package,
  Soup,
  Layers,
  Sparkles
} from 'lucide-react';
import { Category, Product, PaymentMethod } from '../../types';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/format';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';

export const POSView: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    discountPercent, 
    setDiscountPercent,
    orderType, 
    setOrderType,
    tableNumber, 
    setTableNumber,
    customerName, 
    setCustomerName,
    cartSubtotal,
    cartDiscountAmount,
    cartTax,
    cartTotal,
    activeReceipt,
    setActiveReceipt,
    settings
  } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<Category>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('Cash');

  // Categories list with custom icons
  const categories: { name: Category; icon: React.ElementType }[] = [
    { name: 'Semua', icon: Layers },
    { name: 'Fried Chicken', icon: Flame },
    { name: 'Burger', icon: Utensils },
    { name: 'Rice', icon: Soup },
    { name: 'Snack', icon: Sparkles },
    { name: 'Drinks', icon: Coffee },
    { name: 'Paket', icon: Package },
  ];

  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenPayment = () => {
    if (cart.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* LEFT COLUMN: Catalog & Products */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Control Bar: Search & Categories */}
        <div className="bg-zinc-900 p-3.5 border-b border-zinc-800 shrink-0 space-y-3">
          {/* Search bar & Order summary preview */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="pos-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu KAF Chicken (ID / Nama / Kategori)..."
                className="w-full pl-9 pr-9 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono focus:border-red-500 focus:ring-1 focus:ring-red-500/30 outline-hidden transition-all text-zinc-200 placeholder:text-zinc-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile View Cart Toggle */}
            <button
              onClick={() => setMobileCartOpen(true)}
              className="lg:hidden relative flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg font-mono font-bold text-xs active:scale-95 border border-red-500/50"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>KERANJANG</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-zinc-950 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  id={`cat-btn-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer border
                    ${isSelected 
                      ? 'bg-red-600 border-red-500 text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }
                  `}
                >
                  <Icon className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-zinc-500'}`} />
                  <span className="uppercase text-[11px]">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-3 lg:p-5 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500 font-mono">
              <ShoppingBag className="w-10 h-10 stroke-1 text-zinc-600 mb-2" />
              <p className="text-xs font-bold text-zinc-400">NO_ITEMS_FOUND</p>
              <p className="text-[11px] text-zinc-600 mt-1">Coba kata kunci lain atau pilih filter kategori Semua.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map(product => {
                const cartItem = cart.find(ci => ci.product.id === product.id);
                const quantityInCart = cartItem?.quantity || 0;

                return (
                  <div
                    key={product.id}
                    id={`product-card-${product.id}`}
                    className={`bg-zinc-900 rounded-xl border transition-all duration-150 overflow-hidden flex flex-col group font-mono
                      ${!product.isAvailable ? 'opacity-50 border-zinc-800' : 'border-zinc-800 hover:border-zinc-700'}
                      ${quantityInCart > 0 ? 'ring-1 ring-red-500 border-red-500' : ''}
                    `}
                  >
                    {/* Product Photo */}
                    <div className="relative aspect-4/3 bg-zinc-950 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />

                      {/* Category Pill */}
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-zinc-950/80 backdrop-blur-xs text-[9px] font-bold text-zinc-300 border border-zinc-800 uppercase tracking-wider">
                        {product.category}
                      </span>

                      {/* In Cart Indicator */}
                      {quantityInCart > 0 && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold border border-red-500 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>{quantityInCart}x</span>
                        </span>
                      )}

                      {/* Out of Stock Ribbon */}
                      {!product.isAvailable && (
                        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center">
                          <span className="bg-red-950/90 text-red-400 border border-red-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                            OUT_OF_STOCK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between font-sans">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-200 line-clamp-1 group-hover:text-red-400 transition-colors">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-zinc-800">
                        <div>
                          <span className="text-xs font-bold font-mono text-red-400">
                            {formatRupiah(product.price)}
                          </span>
                          <span className="block text-[9px] font-mono text-zinc-500">
                            STOK: {product.stock}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          id={`btn-add-product-${product.id}`}
                          disabled={!product.isAvailable}
                          onClick={() => addToCart(product)}
                          className={`px-2.5 py-1 rounded-md font-mono font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer border
                            ${product.isAvailable
                              ? 'bg-red-600 hover:bg-red-500 text-white border-red-500/50'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                            }
                          `}
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: POS Cart Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-40 w-full sm:w-96 lg:w-96 xl:w-[400px] bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl lg:shadow-none lg:static lg:translate-x-0 transition-transform duration-200
          ${mobileCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Cart Header */}
        <div className="p-3.5 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-zinc-950 border border-zinc-800 text-red-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-zinc-100 uppercase tracking-tight">
                ACTIVE_CART_DISPATCH
              </h2>
              <span className="text-[10px] text-zinc-500">
                {cart.length} item unik • {totalCartCount} total qty
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {cart.length > 0 && (
              <button
                type="button"
                id="btn-clear-cart"
                onClick={clearCart}
                className="p-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded border border-transparent hover:border-red-900 transition-colors cursor-pointer"
                title="Kosongkan Keranjang"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setMobileCartOpen(false)}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dine In / Takeaway and Table Picker */}
        <div className="p-3 bg-zinc-950 border-b border-zinc-800 space-y-2 shrink-0 font-mono">
          <div className="grid grid-cols-2 gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              type="button"
              id="btn-order-type-dinein"
              onClick={() => setOrderType('Dine In')}
              className={`py-1 text-xs font-bold rounded transition-all cursor-pointer
                ${orderType === 'Dine In'
                  ? 'bg-zinc-800 text-red-400 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              DINE IN
            </button>
            <button
              type="button"
              id="btn-order-type-takeaway"
              onClick={() => setOrderType('Takeaway')}
              className={`py-1 text-xs font-bold rounded transition-all cursor-pointer
                ${orderType === 'Takeaway'
                  ? 'bg-zinc-800 text-red-400 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              TAKEAWAY
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {orderType === 'Dine In' && (
              <div>
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  NO_MEJA
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Misal: 05"
                  className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-bold text-zinc-100 outline-hidden focus:border-red-500"
                />
              </div>
            )}
            <div className={orderType === 'Takeaway' ? 'col-span-2' : ''}>
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                CUSTOMER_NAME
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Pelanggan"
                className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-medium text-zinc-100 outline-hidden focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 py-12">
              <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-2">
                <ShoppingBag className="w-6 h-6 stroke-1" />
              </div>
              <p className="text-xs font-bold text-zinc-400">EMPTY_CART</p>
              <p className="text-[10px] text-zinc-600 mt-0.5 max-w-[200px]">
                Pilih menu pada grid katalog untuk menambahkan item transaksi.
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5 group hover:border-zinc-700 transition-colors"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-10 h-10 rounded object-cover shrink-0 border border-zinc-800"
                />

                {/* Name & price */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-200 truncate font-sans">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] font-bold text-amber-400 mt-0.5">
                    {formatRupiah(item.product.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-0.5 rounded text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-zinc-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="p-0.5 rounded text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1 text-zinc-500 hover:text-red-400 rounded transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Calculation & Checkout Panel */}
        <div className="p-3.5 bg-zinc-950 border-t border-zinc-800 shrink-0 space-y-2.5 font-mono">
          {/* Discount presets */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
              <Percent className="w-3 h-3 text-amber-400" />
              <span>DISCOUNT:</span>
            </span>
            <div className="flex items-center gap-1">
              {[0, 5, 10, 15].map(rate => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setDiscountPercent(rate)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border
                    ${discountPercent === rate
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }
                  `}
                >
                  {rate === 0 ? '0%' : `${rate}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown calculation */}
          <div className="space-y-1 text-[11px] text-zinc-400 border-t border-zinc-800 pt-2">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span className="font-bold text-zinc-200">{formatRupiah(cartSubtotal)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>DISCOUNT ({discountPercent}%):</span>
                <span>- {formatRupiah(cartDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>TAX (PPN {settings.taxRate}%):</span>
              <span className="font-bold text-zinc-200">{formatRupiah(cartTax)}</span>
            </div>

            <div className="flex justify-between text-xs font-bold text-zinc-100 pt-1.5 border-t border-zinc-800">
              <span className="uppercase">TOTAL_PAYABLE:</span>
              <span className="text-red-400 text-sm font-black">{formatRupiah(cartTotal)}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            id="btn-pay-now"
            disabled={cart.length === 0}
            onClick={handleOpenPayment}
            className={`w-full py-2.5 px-3 rounded-lg font-mono font-bold text-xs flex items-center justify-between transition-all cursor-pointer border
              ${cart.length > 0
                ? 'bg-red-600 hover:bg-red-500 text-white border-red-500/60 active:scale-98'
                : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
              }
            `}
          >
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>CHECKOUT_PAY</span>
            </div>
            <span className="font-black text-amber-300">
              {formatRupiah(cartTotal)}
            </span>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onShowReceipt={(trx) => setActiveReceipt(trx)}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        transaction={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
