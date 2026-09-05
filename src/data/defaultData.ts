import { Product, StockItem, Transaction, StoreSettings, User } from '../types';

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'kasir',
    name: 'Budi Santoso',
    role: 'Kasir',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    username: 'admin',
    name: 'Siti Rahma (Manager)',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'KAF CHICKEN',
  tagline: 'Crispy, Tasty, Delicious',
  address: 'Jl. Pemuda No. 88, Jakarta Selatan',
  phone: '0812-8899-7722',
  taxRate: 10, // 10% PPN
  discountRate: 0,
  receiptFooter: 'Terima kasih telah membeli di KAF Chicken!',
  currency: 'Rp'
};

export const DEFAULT_PRODUCTS: Product[] = [
  // Fried Chicken
  {
    id: 'fc-1',
    name: 'KAF Chicken Original',
    category: 'Fried Chicken',
    price: 15000,
    costPrice: 8500,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Ayam goreng renyah dengan bumbu rempah rahasia KAF Chicken yang meresap hingga ke tulang.',
    popular: true
  },
  {
    id: 'fc-2',
    name: 'KAF Chicken Crispy',
    category: 'Fried Chicken',
    price: 17000,
    costPrice: 9500,
    stock: 38,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Kulit ekstra renyah golden brown dengan daging ayam juicy gurih di setiap gigitan.',
    popular: true
  },
  {
    id: 'fc-3',
    name: 'KAF Chicken Spicy',
    category: 'Fried Chicken',
    price: 18000,
    costPrice: 10000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Sensasi pedas membakar dengan balutan bumbu cabe khas yang menggugah selera.',
    popular: true
  },

  // Rice
  {
    id: 'rc-1',
    name: 'Chicken Rice',
    category: 'Rice',
    price: 20000,
    costPrice: 11000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Nasi pulen hangat disajikan bersama potongan ayam renyah dan sambal khas.',
    popular: false
  },
  {
    id: 'rc-2',
    name: 'Spicy Chicken Rice',
    category: 'Rice',
    price: 22000,
    costPrice: 12000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Nasi ayam dengan saus pedas manis spesial dan taburan biji wijen renyah.',
    popular: false
  },

  // Burger
  {
    id: 'bg-1',
    name: 'KAF Chicken Burger',
    category: 'Burger',
    price: 20000,
    costPrice: 11500,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Roti brioche empuk berisi fillet ayam renyah, selada segar, keju, dan saus mayo khas.',
    popular: true
  },
  {
    id: 'bg-2',
    name: 'Crispy Chicken Burger',
    category: 'Burger',
    price: 23000,
    costPrice: 13000,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Ekstra crispy chicken patty dengan saus spesial KAF, tomat, dan acar mentimun renyah.',
    popular: false
  },

  // Snack
  {
    id: 'sn-1',
    name: 'French Fries',
    category: 'Snack',
    price: 12000,
    costPrice: 6000,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Kentang goreng impor renyah keemasan bertabur garam laut gurih.',
    popular: true
  },
  {
    id: 'sn-2',
    name: 'Chicken Nugget',
    category: 'Snack',
    price: 15000,
    costPrice: 8000,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: '6 pcs nugget ayam lembut dengan lapisan tepung roti renyah dan cocolan saus BBQ.',
    popular: false
  },

  // Drinks
  {
    id: 'dr-1',
    name: 'Ice Tea',
    category: 'Drinks',
    price: 7000,
    costPrice: 2000,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Es teh manis segar beraroma melati khas nusantara pelepas dahaga.',
    popular: true
  },
  {
    id: 'dr-2',
    name: 'Orange Juice',
    category: 'Drinks',
    price: 10000,
    costPrice: 4000,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Jus jeruk segar dingin kaya vitamin C dengan bulir jeruk asli.',
    popular: false
  },
  {
    id: 'dr-3',
    name: 'Mineral Water',
    category: 'Drinks',
    price: 5000,
    costPrice: 2500,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: 'Air mineral kemasan botol 600ml steril dan segar.',
    popular: false
  },

  // Paket
  {
    id: 'pk-1',
    name: 'Paket Hemat 1',
    category: 'Paket',
    price: 25000,
    costPrice: 14000,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: '1 Pc KAF Chicken Original + 1 Nasi Pulen + 1 Es Teh Manis.',
    popular: true
  },
  {
    id: 'pk-2',
    name: 'Paket Hemat 2',
    category: 'Paket',
    price: 30000,
    costPrice: 17000,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: '1 Pc KAF Chicken Crispy + 1 Nasi Pulen + French Fries Regular + 1 Es Teh.',
    popular: true
  },
  {
    id: 'pk-3',
    name: 'Paket Keluarga',
    category: 'Paket',
    price: 75000,
    costPrice: 42000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    description: '5 Pcs KAF Chicken (Campur) + 3 Nasi Pulen + 3 Minuman Pilihan untuk keluarga.',
    popular: true
  }
];

export const DEFAULT_STOCK_ITEMS: StockItem[] = [
  {
    id: 'stk-1',
    name: 'Daging Ayam Potong Segar',
    currentStock: 48,
    minStock: 20,
    unit: 'kg',
    status: 'Aman',
    lastUpdated: 'Hari ini, 08:30',
    category: 'Bahan Utama'
  },
  {
    id: 'stk-2',
    name: 'Tepung Bumbu KAF Crispy',
    currentStock: 35,
    minStock: 15,
    unit: 'kg',
    status: 'Aman',
    lastUpdated: 'Hari ini, 08:30',
    category: 'Bumbu'
  },
  {
    id: 'stk-3',
    name: 'Minyak Goreng Premium',
    currentStock: 60,
    minStock: 25,
    unit: 'liter',
    status: 'Aman',
    lastUpdated: 'Kemarin, 17:00',
    category: 'Minyak'
  },
  {
    id: 'stk-4',
    name: 'Beras Pulen Pandan Wangi',
    currentStock: 14,
    minStock: 20,
    unit: 'kg',
    status: 'Menipis',
    lastUpdated: 'Hari ini, 09:15',
    category: 'Bahan Pokok'
  },
  {
    id: 'stk-5',
    name: 'Roti Bun Burger Wijen',
    currentStock: 8,
    minStock: 15,
    unit: 'pack',
    status: 'Menipis',
    lastUpdated: 'Hari ini, 10:00',
    category: 'Bakery'
  },
  {
    id: 'stk-6',
    name: 'French Fries Frozen',
    currentStock: 25,
    minStock: 10,
    unit: 'kg',
    status: 'Aman',
    lastUpdated: 'Kemarin, 14:00',
    category: 'Frozen'
  },
  {
    id: 'stk-7',
    name: 'Chicken Nugget Pack',
    currentStock: 4,
    minStock: 10,
    unit: 'pack',
    status: 'Menipis',
    lastUpdated: 'Hari ini, 07:45',
    category: 'Frozen'
  },
  {
    id: 'stk-8',
    name: 'Bumbu Cabai Spicy KAF',
    currentStock: 0,
    minStock: 5,
    unit: 'kg',
    status: 'Habis',
    lastUpdated: 'Hari ini, 11:20',
    category: 'Bumbu'
  },
  {
    id: 'stk-9',
    name: 'Sirup Jeruk Konsentrat',
    currentStock: 12,
    minStock: 5,
    unit: 'botol',
    status: 'Aman',
    lastUpdated: '2 hari lalu',
    category: 'Minuman'
  },
  {
    id: 'stk-10',
    name: 'Teh Celup Wangi Melati',
    currentStock: 18,
    minStock: 8,
    unit: 'box',
    status: 'Aman',
    lastUpdated: 'Kemarin, 16:30',
    category: 'Minuman'
  },
  {
    id: 'stk-11',
    name: 'Air Mineral Botol 600ml',
    currentStock: 3,
    minStock: 5,
    unit: 'karton',
    status: 'Menipis',
    lastUpdated: 'Hari ini, 10:30',
    category: 'Minuman'
  },
  {
    id: 'stk-12',
    name: 'Paper Box KAF Takeaway',
    currentStock: 150,
    minStock: 50,
    unit: 'pcs',
    status: 'Aman',
    lastUpdated: 'Kemarin, 09:00',
    category: 'Kemasan'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-20260905-001',
    orderNumber: '#001',
    date: '05 Sep 2026, 09:15',
    timestamp: Date.now() - 1000 * 60 * 180,
    cashierName: 'Budi Santoso',
    customerName: 'Meja 04',
    orderType: 'Dine In',
    tableNumber: '4',
    items: [
      { product: DEFAULT_PRODUCTS[1], quantity: 2 }, // Crispy
      { product: DEFAULT_PRODUCTS[7], quantity: 1 }, // Fries
      { product: DEFAULT_PRODUCTS[9], quantity: 2 }, // Ice Tea
    ],
    subtotal: 60000,
    discount: 0,
    tax: 6000,
    total: 66000,
    paymentMethod: 'QRIS',
    amountPaid: 66000,
    change: 0,
    status: 'Selesai'
  },
  {
    id: 'TRX-20260905-002',
    orderNumber: '#002',
    date: '05 Sep 2026, 10:05',
    timestamp: Date.now() - 1000 * 60 * 130,
    cashierName: 'Budi Santoso',
    customerName: 'Takeaway Doni',
    orderType: 'Takeaway',
    items: [
      { product: DEFAULT_PRODUCTS[13], quantity: 1 }, // Paket Hemat 2 (30rb)
      { product: DEFAULT_PRODUCTS[5], quantity: 1 }, // Burger (20rb)
    ],
    subtotal: 50000,
    discount: 0,
    tax: 5000,
    total: 55000,
    paymentMethod: 'Cash',
    amountPaid: 100000,
    change: 45000,
    status: 'Selesai'
  },
  {
    id: 'TRX-20260905-003',
    orderNumber: '#003',
    date: '05 Sep 2026, 11:20',
    timestamp: Date.now() - 1000 * 60 * 60,
    cashierName: 'Budi Santoso',
    customerName: 'Keluarga Dimas',
    orderType: 'Dine In',
    tableNumber: '8',
    items: [
      { product: DEFAULT_PRODUCTS[14], quantity: 1 }, // Paket Keluarga (75rb)
      { product: DEFAULT_PRODUCTS[8], quantity: 1 }, // Nugget (15rb)
      { product: DEFAULT_PRODUCTS[10], quantity: 2 }, // Orange juice (20rb)
    ],
    subtotal: 110000,
    discount: 5000,
    tax: 10500,
    total: 115500,
    paymentMethod: 'Debit',
    amountPaid: 115500,
    change: 0,
    status: 'Selesai'
  },
  {
    id: 'TRX-20260905-004',
    orderNumber: '#004',
    date: '05 Sep 2026, 12:00',
    timestamp: Date.now() - 1000 * 60 * 25,
    cashierName: 'Budi Santoso',
    customerName: 'Meja 02',
    orderType: 'Dine In',
    tableNumber: '2',
    items: [
      { product: DEFAULT_PRODUCTS[2], quantity: 2 }, // Spicy Chicken (36rb)
      { product: DEFAULT_PRODUCTS[4], quantity: 1 }, // Spicy Rice (22rb)
      { product: DEFAULT_PRODUCTS[9], quantity: 2 }, // Ice Tea (14rb)
    ],
    subtotal: 72000,
    discount: 0,
    tax: 7200,
    total: 79200,
    paymentMethod: 'E-Wallet',
    amountPaid: 79200,
    change: 0,
    status: 'Selesai'
  },
  {
    id: 'TRX-20260905-005',
    orderNumber: '#005',
    date: '05 Sep 2026, 12:35',
    timestamp: Date.now() - 1000 * 60 * 5,
    cashierName: 'Budi Santoso',
    customerName: 'Takeaway Citra',
    orderType: 'Takeaway',
    items: [
      { product: DEFAULT_PRODUCTS[12], quantity: 2 }, // Paket Hemat 1 (50rb)
    ],
    subtotal: 50000,
    discount: 0,
    tax: 5000,
    total: 55000,
    paymentMethod: 'Cash',
    amountPaid: 60000,
    change: 5000,
    status: 'Selesai'
  }
];
