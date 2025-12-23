import React, { useState, useEffect } from "react";
import { useProduct } from "../../contexts/ProductContext";
import { useCategory } from "../../contexts/CategoryContext";
import { useBreed } from "../../contexts/BreedContext";
import { useOrigin } from "../../contexts/OriginContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Product } from "../../interfaces";
import {
  Plus,
  Edit,
  ArrowLeftRight,
  X,
  Save,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

export const AdminProducts: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  } = useProduct();
  const { categories } = useCategory();
  const { breeds } = useBreed();
  const { origins } = useOrigin();
  const { formatCurrency } = useLanguage();
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [formData, setFormData] = useState<Partial<Product>>({
    id: null,
    createdAt: null,
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
    code: null,
    name: "",
    categoryId: 1,
    breedId: 1,
    originId: 1,
    age: 1,
    gender: 1,
    price: 0,
    image: "",
    description: "",
    status: 1,

    // Frontend Helpers
    category: "",
    breed: "",
    origin: "",
  });

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      categoryId: categories[0]?.id || "",
      price: 0,
      image: "",
      description: "",
      status: 1,
      breedId: 1,
      originId: 1,
      age: 1,
      gender: 1,
    });
    setImageMode("url");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      price: p.price,
      image: p.image,
      description: p.description,
      status: p.status,
      breedId: p.breedId,
      originId: p.originId,
      age: p.age,
      gender: p.gender,
    });
    setImageMode(p.image.startsWith("data:") ? "file" : "url");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct({ ...formData } as Product);
      notify("success", "Cập nhật sản phẩm thành công");
    } else {
      addProduct({
        ...formData,
      } as Product);
      notify("success", "Thêm sản phẩm mới thành công");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Bạn có đổi trạng thái sản phẩm này?")) {
      deleteProduct(id);
      notify("info", "Đã đổi trạng thái sản phẩm");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý Sản phẩm / Thú cưng
        </h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={20} /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên & Loài
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={p.image}
                    alt=""
                    className="h-12 w-12 rounded object-cover bg-gray-100 border"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {p.name}
                  </div>
                  <div className="text-sm text-gray-500">{p.category}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{p.breed}</div>
                  <div>
                    {p.age} tháng - {p.gender === 1 ? "Đực" : "Cái"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-indigo-600">
                    {formatCurrency(p.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      p.status === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.status === 1 ? "Đang bán" : "Đã bán"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(p)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <ArrowLeftRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">
                {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên thú cưng
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Danh mục
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded p-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giống
                  </label>
                  <select
                    value={formData.breedId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        breedId: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded p-2"
                  >
                    {breeds
                      .filter((b) => b.categoryId === formData.categoryId)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nguồn gốc
                  </label>
                  <select
                    value={formData.originId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originId: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded p-2"
                  >
                    {origins.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tuổi (tháng)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: Number(e.target.value) })
                    }
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giới tính
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded p-2"
                  >
                    <option value={1}>Đực</option>
                    <option value={0}>Cái</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded p-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded p-2"
                  >
                    <option value={1}>Hoạt động (Đang bán)</option>
                    <option value={0}>Đã bán / Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh sản phẩm
                </label>

                <div className="flex gap-4 mb-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                      imageMode === "url"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <LinkIcon size={14} /> Nhập Link URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("file")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                      imageMode === "file"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Upload size={14} /> Tải từ máy
                  </button>
                </div>

                {imageMode === "url" ? (
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full border rounded p-2 bg-white"
                    placeholder="https://example.com/image.jpg"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full border rounded p-1 bg-white"
                    />
                  </div>
                )}

                {formData.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Xem trước:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded border bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Save size={18} /> Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
