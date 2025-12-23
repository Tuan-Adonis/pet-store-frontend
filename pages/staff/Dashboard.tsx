import React, { useMemo, useEffect } from "react";
import { useOrder } from "../../contexts/OrderContext";
import { useAppointment } from "../../contexts/AppointmentContext";
import { useService } from "../../contexts/ServiceContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { OrderStatus, ServiceStatus } from "../../interfaces";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, CheckSquare, XSquare, Calendar } from "lucide-react";

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, load } = useOrder();
  const { appointments, loadAppointment } = useAppointment();
  const { services } = useService();
  const { t, formatCurrency } = useLanguage();

  // --- CURRENT MONTH LOGIC ---
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  useEffect(() => {
    load();
    loadAppointment();
  }, []);

  // Filter Data for This Staff & This Month
  const myOrders = useMemo(
    () =>
      orders.filter((o) => {
        const d = new Date(o.createdAt);
        // Ensure we count orders assigned to this staff
        return o.staffId === user?.id && d >= startOfMonth && d <= endOfMonth;
      }),
    [orders, user, startOfMonth, endOfMonth]
  );

  const myServices = useMemo(
    () =>
      appointments.filter((a) => {
        // Use createdAt to filter by booking time
        const d = new Date(a.createdAt);
        // Ensure we count services assigned to this staff.
        return a.staffId === user?.id && d >= startOfMonth && d <= endOfMonth;
      }),
    [appointments, user, startOfMonth, endOfMonth]
  );

  // --- METRICS ---
  const stats = {
    orderRevenue: myOrders
      .filter((o) => o.status === OrderStatus.COMPLETED)
      .reduce((acc, o) => acc + o.totalAmount, 0),
    serviceRevenue: myServices
      .filter((a) => a.status === ServiceStatus.COMPLETED)
      .reduce((acc, a) => {
        const s = services.find((srv) => srv.id === a.serviceId);
        return acc + (s ? s.price : 0);
      }, 0),
    completedOrders: myOrders.filter((o) => o.status === OrderStatus.COMPLETED)
      .length,
    cancelledOrders: myOrders.filter((o) => o.status === OrderStatus.CANCELLED)
      .length,
    completedServices: myServices.filter(
      (a) => a.status === ServiceStatus.COMPLETED
    ).length,
    cancelledServices: myServices.filter(
      (a) => a.status === ServiceStatus.CANCELLED
    ).length,
  };

  // --- CHART DATA (Revenue per Day) ---
  const chartData = useMemo(() => {
    const daysInMonth = endOfMonth.getDate();
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;

      // Calculate Revenue for completed items on this day
      const orderRev = myOrders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return d.getDate() === i && o.status === OrderStatus.COMPLETED;
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const serviceRev = myServices
        .filter((a) => {
          const d = new Date(a.createdAt);
          return d.getDate() === i && a.status === ServiceStatus.COMPLETED;
        })
        .reduce((sum, a) => {
          const s = services.find((srv) => srv.id === a.serviceId);
          return sum + (s ? s.price : 0);
        }, 0);

      data.push({
        day: dayStr,
        orderRevenue: orderRev,
        serviceRevenue: serviceRev,
      });
    }
    return data;
  }, [myOrders, myServices, endOfMonth, services]);

  const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
          {title}
        </p>
        <p className={`text-2xl font-bold mt-1 text-${color}-700`}>{value}</p>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("nav.dashboard")}
        </h1>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-gray-600 flex items-center gap-2">
          <Calendar size={16} /> Tháng {today.getMonth() + 1} /{" "}
          {today.getFullYear()}
        </div>
      </div>

      {/* 6 STAT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Doanh thu Đơn hàng"
          value={formatCurrency(stats.orderRevenue)}
          icon={DollarSign}
          color="indigo"
        />
        <StatCard
          title="Đơn Hoàn Thành"
          value={stats.completedOrders}
          icon={CheckSquare}
          color="green"
        />
        <StatCard
          title="Đơn Đã Hủy"
          value={stats.cancelledOrders}
          icon={XSquare}
          color="red"
        />

        <StatCard
          title="Doanh thu Dịch vụ"
          value={formatCurrency(stats.serviceRevenue)}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Dịch vụ Hoàn Thành"
          value={stats.completedServices}
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title="Dịch vụ Đã Hủy"
          value={stats.cancelledServices}
          icon={XSquare}
          color="orange"
        />
      </div>

      {/* REVENUE CHART */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Doanh thu theo ngày (Dựa trên ngày tạo)
          </h2>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Đơn hàng
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Dịch vụ
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                label={{
                  value: "Ngày",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={(val) =>
                  val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`
                }
              />
              <Tooltip formatter={(val: number) => formatCurrency(val)} />
              <Legend />
              <Bar
                dataKey="orderRevenue"
                name="Doanh thu Đơn"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="serviceRevenue"
                name="Doanh thu Dịch vụ"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
