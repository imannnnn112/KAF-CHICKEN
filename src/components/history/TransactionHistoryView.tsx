import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Receipt, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  ArrowUpDown, 
  X,
  FileText,
  User,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { Transaction } from '../../types';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/format';

export const TransactionHistoryView: React.FC = () => {
  const { transactions, setActiveReceipt } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [selectedTrxForDetail, setSelectedTrxForDetail] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(trx => {
    const matchesSearch = trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trx.cashierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (trx.customerName && trx.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMethod = filterMethod === 'Semua' || trx.paymentMethod === filterMethod;
    const matchesStatus = filterStatus === 'Semua' || trx.status === filterStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalFilteredSum = filteredTransactions.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-6 space-y-4 font-mono text-zinc-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            TRANSACTION_LOGS // RIWAYAT TRANSAKSI KASIR
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
            Audit trail penjualan, mutasi kas, metode pembayaran, dan cetak ulang struk
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-3.5 py-2 rounded-lg">
          <div className="text-right">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
              TOTAL_AGGREGATE ({filteredTransactions.length} TX)
            </span>
            <span className="text-sm font-black text-red-400 font-mono">
              {formatRupiah(totalFilteredSum)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Method filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold text-zinc-500 mr-1 shrink-0 uppercase">METHOD:</span>
          {['Semua', 'Cash', 'QRIS', 'Debit', 'E-Wallet'].map(m => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap border
                ${filterMethod === m
                  ? 'bg-zinc-800 border-red-500 text-white ring-1 ring-red-500/40'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }
              `}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_BY_ID_CASHIER_CUSTOMER..."
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 outline-hidden"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-4">TX_ID</th>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">OPERATOR</th>
                <th className="py-2.5 px-3">ORDER_TYPE / CUST</th>
                <th className="py-2.5 px-3">METHOD</th>
                <th className="py-2.5 px-3">TOTAL_AMOUNT</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <Receipt className="w-8 h-8 stroke-1 text-zinc-600 mx-auto mb-2" />
                    <p className="font-bold text-zinc-300 text-xs uppercase">NO_RECORDS_FOUND</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Sesuaikan kriteria filter atau buat transaksi baru.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-red-400">
                      {trx.id}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400 text-[11px]">
                      {trx.date}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-zinc-200">
                      {trx.cashierName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-zinc-100 block">{trx.customerName || '-'}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">{trx.orderType}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase">
                        {trx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-zinc-100 font-mono">
                      {formatRupiah(trx.total)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 border border-emerald-800/80 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTrxForDetail(trx)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-bold rounded text-[11px] transition-colors cursor-pointer"
                        title="Lihat Rincian"
                      >
                        VIEW
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveReceipt(trx)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[11px] border border-red-500/60 transition-colors cursor-pointer"
                        title="Cetak Struk"
                      >
                        STRUK
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTrxForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">TRANSACTION_DETAILS</h3>
                <p className="font-mono text-[10px] text-red-400 mt-0.5">{selectedTrxForDetail.id}</p>
              </div>
              <button onClick={() => setSelectedTrxForDetail(null)} className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">TIMESTAMP:</span>
                <span className="font-bold text-zinc-200">{selectedTrxForDetail.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">CASHIER:</span>
                <span className="font-bold text-zinc-200">{selectedTrxForDetail.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">CUSTOMER / TYPE:</span>
                <span className="font-bold text-zinc-200">{selectedTrxForDetail.customerName || '-'} ({selectedTrxForDetail.orderType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">PAYMENT_METHOD:</span>
                <span className="font-bold text-zinc-200">{selectedTrxForDetail.paymentMethod}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">ITEMIZED_PAYLOAD</h4>
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {selectedTrxForDetail.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs p-2 rounded bg-zinc-950 border border-zinc-800">
                    <span className="font-medium text-zinc-200">
                      <strong className="text-zinc-100 font-bold">{item.quantity}x</strong> {item.product.name}
                    </span>
                    <span className="font-bold text-zinc-100">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-2.5 border-t border-zinc-800 text-xs space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>SUBTOTAL:</span>
                <span className="text-zinc-200">{formatRupiah(selectedTrxForDetail.subtotal)}</span>
              </div>
              {selectedTrxForDetail.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>DISCOUNT:</span>
                  <span>- {formatRupiah(selectedTrxForDetail.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>TAX (PPN):</span>
                <span className="text-zinc-200">{formatRupiah(selectedTrxForDetail.tax)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-zinc-100 pt-1 border-t border-zinc-800">
                <span>TOTAL:</span>
                <span className="text-red-400 font-black">{formatRupiah(selectedTrxForDetail.total)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedTrxForDetail(null)}
                className="flex-1 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                CLOSE
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveReceipt(selectedTrxForDetail);
                  setSelectedTrxForDetail(null);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold border border-red-500/60 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>OPEN_RECEIPT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
