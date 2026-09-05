import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Utensils, 
  Receipt, 
  Printer, 
  Search,
  Check
} from 'lucide-react';
import { Transaction } from '../../types';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/format';

export const LiveOrdersView: React.FC = () => {
  const { transactions, setActiveReceipt } = usePOS();
  const [filterType, setFilterType] = useState<'Semua' | 'Dine In' | 'Takeaway'>('Semua');

  const filteredOrders = transactions.filter(trx => 
    filterType === 'Semua' || trx.orderType === filterType
  );

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-6 space-y-4 font-mono text-zinc-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE_QUEUE // ANTREAN PESANAN & DAPUR
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
            Realtime monitoring status order penyajian menu ayam goreng dan combo
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          {(['Semua', 'Dine In', 'Takeaway'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer uppercase
                ${filterType === type
                  ? 'bg-zinc-800 text-white border border-red-500/60 ring-1 ring-red-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 bg-zinc-900 rounded-xl border border-zinc-800">
            <ClipboardList className="w-10 h-10 stroke-1 mx-auto text-zinc-600 mb-2" />
            <p className="text-xs font-bold uppercase text-zinc-300">QUEUE_EMPTY // TIDAK ADA PESANAN AKTIF</p>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">Buat transaksi baru di antarmuka Kasir (POS).</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-3.5 shadow-xs flex flex-col justify-between hover:border-zinc-700 transition-all"
            >
              {/* Card Header */}
              <div className="border-b border-zinc-800 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 font-mono">
                    {order.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                    ${order.orderType === 'Dine In' 
                      ? 'bg-amber-950/50 border-amber-800/80 text-amber-400' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }
                  `}>
                    {order.orderType} {order.tableNumber ? `(TBL #${order.tableNumber})` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-200">{order.customerName || 'Customer'}</span>
                  <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {order.date}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="py-2.5 space-y-1.5 flex-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-4.5 h-4.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-zinc-200">{item.product.name}</span>
                    </div>
                    <span className="text-zinc-400 font-bold">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase font-bold">TOTAL_DUE</span>
                  <span className="text-xs font-black text-red-400 font-mono">{formatRupiah(order.total)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveReceipt(order)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>STRUK</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
