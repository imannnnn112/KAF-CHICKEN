import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Transaction, 
  StockItem, 
  StockStatus, 
  StoreSettings, 
  User, 
  PaymentMethod, 
  OrderType 
} from '../types';
import { 
  DEFAULT_PRODUCTS, 
  DEFAULT_STOCK_ITEMS, 
  INITIAL_TRANSACTIONS, 
  DEFAULT_SETTINGS, 
  DEFAULT_USERS 
} from '../data/defaultData';
import { generateTransactionId, formatDateTime, playCashierBeep } from '../utils/format';

export type ActiveTab = 
  | 'dashboard' 
  | 'kasir' 
  | 'menu' 
  | 'pesanan' 
  | 'riwayat' 
  | 'stok' 
  | 'laporan' 
  | 'pengaturan';

interface POSContextType {
  // Auth
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;

  // Stock
  stockItems: StockItem[];
  updateStock: (id: string, newStock: number) => void;
  addStockItem: (item: Omit<StockItem, 'id' | 'status' | 'lastUpdated'>) => void;
  deleteStockItem: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  discountPercent: number;
  setDiscountPercent: (percent: number) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (val: string) => void;
  customerName: string;
  setCustomerName: (val: string) => void;

  // Cart Calculations
  cartSubtotal: number;
  cartDiscountAmount: number;
  cartTax: number;
  cartTotal: number;

  // Checkout & Transactions
  transactions: Transaction[];
  completeCheckout: (paymentMethod: PaymentMethod, amountPaid: number) => Transaction;
  cancelTransaction: (id: string) => void;
  activeReceipt: Transaction | null;
  setActiveReceipt: (trx: Transaction | null) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetAllData: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'kaf_chicken_products_v1',
  STOCK: 'kaf_chicken_stock_v1',
  TRANSACTIONS: 'kaf_chicken_transactions_v1',
  SETTINGS: 'kaf_chicken_settings_v1',
  USER: 'kaf_chicken_user_v1',
  CART: 'kaf_chicken_cart_v1',
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user (default to Kasir Budi so user immediately has access, or can switch/logout)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      return DEFAULT_USERS[0]; // Start logged in as Kasir for instant usability!
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('kasir');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Stock
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK);
      return saved ? JSON.parse(saved) : DEFAULT_STOCK_ITEMS;
    } catch {
      return DEFAULT_STOCK_ITEMS;
    }
  });

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [orderType, setOrderType] = useState<OrderType>('Dine In');
  const [tableNumber, setTableNumber] = useState<string>('01');
  const [customerName, setCustomerName] = useState<string>('');
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stockItems));
  }, [stockItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Auth functions
  const login = (username: string, _password?: string): boolean => {
    const cleanUsername = username.trim().toLowerCase();
    const found = DEFAULT_USERS.find(u => u.username.toLowerCase() === cleanUsername);
    if (found) {
      setCurrentUser(found);
      setActiveTab('dashboard'); // Prompt specifies: "Setelah login, pengguna masuk ke Dashboard"
      return true;
    }
    // Fallback: create temporary user if not found
    const customUser: User = {
      id: `usr-${Date.now()}`,
      username: username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: username.toLowerCase().includes('admin') ? 'Admin' : 'Kasir',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(customUser);
    setActiveTab('dashboard');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Product actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  // Stock actions
  const calculateStockStatus = (current: number, min: number): StockStatus => {
    if (current <= 0) return 'Habis';
    if (current <= min) return 'Menipis';
    return 'Aman';
  };

  const updateStock = (id: string, newStock: number) => {
    setStockItems(prev => prev.map(item => {
      if (item.id === id) {
        const safeStock = Math.max(0, newStock);
        return {
          ...item,
          currentStock: safeStock,
          status: calculateStockStatus(safeStock, item.minStock),
          lastUpdated: formatDateTime()
        };
      }
      return item;
    }));
  };

  const addStockItem = (itemData: Omit<StockItem, 'id' | 'status' | 'lastUpdated'>) => {
    const newItem: StockItem = {
      ...itemData,
      id: `stk-${Date.now()}`,
      status: calculateStockStatus(itemData.currentStock, itemData.minStock),
      lastUpdated: formatDateTime()
    };
    setStockItems(prev => [newItem, ...prev]);
  };

  const deleteStockItem = (id: string) => {
    setStockItems(prev => prev.filter(item => item.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    if (!product.isAvailable) return;
    playCashierBeep('beep');

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    playCashierBeep('delete');
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    playCashierBeep('beep');
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
  };

  // Cart computations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartDiscountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const cartTaxable = Math.max(0, cartSubtotal - cartDiscountAmount);
  const cartTax = Math.round((cartTaxable * settings.taxRate) / 100);
  const cartTotal = cartTaxable + cartTax;

  // Checkout action
  const completeCheckout = (paymentMethod: PaymentMethod, amountPaid: number): Transaction => {
    const seq = transactions.length + 1;
    const orderNumber = `#${String(seq).padStart(3, '0')}`;
    const newTxId = generateTransactionId(seq);

    const newTransaction: Transaction = {
      id: newTxId,
      orderNumber,
      date: formatDateTime(),
      timestamp: Date.now(),
      cashierName: currentUser ? currentUser.name : 'Kasir KAF',
      customerName: customerName.trim() || (orderType === 'Dine In' ? `Meja ${tableNumber}` : 'Pelanggan Takeaway'),
      orderType,
      tableNumber: orderType === 'Dine In' ? tableNumber : undefined,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscountAmount,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      tax: cartTax,
      total: cartTotal,
      paymentMethod,
      amountPaid,
      change: Math.max(0, amountPaid - cartTotal),
      status: 'Selesai'
    };

    // Update product stock
    setProducts(prev => prev.map(p => {
      const soldItem = cart.find(ci => ci.product.id === p.id);
      if (soldItem) {
        const remaining = Math.max(0, p.stock - soldItem.quantity);
        return {
          ...p,
          stock: remaining,
          isAvailable: remaining > 0 ? p.isAvailable : false
        };
      }
      return p;
    }));

    // Record transaction
    setTransactions(prev => [newTransaction, ...prev]);

    // Play sound & clean cart
    playCashierBeep('success');
    clearCart();

    return newTransaction;
  };

  const cancelTransaction = (id: string) => {
    setTransactions(prev => prev.map(trx => 
      trx.id === id ? { ...trx, status: 'Dibatalkan' } : trx
    ));
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetAllData = () => {
    setProducts(DEFAULT_PRODUCTS);
    setStockItems(DEFAULT_STOCK_ITEMS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(DEFAULT_SETTINGS);
    setCart([]);
    localStorage.clear();
  };

  return (
    <POSContext.Provider
      value={{
        currentUser,
        login,
        logout,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        products,
        addProduct,
        editProduct,
        deleteProduct,
        toggleProductStatus,
        stockItems,
        updateStock,
        addStockItem,
        deleteStockItem,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        discountPercent,
        setDiscountPercent,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        customerName,
        setCustomerName,
        cartSubtotal,
        cartDiscountAmount,
        cartTax,
        cartTotal,
        transactions,
        completeCheckout,
        cancelTransaction,
        activeReceipt,
        setActiveReceipt,
        settings,
        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
