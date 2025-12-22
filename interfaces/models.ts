
// --- Role ---
export interface Role {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  code: string;
  name: string;
}

// --- Address ---
export interface Address {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  userId: number | string;
  province: string;
  district: string;
  ward: string;
  info: string;
  phone: string;
  isDefault: number;
}

export interface OrderStatusLog {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  orderId: number | string;
  status: number;
  timestamp: string;
  note?: string;
}

// --- User ---
export interface User {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  username: string;
  password?: string;
  email: string;
  roleId: number;
  phone: string;
  status: number; // 1: active, 0: locked
  
  // Frontend Helpers
  name: string;
  addresses?: Address[];
}

export interface Category {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  code: string;
  name: string;
  description?: string;
}

export interface Breed {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  name: string;
  status: number;
  // Helper
  categoryCode?: string;
  categoryId?: number | string;
}

export interface Origin {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  name: string;
}

export interface Product {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  code?: string;
  name: string;
  categoryId: number | string;
  breedId?: number | string;
  originId?: number | string;
  age?: number;
  gender: number; // 1: Đực, 0: Cái
  price: number;
  image: string;
  description: string;
  status: number;

  // Frontend Helpers
  category?: string;
  breed?: string;
  origin?: string;
}

export interface Service {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  status: number;
}

// --- Cart & Order ---
export interface CartItem {
  productId: number | string;
  quantity: number;
}

export interface OrderItem {
  id: number | string;
  orderId: number | string;
  productId: number | string;
  quantity: number;
  priceSnapshot?: number;
  
  // Frontend Helper
  product?: Product;
}

export interface Order {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  customerId: number | string;
  staffId?: number | string;
  totalAmount: number;
  status: number;
  paymentMethod: number;
  isPaid: number;
  note?: string;
  shippingAddress: string;
  cancelReason?: string;
  isLate?: number;

  // Frontend Helpers
  items?: OrderItem[];
  statusHistory?: OrderStatusLog[];
}

// --- Appointment ---
export interface Appointment {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  customerId: number | string;
  staffId?: number | string;
  serviceId: number | string;
  appointmentDate: string;
  appointmentTime: string;
  status: number;
  petName: string;
  petSpecies: string;
  petBreed: string;
  petAge: number;
  note?: string;
  cancelReason?: string;
  paymentMethod: number;
  isPaid: number;

  // Frontend Helpers
  statusHistory?: AppointmentStatusLog[];
  // alias for UI compatibility if needed, or update UI to use appointmentDate
  date?: string; 
  time?: string;
}

export interface AppointmentStatusLog {
  id: number | string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  appointmentId: number | string;
  status: number;
  timestamp: string;
  note?: string;
}
