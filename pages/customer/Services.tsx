import React, { useState, useEffect } from "react";
import { useService } from "../../contexts/ServiceContext";
import { useAppointment } from "../../contexts/AppointmentContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import {
  Clock,
  Calendar as CalIcon,
  PawPrint,
  CreditCard,
  QrCode,
  X,
  MessageSquare,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CustomerServices: React.FC = () => {
  const { services, refreshServices } = useService();
  const { bookAppointment } = useAppointment();
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<
    string | number | null
  >(null);

  // Booking Form State
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("Dog");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState<string>("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "QR">("COD");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Call API on mount
  useEffect(() => {
    refreshServices();
  }, [refreshServices]);

  const activeService = services.find((s) => s.id === selectedService);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (
      selectedService &&
      date &&
      time &&
      petName &&
      petSpecies &&
      petBreed &&
      petAge
    ) {
      if (paymentMethod === "QR") {
        setIsQrModalOpen(true);
        return;
      }
      performBooking(paymentMethod);
    }
  };

  const handleConfirmQrPaymentAndBook = () => {
    setIsQrModalOpen(false);
    performBooking("QR");
    notify("success", "Thanh toán thành công! Đã gửi yêu cầu đặt lịch.");
  };

  const performBooking = async (method: "COD" | "QR") => {
    if (!selectedService) return;
    setIsSubmitting(true);

    const res = await bookAppointment(
      selectedService,
      date,
      time,
      {
        name: petName,
        species: petSpecies,
        breed: petBreed,
        age: parseInt(petAge),
      },
      method === "COD" ? 0 : 1,
      
      note
    );
    if (res !== null) {
      setIsSubmitting(false);
      notify("success", "Đã gửi yêu cầu đặt lịch hẹn thành công!");

      // Reset form
      setSelectedService(null);
      setDate("");
      setTime("");
      setPetName("");
      setPetBreed("");
      setPetAge("");
      setNote("");
      setPaymentMethod("COD");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
      {/* Service List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Dịch vụ của chúng tôi
        </h2>
        <div className="grid gap-4">
          {services.map((service) => {
            const isInactive = service.status === 0;
            return (
              <div
                key={service.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isInactive
                    ? "border-gray-100 bg-gray-100 cursor-not-allowed opacity-70"
                    : selectedService === service.id
                    ? "border-indigo-600 bg-indigo-50 cursor-pointer"
                    : "border-transparent bg-white shadow-sm hover:bg-gray-50 cursor-pointer"
                }`}
                onClick={() => !isInactive && setSelectedService(service.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {service.name}
                    {isInactive && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                        Tạm ngưng
                      </span>
                    )}
                  </h3>
                  <span className="text-indigo-600 font-bold">
                    {service.price} VNĐ
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {service.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span>{service.duration} phút</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
        <h3 className="text-xl font-bold mb-4">Đặt lịch hẹn</h3>
        {!selectedService ? (
          <div className="text-center py-8 text-gray-500">
            <CalIcon size={48} className="mx-auto mb-2 opacity-50" />
            <p>Vui lòng chọn dịch vụ đang hoạt động để tiếp tục</p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Dịch vụ đã chọn:
              </p>
              <p className="text-indigo-600 font-semibold">
                {activeService?.name} -{" "}
                <span className="text-lg">${activeService?.price}</span>
              </p>
            </div>

            {!user && (
              <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-700 mb-2">
                Bạn cần đăng nhập để xác nhận đặt lịch.
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-2">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <PawPrint size={16} className="mr-2" /> Thông tin thú cưng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Tên bé
                  </label>
                  <input
                    type="text"
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Tuổi (tháng)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Loài
                  </label>
                  <select
                    value={petSpecies}
                    onChange={(e) => setPetSpecies(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="Dog">Chó</option>
                    <option value="Cat">Mèo</option>
                    <option value="Bird">Chim</option>
                    <option value="Small Pet">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Giống loài
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Corgi"
                    required
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <CalIcon size={16} className="mr-2" /> Thời gian
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Ngày hẹn
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Giờ hẹn
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <MessageSquare size={16} className="mr-2" /> Ghi chú
              </h4>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bé có cần lưu ý gì đặc biệt không?"
                className="w-full border border-gray-300 rounded-md p-2 text-sm h-20"
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <CreditCard size={16} className="mr-2" /> Thanh toán
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    paymentMethod === "COD"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setPaymentMethod("COD");
                  }}
                >
                  <CreditCard size={20} />
                  <span className="text-xs font-bold">Sau khi làm xong</span>
                </div>
                <div
                  className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    paymentMethod === "QR"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("QR")}
                >
                  <QrCode size={20} />
                  <span className="text-xs font-bold">Chuyển khoản ngay</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-bold mt-4 flex items-center justify-center gap-2 disabled:bg-indigo-400"
            >
              {isSubmitting && <Loader className="animate-spin" size={18} />}
              {user
                ? paymentMethod === "QR"
                  ? "Thanh toán & Đặt lịch"
                  : "Xác nhận đặt lịch"
                : "Đăng nhập để đặt"}
            </button>
          </form>
        )}
      </div>

      {/* QR Code Modal for Services */}
      {isQrModalOpen && activeService && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <QrCode size={20} /> Quét mã thanh toán
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="hover:bg-white/20 rounded p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center">
              <p className="text-gray-600 mb-4 text-center text-sm">
                Quét mã để thanh toán dịch vụ{" "}
                <strong>{activeService.name}</strong>
              </p>
              <div className="bg-white p-2 border rounded-lg shadow-inner mb-6 relative">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT_SERVICE_${activeService.id}_TOTAL_${activeService.price}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="text-center mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Số tiền thanh toán
                </p>
                <p className="text-3xl font-bold text-indigo-700">
                  ${activeService.price}
                </p>
              </div>

              <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-center">
                <p className="text-sm text-yellow-800 font-medium">
                  Vui lòng quét mã trên ứng dụng ngân hàng.
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Sau khi chuyển khoản thành công, nhấn nút xác nhận bên dưới để
                  hoàn tất đặt lịch.
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmQrPaymentAndBook}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Tôi đã thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
