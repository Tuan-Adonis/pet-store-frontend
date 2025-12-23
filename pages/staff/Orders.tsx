import React, { useState, useEffect } from "react";
import { useOrder } from "../../contexts/OrderContext";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNotification } from "../../contexts/NotificationContext";
import { OrderStatus, Order } from "../../interfaces";
import {
  Eye,
  X,
  AlertTriangle,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Clock,
  ShoppingBag,
  Search,
  RefreshCw,
  Phone,
} from "lucide-react";

export const StaffOrders: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUser();
  const { orders, load, updateOrderStatus } = useOrder();
  const { t, formatCurrency } = useLanguage();
  const { notify } = useNotification();

  const [activeTab, setActiveTab] = useState<string>("PENDING");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelModal, setCancelModal] = useState<string | number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

  useEffect(() => {
    load();
  }, []);

  const getCustomer = (customerId: number) =>
    users.find((u) => u.id === customerId);

  const searchFilteredOrders = orders.filter((o) => {
    const customer = getCustomer(o.customerId);
    if (!customer) return false;

    const matchName = nameFilter
      ? customer.username.toLowerCase().includes(nameFilter.toLowerCase())
      : true;
    const matchPhone = phoneFilter
      ? customer.phone.includes(phoneFilter)
      : true;

    return matchName && matchPhone;
  });

  const isPendingOrder = (o: Order) =>
    o.status === OrderStatus.PENDING ||
    (o.status === OrderStatus.REQ_CANCEL && !o.staffId);
  const isMyOrder = (o: Order) => o.staffId === user?.id;

  const getFilteredOrders = () => {
    switch (activeTab) {
      case "PENDING":
        return searchFilteredOrders.filter((o) => isPendingOrder(o));
      case "PROCESSING":
        return searchFilteredOrders.filter(
          (o) =>
            isMyOrder(o) &&
            (o.status === OrderStatus.ACCEPTED ||
              o.status === OrderStatus.SHIPPING ||
              (o.status === OrderStatus.REQ_CANCEL && o.staffId))
        );
      case "RE_DELIVERY":
        return searchFilteredOrders.filter(
          (o) => isMyOrder(o) && o.status === OrderStatus.RE_DELIVERY
        );
      case "COMPLETED":
        return searchFilteredOrders.filter(
          (o) => isMyOrder(o) && o.status === OrderStatus.COMPLETED
        );
      case "CANCELLED":
        return searchFilteredOrders.filter(
          (o) => isMyOrder(o) && o.status === OrderStatus.CANCELLED
        );
      default:
        return [];
    }
  };

  const displayedOrders = getFilteredOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getCustomerName = (customerId: number) =>
    getCustomer(customerId)?.username || "Khách vãng lai";

  const getStatusLabel = (status: number) => {
    if (status === 0) return t("status.cancelled");
    if (status === 1) return t("status.completed");
    if (status === 2) return t("status.pending");
    if (status === 3) return t("status.accepted");
    if (status === 4) return t("status.req_cancel");
    if (status === 5) return t("status.shipping");
    if (status === 6) return t("status.re_delivery");
    return "N/A";
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800 border-green-200";
      case 2:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 0:
        return "bg-red-100 text-red-800 border-red-200";
      case 4:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 3:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 5:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 6:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReceiveOrder = (orderId: string | number) => {
    updateOrderStatus(
      orderId,
      OrderStatus.ACCEPTED,
      "Nhân viên đã nhận đơn",
      user?.id
    );
    setSelectedOrder(null);
    notify("success", "Đã tiếp nhận đơn hàng thành công");
  };

  const handleProcessOrder = (orderId: string, nextStatus: OrderStatus) => {
    let note = "";
    if (nextStatus === OrderStatus.ACCEPTED) note = "Bắt đầu xử lý đơn hàng";
    if (nextStatus === OrderStatus.SHIPPING)
      note = "Đã giao cho đơn vị vận chuyển";
    if (nextStatus === OrderStatus.COMPLETED) note = "Giao hàng thành công";
    if (nextStatus === OrderStatus.RE_DELIVERY)
      note = "Giao hàng thất bại, lên lịch giao lại";

    updateOrderStatus(orderId, nextStatus, note, user?.id);
    setSelectedOrder(null);
    notify("success", "Cập nhật trạng thái đơn hàng thành công");
  };

  const openCancelModal = (id: string | number) => {
    setCancelModal(id);
    setCancelReason("");
  };

  const confirmCancel = () => {
    if (!cancelModal || !cancelReason.trim()) return;
    updateOrderStatus(
      cancelModal,
      OrderStatus.CANCELLED,
      cancelReason,
      user?.id
    );
    setCancelModal(null);
    setSelectedOrder(null);
    notify("success", "Đã hủy đơn hàng");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t("nav.orders")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t("common.search_name")}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={t("common.search_phone")}
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="flex overflow-x-auto p-2 bg-white rounded-lg border border-gray-200 gap-2">
        <TabButton
          active={activeTab === "PENDING"}
          onClick={() => setActiveTab("PENDING")}
          label={`${t("status.pending")} (All)`}
          count={searchFilteredOrders.filter(isPendingOrder).length}
          color="yellow"
        />
        <TabButton
          active={activeTab === "PROCESSING"}
          onClick={() => setActiveTab("PROCESSING")}
          label={`${t("status.accepted")} / ${t("status.shipping")}`}
          count={
            searchFilteredOrders.filter(
              (o) =>
                isMyOrder(o) &&
                (o.status === OrderStatus.ACCEPTED ||
                  o.status === OrderStatus.SHIPPING)
            ).length
          }
          color="blue"
        />
        <TabButton
          active={activeTab === "RE_DELIVERY"}
          onClick={() => setActiveTab("RE_DELIVERY")}
          label={t("status.re_delivery")}
          count={
            searchFilteredOrders.filter(
              (o) => isMyOrder(o) && o.status === OrderStatus.RE_DELIVERY
            ).length
          }
          color="indigo"
        />
        <TabButton
          active={activeTab === "COMPLETED"}
          onClick={() => setActiveTab("COMPLETED")}
          label={t("status.completed")}
          color="green"
        />
        <TabButton
          active={activeTab === "CANCELLED"}
          onClick={() => setActiveTab("CANCELLED")}
          label={t("status.cancelled")}
          color="gray"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayedOrders.length === 0 && (
          <EmptyState label="Không có đơn hàng nào" />
        )}
        {displayedOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-lg text-gray-800">
                    #{order.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                  {order.isLate && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertCircle size={12} /> Late
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <User size={14} /> {getCustomerName(order.customerId)}
                  <span className="text-gray-300">|</span>
                  <Calendar size={14} />{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                  <MapPin size={14} /> {order.shippingAddress || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm text-gray-500">{t("common.total")}</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                >
                  <Eye size={16} /> {t("common.detail")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              <div className="bg-gray-50 p-3 rounded-lg border">
                <h4 className="font-bold text-sm text-gray-700 mb-2">
                  {t("common.customer")}
                </h4>
                <p className="text-sm">
                  Tên:{" "}
                  <span className="font-medium">
                    {getCustomerName(selectedOrder.customerId)}
                  </span>
                </p>
                <p className="text-sm mt-1">
                  SĐT:{" "}
                  <span className="font-medium">
                    {getCustomer(selectedOrder.customerId)?.phone}
                  </span>
                </p>
                <p className="text-sm mt-1">
                  {t("common.address")}:{" "}
                  <span className="font-medium">
                    {selectedOrder.shippingAddress || "N/A"}
                  </span>
                </p>
                <p className="text-sm mt-1">
                  {t("common.note")}:{" "}
                  <span className="italic">
                    {selectedOrder.note || "Không có"}
                  </span>
                </p>
                {selectedOrder.isLate && (
                  <div className="mt-2 text-xs bg-red-100 text-red-800 p-2 rounded font-bold flex items-center gap-1">
                    <AlertCircle size={14} /> {t("staff.stats.late_orders")}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-2">
                  {t("nav.products")}
                </h4>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between text-sm border-b pb-2"
                    >
                      <span>
                        {item.quantity}x {item.product.name} (
                        {item.product.breed})
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
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
                  <Clock size={16} /> Lịch sử trạng thái
                </h4>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-4 py-1">
                  {selectedOrder.statusHistory?.map((log, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-sm"></div>
                      <p className="text-sm font-bold text-gray-800">
                        {getStatusLabel(log.status)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.statusTime).toLocaleString()}
                      </p>
                      {log.note && (
                        <p className="text-xs text-gray-600 italic mt-1">
                          "{log.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                {selectedOrder.status === OrderStatus.PENDING && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openCancelModal(selectedOrder.id)}
                      className="w-full border border-red-300 text-red-600 py-3 rounded-lg text-sm hover:bg-red-50 font-bold"
                    >
                      {t("action.cancel_order")}
                    </button>
                    <button
                      onClick={() => handleReceiveOrder(selectedOrder.id)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm hover:bg-indigo-700 font-bold shadow-md"
                    >
                      {t("action.receive_order")}
                    </button>
                  </div>
                )}

                {selectedOrder.status === OrderStatus.ACCEPTED &&
                  selectedOrder.staffId === user?.id && (
                    <>
                      <button
                        onClick={() =>
                          handleProcessOrder(
                            selectedOrder.id,
                            OrderStatus.SHIPPING
                          )
                        }
                        className="w-full bg-purple-600 text-white py-3 rounded-lg text-sm hover:bg-purple-700 font-bold shadow-md"
                      >
                        {t("action.process_shipping")}
                      </button>
                      <button
                        onClick={() => openCancelModal(selectedOrder.id)}
                        className="w-full border border-red-300 text-red-600 py-3 rounded-lg text-sm hover:bg-red-50 font-medium"
                      >
                        {t("action.cancel_order")}
                      </button>
                    </>
                  )}

                {selectedOrder.status === OrderStatus.SHIPPING &&
                  selectedOrder.staffId === user?.id && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          handleProcessOrder(
                            selectedOrder.id,
                            OrderStatus.RE_DELIVERY
                          )
                        }
                        className="w-full border border-orange-300 text-orange-700 py-3 rounded-lg text-sm hover:bg-orange-50 font-bold flex flex-col items-center justify-center"
                      >
                        <RefreshCw size={16} className="mb-1" />{" "}
                        {t("action.process_redelivery")}
                      </button>
                      <button
                        onClick={() =>
                          handleProcessOrder(
                            selectedOrder.id,
                            OrderStatus.COMPLETED
                          )
                        }
                        className="w-full bg-green-600 text-white py-3 rounded-lg text-sm hover:bg-green-700 font-bold shadow-md"
                      >
                        {t("action.process_complete")}
                      </button>
                    </div>
                  )}

                {selectedOrder.status === OrderStatus.RE_DELIVERY &&
                  selectedOrder.staffId === user?.id && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openCancelModal(selectedOrder.id)}
                        className="w-full border border-red-300 text-red-600 py-3 rounded-lg text-sm hover:bg-red-50 font-bold"
                      >
                        {t("action.cancel_order")}
                      </button>
                      <button
                        onClick={() =>
                          handleProcessOrder(
                            selectedOrder.id,
                            OrderStatus.COMPLETED
                          )
                        }
                        className="w-full bg-green-600 text-white py-3 rounded-lg text-sm hover:bg-green-700 font-bold shadow-md"
                      >
                        {t("action.process_complete")}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {cancelModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
              <AlertTriangle /> {t("action.confirm_cancel")}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Đơn hàng sẽ bị hủy hoàn toàn.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border p-2 rounded mb-4 h-24 text-sm focus:ring-red-500 focus:border-red-500"
              placeholder={t("action.enter_reason")}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModal(null)}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
              >
                {t("common.close")}
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, label, count, color }: any) => {
  let activeClass = "";
  if (color === "yellow")
    activeClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
  else if (color === "blue")
    activeClass = "bg-blue-100 text-blue-800 border-blue-300";
  else if (color === "green")
    activeClass = "bg-green-100 text-green-800 border-green-300";
  else if (color === "indigo")
    activeClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
  else activeClass = "bg-gray-200 text-gray-800 border-gray-300";

  return (
    <button
      onClick={onClick}
      className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border
                ${
                  active
                    ? `${activeClass} shadow-sm`
                    : "bg-white border-transparent text-gray-600 hover:bg-gray-100"
                }
            `}
    >
      {label}
      {count > 0 && (
        <span
          className={`ml-2 px-1.5 py-0.5 rounded-full text-xs bg-white/50 border border-black/5`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

const EmptyState = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
    <ShoppingBag size={48} className="mb-4 opacity-50" />
    <p>{label}</p>
  </div>
);
