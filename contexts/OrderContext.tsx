
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem, OrderStatusLog } from '../interfaces';
import { ORDER_STATUS } from '../constants';
import { orderApi } from '../api/orderApi';
import { orderItemApi } from '../api/orderItemApi';
import { orderStatusLogApi } from '../api/orderStatusLogApi';
import { CreateOrderRequest } from '../interfaces/request/order';
import { useAuth } from './AuthContext';
import { useProduct } from './ProductContext';
import { useCart } from './CartContext';

interface OrderContextType {
  orders: Order[];
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

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const { products, updateProduct } = useProduct();
  const { setCartFromOrder } = useCart();

  useEffect(() => {
    const load = async () => setOrders(await orderApi.getAll());
    load();
  }, []);

  // Multi-API Transaction Function
  const placeOrder = async (
    itemsToOrder: CartItem[],
    paymentMethod: number,
    shippingAddress: string,
    note: string
  ): Promise<boolean> => {
    if (!user) return false;

    // 1. Calculate Total
    const totalAmount = itemsToOrder.reduce((sum, item) => {
         const p = products.find(prod => prod.id === item.productId);
         return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    try {
        // Step 1: Create Order Header
        const orderRequest: CreateOrderRequest = {
            customerId: user.id,
            items: [], // Passing empty to create generic order first, strictly following creating items separately
            totalAmount,
            paymentMethod,
            shippingAddress,
            note
        };
        const newOrder = await orderApi.create(orderRequest);

        // Step 2: Create Order Items Loop
        const createdItems = [];
        for (const item of itemsToOrder) {
            const newItem = await orderItemApi.create({
                orderId: newOrder.id,
                productId: item.productId as number,
                quantity: item.quantity,
                priceSnapshot: products.find(p => p.id === item.productId)?.price
            });
            createdItems.push(newItem);
        }

        // Step 3: Create Initial Status Log
        const initialLog = await orderStatusLogApi.create({
            orderId: newOrder.id,
            status: ORDER_STATUS.PENDING,
            timestamp: new Date().toISOString(),
            note: 'Khách hàng đặt đơn',
            updatedBy: user.id.toString()
        });

        // Step 4: Update Products (Inventory)
        for (const item of itemsToOrder) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                await updateProduct({ ...product, status: 0 }); // 0: Inactive/Sold
            }
        }

        // Step 5: Hydrate for UI state (Join)
        // In a real app, we might just re-fetch `orderApi.getById(newOrder.id)` which would do the joins on backend.
        // Here we construct manually to update local state instantly.
        const hydratedOrder: Order = {
            ...newOrder,
            statusHistory: [initialLog],
            items: createdItems.map(i => ({
                ...i,
                product: products.find(p => p.id === i.productId)
            }))
        };

        setOrders(prev => [hydratedOrder, ...prev]);
        setCartFromOrder(itemsToOrder);

        return true;
    } catch (e) {
        console.error("Transaction failed", e);
        return false;
    }
  };

  const updateOrderStatus = async (
    orderId: number | string,
    status: number,
    reason?: string,
    staffId?: number | string
  ) => {
    await orderApi.updateStatus({ id: orderId, status, note: reason, staffId });
    
    // Also create a log entry
    const newLog = await orderStatusLogApi.create({
        orderId: orderId,
        status: status,
        timestamp: new Date().toISOString(),
        note: reason || "Cập nhật trạng thái",
        updatedBy: staffId ? staffId.toString() : 'System'
    });

    const targetOrder = orders.find(o => o.id === orderId);

    // If order is CANCELLED, restore product availability
    if (status === ORDER_STATUS.CANCELLED && targetOrder && targetOrder.items) {
        for (const item of targetOrder.items) {
            const product = products.find(p => p.id === item.product?.id);
            if (product) {
                await updateProduct({ ...product, status: 1 });
            }
        }
    }

    setOrders(prev => {
        return prev.map(o => {
            if (o.id === orderId) {
                return {
                    ...o,
                    status,
                    statusHistory: [...(o.statusHistory || []), newLog],
                    staffId: staffId || o.staffId,
                    cancelReason: status === ORDER_STATUS.CANCELLED ? reason : o.cancelReason,
                };
            }
            return o;
        });
    });
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};
