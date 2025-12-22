import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import { RoleId } from "../interfaces";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Info, Cat, Loader } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { users } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login({ email, password });
    if (success !== null) {
      if (success.roleId === RoleId.ADMIN) navigate("/admin/dashboard");
      else if (success.roleId === RoleId.STAFF) navigate("/staff/dashboard");
      else navigate("/");
    } else {
      setError(
        "Email hoặc mật khẩu không chính xác hoặc tài khoản đã bị khóa."
      );
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Cat size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-indigo-700">PET Store</h1>
          <p className="text-gray-500 mt-2">Đăng nhập vào hệ thống</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
          <Link
            to="/"
            className="block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            &larr; Quay về Trang chủ
          </Link>
        </div>

        {/* Credentials Hint Section */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
            <Info size={16} />
            <span>Tài khoản dùng thử</span>
          </div>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <span className="font-bold text-gray-700">Admin:</span>
              <code className="bg-white px-1 rounded border">
                admin@test.com / 123
              </code>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <span className="font-bold text-gray-700">Staff:</span>
              <code className="bg-white px-1 rounded border">
                staff@test.com / 123
              </code>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
              <span className="font-bold text-gray-700">Customer:</span>
              <code className="bg-white px-1 rounded border">
                customer@test.com / 123
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
