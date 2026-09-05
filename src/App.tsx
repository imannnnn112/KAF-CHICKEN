import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { POSView } from './components/pos/POSView';
import { DashboardView } from './components/dashboard/DashboardView';
import { MenuManagementView } from './components/menu/MenuManagementView';
import { LiveOrdersView } from './components/orders/LiveOrdersView';
import { TransactionHistoryView } from './components/history/TransactionHistoryView';
import { StockManagementView } from './components/stock/StockManagementView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ReceiptModal } from './components/pos/ReceiptModal';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, sidebarOpen, activeReceipt, setActiveReceipt } = usePOS();

  // If user is logged out, display Login Screen
  if (!currentUser) {
    return <LoginView />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'kasir':
        return <POSView />;
      case 'dashboard':
        return <DashboardView />;
      case 'menu':
        return <MenuManagementView />;
      case 'pesanan':
        return <LiveOrdersView />;
      case 'riwayat':
        return <TransactionHistoryView />;
      case 'stok':
        return <StockManagementView />;
      case 'laporan':
        return <ReportsView />;
      case 'pengaturan':
        return <SettingsView />;
      default:
        return <POSView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace (shifts depending on sidebar desktop state) */}
      <div 
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 bg-zinc-950
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
        `}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-hidden flex flex-col bg-zinc-950 text-zinc-100">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Receipt Modal */}
      <ReceiptModal
        transaction={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <MainLayout />
    </POSProvider>
  );
}
