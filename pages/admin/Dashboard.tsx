
import React, { useState, useMemo, useEffect } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useAppointment } from '../../contexts/AppointmentContext';
import { useService } from '../../contexts/ServiceContext';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { OrderStatus, ServiceStatus, RoleId } from '../../interfaces';
import { TrendingUp, User, Package, Layers, CheckCircle, XCircle } from 'lucide-react';

type TimeFilter = 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM';

const STATUS_COLORS_ORDER = {
  [OrderStatus.PENDING]: '#FBBF24', // Yellow
  [OrderStatus.ACCEPTED]: '#3B82F6', // Blue
  [OrderStatus.SHIPPING]: '#8B5CF6', // Purple
  [OrderStatus.COMPLETED]: '#10B981', // Green
  [OrderStatus.CANCELLED]: '#EF4444', // Red
  [OrderStatus.RE_DELIVERY]: '#6366F1', // Indigo
};

const STATUS_COLORS_SERVICE = {
  [ServiceStatus.PENDING]: '#FBBF24',
  [ServiceStatus.IN_PROGRESS]: '#3B82F6',
  [ServiceStatus.COMPLETED]: '#10B981',
  [ServiceStatus.CANCELLED]: '#EF4444',
  [ServiceStatus.WAITING_PAYMENT]: '#06B6D4', // Cyan
};

export const AdminDashboard: React.FC = () => {
  const { orders } = useOrder();
  const { appointments } = useAppointment();
  const { services } = useService();
  const { users } = useUser();
  const { formatCurrency } = useLanguage();

  const [filterType, setFilterType] = useState<TimeFilter>('MONTH');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');

  // Staff List
  const staffList = users.filter(u => u.roleId === RoleId.STAFF);

  // --- DATE LOGIC ---
  useEffect(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (filterType === 'WEEK') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
      start = new Date(now.setDate(diff));
      start.setHours(0, 0, 0, 0);
      end = new Date(now.setDate(start.getDate() + 6));
      end.setHours(23, 59, 59, 999);
    } else if (filterType === 'MONTH') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (filterType === 'YEAR') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    } else if (filterType === 'CUSTOM') {
      start = customRange.start ? new Date(customRange.start) : new Date(now.getFullYear(), 0, 1);
      end = customRange.end ? new Date(customRange.end) : new Date();
      end.setHours(23, 59, 59);
    }

    setDateRange({ start, end });
  }, [filterType, customRange]);

  // --- DATA FILTERING ---
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const d = new Date(o.createdAt);
      // Filter by date range
      const inTime = d >= dateRange.start && d <= dateRange.end;
      // Filter by staff if selected
      const matchStaff = selectedStaffId === 'all' || o.staffId === Number(selectedStaffId) || o.staffId === selectedStaffId;
      return inTime && matchStaff;
    });
  }, [orders, dateRange, selectedStaffId]);

  const filteredServices = useMemo(() => {
    return appointments.filter(a => {
      const d = new Date(a.createdAt);
      const inTime = d >= dateRange.start && d <= dateRange.end;
      const matchStaff = selectedStaffId === 'all' || a.staffId === Number(selectedStaffId) || a.staffId === selectedStaffId;
      return inTime && matchStaff;
    });
  }, [appointments, dateRange, selectedStaffId]);

  // --- KPI CALCULATIONS ---
  const calculateRates = (items: any[], total: number, completedStatus: number, cancelledStatus: number) => {
      if (total === 0) return { completionRate: 0, cancellationRate: 0 };
      const completed = items.filter(i => i.status === completedStatus).length;
      const cancelled = items.filter(i => i.status === cancelledStatus).length;
      return {
          completionRate: Math.round((completed / total) * 100),
          cancellationRate: Math.round((cancelled / total) * 100)
      };
  };

  const orderStats = calculateRates(filteredOrders, filteredOrders.length, OrderStatus.COMPLETED, OrderStatus.CANCELLED);
  const serviceStats = calculateRates(filteredServices, filteredServices.length, ServiceStatus.COMPLETED, ServiceStatus.CANCELLED);

  // --- PIE CHART DATA ---
  const getPieData = (items: any[], statusEnum: any, colors: Record<string, string>) => {
      const counts: Record<string, number> = {};
      Object.keys(colors).forEach(key => counts[key] = 0);

      items.forEach(i => {
          if (colors.hasOwnProperty(i.status)) {
              counts[i.status] = (counts[i.status] || 0) + 1;
          }
      });
      
      const result = Object.keys(colors).map(statusKey => {
          const status = Number(statusKey);
          let name = '';
          
          if (statusEnum === OrderStatus) {
            if (status === 0) name = 'Đã hủy';
            else if (status === 1) name = 'Hoàn thành';
            else if (status === 2) name = 'Chờ xác nhận';
            else if (status === 3) name = 'Đã nhận';
            else if (status === 5) name = 'Đang giao';
            else if (status === 6) name = 'Giao lại';
          } else {
             if (status === 0) name = 'Đã hủy';
             else if (status === 1) name = 'Hoàn thành';
             else if (status === 2) name = 'Chờ xác nhận';
             else if (status === 4) name = 'Đang thực hiện';
             else if (status === 5) name = 'Chờ thanh toán';
          }

          return {
              name,
              value: counts[statusKey],
              color: colors[statusKey]
          };
      });
      // Filter out zero values for cleaner chart
      return result.filter(item => item.value > 0);
  };

  const orderPieData = getPieData(filteredOrders, OrderStatus, STATUS_COLORS_ORDER);
  const servicePieData = getPieData(filteredServices, ServiceStatus, STATUS_COLORS_SERVICE);

  // --- REVENUE CHART DATA (BAR CHARTS) ---
  const getChartData = (ordersData: typeof filteredOrders, servicesData: typeof filteredServices) => {
      const dataMap = new Map<string, { name: string, orderRevenue: number, serviceRevenue: number }>();
      
      const process = (date: Date, type: 'order' | 'service', amount: number) => {
          let key = '';
          let name = '';
          if (filterType === 'YEAR') {
              key = `${date.getFullYear()}-${date.getMonth()}`;
              name = `Tháng ${date.getMonth() + 1}`;
          } else {
              key = date.toISOString().split('T')[0];
              name = `${date.getDate()}/${date.getMonth() + 1}`;
          }

          if (!dataMap.has(key)) dataMap.set(key, { name, orderRevenue: 0, serviceRevenue: 0 });
          const entry = dataMap.get(key)!;
          if (type === 'order') entry.orderRevenue += amount;
          else entry.serviceRevenue += amount;
      };

      ordersData.filter(o => o.status === OrderStatus.COMPLETED).forEach(o => {
          process(new Date(o.createdAt), 'order', o.totalAmount);
      });

      servicesData.filter(a => a.status === ServiceStatus.COMPLETED).forEach(a => {
          const s = services.find(srv => srv.id === a.serviceId);
          process(new Date(a.createdAt), 'service', s ? s.price : 0);
      });

      const result = Array.from(dataMap.values()).sort((a,b) => {
           return a.name.localeCompare(b.name, undefined, { numeric: true });
      });

      if (result.length === 0) return [{name: 'No Data', orderRevenue: 0, serviceRevenue: 0}];
      return result;
  };

  const revenueData = getChartData(filteredOrders, filteredServices);

  return (
    <div className="space-y-8">
       {/* HEADER & FILTERS */}
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Thống kê Quản trị</h1>
                <p className="text-sm text-gray-500">
                    Dữ liệu từ <span className="font-bold">{dateRange.start.toLocaleDateString('vi-VN')}</span> đến <span className="font-bold">{dateRange.end.toLocaleDateString('vi-VN')}</span>
                </p>
            </div>
            
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center">
                 {/* Staff Filter */}
                 <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border">
                    <User size={16} className="text-gray-500 ml-2"/>
                    <select 
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none"
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                    >
                        <option value="all">Tất cả nhân viên</option>
                        {staffList.map(staff => (
                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                        ))}
                    </select>
                 </div>

                 <div className="flex gap-2 items-center">
                    <button onClick={() => setFilterType('WEEK')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'WEEK' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Tuần này</button>
                    <button onClick={() => setFilterType('MONTH')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'MONTH' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Tháng này</button>
                    <button onClick={() => setFilterType('YEAR')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'YEAR' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Năm nay</button>
                    <button onClick={() => setFilterType('CUSTOM')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'CUSTOM' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Khác</button>
                 </div>

                 {filterType === 'CUSTOM' && (
                     <div className="flex gap-2 items-center bg-gray-50 p-1 rounded border">
                         <input type="date" className="text-sm border rounded px-2" onChange={e => setCustomRange({...customRange, start: e.target.value})} />
                         <span className="text-gray-400">-</span>
                         <input type="date" className="text-sm border rounded px-2" onChange={e => setCustomRange({...customRange, end: e.target.value})} />
                     </div>
                 )}
            </div>
       </div>

       {filteredOrders.length === 0 && filteredServices.length === 0 && (
           <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-center">
               Chưa có dữ liệu thống kê trong khoảng thời gian này. Vui lòng tạo đơn hàng hoặc lịch hẹn để xem số liệu.
           </div>
       )}

       {/* ROW 1: PERFORMANCE CARDS */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
           <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-sm font-medium text-gray-500">Tổng Đơn Hàng</p>
                       <h3 className="text-3xl font-bold text-indigo-700 mt-2">{filteredOrders.length}</h3>
                   </div>
                   <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Package size={24} /></div>
               </div>
           </div>

           <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-sm font-medium text-gray-500">Tổng Dịch Vụ</p>
                       <h3 className="text-3xl font-bold text-blue-700 mt-2">{filteredServices.length}</h3>
                   </div>
                   <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Layers size={24} /></div>
               </div>
           </div>

           <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-sm font-medium text-gray-500">Tỷ lệ hoàn thành Đơn</p>
                       <h3 className="text-3xl font-bold text-gray-900 mt-2">{orderStats.completionRate}%</h3>
                   </div>
                   <div className="bg-green-100 p-2 rounded-lg text-green-600"><CheckCircle size={24} /></div>
               </div>
               <div className="w-full bg-gray-100 h-1.5 mt-4 rounded-full">
                   <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${orderStats.completionRate}%` }}></div>
               </div>
           </div>

           <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-sm font-medium text-gray-500">Tỷ lệ hủy Đơn</p>
                       <h3 className="text-3xl font-bold text-gray-900 mt-2">{orderStats.cancellationRate}%</h3>
                   </div>
                   <div className="bg-red-100 p-2 rounded-lg text-red-600"><XCircle size={24} /></div>
               </div>
               <div className="w-full bg-gray-100 h-1.5 mt-4 rounded-full">
                   <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${orderStats.cancellationRate}%` }}></div>
               </div>
           </div>

            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-sm font-medium text-gray-500">Tỷ lệ hoàn thành Dịch vụ</p>
                       <h3 className="text-3xl font-bold text-gray-900 mt-2">{serviceStats.completionRate}%</h3>
                   </div>
                   <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CheckCircle size={24} /></div>
               </div>
               <div className="w-full bg-gray-100 h-1.5 mt-4 rounded-full">
                   <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${serviceStats.completionRate}%` }}></div>
               </div>
           </div>

           <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-sm font-medium text-gray-500">Tỷ lệ hủy Dịch vụ</p>
                       <h3 className="text-3xl font-bold text-gray-900 mt-2">{serviceStats.cancellationRate}%</h3>
                   </div>
                   <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><XCircle size={24} /></div>
               </div>
               <div className="w-full bg-gray-100 h-1.5 mt-4 rounded-full">
                   <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${serviceStats.cancellationRate}%` }}></div>
               </div>
           </div>
       </div>

       {/* ROW 2: PIE CHARTS */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4 self-start">Trạng thái Hóa đơn</h3>
                <div className="h-64 w-full">
                    {orderPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [value, 'Số lượng']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-gray-400">Không có dữ liệu</div>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4 self-start">Trạng thái Dịch vụ</h3>
                 <div className="h-64 w-full">
                    {servicePieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={servicePieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {servicePieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [value, 'Số lượng']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-gray-400">Không có dữ liệu</div>}
                </div>
            </div>
       </div>

       {/* ROW 3: REVENUE CHARTS (BAR CHARTS) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-indigo-600" />
                    <h3 className="text-lg font-bold text-gray-900">Doanh thu Đơn hàng</h3>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(val) => `${val/1000000}M`} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} />
                            <Bar dataKey="orderRevenue" fill="#4F46E5" name="Doanh thu" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Doanh thu Dịch vụ</h3>
                </div>
                <div className="h-72">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(val) => `${val/1000}k`} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} />
                            <Bar dataKey="serviceRevenue" fill="#10B981" name="Doanh thu" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
       </div>
    </div>
  );
};
