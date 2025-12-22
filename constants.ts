
import { User, Product, Service, Category, Breed, Origin, Role, Address } from './interfaces/models';
import { ActiveStatus, Gender } from './interfaces/enums';

const NOW = new Date().toISOString();
const SYSTEM = 'System';

// --- CONSTANTS AS ENUM REPLACEMENTS ---
export const ROLE = {
  CUSTOMER: 1,
  STAFF: 2,
  ADMIN: 3
};

export const ORDER_STATUS = {
  CANCELLED: 0,
  COMPLETED: 1,
  PENDING: 2,
  ACCEPTED: 3,
  REQ_CANCEL: 4,
  SHIPPING: 5,
  RE_DELIVERY: 6
};

export const SERVICE_STATUS = {
  CANCELLED: 0,
  COMPLETED: 1,
  PENDING: 2,
  REQ_CANCEL: 3,
  IN_PROGRESS: 4,
  WAITING_PAYMENT: 5
};

// --- INITIAL DATA ---

export const INITIAL_ROLES: Role[] = [
  { id: 1, code: 'CUSTOMER', name: 'Khách hàng', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
  { id: 2, code: 'STAFF', name: 'Nhân viên', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
  { id: 3, code: 'ADMIN', name: 'Quản trị viên', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Quản Trị Viên',
    email: 'admin@test.com',
    password: '123',
    roleId: 3, // Admin
    phone: '0909000111',
    status: ActiveStatus.ACTIVE,
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 2,
    username: 'staff',
    name: 'Nhân Viên Bán Hàng',
    email: 'staff@test.com',
    password: '123',
    roleId: 2, // Staff
    phone: '0909000222',
    status: ActiveStatus.ACTIVE,
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 3,
    username: 'customer',
    name: 'Khách Hàng Thân Thiết',
    email: 'customer@test.com',
    password: '123',
    roleId: 1, // Customer
    phone: '0909000333',
    status: ActiveStatus.ACTIVE,
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  { 
    id: 1, 
    userId: 3, 
    info: '123 Đường Chính', 
    ward: 'Phường Bến Nghé', 
    district: 'Quận 1', 
    province: 'Hồ Chí Minh', 
    isDefault: 1, 
    phone: '0909000333',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  { 
    id: 2, 
    userId: 3, 
    info: '456 Đường Phụ', 
    ward: 'Phường Cống Vị', 
    district: 'Quận Ba Đình', 
    province: 'Hà Nội', 
    isDefault: 0, 
    phone: '0909000333',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  }
];

export const INITIAL_CATEGORIES: Category[] = [
    { id: 1, name: 'Chó Cảnh', code: 'Dog', description: 'Các giống chó cảnh thuần chủng', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 2, name: 'Mèo Cảnh', code: 'Cat', description: 'Mèo Anh, Ba Tư, ...', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 3, name: 'Chim Cảnh', code: 'Bird', description: 'Vẹt, Yến Phụng...', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 4, name: 'Thú Nhỏ', code: 'Small Pet', description: 'Hamster, Sóc, Thỏ...', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
];

export const INITIAL_BREEDS: Breed[] = [
    { id: 1, name: 'Golden Retriever', categoryId: 1, categoryCode: 'Dog', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 2, name: 'Alaskan Malamute', categoryId: 1, categoryCode: 'Dog', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 3, name: 'Corgi', categoryId: 1, categoryCode: 'Dog', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 4, name: 'British Shorthair', categoryId: 2, categoryCode: 'Cat', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 5, name: 'Scottish Fold', categoryId: 2, categoryCode: 'Cat', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 6, name: 'Vẹt Macaw', categoryId: 3, categoryCode: 'Bird', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 7, name: 'Thỏ Holland Lop', categoryId: 4, categoryCode: 'Small Pet', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 8, name: 'Hamster Bear', categoryId: 4, categoryCode: 'Small Pet', status: 1, createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
];

export const INITIAL_ORIGINS: Origin[] = [
    { id: 1, name: 'Việt Nam', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 2, name: 'Thái Lan', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 3, name: 'Châu Âu', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
    { id: 4, name: 'Nam Mỹ', createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    code: 'P001',
    name: 'Micky',
    categoryId: 1,
    breedId: 1,
    originId: 2,
    age: 3,
    gender: Gender.MALE,
    price: 12000000,
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=400&q=80',
    description: 'Chó Golden thuần chủng, 3 tháng tuổi, lông vàng óng, rất thông minh và quấn chủ.',
    status: 1,
    category: 'Dog',
    breed: 'Golden Retriever',
    origin: 'Thái Lan',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 2,
    code: 'P002',
    name: 'Rocky',
    categoryId: 1,
    breedId: 2,
    originId: 1,
    age: 5,
    gender: Gender.MALE,
    price: 15000000,
    image: 'https://images.unsplash.com/photo-1563889958749-6a9b4c6cefb0?auto=format&fit=crop&w=400&q=80',
    description: 'Alaskan Malamute khỏe mạnh, tiêm phòng đầy đủ, khung xương to.',
    status: 1,
    category: 'Dog',
    breed: 'Alaskan Malamute',
    origin: 'Việt Nam',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 3,
    code: 'P003',
    name: 'Luna',
    categoryId: 2,
    breedId: 4,
    originId: 3,
    age: 4,
    gender: Gender.FEMALE,
    price: 9500000,
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80',
    description: 'Mèo Anh Lông Ngắn màu xám xanh, mặt tròn bầu bĩnh, tính cách điềm đạm.',
    status: 1,
    category: 'Cat',
    breed: 'British Shorthair',
    origin: 'Châu Âu',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 4,
    code: 'P004',
    name: 'Bun',
    categoryId: 1,
    breedId: 3,
    originId: 2,
    age: 2,
    gender: Gender.MALE,
    price: 18000000,
    image: 'https://images.unsplash.com/photo-1612536053381-69618f074644?auto=format&fit=crop&w=400&q=80',
    description: 'Corgi mông to, chân ngắn đáng yêu, siêu nghịch ngợm.',
    status: 1,
    category: 'Dog',
    breed: 'Corgi',
    origin: 'Thái Lan',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 5,
    code: 'P005',
    name: 'Mimi',
    categoryId: 2,
    breedId: 5,
    originId: 1,
    age: 3,
    gender: Gender.FEMALE,
    price: 8000000,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=400&q=80',
    description: 'Mèo tai cụp Scottish Fold, màu trắng tinh khôi, mắt 2 màu cực hiếm.',
    status: 1,
    category: 'Cat',
    breed: 'Scottish Fold',
    origin: 'Việt Nam',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 6,
    code: 'P006',
    name: 'Rio',
    categoryId: 3,
    breedId: 6,
    originId: 4,
    age: 12,
    gender: Gender.MALE,
    price: 25000000,
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=400&q=80',
    description: 'Vẹt Macaw sặc sỡ, đã thuần người, biết nói vài câu cơ bản.',
    status: 1,
    category: 'Bird',
    breed: 'Vẹt Macaw',
    origin: 'Nam Mỹ',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 7,
    code: 'P007',
    name: 'Jerry',
    categoryId: 4,
    breedId: 8,
    originId: 1,
    age: 2,
    gender: Gender.MALE,
    price: 150000,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80',
    description: 'Hamster Bear béo ú, lông vàng cam, ăn khỏe ngủ khỏe.',
    status: 1,
    category: 'Small Pet',
    breed: 'Hamster Bear',
    origin: 'Việt Nam',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 8,
    code: 'P008',
    name: 'Bông',
    categoryId: 4,
    breedId: 7,
    originId: 2,
    age: 4,
    gender: Gender.FEMALE,
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1585110396065-88b7406037a7?auto=format&fit=crop&w=400&q=80',
    description: 'Thỏ Holland Lop tai cụp, lông xám tro, rất hiền lành.',
    status: 1,
    category: 'Small Pet',
    breed: 'Thỏ Holland Lop',
    origin: 'Thái Lan',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 9,
    code: 'P009',
    name: 'Coco',
    categoryId: 1,
    breedId: 1,
    originId: 1,
    age: 2,
    gender: Gender.FEMALE,
    price: 11000000,
    image: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?auto=format&fit=crop&w=400&q=80',
    description: 'Chó Golden cái, 2 tháng tuổi, đã tiêm mũi 1, bảo hành sức khỏe.',
    status: 1,
    category: 'Dog',
    breed: 'Golden Retriever',
    origin: 'Việt Nam',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 10,
    code: 'P010',
    name: 'Simba',
    categoryId: 2,
    breedId: 4,
    originId: 3,
    age: 5,
    gender: Gender.MALE,
    price: 12000000,
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a7071?auto=format&fit=crop&w=400&q=80',
    description: 'Mèo Anh Lông Ngắn màu Golden, mặt bánh bao, form chuẩn.',
    status: 1,
    category: 'Cat',
    breed: 'British Shorthair',
    origin: 'Châu Âu',
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Spa - Cắt tỉa trọn gói',
    price: 400000,
    duration: 60,
    description: 'Tắm, sấy, chải lông, cắt tỉa tạo kiểu.',
    status: 1,
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 2,
    name: 'Khám sức khỏe thú y',
    price: 300000,
    duration: 30,
    description: 'Kiểm tra sức khỏe tổng quát.',
    status: 1,
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  },
  {
    id: 3,
    name: 'Huấn luyện cơ bản',
    price: 600000,
    duration: 90,
    description: 'Huấn luyện vâng lời.',
    status: 1,
    createdAt: NOW, createdBy: SYSTEM, updatedAt: NOW, updatedBy: SYSTEM
  }
];

export const INITIAL_ORDERS = [];
export const INITIAL_APPOINTMENTS = [];
export const INITIAL_BLOGS = [
    {
      id: 1,
      title: "Cách chăm sóc cún con mới về nhà",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80",
      desc: "Những điều cần biết về dinh dưỡng, vệ sinh và tiêm phòng cho cún con..."
    },
    {
      id: 2,
      title: "Dấu hiệu mèo cưng đang hạnh phúc",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
      desc: "Làm sao để biết 'hoàng thượng' có hài lòng với cuộc sống hiện tại hay không?"
    }
];
