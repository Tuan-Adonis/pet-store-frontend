import React, { useState } from "react";
import { useBreed } from "../../contexts/BreedContext";
import { useOrigin } from "../../contexts/OriginContext";
import { useCategory } from "../../contexts/CategoryContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Plus, ArrowLeftRight, X, Save, Tag } from "lucide-react";
import { CreateBreedRequest } from "../../interfaces/request/breed";
import { CreateOriginRequest } from "../../interfaces/request/origin";

export const AdminAttributes: React.FC = () => {
  const { breeds, addBreed, deleteBreed } = useBreed();
  const { origins, addOrigin, deleteOrigin } = useOrigin();
  const { categories } = useCategory();
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<"breeds" | "origins">("breeds");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");

  const openAddModal = () => {
    setName("");
    setCategoryCode(categories[0]?.code || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "breeds") {
      const category = categories.find((c) => c.code === categoryCode);
      const newBreed: CreateBreedRequest = {
        name,
        categoryCode,
        categoryId: category ? category.id : 0,
        status: 1,
      };
      addBreed(newBreed);
      //   notify("success", "Đã thêm giống mới");
    } else {
      const newOrigin: CreateOriginRequest = {
        name,
      };
      addOrigin(newOrigin);
    }
    setIsModalOpen(false);
  };

  const handleDeleteBreed = (id: string | number) => {
    if (confirm("Bạn có chắc chắn muốn đổi trạng thái?")) {
      deleteBreed(id);
    }
  };

  const handleDeleteOrigin = (id: string | number) => {
    if (confirm("Bạn có chắc chắn muốn đổi trạng thái?")) {
      deleteOrigin(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Thuộc tính</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={20} />{" "}
          {activeTab === "breeds" ? "Thêm Giống" : "Thêm Nguồn gốc"}
        </button>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("breeds")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "breeds"
              ? "bg-white shadow-sm text-indigo-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Giống loài (Breeds)
        </button>
        <button
          onClick={() => setActiveTab("origins")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "origins"
              ? "bg-white shadow-sm text-indigo-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Nguồn gốc (Origins)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              {activeTab === "breeds" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thuộc Danh mục
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeTab === "breeds"
              ? breeds
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {b.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {categories.find((c) => c.id === b.categoryId)?.name ||
                          b.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            b.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {b.status === 1 ? "Hoạt động" : "Ngừng"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteBreed(b.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <ArrowLeftRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
              : origins
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {o.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            o.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {o.status === 1 ? "Hoạt động" : "Ngừng"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteOrigin(o.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <ArrowLeftRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
        {((activeTab === "breeds" && breeds.length === 0) ||
          (activeTab === "origins" && origins.length === 0)) && (
          <div className="p-8 text-center text-gray-500">Chưa có dữ liệu</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {activeTab === "breeds" ? "Thêm Giống mới" : "Thêm Nguồn gốc"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên hiển thị
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Ví dụ: Husky, Việt Nam..."
                />
              </div>

              {activeTab === "breeds" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thuộc danh mục
                  </label>
                  <select
                    value={categoryCode}
                    onChange={(e) => setCategoryCode(e.target.value)}
                    className="mt-1 w-full border rounded p-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
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
