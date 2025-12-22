
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAddress } from '../../contexts/AddressContext';
import { useOrder } from '../../contexts/OrderContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { CartItem } from '../../interfaces';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MapPin, User, CreditCard, QrCode, ArrowLeft, X, MessageSquare, Truck, CheckCircle, Phone, Loader } from 'lucide-react';

export const CustomerCheckout: React.FC = () => {
  const { user } = useAuth();
  const { userAddresses } = useAddress();
  const { placeOrder } = useOrder();
  const { formatCurrency } = useLanguage();
  const { notify } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  
  const itemsToBuy = (location.state?.items as CartItem[]) || [];
  
  // State
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>('');
  const [paymentMethod, setPaymentMethod] = useState<number>(1); // 1 = COD, 2 = QR
  const [note, setNote] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate delivery estimate
  const today = new Date();
  const datePlus3 = new Date(today); datePlus3.setDate(datePlus3.getDate() + 3);
  const datePlus5 = new Date(today); datePlus5.setDate(datePlus5.getDate() + 5);
  const estimatedDelivery = `${datePlus3.toLocaleDateString('vi-VN')} đến ${datePlus5.toLocaleDateString('vi-VN')}`;

  // Initialize address
  useEffect(() => {
    if (userAddresses.length > 0) {
        const defaultAddr = userAddresses.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else setSelectedAddressId(userAddresses[0].id);
    }
  }, [userAddresses]);

  // Redirect if no items
  useEffect(() => {
    if (itemsToBuy.length === 0) {
        navigate('/customer/cart');
    }
  }, [itemsToBuy, navigate]);

  const total = itemsToBuy.reduce((sum, item) => {
     const price = (item as any).product?.price || 0;
     return sum + (price * item.quantity);
  }, 0);

  const selectedAddress = userAddresses.find(a => a.id === selectedAddressId);
  const deliveryPhone = selectedAddress?.phone || user?.phone;

  const submitOrderLogic = async () => {
      setIsSubmitting(true);
      const addressString = selectedAddress 
        ? `${selectedAddress.info}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province} - SĐT: ${deliveryPhone}` 
        : 'Unknown Address';
      
      const success = await placeOrder(itemsToBuy, paymentMethod, addressString, note);
      
      setIsSubmitting(false);
      if (success) {
        notify('success', "Đặt hàng thành công!");
        navigate('/customer/profile');
      } else {
        notify('error', "Có lỗi xảy ra khi đặt hàng (có thể hết hàng). Vui lòng kiểm tra lại.");
        navigate('/customer/cart');
      }
  };

  const handlePlaceOrder = () => {
      if (!selectedAddressId) {
          notify('error', "Vui lòng chọn địa chỉ nhận hàng!");
          return;
      }
      
      // If payment is QR (2), open modal to simulate scan
      if (paymentMethod === 2) {
          setIsQrModalOpen(true);
          return;
      }

      // COD - Submit immediately
      submitOrderLogic();
  };

  const handleConfirmQrPaymentAndSubmit = () => {
      setIsQrModalOpen(false);
      notify('success', "Đã xác nhận thanh toán. Đang tạo đơn hàng...");
      // Add a small delay to let the modal close visually before navigating
      setTimeout(() => {
          submitOrderLogic();
      }, 500);
  };

  if (!user || itemsToBuy.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* ... Left part omitted for brevity, structure remains similar ... */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
           {/* 1. Buyer Info */}
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <User size={20} className="text-indigo-600"/> Thông tin người nhận
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                      <label className="text-gray-500 block text-xs">Họ và tên</label>
                      <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                      <label className="text-gray-500 block text-xs">Số điện thoại nhận hàng</label>
                      <p className="font-medium text-indigo-700">{deliveryPhone}</p>
                  </div>
              </div>
              
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                 <MapPin size={16} className="text-indigo-600"/> Địa chỉ nhận hàng
              </h3>
              
              {userAddresses.length === 0 ? (
                  <div className="text-red-500 text-sm">
                      Bạn chưa có địa chỉ nào. <Link to="/customer/profile" className="underline">Thêm địa chỉ</Link>
                  </div>
              ) : (
                  <div className="space-y-3">
                      {userAddresses.map(addr => (
                          <label 
                            key={addr.id} 
                            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-indigo-600 bg-indigo-50' : 'hover:bg-gray-50'}`}
                          >
                              <input 
                                type="radio" 
                                name="address" 
                                className="mt-1 text-indigo-600 focus:ring-indigo-500"
                                checked={selectedAddressId === addr.id}
                                onChange={() => setSelectedAddressId(addr.id)}
                              />
                              <div>
                                  <p className="font-medium text-gray-900">{addr.info}</p>
                                  <p className="text-gray-500 text-xs">{addr.ward}, {addr.district}, {addr.province}</p>
                                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                      <Phone size={10}/> {addr.phone}
                                  </p>
                              </div>
                          </label>
                      ))}
                  </div>
              )}
           </div>

           {/* ... Note section ... */}

           {/* 3. Payment Method */}
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <CreditCard size={20} className="text-indigo-600"/> Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                    className={`border rounded-lg p-4 cursor-pointer flex items-center space-x-3 transition-colors ${paymentMethod === 1 ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'hover:bg-gray-50'}`}
                    onClick={() => { setPaymentMethod(1); }}
                >
                    <CreditCard className={paymentMethod === 1 ? 'text-indigo-600' : 'text-gray-600'} />
                    <div>
                        <p className="font-medium text-sm">Thanh toán khi nhận hàng</p>
                        <p className="text-xs text-gray-500">Trả tiền mặt cho Shipper</p>
                    </div>
                </div>
                <div 
                    className={`border rounded-lg p-4 cursor-pointer flex items-center space-x-3 transition-colors ${paymentMethod === 2 ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'hover:bg-gray-50'}`}
                    onClick={() => setPaymentMethod(2)}
                >
                    <QrCode className={paymentMethod === 2 ? 'text-indigo-600' : 'text-gray-600'} />
                    <div>
                        <p className="font-medium text-sm">Chuyển khoản QR</p>
                        <p className="text-xs text-gray-500">Quét mã để thanh toán ngay</p>
                    </div>
                </div>
              </div>
           </div>
        </div>

        {/* ... Right Column same as before ... */}
        <div className="md:col-span-1">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                 <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
                 
                 <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                     {itemsToBuy.map((item: any) => (
                         <div key={item.productId} className="flex gap-3">
                             <img src={item.product?.image} alt="" className="w-12 h-12 rounded object-cover border bg-gray-50"/>
                             <div className="flex-1 min-w-0">
                                 <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
                                 <p className="text-xs text-gray-500">x{item.quantity}</p>
                             </div>
                             <p className="text-sm font-bold text-gray-900">{formatCurrency((item.product?.price || 0) * item.quantity)}</p>
                         </div>
                     ))}
                 </div>

                 <div className="border-t pt-4 space-y-2">
                     <div className="flex justify-between text-sm text-gray-600">
                         <span>Tạm tính</span>
                         <span>{formatCurrency(total)}</span>
                     </div>
                     <div className="flex justify-between text-sm text-gray-600">
                         <span>Phí vận chuyển</span>
                         <span>Miễn phí</span>
                     </div>
                     <div className="flex justify-between text-xl font-bold text-indigo-700 pt-2 border-t">
                         <span>Tổng cộng</span>
                         <span>{formatCurrency(total)}</span>
                     </div>
                 </div>

                 <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center gap-2"
                 >
                     {isSubmitting && <Loader className="animate-spin" size={18} />}
                     {paymentMethod === 2 ? 'Thanh toán & Đặt Hàng' : 'Đặt Hàng'}
                 </button>
             </div>
        </div>
      </div>
       {/* QR Modal ... */}
       {isQrModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <QrCode size={20}/> Quét mã thanh toán
                    </h3>
                    <button onClick={() => setIsQrModalOpen(false)} className="hover:bg-white/20 rounded p-1"><X size={20}/></button>
                </div>
                <div className="p-8 flex flex-col items-center">
                     <p className="text-gray-600 mb-4 text-center text-sm">
                        Sử dụng ứng dụng ngân hàng để quét mã bên dưới.
                     </p>
                     <div className="bg-white p-2 border rounded-lg shadow-inner mb-6 relative">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT_ORDER_TOTAL_${total}`} 
                            alt="QR Code" 
                            className="w-48 h-48"
                        />
                     </div>
                     <div className="text-center mb-6">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Số tiền thanh toán</p>
                        <p className="text-3xl font-bold text-indigo-700">{formatCurrency(total)}</p>
                     </div>
                     
                     <div className="flex gap-3 w-full">
                        <button
                            onClick={() => setIsQrModalOpen(false)}
                            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
                        >
                            Quay lại
                        </button>
                         <button
                            onClick={handleConfirmQrPaymentAndSubmit}
                            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md text-sm flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={16}/> Tôi đã thanh toán
                        </button>
                     </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
