import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import WholesalePage from './pages/WholesalePage';
import BrandPage from './pages/BrandPage';
import BrandsPage from './pages/BrandsPage';
import NotFound from './pages/NotFound';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import BrandList from './pages/admin/brands/BrandList';
import BrandForm from './pages/admin/brands/BrandForm';
import CategoryList from './pages/admin/categories/CategoryList';
import CategoryForm from './pages/admin/categories/CategoryForm';
import ProductList from './pages/admin/products/ProductList';
import ProductForm from './pages/admin/products/ProductForm';
import PageList from './pages/admin/pages/PageList';
import PageForm from './pages/admin/pages/PageForm';
import LeadsList from './pages/admin/leads/LeadsList';

import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="wholesale" element={<WholesalePage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:id" element={<BrandPage />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Brands */}
          <Route path="brands" element={<BrandList />} />
          <Route path="brands/new" element={<BrandForm />} />
          <Route path="brands/:id" element={<BrandForm />} />
          {/* Categories */}
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:id" element={<CategoryForm />} />
          {/* Products */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:slug" element={<ProductForm />} />
          {/* Pages */}
          <Route path="pages" element={<PageList />} />
          <Route path="pages/:type" element={<PageForm />} />
          {/* Leads */}
          <Route path="leads" element={<LeadsList />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #333',
        },
      }} />
    </AuthProvider>
  );
}
export default App;
