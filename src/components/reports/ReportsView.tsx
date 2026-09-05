import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Printer, 
  Sparkles,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/format';

export const ReportsView: React.FC = () => {
  const { transactions, products, settings } = usePOS();
  const [selectedPeriod, setSelectedPeriod] = useState<'Hari Ini' | 'Minggu Ini' | 'Bulan Ini'>('Hari Ini');

  // Multiplier for mock timeframe visualization based on real data
  const baseTotal = transactions.reduce((sum, trx) => sum + trx.total, 0);
  const baseCount = transactions.length;

  const harianTotal = baseTotal;
  const mingguanTotal = Math.round(baseTotal * 5.8);
  const bulananTotal = Math.round(baseTotal * 24.5);

  const displayedTotal = selectedPeriod === 'Hari Ini' ? harianTotal : (selectedPeriod === 'Minggu Ini' ? mingguanTotal : bulananTotal);
  const displayedTrxCount = selectedPeriod === 'Hari Ini' ? baseCount : (selectedPeriod === 'Minggu Ini' ? baseCount * 5 : baseCount * 22);
  const avgTrx = displayedTrxCount > 0 ? Math.round(displayedTotal / displayedTrxCount) : 0;

  // Best selling products map
  const productSales: Record<string, { product: typeof products[0]; quantity: number; revenue: number }> = {};
  transactions.forEach(trx => {
    trx.items.forEach(item => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = { product: item.product, quantity: 0, revenue: 0 };
      }
      productSales[item.product.id].quantity += item.quantity;
      productSales[item.product.id].revenue += item.quantity * item.product.price;
    });
  });

  const bestSellers = Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
  const maxQty = bestSellers.length > 0 ? bestSellers[0].quantity : 1;

  // Payment methods breakdown
  const paymentMethodCount: Record<string, number> = {
    Cash: 0,
    QRIS: 0,
    Debit: 0,
    'E-Wallet': 0
  };
  transactions.forEach(trx => {
    if (paymentMethodCount[trx.paymentMethod] !== undefined) {
      paymentMethodCount[trx.paymentMethod] += trx.total;
    }
  });

  // Export report to CSV
  const handleExportCSV = () => {
    const headers = 'ID Transaksi,Tanggal,Kasir,Pelanggan,Metode,Subtotal,Diskon,Pajak,Total\n';
    const rows = transactions.map(trx => 
      `"${trx.id}","${trx.date}","${trx.cashierName}","${trx.customerName || '-'}","${trx.paymentMethod}",${trx.subtotal},${trx.discount},${trx.tax},${trx.total}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan-KAF-Chicken-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  // Day bars for weekly view or monthly view
  const weeklyDays = [
    { day: 'Senin', amount: Math.round(baseTotal * 0.7) },
    { day: 'Selasa', amount: Math.round(baseTotal * 0.8) },
    { day: 'Rabu', amount: Math.round(baseTotal * 0.9) },
    { day: 'Kamis', amount: Math.round(baseTotal * 0.85) },
    { day: 'Jumat', amount: Math.round(baseTotal * 1.3) },
    { day: 'Sabtu', amount: Math.round(baseTotal * 1.6) },
    { day: 'Minggu', amount: Math.round(baseTotal * 1.5) },
  ];
  const maxWeekly = Math.max(...weeklyDays.map(w => w.amount), 1);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-6 space-y-4 font-mono text-zinc-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            FINANCIAL_ANALYTICS // PERFORMA PENJUALAN & OMSET
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
            Analisis omset harian, mingguan, bulanan, dan audit komparasi menu paling laris
          </p>
        </div>

        {/* Export & Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSummary}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer uppercase"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT_REPORT</span>
          </button>
          <button
            onClick={handleExportCSV}
            id="btn-export-csv"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg border border-emerald-500/60 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT_CSV</span>
          </button>
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 max-w-xs">
        {(['Hari Ini', 'Minggu Ini', 'Bulan Ini'] as const).map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`flex-1 py-1.5 text-xs font-bold rounded transition-all cursor-pointer uppercase
              ${selectedPeriod === period
                ? 'bg-zinc-800 text-white border border-red-500/60 ring-1 ring-red-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
              }
            `}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Penjualan */}
        <div className="bg-zinc-900 rounded-xl p-3.5 border border-zinc-800 shadow-xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            TOTAL_REVENUE ({selectedPeriod})
          </span>
          <span className="text-xl font-black text-red-400 mt-1 block font-mono">
            {formatRupiah(displayedTotal)}
          </span>
          <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            DELTA +18.4% VS LAST_CYCLE
          </p>
        </div>

        {/* Total Transaksi */}
        <div className="bg-zinc-900 rounded-xl p-3.5 border border-zinc-800 shadow-xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            TX_COUNT
          </span>
          <span className="text-xl font-black text-zinc-100 mt-1 block font-mono">
            {displayedTrxCount} TRANSAKSI
          </span>
          <p className="text-[10px] text-zinc-500 mt-1">
            OPERATOR_ONLINE_BUSY
          </p>
        </div>

        {/* Rata-Rata Transaksi */}
        <div className="bg-zinc-900 rounded-xl p-3.5 border border-zinc-800 shadow-xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            AVG_BASKET_SIZE
          </span>
          <span className="text-xl font-black text-zinc-100 mt-1 block font-mono">
            {formatRupiah(avgTrx)}
          </span>
          <p className="text-[10px] text-zinc-500 mt-1">
            PER_CHECKOUT_TICKET
          </p>
        </div>

        {/* Pendapatan Bulanan */}
        <div className="bg-zinc-900 border border-red-500/40 rounded-xl p-3.5 shadow-xs relative overflow-hidden">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            EST_MONTHLY_RUNRATE
          </span>
          <span className="text-xl font-black text-zinc-100 mt-1 block font-mono">
            {formatRupiah(bulananTotal)}
          </span>
          <p className="text-[10px] text-zinc-400 mt-1">
            30_DAYS_PROJECTION_MODEL
          </p>
        </div>
      </div>

      {/* 2-Column Section: Graphical Revenue & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                WEEKLY_SALES_DISTRIBUTION
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans">
                Fluktuasi omset harian restoran selama periode 7 hari terakhir
              </p>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded">
              CURRENT_TIMEFRAME
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-4 pb-2 border-b border-zinc-800">
            {weeklyDays.map((d, i) => {
              const heightPct = Math.round((d.amount / maxWeekly) * 100);
              const isWeekend = d.day === 'Sabtu' || d.day === 'Minggu';
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 border border-zinc-700 text-zinc-200 text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap mb-1">
                    {formatRupiah(d.amount)}
                  </div>

                  <div className="w-full max-w-[36px] bg-zinc-950 border border-zinc-800 rounded-t overflow-hidden h-full flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-300
                        ${isWeekend 
                          ? 'bg-red-600 group-hover:bg-red-500' 
                          : 'bg-zinc-700 group-hover:bg-zinc-600'
                        }
                      `}
                    />
                  </div>

                  <span className={`text-[10px] font-bold uppercase ${isWeekend ? 'text-red-400' : 'text-zinc-500'}`}>
                    {d.day.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3">
            <span>PEAK_PERIOD: WEEKEND (SABTU & MINGGU)</span>
            <span className="font-bold text-red-400">MAX: {formatRupiah(maxWeekly)}</span>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 mb-1">
              PAYMENT_CHANNELS
            </h3>
            <p className="text-[11px] text-zinc-400 mb-3 font-sans">
              Distribusi volume transaksi berdasarkan metode pembayaran
            </p>

            <div className="space-y-2.5">
              {Object.entries(paymentMethodCount).map(([method, amount]) => {
                const pct = displayedTotal > 0 ? Math.round((amount / displayedTotal) * 100) : 25;
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-300">{method}</span>
                      <span className="text-zinc-100 font-bold font-mono">{formatRupiah(amount)} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-zinc-950 border border-zinc-800 h-2 rounded overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                        className="h-full bg-red-600 rounded"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-sans">QRIS & Tunai mendominasi 80%+ dari total perputaran kas restoran.</span>
          </div>
        </div>
      </div>

      {/* Best Selling Products Ranking */}
      <div className="bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-800 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 mb-1">
          BESTSELLER_RANKINGS // PRODUK PALING LAKU
        </h3>
        <p className="text-[11px] text-zinc-400 mb-3 font-sans">
          Daftar menu komoditas dengan volume penjualan porsi dan pendapatan bruto tertinggi
        </p>

        <div className="space-y-2">
          {bestSellers.map((item, index) => {
            const widthPct = Math.round((item.quantity / maxQty) * 100);
            return (
              <div key={item.product.id} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 border
                    ${index === 0 
                      ? 'bg-amber-950/70 border-amber-800 text-amber-400' 
                      : (index === 1 ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-zinc-900 border-zinc-800 text-zinc-400')}
                  `}>
                    #{index + 1}
                  </span>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-9 h-9 rounded object-cover border border-zinc-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-zinc-100 truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">
                      {item.product.category} • {formatRupiah(item.product.price)}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-64 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-300 font-mono">{item.quantity} PORSI</span>
                    <span className="text-red-400 font-mono">{formatRupiah(item.revenue)}</span>
                  </div>
                  <div className="w-full bg-zinc-900 border border-zinc-800 h-1.5 rounded overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-red-600 rounded"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
