import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNotification } from "../../contexts/NotificationContext";
import { User, RoleId, ActiveStatus } from "../../interfaces";
import {
  Edit,
  ArrowLeftRight,
  X,
  Save,
  Lock,
  Unlock,
  UserPlus,
} from "lucide-react";

export const AdminUsers: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUser();
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      username: "",
      email: "",
      phone: "",
      password: "",
      roleId: RoleId.CUSTOMER,
      status: ActiveStatus.ACTIVE,
      addresses: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingId(u.id);
    setFormData({ ...u });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUser({ ...formData, id: editingId } as User);
      notify("success", "Cập nhật người dùng thành công");
    } else {
      addUser({ ...formData, id: Date.now() } as User);
      notify("success", "Thêm người dùng mới thành công");
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (u: User) => {
    const newStatus =
      u.status === ActiveStatus.ACTIVE
        ? ActiveStatus.INACTIVE
        : ActiveStatus.ACTIVE;
    updateUser({ ...u, status: newStatus });
    notify(
      "info",
      `Đã ${newStatus === ActiveStatus.ACTIVE ? "mở khóa" : "khóa"} tài khoản`
    );
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Bạn có đổi trạng thái người dùng này?")) {
      deleteUser(id);
      notify("info", "Đã đổi trạng thái người dùng");
    }
  };

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case RoleId.ADMIN:
        return "Admin";
      case RoleId.STAFF:
        return "Staff";
      case RoleId.CUSTOMER:
        return "Customer";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <UserPlus size={20} /> Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
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
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {u.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      u.roleId === RoleId.ADMIN
                        ? "bg-purple-100 text-purple-800"
                        : u.roleId === RoleId.STAFF
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getRoleName(u.roleId)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      u.status === ActiveStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status === ActiveStatus.ACTIVE ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(u)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  {u.roleId !== RoleId.ADMIN && (
                    <>
                      <button
                        onClick={() => toggleStatus(u)}
                        className={`${
                          u.status === ActiveStatus.ACTIVE
                            ? "text-orange-600"
                            : "text-green-600"
                        } mr-4`}
                      >
                        {u.status === ActiveStatus.ACTIVE ? (
                          <Lock size={18} />
                        ) : (
                          <Unlock size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <ArrowLeftRight size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {editingId ? "Sửa người dùng" : "Thêm người dùng"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                  disabled={!!editingId}
                />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <select
                  value={formData.roleId}
                  onChange={(e) =>
                    setFormData({ ...formData, roleId: Number(e.target.value) })
                  }
                  className="mt-1 w-full border rounded p-2"
                >
                  <option value={RoleId.CUSTOMER}>Customer</option>
                  <option value={RoleId.STAFF}>Staff</option>
                  {/* <option value={RoleId.ADMIN}>Admin</option> */}
                </select>
              </div>
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
