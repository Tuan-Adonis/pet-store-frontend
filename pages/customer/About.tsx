import React from 'react';
import { Award, Heart, Shield, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4">Về PET Store</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Ngôi nhà chung cho những người yêu thú cưng. Chúng tôi cam kết mang đến những người bạn nhỏ khỏe mạnh và dịch vụ chăm sóc tận tâm nhất.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Heart className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Tình Yêu Thú Cưng</h3>
          <p className="text-gray-600 text-sm">Chúng tôi coi thú cưng như thành viên trong gia đình và chăm sóc bằng cả trái tim.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Shield className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Uy Tín Hàng Đầu</h3>
          <p className="text-gray-600 text-sm">Cam kết nguồn gốc thú cưng rõ ràng, sức khỏe được đảm bảo và tiêm phòng đầy đủ.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Users className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Đội Ngũ Chuyên Nghiệp</h3>
          <p className="text-gray-600 text-sm">Nhân viên giàu kinh nghiệm, được đào tạo bài bản về chăm sóc và tư vấn thú cưng.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Award className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Dịch Vụ Toàn Diện</h3>
          <p className="text-gray-600 text-sm">Từ spa, cắt tỉa đến khách sạn thú cưng, chúng tôi đáp ứng mọi nhu cầu của bạn.</p>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-indigo-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Câu Chuyện Của Chúng Tôi</h2>
          <p className="text-gray-700 mb-4">
            Được thành lập từ năm 2023, PET Store bắt đầu từ niềm đam mê nhỏ bé với những chú cún Corgi. 
            Sau nhiều năm nỗ lực, chúng tôi đã phát triển thành hệ thống cửa hàng thú cưng uy tín với đa dạng các chủng loại từ chó, mèo đến chim cảnh và chuột hamster.
          </p>
          <p className="text-gray-700">
            Sứ mệnh của chúng tôi là kết nối những trái tim yêu động vật và mang lại cuộc sống hạnh phúc nhất cho các bé thú cưng.
          </p>
        </div>
        <div className="flex-1">
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" 
            alt="Happy pets" 
            className="rounded-lg shadow-md w-full h-64 object-cover"
          />
        </div>
      </div>
    </div>
  );
};