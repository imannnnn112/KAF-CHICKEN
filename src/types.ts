export type Category = 
  | 'Semua'
  | 'Fried Chicken'
  | 'Burger'
  | 'Rice'
  | 'Snack'
  | 'Drinks'
  | 'Paket';

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, 'Semua'>;
  price: number;
  costPrice?: number;
  stock: number;
  image: string;
  isAvailable: boolean;
  description?: string;
  popular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'QRIS' | 'Debit' | 'E-Wallet';

export type OrderType = 'Dine In' | 'Takeaway';

export interface Transaction {
  id: string;
  orderNumber: string;
  date: string; // ISO string or formatted
  timestamp: number;
  cashierName: string;
  customerName?: string;
  orderType: OrderType;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  discount: number; // in rupiah
  discountPercent?: number;
  tax: number; // PPN 10%
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  status: 'Selesai' | 'Dibatalkan' | 'Diproses';
}

export type StockStatus = 'Aman' | 'Menipis' | 'Habis';

export interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string; // kg, pcs, botol, porsi, karton, pack
  status: StockStatus;
  lastUpdated: string;
  category?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'Kasir' | 'Admin';
  avatar?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  taxRate: number; // percentage, e.g. 10
  discountRate: number; // default discount %
  receiptFooter: string;
  currency: string;
}
