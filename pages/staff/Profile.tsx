
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RoleId } from '../../interfaces';
import { User, Mail, Phone, Shield } from 'lucide-react';

export const StaffProfile: React.FC = () => {
  const { user } = useAuth();

  const getRoleName = (id: number) => {
      if (id === RoleId.ADMIN) return 'Quản trị viên';
      if (id === RoleId.STAFF) return 'Nhân viên';
      return 'Khách hàng';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Hồ sơ nhân viên</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
            <div className="bg-indigo-100 p-4 rounded-full">
                <User size={40} className="text-indigo-600" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user ? getRoleName(user.roleId) : ''}
                </span>
            </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6 text-sm text-yellow-800">
            Thông tin hồ sơ nhân viên được quản lý bởi Quản trị viên. Bạn không thể tự thay đổi thông tin này.
        </div>

        <div className="space-y-6">
             {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                    <User size={16}/> Họ và tên
                </label>
                <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                />
            </div>

             {/* Phone */}
             <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                    <Phone size={16}/> Số điện thoại
                </label>
                <input
                    type="text"
                    value={user?.phone || ''}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                />
            </div>

            {/* Email (Read Only) */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                    <Mail size={16}/> Email
                </label>
                <input
                    type="text"
                    value={user?.email}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                />
            </div>
             
             {/* Role (Read Only) */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                    <Shield size={16}/> Vai trò
                </label>
                <input
                    type="text"
                    value={user ? getRoleName(user.roleId) : ''}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                />
            </div>
        </div>
      </div>
    </div>
  );
};
