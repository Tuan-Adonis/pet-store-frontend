
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { BreedProvider } from './contexts/BreedContext';
import { OriginProvider } from './contexts/OriginContext';
import { ProductProvider } from './contexts/ProductContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { OrderProvider } from './contexts/OrderContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { RoleProvider } from './contexts/RoleContext';
import { AddressProvider } from './contexts/AddressContext';

import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CustomerHome } from './pages/customer/Home';
import { CustomerProducts } from './pages/customer/Products';
import { CustomerCart } from './pages/customer/Cart';
import { CustomerCheckout } from './pages/customer/Checkout';
import { CustomerServices } from './pages/customer/Services';
import { CustomerProfile } from './pages/customer/Profile';
import { About } from './pages/customer/About';
import { Contact } from './pages/customer/Contact';
import { StaffDashboard } from './pages/staff/Dashboard';
import { StaffOrders } from './pages/staff/Orders';
import { StaffServices } from './pages/staff/Services';
import { StaffProfile } from './pages/staff/Profile';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCategories } from './pages/admin/Categories';
import { AdminProducts } from './pages/admin/Products';
import { AdminServices } from './pages/admin/Services';
import { AdminUsers } from './pages/admin/Users';
import { AdminAttributes } from './pages/admin/Attributes';

// Role IDs from constants/DB
const ROLE_ADMIN = 3;
const ROLE_STAFF = 2;
const ROLE_CUSTOMER = 1;

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: number[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.roleId)) {
    if (user.roleId === ROLE_ADMIN) return <Navigate to="/admin/dashboard" replace />;
    if (user.roleId === ROLE_STAFF) return <Navigate to="/staff/dashboard" replace />;
    if (user.roleId === ROLE_CUSTOMER) return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Routes */}
        <Route path="/" element={<Layout><CustomerHome /></Layout>} />
        <Route path="/products" element={<Layout><CustomerProducts /></Layout>} />
        <Route path="/services" element={<Layout><CustomerServices /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Protected Customer Routes */}
        <Route path="/customer/cart" element={
          <ProtectedRoute allowedRoles={[ROLE_CUSTOMER]}>
            <Layout>
              <CustomerCart />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/customer/checkout" element={
          <ProtectedRoute allowedRoles={[ROLE_CUSTOMER]}>
            <Layout>
              <CustomerCheckout />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/customer/profile" element={
          <ProtectedRoute allowedRoles={[ROLE_CUSTOMER]}>
            <Layout>
              <CustomerProfile />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLE_STAFF]}>
            <Layout>
              <StaffDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/staff/orders" element={
          <ProtectedRoute allowedRoles={[ROLE_STAFF]}>
            <Layout>
              <StaffOrders />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/staff/services" element={
          <ProtectedRoute allowedRoles={[ROLE_STAFF]}>
            <Layout>
              <StaffServices />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/staff/profile" element={
          <ProtectedRoute allowedRoles={[ROLE_STAFF]}>
            <Layout>
              <StaffProfile />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <Layout>
              <AdminCategories />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/attributes" element={
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <Layout>
              <AdminAttributes />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <Layout>
              <AdminProducts />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/services" element={
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <Layout>
              <AdminServices />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <Layout>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <RoleProvider>
          <UserProvider>
            <AddressProvider>
              <AuthProvider>
                <CategoryProvider>
                  <BreedProvider>
                    <OriginProvider>
                      <ServiceProvider>
                        <AppointmentProvider>
                          <ProductProvider>
                            <CartProvider>
                              <OrderProvider>
                                <AppContent />
                              </OrderProvider>
                            </CartProvider>
                          </ProductProvider>
                        </AppointmentProvider>
                      </ServiceProvider>
                    </OriginProvider>
                  </BreedProvider>
                </CategoryProvider>
              </AuthProvider>
            </AddressProvider>
          </UserProvider>
        </RoleProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}
