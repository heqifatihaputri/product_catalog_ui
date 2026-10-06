import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  ID: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });

  const token = localStorage.getItem('token');

  // Config Axios bawaan dengan Header Token JWT
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 1. READ: Fetch Data Produk
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Log untuk cek bentuk data asli dari Go di Console
      console.log('Response API Products:', response.data);

      // Cek apakah response.data langsung berupa Array, atau ada di dalam properti .data / .products
      let dataArray = [];
      if (Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (Array.isArray(response.data?.data)) {
        dataArray = response.data.data;
      } else if (Array.isArray(response.data?.products)) {
        dataArray = response.data.products;
      }

      setProducts(dataArray);
    } catch (err: any) {
      console.error('Fetch products error:', err.response || err.message);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setError('Gagal memuat data produk.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler Buka Modal Tambah
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, stock: 0 });
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };

  // 2 & 3. CREATE & UPDATE: Handle Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // UPDATE (PUT)
        await axios.put(
          `http://localhost:8080/api/products/${editingProduct.ID}`,
          formData,
          axiosConfig
        );
      } else {
        // CREATE (POST)
        await axios.post('http://localhost:8080/api/products', formData, axiosConfig);
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh data produk
    } catch (err) {
      alert('Gagal menyimpan data produk.');
    }
  };

  // 4. DELETE: Hapus Produk
  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`, axiosConfig);
        fetchProducts(); // Refresh data setelah dihapus
      } catch (err) {
        alert('Gagal menghapus produk.');
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Katalog Produk</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola data barang inventaris Anda</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleOpenCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition"
            >
              + Tambah Produk
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* Tabel / Grid Produk */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div key={product.ID} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">{product.description || 'Tidak ada deskripsi'}</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      Rp {Number(product.price || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      Stok: {product.stock || 0}
                    </span>
                  </div>
                  <div className="flex space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="flex-1 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-sm font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.ID)}
                      className="flex-1 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Belum ada data produk. Klik <strong>+ Tambah Produk</strong> untuk membuat produk baru.
            </div>
          )}
        </div>

        {/* Modal Form Tambah / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
