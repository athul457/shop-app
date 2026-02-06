
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

import Profile from './pages/customer/Profile';
import Products from './pages/customer/Products';
import ProductDetails from './pages/customer/ProductDetails';
import Orders from './pages/customer/Orders';
import Addresses from './pages/customer/Addresses';
import Wishlist from './pages/customer/Wishlist';
import Cart from './pages/customer/Cart';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AddressProvider } from './context/AddressContext';
import Checkout from './pages/customer/Checkout';
import Payment from './pages/customer/Payment';

import AdminDashboard from './pages/admin/AdminDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminVendors from './pages/admin/AdminVendors';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <AddressProvider>
      <CartProvider>
      <WishlistProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/dashboard" element={<DashboardLayout role="customer" />}>
           <Route index element={<Products />} />
           <Route path="product/:id" element={<ProductDetails />} />
           <Route path="profile" element={<Profile />} />
           <Route path="orders" element={<Orders />} />
           <Route path="addresses" element={<Addresses />} />
           <Route path="wishlist" element={<Wishlist />} />
           <Route path="cart" element={<Cart />} />
           <Route path="checkout" element={<Checkout />} />
           <Route path="payment" element={<Payment />} />
        </Route>
        
        <Route path="/vendor" element={<DashboardLayout role="vendor" />}>
           <Route index element={<VendorDashboard />} />
        </Route>

        <Route path="/admin" element={<DashboardLayout role="admin" />}>
           <Route index element={<AdminDashboard />} />
           <Route path="products" element={<AdminProducts />} />
           <Route path="users" element={<AdminUsers />} />
           <Route path="orders" element={<AdminOrders />} />
           <Route path="vendors" element={<AdminVendors />} />
        </Route>
      </Routes>
      </WishlistProvider>
      </CartProvider>
      </AddressProvider>
    </>
  );
}

export default App;
