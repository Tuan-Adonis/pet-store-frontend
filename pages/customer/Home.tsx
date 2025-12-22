
import React, { useState } from 'react';
import { useService } from '../../contexts/ServiceContext';
import { useProduct } from '../../contexts/ProductContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, Star, X, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { INITIAL_BLOGS } from '../../constants';

export const CustomerHome: React.FC = () => {
  const { services } = useService();
  const { products } = useProduct();
  const { formatCurrency } = useLanguage();
  const navigate = useNavigate();
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  // Get featured products (e.g., first 4 active ones)
  const featuredProducts = products
    .filter(p => p.status === 1)
    .slice(0, 4);

  // Get featured services (e.g., first 3)
  const featuredServices = services
    .filter(s => s.status === 1)
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-10">
      
      {/* 1. Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl h-[400px] md:h-[500px]">
        <img 
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
          <div className="px-8 md:px-16 max-w-2xl text-white space-y-6">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Uy tín hàng đầu
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-sm">
              Yêu thương <br/> <span className="text-indigo-400">Thú cưng</span> của bạn
            </h1>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow-sm max-w-lg">
              Cung cấp các giống thú cưng thuần chủng, khỏe mạnh cùng các dịch vụ chăm sóc chuyên nghiệp nhất.
            </p>
            <div className="flex gap-4 pt-2">
                <Link 
                to="/products"
                className="inline-flex bg-white text-indigo-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl items-center gap-2"
                >
                Mua sắm ngay <ArrowRight size={20}/>
                </Link>
                <Link 
                to="/services"
                className="inline-flex bg-indigo-600/90 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl items-center gap-2"
                >
                Đặt lịch Spa
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Danh mục nổi bật</h2>
          <p className="text-gray-500">Tìm kiếm người bạn nhỏ phù hợp với bạn</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            onClick={() => handleCategoryClick('Dog')}
            className="group cursor-pointer bg-orange-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-orange-100"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Dog"/>
            </div>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">Chó Cảnh</h3>
            <p className="text-xs text-gray-500 mt-1">Golden, Corgi, Poodle...</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('Cat')}
            className="group cursor-pointer bg-blue-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-blue-100"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Cat"/>
            </div>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">Mèo Cảnh</h3>
            <p className="text-xs text-gray-500 mt-1">Anh lông ngắn, Ba Tư...</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('Bird')}
            className="group cursor-pointer bg-green-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-green-100"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Bird"/>
            </div>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">Chim Cảnh</h3>
            <p className="text-xs text-gray-500 mt-1">Vẹt, Yến phụng...</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('Small Pet')}
            className="group cursor-pointer bg-purple-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-purple-100"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Hamster"/>
            </div>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">Thú Nhỏ</h3>
            <p className="text-xs text-gray-500 mt-1">Hamster, Sóc, Thỏ...</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Thú Cưng Mới Về</h2>
                <p className="text-gray-500 mt-1">Những người bạn nhỏ đang chờ đón chủ nhân</p>
            </div>
            <Link to="/products" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 transition-colors">
                Xem tất cả <ArrowRight size={18}/>
            </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="h-48 overflow-hidden bg-gray-100 relative">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm">
                            {product.age} tháng
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-xs text-gray-500 mb-1">{product.breed}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                        <div className="flex justify-between items-center">
                            <span className="text-indigo-700 font-extrabold">{formatCurrency(product.price)}</span>
                            <button 
                                onClick={() => navigate('/products')}
                                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors"
                            >
                                <ArrowUpRight size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 4. Services Preview */}
      <section className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Dịch Vụ Chăm Sóc Chuyên Nghiệp</h2>
                <p className="text-indigo-200 max-w-2xl mx-auto">
                    Đội ngũ nhân viên giàu kinh nghiệm và yêu thương động vật sẽ mang đến trải nghiệm tốt nhất cho thú cưng của bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredServices.map((service, index) => (
                    <div key={service.id} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/20 transition-colors">
                        <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4 text-white">
                            {index === 0 ? <Star size={24}/> : index === 1 ? <Calendar size={24}/> : <ArrowUpRight size={24}/>}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                        <p className="text-indigo-200 text-sm mb-4 line-clamp-2">{service.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="font-bold">{formatCurrency(service.price)}</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">{service.duration} phút</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-10">
                <Link to="/services" className="inline-block bg-white text-indigo-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                    Xem tất cả dịch vụ
                </Link>
            </div>
          </div>
      </section>

      {/* 5. Blog Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kiến Thức Chăm Sóc</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_BLOGS.map(blog => (
                <div 
                    key={blog.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedBlog(blog)}
                >
                    <div className="h-48 overflow-hidden">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"/>
                    </div>
                    <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{blog.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-3">{blog.desc}</p>
                        <button className="mt-4 text-indigo-600 text-sm font-medium hover:underline">Đọc thêm</button>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
                <div className="relative h-64">
                    <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover"/>
                    <button 
                        onClick={() => setSelectedBlog(null)}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                        <X size={20}/>
                    </button>
                </div>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {selectedBlog.desc}
                        <br/><br/>
                        (Nội dung chi tiết bài viết sẽ được cập nhật...)
                    </p>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button 
                            onClick={() => setSelectedBlog(null)}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
