import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Banknote, 
  QrCode, 
  CreditCard, 
  Smartphone, 
  Printer, 
  PlusCircle, 
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod, Transaction } from '../../types';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, generateTransactionId } from '../../utils/format';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowReceipt: (trx: Transaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onShowReceipt }) => {
  const { 
    cart, 
    cartTotal, 
    cartSubtotal, 
    cartTax, 
    cartDiscountAmount, 
    discountPercent, 
    orderType, 
    tableNumber, 
    customerName, 
    completeCheckout, 
    transactions 
  } = usePOS();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash');
  const [cashGiven, setCashGiven] = useState<number>(cartTotal);
  const [customCashInput, setCustomCashInput] = useState<string>(String(cartTotal));
  const [ewalletProvider, setEwalletProvider] = useState<'GoPay' | 'OVO' | 'Dana' | 'ShopeePay'>('GoPay');
  const [cardLastDigits, setCardLastDigits] = useState<string>('8842');
  
  // Checkout status
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [completedTrx, setCompletedTrx] = useState<Transaction | null>(null);

  // Temporary transaction ID preview
  const previewTxId = generateTransactionId(transactions.length + 1);

  // Synchronize initial cash given when modal opens or total changes
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setCompletedTrx(null);
      setSelectedMethod('Cash');
      setCashGiven(cartTotal);
      setCustomCashInput(String(cartTotal));
    }
  }, [isOpen, cartTotal]);

  if (!isOpen) return null;

  const change = Math.max(0, cashGiven - cartTotal);
  const isCashInsufficient = selectedMethod === 'Cash' && cashGiven < cartTotal;

  // Quick cash buttons
  const cashPresets = [
    { label: 'Uang Pas', amount: cartTotal },
    { label: 'Rp 20.000', amount: 20000 },
    { label: 'Rp 50.000', amount: 50000 },
    { label: 'Rp 100.000', amount: 100000 },
    { label: 'Rp 200.000', amount: 200000 },
  ].filter(p => p.amount >= cartTotal || p.label === 'Uang Pas');

  const handleCashPreset = (amount: number) => {
    setCashGiven(amount);
    setCustomCashInput(String(amount));
  };

  const handleCustomCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = Number(raw);
    setCustomCashInput(raw);
    setCashGiven(num);
  };

  const handleConfirmPayment = () => {
    if (isCashInsufficient) return;
    
    const paidAmount = selectedMethod === 'Cash' ? cashGiven : cartTotal;
    const trx = completeCheckout(selectedMethod, paidAmount);
    setCompletedTrx(trx);
    setIsSuccess(true);
  };

  const handleNewOrder = () => {
    setIsSuccess(false);
    setCompletedTrx(null);
    onClose();
  };

  const handlePrint = () => {
    if (completedTrx) {
      onShowReceipt(completedTrx);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 text-red-500 flex items-center justify-center font-black">
              <Flame className="w-4 h-4 fill-red-600 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight uppercase tracking-tight text-zinc-100">
                {isSuccess ? 'SETTLEMENT_SUCCESS' : 'TRANSACTION_CHECKOUT'}
              </h2>
              <p className="text-[10px] text-zinc-400">
                {isSuccess ? completedTrx?.id : `REF: ${previewTxId}`} • {orderType} {tableNumber ? `(TBL #${tableNumber})` : ''}
              </p>
            </div>
          </div>

          {!isSuccess && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {/* SUCCESS STATE */}
          {isSuccess && completedTrx ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-bold rounded mb-1">
                  STATUS: COMPLETED
                </span>
                <h3 className="text-xl font-black text-zinc-100">
                  PEMBAYARAN DITERIMA
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Order payload ditransmisikan ke antrean dapur KAF Chicken.
                </p>
              </div>

              {/* Transaction Summary Card */}
              <div className="max-w-md mx-auto bg-zinc-950 rounded-xl p-3.5 border border-zinc-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>TX_ID:</span>
                  <span className="font-bold text-zinc-100">{completedTrx.id}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>METODE_BAYAR:</span>
                  <span className="font-bold text-zinc-200">{completedTrx.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>TOTAL_TAGIHAN:</span>
                  <span className="font-bold text-zinc-100">{formatRupiah(completedTrx.total)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>DITERIMA:</span>
                  <span className="font-bold text-zinc-200">{formatRupiah(completedTrx.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-zinc-100 font-bold pt-2 border-t border-zinc-800 text-sm">
                  <span>KEMBALIAN:</span>
                  <span className="text-emerald-400 font-black">{formatRupiah(completedTrx.change)}</span>
                </div>
              </div>

              {/* Actions: Cetak Struk / Pesanan Baru */}
              <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
                <button
                  type="button"
                  id="btn-print-receipt-success"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>CETAK_STRUK</span>
                </button>
                <button
                  type="button"
                  id="btn-new-order-success"
                  onClick={handleNewOrder}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 border border-red-500/60 shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-white" />
                  <span>ORDER_BARU</span>
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT FORM STATE */
            <div className="space-y-4">
              {/* Order Summary Preview */}
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400 font-medium">
                  <span>ITEMS_IN_CART ({cart.length})</span>
                  <span>{customerName || (orderType === 'Dine In' ? `TBL #${tableNumber}` : 'TAKEAWAY')}</span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs text-zinc-300">
                      <span className="truncate pr-2">
                        <strong className="text-zinc-100 font-bold">{item.quantity}x</strong> {item.product.name}
                      </span>
                      <span className="font-bold text-zinc-100 shrink-0">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-zinc-800 flex justify-between items-center text-[11px]">
                  <div className="text-zinc-400">
                    Sub: {formatRupiah(cartSubtotal)} {discountPercent > 0 ? `• Disc: -${formatRupiah(cartDiscountAmount)}` : ''} • Tax: {formatRupiah(cartTax)}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block uppercase">TOTAL_DUE</span>
                    <span className="text-base font-black text-red-400 leading-none">{formatRupiah(cartTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  SELECT_PAYMENT_METHOD
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Cash', label: 'Cash / Tunai', icon: Banknote },
                    { id: 'QRIS', label: 'QRIS Core', icon: QrCode },
                    { id: 'Debit', label: 'Debit EDC', icon: CreditCard },
                    { id: 'E-Wallet', label: 'E-Wallet API', icon: Smartphone },
                  ].map(method => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        id={`payment-method-${method.id.toLowerCase()}`}
                        onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                        className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer
                          ${isSelected 
                            ? 'bg-zinc-800 border-red-500 text-white ring-1 ring-red-500/40' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-red-400' : 'text-zinc-400'}`} />
                        <span className="text-[11px] font-bold uppercase">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Method Specific Fields */}
              {selectedMethod === 'Cash' && (
                <div className="space-y-2.5 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="font-bold text-zinc-300 uppercase">
                      CASH_RECEIVED:
                    </label>
                    <span className="text-zinc-500 text-[10px]">
                      Quick Denominations
                    </span>
                  </div>

                  {/* Cash Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {cashPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCashPreset(preset.amount)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border
                          ${cashGiven === preset.amount
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                          }
                        `}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Cash Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-zinc-500 pointer-events-none">
                      Rp
                    </span>
                    <input
                      type="text"
                      id="input-cash-amount"
                      value={customCashInput ? Number(customCashInput).toLocaleString('id-ID') : ''}
                      onChange={handleCustomCashChange}
                      placeholder="Input nominal cash"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800 font-bold text-zinc-100 text-xs focus:border-red-500 outline-hidden"
                    />
                  </div>

                  {/* Kembalian live calculation */}
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                    <span className="text-zinc-400">CHANGE_DUE:</span>
                    <span className={`font-bold text-sm ${isCashInsufficient ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isCashInsufficient ? 'INSUFFICIENT_FUNDS' : formatRupiah(change)}
                    </span>
                  </div>

                  {isCashInsufficient && (
                    <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-mono">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Jumlah uang diterima kurang dari total pembayaran.</span>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === 'QRIS' && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[10px] rounded">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>QRIS STANDARD INDONESIA</span>
                  </div>

                  {/* QRIS Mock Display */}
                  <div className="w-40 h-40 mx-auto bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
                    <div className="w-full h-full bg-zinc-950 p-2 rounded flex flex-col justify-between border border-zinc-800">
                      <div className="flex justify-between">
                        <div className="w-6 h-6 bg-zinc-200 p-1 rounded-xs"><div className="w-full h-full bg-zinc-950"></div></div>
                        <div className="w-6 h-6 bg-zinc-200 p-1 rounded-xs"><div className="w-full h-full bg-zinc-950"></div></div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="px-1.5 py-0.5 bg-red-600 text-[8px] font-bold text-white rounded">KAF</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-6 h-6 bg-zinc-200 p-1 rounded-xs"><div className="w-full h-full bg-zinc-950"></div></div>
                        <div className="w-6 h-6 bg-amber-400 p-1 rounded-xs flex items-center justify-center text-[6px] font-bold text-zinc-950">QRIS</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400">
                    Scan via BCA / Mandiri / GoPay / ShopeePay: <strong className="text-zinc-100">{formatRupiah(cartTotal)}</strong>
                  </p>
                </div>
              )}

              {selectedMethod === 'Debit' && (
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
                    <span>TERMINAL_EDC</span>
                    <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ONLINE
                    </span>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1.5">
                    <label className="text-zinc-500 text-[10px] block">CARD_LAST_4_DIGITS:</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardLastDigits}
                      onChange={(e) => setCardLastDigits(e.target.value)}
                      placeholder="Contoh: 8842"
                      className="w-full p-2 bg-zinc-950 rounded border border-zinc-800 font-mono font-bold tracking-widest text-zinc-100 text-xs focus:border-red-500 outline-hidden"
                    />
                    <p className="text-[10px] text-zinc-500">Gesek atau tap kartu di EDC reader kasir.</p>
                  </div>
                </div>
              )}

              {selectedMethod === 'E-Wallet' && (
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2.5 text-xs">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">SELECT_PROVIDER:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['GoPay', 'OVO', 'Dana', 'ShopeePay'] as const).map(wallet => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setEwalletProvider(wallet)}
                        className={`p-2 rounded-lg text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer
                          ${ewalletProvider === wallet
                            ? 'bg-zinc-800 border-red-500 text-white ring-1 ring-red-500/40'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                          }
                        `}
                      >
                        <span>{wallet}</span>
                        {ewalletProvider === wallet && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500">Push notification billing disinkronkan ke gateway {ewalletProvider}.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isSuccess && (
          <div className="p-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-xs font-bold transition-colors cursor-pointer"
            >
              CANCEL
            </button>

            <button
              type="button"
              id="btn-confirm-payment"
              disabled={isCashInsufficient}
              onClick={handleConfirmPayment}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border
                ${isCashInsufficient
                  ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-white border-red-500/60 active:scale-98'
                }
              `}
            >
              <span>CONFIRM_PAYMENT ({formatRupiah(cartTotal)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
