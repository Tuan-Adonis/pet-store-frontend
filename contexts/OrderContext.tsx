// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Order, CartItem, OrderStatusLog } from '../interfaces';
// import { ORDER_STATUS } from '../constants';
// import { orderApi } from '../api/orderApi';
// import { orderItemApi } from '../api/orderItemApi';
// import { orderStatusLogApi } from '../api/orderStatusLogApi';
// import { CreateOrderRequest } from '../interfaces/request/order';
// import { useAuth } from './AuthContext';
// import { useProduct } from './ProductContext';
// import { useCart } from './CartContext';

// interface OrderContextType {
//   orders: Order[];
//   placeOrder: (
//     items: CartItem[],
//     paymentMethod: number,
//     shippingAddress: string,
//     note: string
//   ) => Promise<boolean>;
//   updateOrderStatus: (
//     orderId: number | string,
//     status: number,
//     reason?: string,
//     staffId?: number | string
//   ) => Promise<void>;
// }

// const OrderContext = createContext<OrderContextType | undefined>(undefined);

// export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const { user } = useAuth();
//   const { products, updateProduct } = useProduct();
//   const { setCartFromOrder } = useCart();

//   useEffect(() => {
//     const load = async () => setOrders(await orderApi.getAll());
//     load();
//   }, []);

//   // Multi-API Transaction Function
//   const placeOrder = async (
//     itemsToOrder: CartItem[],
//     paymentMethod: number,
//     shippingAddress: string,
//     note: string
//   ): Promise<boolean> => {
//     if (!user) return false;

//     // 1. Calculate Total
//     const totalAmount = itemsToOrder.reduce((sum, item) => {
//          const p = products.find(prod => prod.id === item.productId);
//          return sum + (p ? p.price * item.quantity : 0);
//     }, 0);

//     try {
//         // Step 1: Create Order Header
//         const orderRequest: CreateOrderRequest = {
//             customerId: user.id,
//             items: [], // Passing empty to create generic order first, strictly following creating items separately
//             totalAmount,
//             paymentMethod,
//             shippingAddress,
//             note
//         };
//         const newOrder = await orderApi.create(orderRequest);

//         // Step 2: Create Order Items Loop
//         const createdItems = [];
//         for (const item of itemsToOrder) {
//             const newItem = await orderItemApi.create({
//                 orderId: newOrder.id,
//                 productId: item.productId as number,
//                 quantity: item.quantity,
//                 priceSnapshot: products.find(p => p.id === item.productId)?.price
//             });
//             createdItems.push(newItem);
//         }

//         // Step 3: Create Initial Status Log
//         const initialLog = await orderStatusLogApi.create({
//             orderId: newOrder.id,
//             status: ORDER_STATUS.PENDING,
//             timestamp: new Date().toISOString(),
//             note: 'Khách hàng đặt đơn',
//             updatedBy: user.id.toString()
//         });

//         // Step 4: Update Products (Inventory)
//         for (const item of itemsToOrder) {
//             const product = products.find(p => p.id === item.productId);
//             if (product) {
//                 await updateProduct({ ...product, status: 0 }); // 0: Inactive/Sold
//             }
//         }

//         // Step 5: Hydrate for UI state (Join)
//         // In a real app, we might just re-fetch `orderApi.getById(newOrder.id)` which would do the joins on backend.
//         // Here we construct manually to update local state instantly.
//         const hydratedOrder: Order = {
//             ...newOrder,
//             statusHistory: [initialLog],
//             items: createdItems.map(i => ({
//                 ...i,
//                 product: products.find(p => p.id === i.productId)
//             }))
//         };

//         setOrders(prev => [hydratedOrder, ...prev]);
//         setCartFromOrder(itemsToOrder);

//         return true;
//     } catch (e) {
//         console.error("Transaction failed", e);
//         return false;
//     }
//   };

//   const updateOrderStatus = async (
//     orderId: number | string,
//     status: number,
//     reason?: string,
//     staffId?: number | string
//   ) => {
//     await orderApi.updateStatus({ id: orderId, status, note: reason, staffId });

//     // Also create a log entry
//     const newLog = await orderStatusLogApi.create({
//         orderId: orderId,
//         status: status,
//         timestamp: new Date().toISOString(),
//         note: reason || "Cập nhật trạng thái",
//         updatedBy: staffId ? staffId.toString() : 'System'
//     });

//     const targetOrder = orders.find(o => o.id === orderId);

//     // If order is CANCELLED, restore product availability
//     if (status === ORDER_STATUS.CANCELLED && targetOrder && targetOrder.items) {
//         for (const item of targetOrder.items) {
//             const product = products.find(p => p.id === item.product?.id);
//             if (product) {
//                 await updateProduct({ ...product, status: 1 });
//             }
//         }
//     }

//     setOrders(prev => {
//         return prev.map(o => {
//             if (o.id === orderId) {
//                 return {
//                     ...o,
//                     status,
//                     statusHistory: [...(o.statusHistory || []), newLog],
//                     staffId: staffId || o.staffId,
//                     cancelReason: status === ORDER_STATUS.CANCELLED ? reason : o.cancelReason,
//                 };
//             }
//             return o;
//         });
//     });
//   };

//   return (
//     <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
//       {children}
//     </OrderContext.Provider>
//   );
// };

// export const useOrder = () => {
//   const context = useContext(OrderContext);
//   if (!context) throw new Error('useOrder must be used within OrderProvider');
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, CartItem, OrderItem, OrderStatusLog } from "../interfaces";
import { ORDER_STATUS } from "../constants";
import { orderApi } from "../api/orderApi";
import { orderItemApi } from "../api/orderItemApi";
import { orderStatusLogApi } from "../api/orderStatusLogApi";
import { CreateOrderRequest } from "../interfaces/request/order";
import { useAuth } from "./AuthContext";
import { useProduct } from "./ProductContext";
import { useCart } from "./CartContext";
import { useNotification } from "./NotificationContext";

/**
 * Interface định nghĩa dữ liệu và hàm
 * mà OrderContext sẽ cung cấp cho toàn bộ app
 */
interface OrderContextType {
  orders: Order[];
  load: () => Promise<void>;
  loadByCustomerID: (customerId: number) => Promise<void>;
  placeOrder: (
    items: CartItem[],
    paymentMethod: number,
    shippingAddress: string,
    note: string
  ) => Promise<boolean>;
  updateOrderStatus: (
    orderId: number | string,
    status: number,
    reason?: string,
    staffId?: number | string
  ) => Promise<void>;
}

/**
 * Khởi tạo Context
 */
const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Provider quản lý toàn bộ logic liên quan đến Order
 */
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotification();
  // Danh sách đơn hàng trong hệ thống
  const [orders, setOrders] = useState<Order[]>([]);

  // Lấy thông tin user đang đăng nhập
  const { user } = useAuth();

  // Lấy danh sách sản phẩm & hàm cập nhật sản phẩm
  const { products, updateProduct } = useProduct();

  // Cart context để clear / sync giỏ hàng
  const { setCartFromOrder } = useCart();

  /* ======================================================
     HÀM HYDRATE ORDER
     - Lấy danh sách item theo orderId
     - Lấy lịch sử trạng thái theo orderId
     ====================================================== */
  const hydrateOrder = async (order: Order): Promise<Order> => {
    const [items, statusHistory] = await Promise.all([
      orderItemApi.getByOrderId(order.id),
      orderStatusLogApi.getByOrderId(order.id),
    ]);

    return {
      ...order,
      // Gắn thêm thông tin product để UI hiển thị
      items: items.map((i: OrderItem) => ({
        ...i,
        product: products.find((p) => p.id === i.productId),
      })),
      // Lịch sử trạng thái lấy từ DB
      statusHistory: statusHistory.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    };
  };

  /* ======================================================
     LOAD DANH SÁCH ĐƠN HÀNG BAN ĐẦU
     - Lấy danh sách order
     - Sau đó hydrate từng order
     ====================================================== */
  const load = async () => {
    const baseOrders = await orderApi.getAll();
    if (baseOrders.length !== 0) {
      const hydratedOrders = await Promise.all(
        baseOrders.map((o: Order) => hydrateOrder(o))
      );

      setOrders(hydratedOrders);
    } else {
      setOrders(baseOrders);
    }
  };

  const loadByCustomerID = async (customerId: number) => {
    const baseOrders = await orderApi.getAllByCustomerId(customerId);

    if (baseOrders.length !== 0) {
      const hydratedOrders = await Promise.all(
        baseOrders.map((o: Order) => hydrateOrder(o))
      );

      setOrders(hydratedOrders);
    } else {
      setOrders(baseOrders);
    }
  };

  // Load dữ liệu khi OrderProvider được mount
  // useEffect(() => {
  //   load();
  // }, []);

  /* ======================================================
     ĐẶT HÀNG
     - Tạo order
     - Tạo order item
     - Tạo log trạng thái ban đầu
     - Cập nhật trạng thái sản phẩm
     ====================================================== */
  const placeOrder = async (
    itemsToOrder: CartItem[],
    paymentMethod: number,
    shippingAddress: string,
    note: string
  ): Promise<boolean> => {
    if (!user) return false;

    // Tính tổng tiền
    const totalAmount = itemsToOrder.reduce((sum, item) => {
      const p = products.find((prod) => prod.id === item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    try {
      // 1. Tạo Order (header)
      const orderRequest: CreateOrderRequest = {
        customerId: user.id,
        items: [],
        totalAmount,
        paymentMethod,
        shippingAddress,
        note,
      };

      const newOrder = await orderApi.create(orderRequest);

      // 2. Tạo từng Order Item
      for (const item of itemsToOrder) {
        await orderItemApi.create({
          orderId: newOrder.id,
          productId: item.productId as number,
          quantity: item.quantity,
          priceSnapshot: products.find((p) => p.id === item.productId)?.price,
        });
      }

      // 3. Tạo log trạng thái ban đầu
      await orderStatusLogApi.create({
        orderId: newOrder.id,
        status: ORDER_STATUS.PENDING,
        statusTime: new Date().toISOString(),
        note: "Khách hàng đặt đơn",
        updatedBy: user.id.toString(),
      });

      // 4. Cập nhật trạng thái sản phẩm (đã bán)
      for (const item of itemsToOrder) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          await updateProduct({ ...product, status: 0 });
        }
      }

      // 5. Lấy lại dữ liệu đầy đủ từ API
      const hydratedOrder = await hydrateOrder(newOrder);

      // Cập nhật state
      setOrders((prev) => [hydratedOrder, ...prev]);
      setCartFromOrder(itemsToOrder);

      return true;
    } catch (e) {
      console.error("Đặt hàng thất bại", e);
      return false;
    }
  };

  /* ======================================================
     CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
     - Update order
     - Tạo log trạng thái
     - Reload lại items + statusHistory
     ====================================================== */
  const updateOrderStatus = async (
    orderId: number,
    status: number,
    reason?: string,
    staffId?: number | null
  ) => {
    // 1. Cập nhật trạng thái đơn hàng
    const res = await orderApi.updateStatus({
      id: orderId,
      status,
      note: reason,
      staffId,
    });

    if (res === 0) {
      notify("error", "Đổi trạng thái thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy đơn hàng");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Đổi trạng thái thành công");
      // 2. Tạo log trạng thái mới
      await orderStatusLogApi.create({
        orderId,
        status,
        statusTime: new Date().toISOString(),
        note: reason || "Cập nhật trạng thái",
        updatedBy: staffId ? staffId.toString() : "System",
      });
    }

    const current = orders.find((o) => o.id === orderId);
    if (!current) return;

    // 3. Lấy lại dữ liệu mới nhất từ API
    const hydrated = await hydrateOrder({
      ...current,
      status,
      staffId: staffId || current.staffId,
      cancelReason:
        status === ORDER_STATUS.CANCELLED ? reason : current.cancelReason,
    });

    // 4. Nếu hủy đơn thì khôi phục trạng thái sản phẩm
    if (status === ORDER_STATUS.CANCELLED && hydrated.items) {
      for (const item of hydrated.items) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          await updateProduct({ ...product, status: 1 });
        }
      }
    }

    // 5. Cập nhật lại state
    setOrders((prev) => prev.map((o) => (o.id === orderId ? hydrated : o)));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        load,
        loadByCustomerID,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

/**
 * Custom hook để sử dụng OrderContext
 */
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder phải được dùng trong OrderProvider");
  }
  return context;
};
