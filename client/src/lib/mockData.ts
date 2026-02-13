
// Types
export type Category = 'Kitchen' | 'Stationery' | 'Toys' | 'Decor' | 'Storage' | 'Bags' | 'Bathroom' | 'Cleaning' | 'Gifts';

export interface Product {
  id: string;
  name: string;
  category: Category;
  image: string;
  costPrice: number;
  mrp: number;
  tags: string[];
  status: 'Active' | 'Draft' | 'Discontinued';
}

export type ClientStage = 
  | 'Lead' 
  | 'Token Paid' 
  | 'Location Shared' 
  | 'Location Approved' 
  | '3D Design' 
  | 'Payment Partial' 
  | 'In Production' 
  | 'Shipped' 
  | 'Setup' 
  | 'Launched' 
  | 'Active';

export interface Client {
  id: string;
  name: string;
  city: string;
  stage: ClientStage;
  phone: string;
  email: string;
  totalPaid: number;
  totalDue: number;
  nextAction: string;
  managerName: string;
  managerPhone: string;
  joinedDate: string;
}

// Mock Data
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Glass Water Bottle Set',
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-01114192003b?auto=format&fit=crop&q=80&w=500',
    costPrice: 250,
    mrp: 699,
    tags: ['Bestseller', 'High Margin'],
    status: 'Active'
  },
  {
    id: '2',
    name: 'Stackable Storage Bins (Set of 3)',
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=500',
    costPrice: 450,
    mrp: 1299,
    tags: ['Recommended', 'Storage'],
    status: 'Active'
  },
  {
    id: '3',
    name: 'Minimalist Desk Organizer',
    category: 'Stationery',
    image: 'https://images.unsplash.com/photo-1520970014086-2208d15799f0?auto=format&fit=crop&q=80&w=500',
    costPrice: 180,
    mrp: 499,
    tags: ['Office', 'New'],
    status: 'Active'
  },
  {
    id: '4',
    name: 'Kids Educational Building Blocks',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&q=80&w=500',
    costPrice: 350,
    mrp: 899,
    tags: ['Kids', 'Seasonal'],
    status: 'Active'
  },
  {
    id: '5',
    name: 'Ceramic Flower Vase',
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1581783342308-f792ca11df53?auto=format&fit=crop&q=80&w=500',
    costPrice: 120,
    mrp: 399,
    tags: ['Decor', 'High Margin'],
    status: 'Active'
  },
  {
    id: '6',
    name: 'Canvas Tote Bag',
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500',
    costPrice: 85,
    mrp: 299,
    tags: ['Eco Friendly', 'Bestseller'],
    status: 'Active'
  },
  {
    id: '7',
    name: 'Bamboo Bathroom Set',
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=500',
    costPrice: 550,
    mrp: 1499,
    tags: ['Luxury', 'Bathroom'],
    status: 'Active'
  },
  {
    id: '8',
    name: 'Microfiber Cleaning Cloths (Pack of 5)',
    category: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500',
    costPrice: 90,
    mrp: 249,
    tags: ['Essentials'],
    status: 'Active'
  },
  {
    id: '9',
    name: 'Scented Soy Candle',
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=500',
    costPrice: 140,
    mrp: 449,
    tags: ['Gifting', 'Seasonal'],
    status: 'Active'
  },
  {
    id: '10',
    name: 'Stainless Steel Lunch Box',
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1594910243285-b1a72d3f232b?auto=format&fit=crop&q=80&w=500',
    costPrice: 280,
    mrp: 799,
    tags: ['Durable', 'Kitchen'],
    status: 'Active'
  }
];

export const CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    city: 'Jaipur',
    stage: '3D Design',
    phone: '+91 98765 43210',
    email: 'rahul.s@example.com',
    totalPaid: 150000,
    totalDue: 350000,
    nextAction: 'Approve 3D Design Layout',
    managerName: 'Amit Verma',
    managerPhone: '+91 99999 88888',
    joinedDate: '2023-11-15'
  },
  {
    id: '2',
    name: 'Priya Patel',
    city: 'Ahmedabad',
    stage: 'Location Approved',
    phone: '+91 98989 89898',
    email: 'priya.p@example.com',
    totalPaid: 50000,
    totalDue: 450000,
    nextAction: 'Submit Floor Plan measurements',
    managerName: 'Sneha Gupta',
    managerPhone: '+91 77777 66666',
    joinedDate: '2024-01-10'
  },
  {
    id: '3',
    name: 'Vikram Singh',
    city: 'Chandigarh',
    stage: 'Lead',
    phone: '+91 91234 56789',
    email: 'vikram.s@example.com',
    totalPaid: 0,
    totalDue: 500000,
    nextAction: 'Schedule Initial Call',
    managerName: 'Amit Verma',
    managerPhone: '+91 99999 88888',
    joinedDate: '2024-02-05'
  }
];

export const STAGES: ClientStage[] = [
  'Lead',
  'Token Paid',
  'Location Shared',
  'Location Approved',
  '3D Design',
  'Payment Partial',
  'In Production',
  'Shipped',
  'Setup',
  'Launched',
  'Active'
];
