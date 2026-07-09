import { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, ChevronLeft, LogOut, BarChart3, Search, Loader2, Upload } from 'lucide-react';
import type { Product, AppView, OrderStatus } from '@/types';
import { formatPrice, generateSlug } from '@/lib/data';
import { useAuth } from '@/hooks/useAuth';
import { useCatalog } from '@/contexts/CatalogContext';
import { hasSupabaseConfig } from '@/lib/supabase';
import { AdminLogin } from '@/sections/AdminLogin';
import { AdminOrdersChart } from '@/sections/AdminOrdersChart';
import {
  fetchProducts,
  fetchOrders,
  createProduct,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  toggleProductPublished as toggleProductPublishedApi,
  updateOrderStatus as updateOrderStatusApi,
  uploadProductImage,
  replaceProductImages,
} from '@/lib/api';

interface AdminDashboardProps {
  onNavigate: (view: AppView) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const { refresh: refreshCatalog } = useCatalog();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data & loading states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load data from Supabase on mount
  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const publishedCount = products.filter(p => p.published).length;
  const totalRevenue = orders.filter((o: any) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered').reduce((s: number, o: any) => s + o.total_amount, 0);
  const recentOrders = orders.slice(0, 5);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '', slug: '', description: '', base_price: 25, sale_price: null,
    category: 'tees', tags: [], themes: [], published: true,
    featured: false, best_seller: false, made_to_order: true,
  });

  const startNewProduct = () => {
    setEditingProduct(null);
    setImageFiles([]);
    setSaveError(null);
    setFormData({
      title: '', slug: '', description: '', base_price: 25, sale_price: null,
      category: 'tees', tags: [], themes: [], published: true,
      featured: false, best_seller: false, made_to_order: true,
    });
    setShowForm(true);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setImageFiles([]);
    setSaveError(null);
    setFormData({ ...product });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.base_price) return;
    setActionLoading('save');
    setSaveError(null);
    try {
      const slug = formData.slug || generateSlug(formData.title!);

      if (editingProduct) {
        await updateProductApi(editingProduct.id, { ...formData, slug });
        if (imageFiles.length > 0) {
          const uploaded = await Promise.all(
            imageFiles.map((file) => uploadProductImage(file, slug))
          );
          const merged = [
            ...editingProduct.product_images.map((img) => ({
              url: img.url,
              alt_text: img.alt_text,
              is_primary: img.is_primary,
              sort_order: img.sort_order,
            })),
            ...uploaded.map((url, i) => ({
              url,
              alt_text: formData.title ?? null,
              is_primary: editingProduct.product_images.length === 0 && i === 0,
              sort_order: editingProduct.product_images.length + i,
            })),
          ];
          await replaceProductImages(editingProduct.id, merged);
        }
      } else {
        const uploaded = await Promise.all(
          imageFiles.map((file) => uploadProductImage(file, slug))
        );
        const newProduct = {
          title: formData.title!,
          slug,
          description: formData.description ?? null,
          base_price: formData.base_price!,
          sale_price: formData.sale_price ?? null,
          category: (formData.category as Product['category']) || 'tees',
          tags: formData.tags || [],
          themes: formData.themes || [],
          published: formData.published ?? true,
          featured: formData.featured ?? false,
          best_seller: formData.best_seller ?? false,
          made_to_order: formData.made_to_order ?? true,
          product_images: uploaded.map((url, i) => ({
            url,
            alt_text: formData.title ?? null,
            is_primary: i === 0,
            sort_order: i,
          })),
          product_variants: [
            { size: 'S', color: 'Black', sku: null, pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
            { size: 'M', color: 'Black', sku: null, pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
            { size: 'L', color: 'Black', sku: null, pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
            { size: 'XL', color: 'Black', sku: null, pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
          ],
        };
        await createProduct(newProduct);
      }
      await loadProducts();
      await refreshCatalog();
      setShowForm(false);
      setEditingProduct(null);
      setImageFiles([]);
    } catch (err) {
      console.error('Save product failed:', err);
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading('delete');
    try {
      await deleteProductApi(id);
      await loadProducts();
    } catch (err) {
      console.error('Delete product failed:', err);
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      await toggleProductPublishedApi(id, !currentPublished);
      await loadProducts();
    } catch (err) {
      console.error('Toggle publish failed:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusApi(orderId, status);
      await loadOrders();
    } catch (err) {
      console.error('Update order status failed:', err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Items', 'Total', 'Status'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.created_at).toLocaleDateString(),
      o.shipping_address?.name || 'Guest',
      o.email,
      o.order_items?.length || 0,
      o.total_amount,
      o.status,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (hasSupabaseConfig) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#64748B]" />
        </div>
      );
    }
    if (!user) {
      return <AdminLogin />;
    }
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-[#0A0A0A]/15 p-8 text-center">
            <h1 className="text-2xl mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>ACCESS DENIED</h1>
            <p className="text-sm text-[#64748B] mb-6">
              This account is not an admin. Run the SQL in docs/OPERATOR_TODO.md to grant access.
            </p>
            <button
              onClick={() => signOut()}
              className="px-6 py-3 text-white text-sm uppercase tracking-wider"
              style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      );
    }
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
          <button onClick={() => setShowForm(false)} className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0A0A0A] mb-6">
            <ChevronLeft size={16} />
            Back to Products
          </button>
          <h1 className="text-3xl text-[#0A0A0A] mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>
            {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW SHIRT'}
          </h1>

          <div className="bg-white border border-[#0A0A0A]/15 p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Title *</label>
              <input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none"
                placeholder="Product title"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Base Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.base_price || ''}
                  onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sale_price || ''}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none"
              >
                <option value="tees">T-Shirts</option>
                <option value="hoodies">Hoodies</option>
                <option value="longsleeve">Long Sleeve</option>
                <option value="hats">Hats</option>
                <option value="stickers">Stickers</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none resize-none"
                placeholder="The humor copy..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Tags (comma separated)</label>
              <input
                value={(formData.tags || []).join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none"
                placeholder="funny, retro, nj..."
              />
            </div>

            {/* Themes */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Themes</label>
              <div className="flex flex-wrap gap-2">
                {['nj-flavor', 'satirical', 'retro', 'band-merch', 'best-sellers'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => {
                      const current = formData.themes || [];
                      setFormData({
                        ...formData,
                        themes: current.includes(theme)
                          ? current.filter(t => t !== theme)
                          : [...current, theme]
                      });
                    }}
                    className={`px-3 py-1.5 text-xs uppercase border transition-all ${
                      (formData.themes || []).includes(theme)
                        ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                        : 'border-[#0A0A0A]/30 text-[#64748B] hover:border-[#0A0A0A]'
                    }`}
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                Product Images
              </label>
              {editingProduct && editingProduct.product_images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {editingProduct.product_images.map((img) => (
                    <img key={img.id} src={img.url} alt="" className="w-20 h-20 object-cover border border-[#0A0A0A]/15" />
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-[#0A0A0A]/20 cursor-pointer hover:border-[#C41E3A] transition-colors">
                <Upload size={18} className="text-[#64748B]" />
                <span className="text-sm text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>
                  {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Upload images (JPG, PNG, WebP)'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                />
              </label>
            </div>

            {saveError && <p className="text-sm text-[#C41E3A]">{saveError}</p>}

            {/* Toggles */}
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'published', label: 'Published' },
                { key: 'featured', label: 'Featured' },
                { key: 'best_seller', label: 'Best Seller' },
                { key: 'made_to_order', label: 'Made to Order' },
              ].map(toggle => (
                <button
                  key={toggle.key}
                  onClick={() => setFormData({ ...formData, [toggle.key]: !(formData as any)[toggle.key] })}
                  className={`flex items-center gap-2 px-4 py-2 border text-xs uppercase transition-all ${
                    (formData as any)[toggle.key]
                      ? 'bg-[#00C853] text-white border-[#00C853]'
                      : 'border-[#0A0A0A]/30 text-[#64748B]'
                  }`}
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {(formData as any)[toggle.key] && <span className="text-xs">&#10003;</span>}
                  {toggle.label}
                </button>
              ))}
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={actionLoading === 'save'}
              className="w-full py-4 text-white text-sm uppercase tracking-wider hover:translate-y-[-2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              {actionLoading === 'save' && <Loader2 size={16} className="animate-spin" />}
              {editingProduct ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Admin Nav */}
      <div className="bg-[#0A0A0A] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="text-sm" style={{ fontFamily: "'Anton', sans-serif" }}>MADCAP ADMIN</span>
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { key: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
                { key: 'products' as const, label: 'Products', icon: Package },
                { key: 'orders' as const, label: 'Orders', icon: ShoppingCart },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs uppercase transition-colors ${
                    activeTab === tab.key ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                  }`}
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {hasSupabaseConfig && user && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            )}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <LogOut size={14} />
              Exit Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <h1 className="text-3xl text-[#0A0A0A] mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>DASHBOARD</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Designs', value: products.length, icon: Package, color: '#1B7A7A' },
                { label: 'Live Designs', value: publishedCount, icon: TrendingUp, color: '#00C853' },
                { label: 'Orders', value: orders.length, icon: ShoppingCart, color: '#D4A843' },
                { label: 'Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: '#C41E3A' },
              ].map(stat => (
                <div key={stat.label} className="bg-white border border-[#0A0A0A]/15 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{stat.value}</p>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <AdminOrdersChart orders={orders} />

            {/* Quick Actions */}
            <div className="bg-white border border-[#0A0A0A]/15 p-6 mb-8">
              <h3 className="text-sm uppercase tracking-wider text-[#64748B] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={startNewProduct}
                  className="flex items-center gap-2 px-6 py-3 text-white text-sm uppercase tracking-wider"
                  style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                >
                  <Plus size={16} />
                  Add New Shirt
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-3 border border-[#0A0A0A] text-sm uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-all"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  Manage Products
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-6 py-3 border border-[#0A0A0A] text-sm uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-all"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  View Orders
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-[#0A0A0A]/15">
              <div className="p-4 border-b border-[#0A0A0A]/10 flex items-center justify-between">
                <h3 className="text-sm uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-[#C41E3A] hover:underline" style={{ fontFamily: "'Space Mono', monospace" }}>View All</button>
              </div>
              <div className="divide-y divide-[#0A0A0A]/10">
                {recentOrders.map(order => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-[#64748B]">{order.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(order.total_amount)}</p>
                      <span className={`text-xs px-2 py-0.5 ${
                        (order as any).status === 'paid' ? 'bg-[#00C853] text-white' :
                        (order as any).status === 'shipped' ? 'bg-[#D4A843] text-[#0A0A0A]' :
                        (order as any).status === 'delivered' ? 'bg-[#1B7A7A] text-white' :
                        'bg-[#64748B] text-white'
                      }`} style={{ fontFamily: "'Space Mono', monospace" }}>
                        {(order as any).status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl text-[#0A0A0A]" style={{ fontFamily: "'Anton', sans-serif" }}>PRODUCTS</h1>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9 pr-4 py-2 border border-[#0A0A0A]/30 text-sm focus:border-[#0A0A0A] focus:outline-none w-48 sm:w-64"
                  />
                </div>
                <button
                  onClick={startNewProduct}
                  className="flex items-center gap-2 px-4 py-2 text-white text-xs uppercase tracking-wider"
                  style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                >
                  <Plus size={14} />
                  Add New
                </button>
              </div>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#64748B]" />
              </div>
            ) : (
              <div className="bg-white border border-[#0A0A0A]/15 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#0A0A0A]/10">
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Product</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Category</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Price</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Themes</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Status</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0A0A0A]/10">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-[#F5F0E8] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#F5F0E8] border border-[#0A0A0A]/10 flex-shrink-0">
                              {product.product_images[0] && (
                                <img src={product.product_images[0].url} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{product.title}</p>
                              <p className="text-xs text-[#64748B]">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm capitalize">{product.category}</td>
                        <td className="px-4 py-3 text-sm">
                          {product.sale_price ? (
                            <>
                              <span className="line-through text-[#64748B]">{formatPrice(product.base_price)}</span>
                              <span className="ml-2 font-bold" style={{ color: '#C41E3A' }}>{formatPrice(product.sale_price)}</span>
                            </>
                          ) : (
                            formatPrice(product.base_price)
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {product.themes.map(t => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-[#F5F0E8] border border-[#0A0A0A]/10" style={{ fontFamily: "'Space Mono', monospace" }}>{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleTogglePublish(product.id, product.published)}
                            className={`text-xs px-2 py-1 ${product.published ? 'bg-[#00C853] text-white' : 'bg-[#64748B] text-white'}`}
                            style={{ fontFamily: "'Space Mono', monospace" }}
                          >
                            {product.published ? 'LIVE' : 'DRAFT'}
                          </button>
                          {product.featured && <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-[#1B7A7A] text-white">FEAT</span>}
                          {product.best_seller && <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-[#D4A843] text-[#0A0A0A]">BS</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(product)} className="text-xs px-3 py-1.5 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all" style={{ fontFamily: "'Space Mono', monospace" }}>Edit</button>
                            <button onClick={() => setDeleteConfirm(product.id)} className="text-xs px-3 py-1.5 border border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition-all" style={{ fontFamily: "'Space Mono', monospace" }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[#0A0A0A]/60" onClick={() => setDeleteConfirm(null)} />
                <div className="relative bg-white p-6 max-w-sm w-full">
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>Delete Product?</h3>
                  <p className="text-sm text-[#64748B] mb-4">This action cannot be undone.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-[#0A0A0A] text-sm">Cancel</button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      disabled={actionLoading === 'delete'}
                      className="flex-1 py-2 bg-[#D32F2F] text-white text-sm disabled:opacity-60"
                    >
                      {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl text-[#0A0A0A]" style={{ fontFamily: "'Anton', sans-serif" }}>ORDERS</h1>
              <button
                onClick={exportCSV}
                className="px-4 py-2 border border-[#0A0A0A] text-xs uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-all"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Export CSV
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#64748B]" />
              </div>
            ) : (
              <div className="bg-white border border-[#0A0A0A]/15 overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#0A0A0A]/10">
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Order</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Date</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Customer</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Items</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Total</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0A0A0A]/10">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-[#F5F0E8] transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>{order.id}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{order.shipping_address?.name || 'Guest'}</p>
                          <p className="text-xs text-[#64748B]">{order.email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{order.order_items?.length || 0} items</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatPrice(order.total_amount)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs px-2 py-1 border border-[#0A0A0A]/20 bg-white"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                          >
                            <option value="pending">PENDING</option>
                            <option value="paid">PAID</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
