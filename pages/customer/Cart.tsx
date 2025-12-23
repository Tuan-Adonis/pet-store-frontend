import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useProduct } from "../../contexts/ProductContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const CustomerCart: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const { products } = useProduct();
  const { formatCurrency } = useLanguage();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  );

  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId)!,
    }))
    .filter((item) => item.product);

  const selectedItems = cartItems.filter((item) =>
    selectedIds.has(item.productId)
  );
  const total = selectedItems.reduce(
    (sum, item) => sum + item.product.price,
    0
  );

  const toggleSelect = (id: string | number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === cartItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cartItems.map((i) => i.productId)));
    }
  };

  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) {
      notify("error", "Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    navigate("/customer/checkout", { state: { items: selectedItems } });
  };

  const handleRemove = (id: string | number) => {
    removeFromCart(id);
    notify("info", "Đã xóa sản phẩm khỏi giỏ hàng");
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Giỏ hàng trống
        </h2>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Tiếp tục mua sắm &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative pb-24">
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4 cursor-pointer"
            checked={
              cartItems.length > 0 && selectedIds.size === cartItems.length
            }
            onChange={toggleSelectAll}
          />
          <span className="text-sm font-medium text-gray-700">
            Chọn tất cả ({cartItems.length} thú cưng)
          </span>
        </div>

        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li
              key={item.productId}
              className="p-6 flex items-center hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4 cursor-pointer"
                checked={selectedIds.has(item.productId)}
                onChange={() => toggleSelect(item.productId)}
              />
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-20 w-20 object-cover rounded-md border border-gray-200 shadow-sm"
              />
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {item.product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-1">
                  {item.product.category} - {item.product.breed}
                </p>
                <p className="text-indigo-600 font-bold">
                  {formatCurrency(item.product.price)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm font-bold border border-indigo-100">
                  Số lượng: 1
                </div> */}
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 hidden sm:block">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  Đang chọn {selectedItems.length} thú cưng
                </p>
                <p className="text-2xl font-bold text-indigo-700">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>

            <div className="hidden md:flex gap-2 overflow-x-auto max-w-xs">
              {selectedItems.slice(0, 3).map((i) => (
                <img
                  key={i.productId}
                  src={i.product.image}
                  className="w-10 h-10 rounded object-cover border"
                  alt=""
                />
              ))}
              {selectedItems.length > 3 && (
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  +{selectedItems.length - 3}
                </div>
              )}
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Mua Hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
