
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { RoleId } from '../interfaces';
import { LogOut, ShoppingCart, User as UserIcon, LayoutDashboard, Menu, X, Package, Calendar, LogIn, Cat, Home, Info, Phone, ChevronDown, HelpCircle, FileText, Clock, Users, Layers, Tag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCustomer = user?.roleId === RoleId.CUSTOMER;
  const isStaff = user?.roleId === RoleId.STAFF;
  const isAdmin = user?.roleId === RoleId.ADMIN;
  const isGuest = !user;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const NavLink = ({ to, label, icon: Icon }: any) => (
    <Link 
      to={to} 
      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        location.pathname === to 
        ? 'bg-indigo-100 text-indigo-700' 
        : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      <Icon size={18} />
      <span className="hidden lg:inline">{label}</span>
      <span className="lg:hidden">{label}</span>
    </Link>
  );

  const SidebarLink = ({ to, label, icon: Icon }: any) => (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${
        location.pathname === to 
        ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' 
        : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full">
            
            {/* Logo area */}
            <div className="flex items-center">
              {isStaff || isAdmin ? (
                // Non-clickable logo or redirect to dashboard for internal users
                <div className="flex-shrink-0 flex items-center gap-2 mr-6 select-none cursor-default">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Cat size={24} className="text-white" />
                  </div>
                  <span className="text-xl font-bold text-indigo-600 hidden sm:block">PET Store</span>
                  <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-700 font-bold uppercase">
                      {isStaff ? 'Staff' : 'Admin'}
                  </span>
                </div>
              ) : (
                <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-6">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Cat size={24} className="text-white" />
                  </div>
                  <span className="text-xl font-bold text-indigo-600 hidden sm:block">PET Store</span>
                </Link>
              )}
              
              {/* Top Menu for Customers/Guests ONLY */}
              {(isCustomer || isGuest) && (
                <div className="hidden md:flex md:space-x-2">
                  <NavLink to="/" label={t('nav.home')} icon={Home} />
                  <NavLink to="/products" label={t('nav.products')} icon={Package} />
                  <NavLink to="/services" label={t('nav.services')} icon={Calendar} />
                  <NavLink to="/about" label={t('nav.about')} icon={Info} />
                  <NavLink to="/contact" label={t('nav.contact')} icon={Phone} />
                </div>
              )}
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              
              {/* Cart - Only for Customers/Guests */}
              {(isCustomer || isGuest) && (
                <Link to="/customer/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
                  <ShoppingCart size={24} />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </Link>
              )}
              
              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none px-3 py-2 rounded-md hover:bg-gray-50"
                    >
                      <UserIcon size={20} />
                      <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown size={16} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                        {isCustomer && (
                          <Link 
                            to="/customer/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {t('nav.profile')}
                          </Link>
                        )}
                        {isStaff && (
                           <Link 
                             to="/staff/profile" 
                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                             onClick={() => setIsUserMenuOpen(false)}
                           >
                             {t('nav.profile')}
                           </Link>
                        )}
                        {/* Admin doesn't have a specific profile page yet, or use dashboard */}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          {t('nav.logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <LogIn size={18} />
                    <span>{t('nav.login')}</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1 px-2">
              {(isCustomer || isGuest) && (
                <>
                  <NavLink to="/" label={t('nav.home')} icon={Home} />
                  <NavLink to="/products" label={t('nav.products')} icon={Package} />
                  <NavLink to="/services" label={t('nav.services')} icon={Calendar} />
                  <NavLink to="/about" label={t('nav.about')} icon={Info} />
                  <NavLink to="/contact" label={t('nav.contact')} icon={Phone} />
                </>
              )}
               {isStaff && (
                 <>
                   <NavLink to="/staff/dashboard" label={t('nav.dashboard')} icon={LayoutDashboard} />
                   <NavLink to="/staff/orders" label={t('nav.orders')} icon={FileText} />
                   <NavLink to="/staff/services" label={t('nav.appointments')} icon={Clock} />
                 </>
              )}
              {isAdmin && (
                  <>
                   <NavLink to="/admin/dashboard" label="Thống kê" icon={LayoutDashboard} />
                   <NavLink to="/admin/categories" label="Danh mục" icon={Layers} />
                   <NavLink to="/admin/attributes" label="Thuộc tính" icon={Tag} />
                   <NavLink to="/admin/products" label="Sản phẩm" icon={Package} />
                   <NavLink to="/admin/services" label="Dịch vụ" icon={Clock} />
                   <NavLink to="/admin/users" label="Người dùng" icon={Users} />
                  </>
              )}
              
              <div className="border-t border-gray-200 my-2 pt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center space-x-2 text-gray-500">
                        <UserIcon size={18} />
                        <span className="font-medium">{user.name}</span>
                    </div>
                    {isCustomer && (
                        <NavLink to="/customer/profile" label={t('nav.profile')} icon={UserIcon} />
                    )}
                    {isStaff && (
                        <NavLink to="/staff/profile" label={t('nav.profile')} icon={UserIcon} />
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>{t('nav.login')}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Layout Area */}
      <div className="flex flex-grow max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar for STAFF */}
        {isStaff && (
          <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] py-6 px-3">
             <div className="mb-6 px-4">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nhân sự</p>
               <h3 className="font-bold text-gray-800">{user?.name}</h3>
             </div>
             <nav className="space-y-1">
                <SidebarLink to="/staff/dashboard" label={t('nav.dashboard')} icon={LayoutDashboard} />
                <SidebarLink to="/staff/orders" label={t('nav.orders')} icon={FileText} />
                <SidebarLink to="/staff/services" label={t('nav.appointments')} icon={Clock} />
             </nav>
          </aside>
        )}

        {/* Left Sidebar for ADMIN */}
        {isAdmin && (
          <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] py-6 px-3">
             <div className="mb-6 px-4">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quản Trị Viên</p>
               <h3 className="font-bold text-gray-800">{user?.name}</h3>
             </div>
             <nav className="space-y-1">
                <SidebarLink to="/admin/dashboard" label="Thống kê" icon={LayoutDashboard} />
                <SidebarLink to="/admin/categories" label="Quản lý Danh mục" icon={Layers} />
                <SidebarLink to="/admin/attributes" label="Quản lý Thuộc tính" icon={Tag} />
                <SidebarLink to="/admin/products" label="Quản lý Sản phẩm" icon={Package} />
                <SidebarLink to="/admin/services" label="Quản lý Dịch vụ" icon={Clock} />
                <SidebarLink to="/admin/users" label="Quản lý Người dùng" icon={Users} />
             </nav>
          </aside>
        )}

        {/* Content Area */}
        <main className={`flex-grow px-4 sm:px-6 lg:px-8 py-8 w-full ${isStaff || isAdmin ? 'bg-gray-50' : ''}`}>
          {children}
        </main>
      </div>

      {/* Footer (Simplified for Staff/Admin) */}
      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Staff/Admin sees minimal footer */}
          {isStaff || isAdmin ? (
             <div className="text-center text-gray-500 text-sm">
               &copy; 2023 PET Store Internal System.
             </div>
          ) : (
             <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Brand */}
                  <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                          <Cat size={20} className="text-white" />
                        </div>
                        <span className="text-lg font-bold text-indigo-600">PET Store</span>
                      </div>
                      <p className="text-gray-500 text-sm">Hệ thống cửa hàng thú cưng và dịch vụ chăm sóc hàng đầu Việt Nam.</p>
                  </div>

                  {/* Links */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Liên kết nhanh</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><Link to="/products" className="hover:text-indigo-600">Sản phẩm</Link></li>
                      <li><Link to="/services" className="hover:text-indigo-600">Dịch vụ</Link></li>
                      <li><Link to="/about" className="hover:text-indigo-600">Về chúng tôi</Link></li>
                      <li><Link to="/contact" className="hover:text-indigo-600">Liên hệ</Link></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Hỗ trợ khách hàng</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>Chính sách bảo hành</li>
                      <li>Chính sách đổi trả</li>
                      <li>Vận chuyển & giao nhận</li>
                      <li>Bảo mật thông tin</li>
                    </ul>
                  </div>

                  {/* FAQ */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <HelpCircle size={18} /> FAQ
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-800">Shop có ship tỉnh không?</p>
                        <p className="text-xs">Có, chúng tôi vận chuyển toàn quốc.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Thú cưng có giấy tờ không?</p>
                        <p className="text-xs">Tất cả thú cưng đều có giấy chứng nhận sức khỏe và nguồn gốc.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Đặt lịch spa cần báo trước bao lâu?</p>
                        <p className="text-xs">Bạn nên đặt trước ít nhất 24h.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-10 pt-6 text-center text-gray-500 text-sm">
                  &copy; 2023 PET Store. All rights reserved.
                </div>
             </>
          )}
        </div>
      </footer>
    </div>
  );
};
