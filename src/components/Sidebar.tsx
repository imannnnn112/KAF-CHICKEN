import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  UtensilsCrossed, 
  ClipboardList, 
  History, 
  Boxes, 
  BarChart3, 
  Settings, 
  LogOut, 
  Flame, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { usePOS, ActiveTab } from '../context/POSContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarOpen, 
    setSidebarOpen, 
    toggleSidebar, 
    currentUser, 
    logout, 
    cart, 
    stockItems 
  } = usePOS();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = stockItems.filter(item => item.status !== 'Aman').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kasir', label: 'Kasir (POS)', icon: ShoppingCart, badge: totalCartItems > 0 ? totalCartItems : undefined, badgeColor: 'bg-amber-400 text-slate-900' },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'pesanan', label: 'Pesanan', icon: ClipboardList },
    { id: 'riwayat', label: 'Riwayat Transaksi', icon: History },
    { id: 'stok', label: 'Stok Bahan', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-red-500 text-white' },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-zinc-950 text-zinc-100 border-r border-zinc-800 transition-all duration-300 shadow-xl
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActiveTab('kasir')}>
            <div className="w-9 h-9 rounded-lg bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center font-extrabold shadow-xs shrink-0">
              <Flame className="w-5 h-5 fill-red-500 text-amber-400" />
            </div>
            {sidebarOpen && (
              <div className="leading-tight select-none">
                <div className="font-bold tracking-tight text-sm text-zinc-100 flex items-center gap-1.5 font-mono">
                  <span>KAF CHICKEN</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">POS</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 tracking-wider">
                  SYS://RESTO.v2.4
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-700/60 transition-colors"
            title={sidebarOpen ? 'Persempit Menu' : 'Perluas Menu'}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative border
                  ${isActive 
                    ? 'bg-zinc-900 text-zinc-100 border-zinc-700 shadow-xs font-semibold' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border-transparent'
                  }
                  ${!sidebarOpen ? 'justify-center' : ''}
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                
                {sidebarOpen && (
                  <span className="truncate flex-1 text-left font-mono tracking-tight">{item.label}</span>
                )}

                {/* Active indicator bar */}
                {isActive && sidebarOpen && (
                  <span className="w-1 h-3.5 rounded-full bg-red-500 shrink-0" />
                )}

                {/* Badge if any */}
                {item.badge !== undefined && (
                  <span 
                    className={`inline-flex items-center justify-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border
                      ${isActive 
                        ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }
                      ${!sidebarOpen ? 'absolute top-1.5 right-1.5 text-[9px] w-4 h-4 p-0' : ''}
                    `}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on collapsed state */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Low Stock Warning Alert if any */}
        {sidebarOpen && lowStockCount > 0 && (
          <div 
            onClick={() => setActiveTab('stok')}
            className="mx-2 mb-2 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-lg cursor-pointer hover:bg-amber-950/60 transition-all text-xs text-amber-300 flex items-start gap-2 font-mono"
          >
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200 text-[11px] uppercase tracking-wider">Telemetry: Stok Menipis</p>
              <p className="text-[10px] text-amber-400/80 mt-0.5">{lowStockCount} bahan perlu restock.</p>
            </div>
          </div>
        )}

        {/* User profile & Logout */}
        <div className="p-2 border-t border-zinc-800 bg-zinc-900/60">
          <div className={`flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center font-mono font-bold text-xs text-zinc-300">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-4 h-4 text-zinc-300" />
              )}
            </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-200 truncate font-mono">{currentUser?.name || 'Kasir KAF'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{currentUser?.role || 'Staff'}</span>
                </div>
              </div>
            )}

            {sidebarOpen && (
              <button
                id="btn-logout-sidebar"
                onClick={logout}
                title="Keluar / Ganti Akun"
                className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
