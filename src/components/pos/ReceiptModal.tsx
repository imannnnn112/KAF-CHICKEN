import React from 'react';
import { Printer, X, Check, Flame } from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah } from '../../utils/format';
import { usePOS } from '../../context/POSContext';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const { settings } = usePOS();

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Controls (Hidden on Print) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            RECEIPT_PREVIEW // STRUK
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-4 overflow-y-auto flex-1 bg-zinc-950">
          <div 
            id="printable-receipt" 
            className="font-mono text-xs text-zinc-100 bg-zinc-900 p-4 rounded-lg border border-zinc-800 shadow-inner"
          >
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-zinc-700">
              <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                <Flame className="w-4 h-4 fill-red-600 text-amber-400" />
                <span className="font-extrabold text-sm tracking-widest text-zinc-100 font-sans">
                  {settings.storeName}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-zinc-400 italic">
                "{settings.tagline}"
              </p>
              <p className="text-[9px] text-zinc-500 mt-0.5">
                {settings.address}
              </p>
              <p className="text-[9px] text-zinc-500">
                Telp: {settings.phone}
              </p>
            </div>

            {/* Meta Info */}
            <div className="py-2.5 border-b border-dashed border-zinc-700 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">TX_ID:</span>
                <span className="font-bold text-zinc-200">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">DATE:</span>
                <span className="text-zinc-300">{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">CASHIER:</span>
                <span className="font-medium text-zinc-300">{transaction.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">TYPE / CUST:</span>
                <span className="font-medium text-zinc-300">{transaction.orderType} • {transaction.customerName || '-'}</span>
              </div>
            </div>

            {/* Itemized List */}
            <div className="py-2.5 border-b border-dashed border-zinc-700 space-y-1.5">
              <div className="text-[9px] font-bold text-zinc-500 grid grid-cols-12 uppercase pb-0.5">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-4 text-right">Subtotal</span>
              </div>

              {transaction.items.map((item, idx) => (
                <div key={idx} className="text-[10px]">
                  <div className="font-bold text-zinc-200 truncate">{item.product.name}</div>
                  <div className="grid grid-cols-12 text-zinc-400 text-[9px] pt-0.5">
                    <span className="col-span-6 text-zinc-500">
                      @ {formatRupiah(item.product.price)}
                    </span>
                    <span className="col-span-2 text-center font-bold text-zinc-300">
                      {item.quantity}x
                    </span>
                    <span className="col-span-4 text-right font-bold text-zinc-100">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals & Calculations */}
            <div className="py-2.5 border-b border-dashed border-zinc-700 space-y-1 text-[10px]">
              <div className="flex justify-between text-zinc-400">
                <span>SUBTOTAL:</span>
                <span className="text-zinc-200">{formatRupiah(transaction.subtotal)}</span>
              </div>

              {transaction.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>DISCOUNT {transaction.discountPercent ? `(${transaction.discountPercent}%)` : ''}:</span>
                  <span>- {formatRupiah(transaction.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>TAX (PPN {settings.taxRate}%):</span>
                <span className="text-zinc-200">{formatRupiah(transaction.tax)}</span>
              </div>

              <div className="flex justify-between text-xs font-bold text-zinc-100 pt-1 border-t border-zinc-800">
                <span>TOTAL:</span>
                <span className="text-red-400 font-black">{formatRupiah(transaction.total)}</span>
              </div>

              <div className="flex justify-between text-zinc-400 pt-0.5">
                <span>PAID ({transaction.paymentMethod}):</span>
                <span className="text-zinc-200">{formatRupiah(transaction.amountPaid)}</span>
              </div>

              <div className="flex justify-between text-zinc-300 font-semibold">
                <span>CHANGE:</span>
                <span className="text-emerald-400">{formatRupiah(transaction.change)}</span>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="text-center pt-3 pb-1">
              <p className="font-bold text-zinc-300 text-[10px]">
                {settings.receiptFooter}
              </p>
              <p className="text-[9px] text-zinc-500 mt-0.5">
                KAF CHICKEN • Kualitas Terjamin & Halal
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
          >
            TUTUP
          </button>
          <button
            onClick={handlePrint}
            id="btn-print-receipt-action"
            className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold border border-red-500/60 shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>CETAK_STRUK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
