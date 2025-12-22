import React from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-indigo-700">Liên Hệ Với Chúng Tôi</h1>
        <p className="mt-2 text-gray-600">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông Tin Liên Lạc</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-indigo-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Địa chỉ cửa hàng</p>
                  <p className="text-gray-600 text-sm">123 Đường Thú Cưng, xxx, yyy, zzz, Việt Nam</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="text-indigo-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Hotline</p>
                  <p className="text-gray-600 text-sm">1900 123 456</p>
                  <p className="text-gray-600 text-sm">0909 000 111</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="text-indigo-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600 text-sm">support@petstore.com</p>
                  <p className="text-gray-600 text-sm">sales@petstore.com</p>
                </div>
              </div>

               <div className="flex items-start space-x-3">
                <Clock className="text-indigo-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Giờ làm việc</p>
                  <p className="text-gray-600 text-sm">Thứ 2 - Chủ Nhật</p>
                  <p className="text-gray-600 text-sm">8:00 - 21:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0909xxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bạn cần hỗ trợ gì?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Send size={18} className="mr-2" />
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};