import React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  PackageCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  ChevronRight, 
  Flame, 
  Plus, 
  Boxes, 
  Receipt,
  User
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/format';

export const DashboardView: React.FC = () => {
  const { transactions, products, stockItems, setActiveTab, setActiveReceipt } = usePOS();

  // Calculate metrics
  const totalSalesToday = transactions.reduce((sum, trx) => sum + trx.total, 0);
  const totalTransactionsToday = transactions.length;
  const totalItemsSold = transactions.reduce((sum, trx) => {
    return sum + trx.items.reduce((iSum, item) => iSum + item.quantity, 0);
  }, 0);
  const totalRevenue = transactions.reduce((sum, trx) => sum + trx.subtotal, 0);

  // Hourly sales distribution for the sales chart
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  // Calculate relative mockup heights based on actual sales count or simulated distribution
  const chartData = [
    { hour: '09:00', amount: 66000, count: 1 },
    { hour: '10:00', amount: 55000, count: 1 },
    { hour: '11:00', amount: 115500, count: 1 },
    { hour: '12:00', amount: 134200, count: 2 },
    { hour: '13:00', amount: 45000, count: 1 },
    { hour: '14:00', amount: 80000, count: 2 },
    { hour: '15:00', amount: 35000, count: 1 },
    { hour: '16:00', amount: 95000, count: 2 },
    { hour: '17:00', amount: 120000, count: 3 },
  ];

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  // Top selling products
  const productSalesMap: Record<string, { product: typeof products[0]; count: number; totalRupiah: number }> = {};
  transactions.forEach(trx => {
    trx.items.forEach(item => {
      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = { product: item.product, count: 0, totalRupiah: 0 };
      }
      productSalesMap[item.product.id].count += item.quantity;
      productSalesMap[item.product.id].totalRupiah += item.quantity * item.product.price;
    });
  });

  const topSellingList = Object.values(productSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-4 lg:p-6 space-y-4 font-sans">
      {/* Top Banner Greeting */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md text-[11px] text-zinc-300 font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-zinc-400 uppercase tracking-wider">NODE_STATUS:</span>
            <span className="text-emerald-400 font-bold">OPERATIONAL</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black font-mono tracking-tight text-zinc-100">
            KAF CHICKEN // TELEMETRY & SALES
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            Pemantauan transaksi realtime, throughput kasir, dan analitik stok menu aktif.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('kasir')}
          className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer border border-red-500/40"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>TERMINAL KASIR (POS)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {/* Total Penjualan */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              TOTAL_SALES_TODAY
            </span>
            <span className="text-xl font-bold text-zinc-100 mt-1 block">
              {formatRupiah(totalSalesToday)}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+14.2% vs prev_period</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-red-400 flex items-center justify-center font-bold shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Jumlah Transaksi */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              TRANSACTION_COUNT
            </span>
            <span className="text-xl font-bold text-zinc-100 mt-1 block">
              {totalTransactionsToday} <span className="text-xs font-normal text-zinc-500">TX</span>
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">
              Avg: {totalTransactionsToday > 0 ? formatRupiah(Math.round(totalSalesToday / totalTransactionsToday)) : 'Rp 0'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Produk Terjual */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              ITEMS_DISPATCHED
            </span>
            <span className="text-xl font-bold text-zinc-100 mt-1 block">
              {totalItemsSold} <span className="text-xs font-normal text-zinc-500">UNIT</span>
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">
              Throughput normal
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Pendapatan / Margin */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              NET_REVENUE
            </span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">
              Target harian: 92%
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-blue-400 flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2-Column Section: Sales Chart & Top Selling Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart (Hourly Trend) */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase tracking-tight">
                HISTOGRAM // VOLUME PENJUALAN PER JAM
              </h3>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Metrik checkout real-time per jam operasional KAF Chicken
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/40 px-2.5 py-1 rounded border border-red-800/60">
              STREAM: ACTIVE
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-52 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-zinc-800">
            {chartData.map((d, i) => {
              const heightPct = Math.round((d.amount / maxAmount) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-[9px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap shadow-md mb-1">
                    {formatRupiah(d.amount)}
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[32px] bg-zinc-950 rounded-t border-t border-x border-zinc-800 overflow-hidden h-full flex items-end">
                    <div
                      style={{ height: `${Math.max(15, heightPct)}%` }}
                      className="w-full bg-red-600 group-hover:bg-red-500 rounded-t transition-all duration-300"
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300">
                    {d.hour}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-3">
            <span>Peak hour: 12:00 - 13:30 (Makan Siang)</span>
            <span className="font-bold text-zinc-200">MAX: {formatRupiah(maxAmount)}</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase tracking-tight">
                TOP_ITEMS_GRID
              </h3>
              <button 
                onClick={() => setActiveTab('menu')}
                className="text-[11px] font-mono text-red-400 hover:text-red-300 cursor-pointer"
              >
                [VIEW_ALL]
              </button>
            </div>

            <div className="space-y-2">
              {topSellingList.length > 0 ? (
                topSellingList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors font-mono">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-9 h-9 rounded object-cover border border-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-zinc-200 truncate font-sans">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        {item.count} porsi sold
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      {formatRupiah(item.totalRupiah)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 text-center py-6 font-mono">NO_TRANSACTION_RECORDS</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800">
            <button
              onClick={() => setActiveTab('menu')}
              className="w-full py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 bg-zinc-950/80 text-zinc-300 hover:text-white font-mono text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-red-400" />
              <span>KELOLA_KATALOG_MENU</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase tracking-tight">
              RECENT_TRANSACTIONS_LOG
            </h3>
            <p className="text-[11px] font-mono text-zinc-400">
              Daftar entri checkout kasir terverifikasi
            </p>
          </div>
          <button
            onClick={() => setActiveTab('riwayat')}
            className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
          >
            <span>[ALL_RECORDS]</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2.5 font-bold">TX_ID</th>
                <th className="pb-2.5 font-bold">TIMESTAMP</th>
                <th className="pb-2.5 font-bold">PELANGGAN / TIPE</th>
                <th className="pb-2.5 font-bold">KASIR</th>
                <th className="pb-2.5 font-bold">METODE</th>
                <th className="pb-2.5 font-bold">TOTAL</th>
                <th className="pb-2.5 font-bold">STATUS</th>
                <th className="pb-2.5 font-bold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-2.5 font-bold text-zinc-100">
                    {trx.id}
                  </td>
                  <td className="py-2.5 text-zinc-400 text-[11px]">
                    {trx.date}
                  </td>
                  <td className="py-2.5">
                    <span className="font-semibold text-zinc-200 block font-sans">{trx.customerName || '-'}</span>
                    <span className="text-[10px] text-zinc-400 block">{trx.orderType}</span>
                  </td>
                  <td className="py-2.5 text-zinc-400 font-sans">
                    {trx.cashierName}
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700">
                      {trx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-zinc-100">
                    {formatRupiah(trx.total)}
                  </td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => setActiveReceipt(trx)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-[11px] transition-colors cursor-pointer border border-zinc-700"
                    >
                      STRUK
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
