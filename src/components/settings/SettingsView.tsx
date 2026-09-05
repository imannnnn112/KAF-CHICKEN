import React, { useState } from 'react';
import { 
  Store, 
  Percent, 
  FileText, 
  RotateCcw, 
  Save, 
  Check, 
  Flame, 
  Phone, 
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = usePOS();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [taxRate, setTaxRate] = useState(String(settings.taxRate));
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeName.trim() || 'KAF CHICKEN',
      tagline: tagline.trim(),
      address: address.trim(),
      phone: phone.trim(),
      taxRate: Math.max(0, Number(taxRate) || 0),
      receiptFooter: receiptFooter.trim()
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-6 space-y-4 font-mono text-zinc-100">
      {/* Header Bar */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          SYSTEM_CONFIGURATION // PENGATURAN RESTORAN
        </h2>
        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
          Parameter gerai KAF Chicken, tarif PPN, identitas struk kasir, dan reset database lokal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800">
            <Store className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
              STORE_IDENTITY // PROFIL OUTLET
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                STORE_NAME
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                BRAND_TAGLINE
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                STORE_LOCATION_ADDRESS
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                TELEPHONE_HOTLINE
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                TAXATION_AND_RECEIPT_CONFIG
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  PPN_TAX_RATE (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-hidden focus:border-red-500 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">%</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  RECEIPT_FOOTER_MESSAGE
                </label>
                <input
                  type="text"
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 outline-hidden focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-zinc-800">
            {savedSuccess ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>SETTINGS_SAVED_SUCCESSFULLY</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              id="btn-save-settings"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg border border-red-500/60 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer uppercase"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE_CHANGES</span>
            </button>
          </div>
        </form>

        {/* Data Maintenance / Reset Card */}
        <div className="bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-400 flex items-center justify-center font-bold mb-3">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
              LOCAL_STORAGE_STATE
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed font-sans">
              State aplikasi disimpan secara persist pada browser localStorage. Untuk mereset inventaris produk, mutasi kasir, dan database stok ke profil benchmark awal, gunakan kontrol di bawah.
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-red-900/60 text-xs text-zinc-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-red-400 uppercase text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>DANGER_ZONE // RESET_DB</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-sans">
              Operasi ini akan menghapus semua invoice riwayat dan merestore 8 menu awal KAF Chicken.
            </p>

            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/80 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTORE_DEFAULT_DATA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs font-mono text-zinc-100">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 max-w-sm w-full shadow-2xl space-y-3.5">
            <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">CONFIRM_DATABASE_RESET</h3>
              <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                Seluruh log transaksi dan penyesuaian stok akan direset kembali ke data bawaan KAF Chicken. Lanjutkan?
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold border border-red-500/60 shadow-xs cursor-pointer uppercase"
              >
                CONFIRM_RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
