import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowDownCircle, 
  ArrowUpCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { StockItem, StockStatus } from '../../types';
import { usePOS } from '../../context/POSContext';

export const StockManagementView: React.FC = () => {
  const { stockItems, updateStock, addStockItem, deleteStockItem } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<StockItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<string>('10');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Bahan Utama');
  const [currentStock, setCurrentStock] = useState('20');
  const [minStock, setMinStock] = useState('10');
  const [unit, setUnit] = useState('kg');

  // Counts
  const amanCount = stockItems.filter(i => i.status === 'Aman').length;
  const menipisCount = stockItems.filter(i => i.status === 'Menipis').length;
  const habisCount = stockItems.filter(i => i.status === 'Habis').length;

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'Semua' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenRestock = (item: StockItem) => {
    setRestockItem(item);
    setRestockAmount('10');
  };

  const handleApplyRestock = (multiplier: 1 | -1 = 1) => {
    if (!restockItem) return;
    const qty = (Number(restockAmount) || 0) * multiplier;
    updateStock(restockItem.id, restockItem.currentStock + qty);
    setRestockItem(null);
  };

  const handleCreateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addStockItem({
      name: name.trim(),
      category,
      currentStock: Math.max(0, Number(currentStock) || 0),
      minStock: Math.max(0, Number(minStock) || 0),
      unit: unit.trim() || 'pcs',
    });

    setIsAddModalOpen(false);
    setName('');
  };

  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case 'Aman':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/80 uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>STOK_AMAN</span>
          </span>
        );
      case 'Menipis':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/70 text-amber-400 border border-amber-800/80 uppercase animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>STOK_MENIPIS</span>
          </span>
        );
      case 'Habis':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/70 text-red-400 border border-red-800/80 uppercase">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>STOK_HABIS</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-6 space-y-4 font-mono text-zinc-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            INVENTORY_CONTROL // MANAJEMEN STOK & BAHAN BAKU
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
            Monitoring ketersediaan daging ayam segar, bumbu resep rahasia, kemasan, dan minyak goreng
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          id="btn-add-new-stock"
          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg border border-red-500/60 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>TAMBAH_BAHAN</span>
        </button>
      </div>

      {/* 3 Status Indicator Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div 
          onClick={() => setFilterStatus('Aman')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-zinc-900 shadow-xs font-mono
            ${filterStatus === 'Aman' ? 'border-emerald-500 ring-1 ring-emerald-500/40 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              NORMAL // STOK AMAN
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{amanCount}</span>
            <span className="text-[10px] text-zinc-500">KOMODITAS_CUKUP</span>
          </div>
        </div>

        <div 
          onClick={() => setFilterStatus('Menipis')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-zinc-900 shadow-xs font-mono
            ${filterStatus === 'Menipis' ? 'border-amber-500 ring-1 ring-amber-500/40 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              LOW // STOK MENIPIS
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{menipisCount}</span>
            <span className="text-[10px] text-zinc-500">PERLU_RESTOCK</span>
          </div>
        </div>

        <div 
          onClick={() => setFilterStatus('Habis')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-zinc-900 shadow-xs font-mono
            ${filterStatus === 'Habis' ? 'border-red-500 ring-1 ring-red-500/40 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              CRITICAL // STOK HABIS
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-400 font-mono">{habisCount}</span>
            <span className="text-[10px] text-zinc-500">ORDER_SUPPLIER</span>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-zinc-500 mr-1 uppercase">FILTER:</span>
          {['Semua', 'Aman', 'Menipis', 'Habis'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap border uppercase
                ${filterStatus === status
                  ? 'bg-zinc-800 border-red-500 text-white ring-1 ring-red-500/40'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_INGREDIENTS..."
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 outline-hidden font-mono"
          />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-4">ITEM_NAME</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">STOCK_LEVEL</th>
                <th className="py-2.5 px-3">MIN_LIMIT</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">LAST_TIMESTAMP</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-zinc-100 text-xs">
                      {item.name}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] font-semibold uppercase">
                      {item.category || 'Bahan'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-xs font-bold text-zinc-100 font-mono">
                      {item.currentStock}
                    </span>
                    <span className="text-zinc-500 ml-1 text-[11px]">{item.unit}</span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">
                    <span className="font-medium text-zinc-300">{item.minStock}</span> {item.unit}
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 text-[10px]">
                    {item.lastUpdated}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenRestock(item)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer uppercase"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>UPDATE</span>
                      </button>
                      <button
                        onClick={() => deleteStockItem(item.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Restock / Adjust Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 max-w-sm w-full shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">UPDATE_STOCK_LEVEL</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">{restockItem.name}</p>
              </div>
              <button onClick={() => setRestockItem(null)} className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-xs flex justify-between items-center">
              <span className="text-zinc-400">CURRENT_STOCK:</span>
              <span className="font-bold text-red-400 text-xs">{restockItem.currentStock} {restockItem.unit}</span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase">
                DELTA_QUANTITY ({restockItem.unit})
              </label>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-bold text-zinc-100 text-xs outline-hidden focus:border-red-500"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex gap-1.5">
              {[5, 10, 25, 50].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRestockAmount(String(val))}
                  className="flex-1 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs font-bold cursor-pointer"
                >
                  +{val}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleApplyRestock(-1)}
                className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowDownCircle className="w-3.5 h-3.5 text-red-400" />
                <span>KURANGI</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyRestock(1)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold border border-red-500/60 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>TAMBAH</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Stock Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 max-w-md w-full shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">ADD_NEW_RAW_MATERIAL</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStock} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase">MATERIAL_NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Daging Paha Ayam Fillet"
                  className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-bold outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-medium outline-hidden focus:border-red-500"
                  >
                    <option value="Bahan Utama">Bahan Utama</option>
                    <option value="Bumbu">Bumbu</option>
                    <option value="Minyak">Minyak</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Kemasan">Kemasan</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase">UNIT</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, liter, pack, pcs"
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase">INITIAL_STOCK</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-bold outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase">MINIMUM_THRESHOLD</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-bold outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold border border-red-500/60 shadow-xs cursor-pointer"
                >
                  SAVE_MATERIAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
