
import React, { useState, useEffect } from 'react';
import { useService } from '../../contexts/ServiceContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Service } from '../../interfaces';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService, refreshServices } = useService();
  const { formatCurrency } = useLanguage();
  const { notify } = useNotification();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

  useEffect(() => {
    refreshServices();
  }, [refreshServices]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', price: 0, duration: 60, description: '', status: 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingId(s.id);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateService({ ...formData, id: editingId } as Service);
        notify('success', 'Cập nhật dịch vụ thành công');
    } else {
        addService({ ...formData, id: `s${Date.now()}` } as Service);
        notify('success', 'Thêm dịch vụ mới thành công');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
      if(confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
          deleteService(id);
          notify('info', 'Đã xóa dịch vụ');
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
            <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                <Plus size={20}/> Thêm dịch vụ
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian (phút)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {services.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{s.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{s.duration}p</td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">{formatCurrency(s.price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${s.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {s.status === 1 ? 'Hoạt động' : 'Tạm ngưng'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => openEditModal(s)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18}/></button>
                                <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button>
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
                        <h3 className="font-bold text-lg">{editingId ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h3>
                        <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full border rounded p-2"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giá (VNĐ)</label>
                                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="mt-1 w-full border rounded p-2"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thời gian (phút)</label>
                                <input required type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="mt-1 w-full border rounded p-2"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 w-full border rounded p-2"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: Number(e.target.value)})} className="mt-1 w-full border rounded p-2">
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Tạm ngưng</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Hủy</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2">
                                <Save size={18}/> Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
