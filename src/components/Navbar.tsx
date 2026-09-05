import React, { useState, useEffect } from 'react';
import { Menu, Clock, Store, ShoppingCart } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { formatDateTime } from '../utils/format';

export const Navbar: React.FC = () => {
  const { toggleSidebar, activeTab, setActiveTab, cart, currentUser, settings } = usePOS();
  const [currentTime, setCurrentTime] = useState(formatDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatDateTime());
    }, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Penjualan';
      case 'kasir': return 'Point of Sale (Kasir)';
      case 'menu': return 'Manajemen Menu Produk';
      case 'pesanan': return 'Daftar Pesanan & Dapur';
      case 'riwayat': return 'Riwayat Transaksi';
      case 'stok': return 'Manajemen Stok Bahan';
      case 'laporan': return 'Laporan & Analitik';
      case 'pengaturan': return 'Pengaturan Restoran';
      default: return 'KAF Chicken';
    }
  };

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-20 px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Left side: Hamburger & View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 active:scale-95 transition-all border border-zinc-800"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-sm lg:text-base font-bold text-zinc-100 flex items-center gap-2 font-mono tracking-tight">
            <span>{getTabTitle()}</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </h1>
          <p className="text-[10px] font-mono text-zinc-400 hidden sm:block">
            {settings.storeName} // {settings.tagline}
          </p>
        </div>
      </div>

      {/* Right side: Store Status, Clock, Quick POS Cart button */}
      <div className="flex items-center gap-2 sm:gap-3 font-mono">
        {/* Status resto */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-800/60 text-[11px] font-semibold text-emerald-400">
          <Store className="w-3.5 h-3.5" />
          <span>TERMINAL_ONLINE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950/80 text-zinc-300 text-[11px] border border-zinc-800">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{currentTime}</span>
        </div>

        {/* Quick Cart button if not currently on kasir */}
        {activeTab !== 'kasir' && (
          <button
            onClick={() => setActiveTab('kasir')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all border border-red-500/40"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">KASIR</span>
            {totalCartCount > 0 && (
              <span className="bg-zinc-950 text-amber-400 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border border-amber-400/40">
                {totalCartCount}
              </span>
            )}
          </button>
        )}

        {/* Current User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-xs">
            {currentUser?.name.charAt(0) || 'K'}
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <span className="text-xs font-bold text-zinc-200 block truncate max-w-[100px]">{currentUser?.name}</span>
            <span className="text-[10px] text-red-400 font-semibold uppercase">{currentUser?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
