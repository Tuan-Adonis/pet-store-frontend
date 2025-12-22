import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAddress } from "../../contexts/AddressContext";
import { useOrder } from "../../contexts/OrderContext";
import { useAppointment } from "../../contexts/AppointmentContext";
import { useService } from "../../contexts/ServiceContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNotification } from "../../contexts/NotificationContext";
import { ORDER_STATUS, SERVICE_STATUS } from "../../constants";
import { Address, Order, Appointment, RoleId } from "../../interfaces";
import {
  Package,
  Calendar,
  MapPin,
  User,
  Trash2,
  Eye,
  X,
  CheckCircle,
  MessageSquare,
  Truck,
  Clock,
  Phone,
  Lock,
  Save,
} from "lucide-react";

export const CustomerProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { userAddresses, addAddress, updateAddress, deleteAddress } =
    useAddress();
  const { orders, updateOrderStatus } = useOrder();
  const { appointments, updateAppointmentStatus } = useAppointment();
  const { services } = useService();
  const { t, formatCurrency } = useLanguage();
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<
    "orders" | "appointments" | "info" | "password"
  >("orders");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Profile Form
  const [username, setUserName] = useState(user?.username || "");
  const [newAddress, setNewAddress] = useState({
    province: "",
    district: "",
    ward: "",
    info: "",
    phone: "",
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const userOrders = orders
    .filter((o) => o.customerId === user?.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const userAppointments = appointments
    .filter((a) => a.customerId === user?.id)
    .sort((a, b) => {
      const dateA = new Date(
        `${a.appointmentDate}T${a.appointmentTime}`
      ).getTime();
      const dateB = new Date(
        `${b.appointmentDate}T${b.appointmentTime}`
      ).getTime();
      return dateB - dateA;
    });

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 0:
        return "bg-red-100 text-red-800";
      case 4:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-blue-100 text-blue-800";
      case 5:
        return "bg-purple-100 text-purple-800";
      case 6:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: number, type: "ORDER" | "SERVICE") => {
    if (status === 0) return t("status.cancelled");
    if (status === 1) return t("status.completed");
    if (status === 2) return t("status.pending");

    if (type === "ORDER") {
      if (status === 3) return t("status.accepted");
      if (status === 4) return t("status.req_cancel");
      if (status === 5) return t("status.shipping");
      if (status === 6) return t("status.re_delivery");
    } else {
      if (status === 3) return t("status.req_cancel");
      if (status === 4) return t("status.in_progress");
      if (status === 5) return "Chờ thanh toán";
    }
    return "N/A";
  };

  const handleUpdateProfile = () => {
    if (user) {
      updateProfile({ ...user, name });
      notify("success", "Cập nhật hồ sơ thành công");
    }
  };

  const handleAddAddressSubmit = async () => {
    if (
      user &&
      newAddress.province &&
      newAddress.district &&
      newAddress.ward &&
      newAddress.info &&
      newAddress.phone
    ) {
      await addAddress({
        userId: user.id,
        province: newAddress.province,
        district: newAddress.district,
        ward: newAddress.ward,
        info: newAddress.info,
        phone: newAddress.phone,
        isDefault: userAddresses.length === 0 ? 1 : 0,
      });
      setNewAddress({
        province: "",
        district: "",
        ward: "",
        info: "",
        phone: "",
      });
      notify("success", "Đã thêm địa chỉ mới");
    } else {
      notify(
        "error",
        "Vui lòng nhập đầy đủ thông tin địa chỉ và số điện thoại"
      );
    }
  };

  const handleSetDefaultAddress = async (addr: Address) => {
    // First, undefault current default
    const currentDefault = userAddresses.find((a) => a.isDefault === 1);
    if (currentDefault)
      await updateAddress({ ...currentDefault, isDefault: 0 });
    // Set new default
    await updateAddress({ ...addr, isDefault: 1 });
    notify("success", "Đã đặt địa chỉ mặc định");
  };

  const handleDirectCancel = (
    type: "ORDER" | "SERVICE",
    id: number | string
  ) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn hủy đơn này không? Hành động này không thể hoàn tác."
      )
    )
      return;

    if (type === "ORDER") {
      updateOrderStatus(
        id,
        ORDER_STATUS.CANCELLED,
        "Khách hàng hủy trực tiếp",
        user?.id
      );
      setSelectedOrder(null);
    } else {
      updateAppointmentStatus(
        id,
        SERVICE_STATUS.CANCELLED,
        "Khách hàng hủy trực tiếp",
        user?.id
      );
      setSelectedAppointment(null);
    }
    notify("success", "Đã hủy thành công");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      <div className="w-full md:w-64 space-y-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
            activeTab === "orders"
              ? "bg-indigo-600 text-white"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <Package size={20} />
          <span>{t("nav.orders")}</span>
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
            activeTab === "appointments"
              ? "bg-indigo-600 text-white"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <Calendar size={20} />
          <span>{t("nav.appointments")}</span>
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
            activeTab === "info"
              ? "bg-indigo-600 text-white"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <User size={20} />
          <span>Hồ sơ & Địa chỉ</span>
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 min-h-[500px]">
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Lịch sử đơn hàng</h2>
            {userOrders.length === 0 && (
              <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
            )}
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-mono text-sm text-gray-500">
                      #{order.id}
                    </span>
                    <span className="text-sm text-gray-400 mx-2">•</span>
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status, "ORDER")}
                  </span>
                </div>
                <div className="space-y-1 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.product?.name || "Sản phẩm"}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          (item.product?.price || 0) * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold text-lg text-indigo-700">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <div className="flex gap-3">
                    {order.status === 2 && ( // PENDING
                      <button
                        onClick={() => handleDirectCancel("ORDER", order.id)}
                        className="text-red-600 text-sm font-medium hover:underline"
                      >
                        Hủy đơn
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center text-indigo-600 text-sm font-medium hover:underline"
                    >
                      <Eye size={16} className="mr-1" /> {t("common.detail")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Lịch sử đặt hẹn</h2>
            {userAppointments.length === 0 && (
              <p className="text-gray-500">Bạn chưa có lịch hẹn nào.</p>
            )}
            {userAppointments.map((appt) => (
              <div
                key={appt.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-bold text-gray-800">
                      {services.find((s) => s.id === appt.serviceId)?.name ||
                        "Dịch vụ"}
                    </span>
                    <span className="text-sm text-gray-400 mx-2">•</span>
                    <span className="text-sm font-medium">
                      {appt.appointmentDate} - {appt.appointmentTime}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                      appt.status
                    )}`}
                  >
                    {getStatusLabel(appt.status, "SERVICE")}
                  </span>
                </div>
                <div className="space-y-1 mb-4 text-sm text-gray-600">
                  <p>
                    Bé: <span className="font-medium">{appt.petName}</span> (
                    {appt.petSpecies})
                  </p>
                  {appt.note && <p className="italic">"{appt.note}"</p>}
                </div>
                <div className="flex justify-end pt-3 border-t gap-3">
                  {appt.status === 2 && ( // PENDING
                    <button
                      onClick={() => handleDirectCancel("SERVICE", appt.id)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Hủy lịch
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAppointment(appt)}
                    className="flex items-center text-indigo-600 text-sm font-medium hover:underline"
                  >
                    <Eye size={16} className="mr-1" /> {t("common.detail")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "info" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={user?.email}
                    disabled
                    className="border p-2 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={user?.phone}
                    disabled
                    className="border p-2 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Quyền
                  </label>
                  <input
                    type="text"
                    value={
                      user?.role === RoleId.STAFF ? "Nhân viên" : "Khách hàng"
                    }
                    disabled
                    className="border p-2 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                onClick={handleUpdateProfile}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save size={16} /> Lưu thay đổi
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <MapPin size={20} className="mr-2" /> Sổ địa chỉ
              </h3>
              <div className="space-y-3 mb-4">
                {userAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex justify-between items-center border p-3 rounded ${
                      addr.isDefault
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {addr.info}, {addr.ward}, {addr.district},{" "}
                        {addr.province}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={10} /> {addr.phone}
                      </p>
                      {addr.isDefault ? (
                        <span className="text-xs text-indigo-600 font-bold flex items-center gap-1 mt-1">
                          <CheckCircle size={10} /> Mặc định
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs underline font-medium"
                        >
                          Đặt làm mặc định
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-3">
                  Thêm địa chỉ mới
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tỉnh/Thành phố"
                    className="border p-2 rounded text-sm w-full"
                    value={newAddress.province}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, province: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Quận/Huyện"
                    className="border p-2 rounded text-sm w-full"
                    value={newAddress.district}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, district: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Phường/Xã"
                    className="border p-2 rounded text-sm w-full"
                    value={newAddress.ward}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, ward: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="SĐT liên hệ (*)"
                    className="border p-2 rounded text-sm w-full"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường, chi tiết..."
                    className="border p-2 rounded text-sm w-full md:col-span-2"
                    value={newAddress.info}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, info: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleAddAddressSubmit}
                  className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 mt-3 w-full md:w-auto"
                >
                  Thêm địa chỉ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">
                {t("common.detail")} #{selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Order Details */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-2">
                  {t("common.address")}
                </h4>
                <p className="text-sm">
                  {selectedOrder.shippingAddress || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-2">
                  {t("nav.products")}
                </h4>
                <ul className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between text-sm border-b pb-2"
                    >
                      <span>
                        {item.quantity}x {item.product?.name}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          (item.product?.price || 0) * item.quantity
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>{t("common.total")}:</span>
                  <span className="text-indigo-600">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Clock size={16} /> Lịch sử
                </h4>
                <div className="space-y-3">
                  {selectedOrder.statusHistory?.map((log, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-bold">
                        {getStatusLabel(log.status, "ORDER")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                      {log.note && (
                        <p className="text-xs italic text-gray-600">
                          "{log.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
