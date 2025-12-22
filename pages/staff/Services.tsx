
import React, { useState } from 'react';
import { useAppointment } from '../../contexts/AppointmentContext';
import { useService } from '../../contexts/ServiceContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ServiceStatus, Appointment } from '../../interfaces';
import { Eye, X, AlertTriangle, User, Calendar, Clock, ShoppingBag, Search, Phone } from 'lucide-react';

export const StaffServices: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUser();
  const { appointments, updateAppointmentStatus } = useAppointment();
  const { services } = useService();
  const { t } = useLanguage();
  const { notify } = useNotification();
  
  const [activeTab, setActiveTab] = useState<string>('PENDING');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelModal, setCancelModal] = useState<string | number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');

  const getCustomer = (customerId: string | number) => users.find(u => u.id === customerId);

  const searchFilteredAppts = appointments.filter(a => {
      const customer = getCustomer(a.customerId);
      if (!customer) return false;

      const matchName = nameFilter ? customer.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
      const matchPhone = phoneFilter ? customer.phone.includes(phoneFilter) : true;
      
      return matchName && matchPhone;
  });

  const isPendingAppt = (a: Appointment) => a.status === ServiceStatus.PENDING || (a.status === ServiceStatus.REQ_CANCEL && !a.staffId);
  const isMyAppt = (a: Appointment) => a.staffId === user?.id;

  const getFilteredAppointments = () => {
    switch (activeTab) {
      case 'PENDING':
        return searchFilteredAppts.filter(a => isPendingAppt(a));
      case 'PROCESSING':
        return searchFilteredAppts.filter(a => isMyAppt(a) && (a.status === ServiceStatus.IN_PROGRESS));
      case 'COMPLETED':
        return searchFilteredAppts.filter(a => isMyAppt(a) && a.status === ServiceStatus.COMPLETED);
      case 'CANCELLED':
        return searchFilteredAppts.filter(a => isMyAppt(a) && a.status === ServiceStatus.CANCELLED);
      default: return [];
    }
  };

  const displayedAppointments = getFilteredAppointments();

  const getCustomerName = (customerId: string | number) => getCustomer(customerId)?.name || 'Khách vãng lai';

  const getStatusLabel = (status: number) => {
      if (status === 0) return t('status.cancelled');
      if (status === 1) return t('status.completed');
      if (status === 2) return t('status.pending');
      if (status === 3) return t('status.req_cancel');
      if (status === 4) return t('status.in_progress');
      return 'N/A';
  };

  const getStatusColor = (status: number) => {
    switch(status) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 0: return 'bg-red-100 text-red-800 border-red-200';
      case 4: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReceiveAppointment = (appId: string | number) => {
       updateAppointmentStatus(appId, ServiceStatus.IN_PROGRESS, 'Nhân viên đã nhận lịch', user?.id);
       setSelectedAppointment(null);
       notify('success', 'Đã tiếp nhận lịch hẹn');
  };

  const handleCompleteAppointment = (appId: string | number) => {
       updateAppointmentStatus(appId, ServiceStatus.COMPLETED, 'Dịch vụ đã hoàn thành');
       setSelectedAppointment(null);
       notify('success', 'Đã hoàn thành dịch vụ');
  };

  const openCancelModal = (id: string | number) => {
      setCancelModal(id);
      setCancelReason('');
  };

  const confirmCancel = () => {
      if(!cancelModal || !cancelReason.trim()) return;
      updateAppointmentStatus(cancelModal, ServiceStatus.CANCELLED, cancelReason, user?.id);
      setCancelModal(null);
      setSelectedAppointment(null);
      notify('success', 'Đã hủy lịch hẹn');
  };

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-900">{t('nav.appointments')}</h1>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <input 
                    type="text"
                    placeholder={t('common.search_name')}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="relative">
                <input 
                    type="text"
                    placeholder={t('common.search_phone')}
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
       </div>

       <div className="flex overflow-x-auto p-2 bg-white rounded-lg border border-gray-200 gap-2">
            <TabButton 
                active={activeTab === 'PENDING'} 
                onClick={() => setActiveTab('PENDING')} 
                label={`${t('status.pending')} (All)`}
                count={searchFilteredAppts.filter(isPendingAppt).length}
                color="yellow"
            />
            <TabButton 
                active={activeTab === 'PROCESSING'} 
                onClick={() => setActiveTab('PROCESSING')} 
                label={`${t('status.in_progress')} (Mine)`} 
                count={searchFilteredAppts.filter(a => isMyAppt(a) && a.status === ServiceStatus.IN_PROGRESS).length}
                color="blue"
            />
                <TabButton 
                active={activeTab === 'COMPLETED'} 
                onClick={() => setActiveTab('COMPLETED')} 
                label={t('status.completed')} 
                color="green"
            />
            <TabButton 
                active={activeTab === 'CANCELLED'} 
                onClick={() => setActiveTab('CANCELLED')} 
                label={t('status.cancelled')} 
                color="gray"
            />
        </div>

        <div className="grid grid-cols-1 gap-4">
             {displayedAppointments.length === 0 && <EmptyState label="Không có lịch hẹn nào" />}
             {displayedAppointments.map(app => (
                <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-bold text-lg text-gray-800">{services.find(s=>s.id === app.serviceId)?.name}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(app.status)}`}>
                                    {getStatusLabel(app.status)}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                                <User size={14}/> {getCustomerName(app.customerId)}
                            </p>
                            <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                                <Calendar size={14}/> <span className="font-bold text-gray-900">{app.date}</span> lúc <span className="font-bold text-gray-900">{app.time}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                             <button 
                                onClick={() => setSelectedAppointment(app)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                            >
                                <Eye size={16}/> {t('common.detail')}
                            </button>
                        </div>
                    </div>
                </div>
             ))}
        </div>

      {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                  <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                      <h3 className="font-bold text-lg">{t('common.detail')}</h3>
                      <button onClick={() => setSelectedAppointment(null)}><X size={24}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                       <div className="bg-gray-50 p-3 rounded-lg border">
                          <h4 className="font-bold text-sm text-gray-700 mb-2">{t('common.customer')}</h4>
                          <p className="text-sm">Tên: <span className="font-medium">{getCustomerName(selectedAppointment.customerId)}</span></p>
                          <p className="text-sm mt-1">SĐT: <span className="font-medium">{getCustomer(selectedAppointment.customerId)?.phone}</span></p>
                          <p className="text-sm mt-1">{t('common.note')}: <span className="italic">{selectedAppointment.note || 'Không có'}</span></p>
                      </div>

                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                          <h4 className="font-bold text-sm text-indigo-800 mb-2">{t('common.pet_info')}</h4>
                          <p className="text-sm">Bé: {selectedAppointment.petName} ({selectedAppointment.petSpecies})</p>
                          <p className="text-sm">Giống: {selectedAppointment.petBreed} - {selectedAppointment.petAge} tháng</p>
                      </div>
                      
                      <div className="text-sm">
                          <p><span className="font-medium">{t('nav.services')}:</span> {services.find(s=>s.id === selectedAppointment.serviceId)?.name}</p>
                          <p><span className="font-medium">{t('common.date')}:</span> {selectedAppointment.date} lúc {selectedAppointment.time}</p>
                      </div>

                      <div className="border-t pt-4">
                         <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                            <Clock size={16}/> Lịch sử trạng thái
                         </h4>
                         <div className="relative border-l-2 border-gray-200 ml-3 space-y-4 py-1">
                            {selectedAppointment.statusHistory?.map((log, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-sm"></div>
                                    <p className="text-sm font-bold text-gray-800">{getStatusLabel(log.status)}</p>
                                    <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                                    {log.note && <p className="text-xs text-gray-600 italic mt-1">"{log.note}"</p>}
                                </div>
                            ))}
                         </div>
                      </div>

                      <div className="pt-4 border-t space-y-3">
                           {selectedAppointment.status === ServiceStatus.PENDING && (
                               <div className="grid grid-cols-2 gap-3">
                                   <button 
                                    onClick={() => openCancelModal(selectedAppointment.id)}
                                    className="w-full border border-red-300 text-red-600 py-3 rounded-lg text-sm hover:bg-red-50 font-medium"
                                   >
                                       {t('action.cancel_appt')}
                                   </button>
                                   <button 
                                    onClick={() => handleReceiveAppointment(selectedAppointment.id)}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm hover:bg-indigo-700 font-bold shadow-md"
                                   >
                                       {t('action.receive_appt')}
                                   </button>
                               </div>
                           )}

                           {selectedAppointment.status === ServiceStatus.IN_PROGRESS && selectedAppointment.staffId === user?.id && (
                               <button 
                                onClick={() => handleCompleteAppointment(selectedAppointment.id)}
                                className="w-full bg-green-600 text-white py-3 rounded-lg text-sm hover:bg-green-700 font-bold shadow-md"
                               >
                                   {t('action.process_complete')}
                               </button>
                           )}
                           
                           {selectedAppointment.status === ServiceStatus.IN_PROGRESS && (
                               <p className="text-center text-xs text-gray-500 italic">
                                   Dịch vụ đang thực hiện, không thể yêu cầu hủy.
                               </p>
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
                    <AlertTriangle/> {t('action.confirm_cancel')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Bạn có chắc chắn muốn hủy lịch hẹn này?
                </p>
                <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full border p-2 rounded mb-4 h-24 text-sm focus:ring-red-500 focus:border-red-500"
                    placeholder={t('action.enter_reason')}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setCancelModal(null)} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">{t('common.close')}</button>
                    <button onClick={confirmCancel} disabled={!cancelReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">{t('common.confirm')}</button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, label, count, color }: any) => {
    let activeClass = '';
    if (color === 'yellow') activeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    else if (color === 'blue') activeClass = 'bg-blue-100 text-blue-800 border-blue-300';
    else if (color === 'green') activeClass = 'bg-green-100 text-green-800 border-green-300';
    else activeClass = 'bg-gray-200 text-gray-800 border-gray-300';

    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border
                ${active ? `${activeClass} shadow-sm` : 'bg-white border-transparent text-gray-600 hover:bg-gray-100'}
            `}
        >
            {label}
            {count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs bg-white/50 border border-black/5`}>
                    {count}
                </span>
            )}
        </button>
    );
};

const EmptyState = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
        <ShoppingBag size={48} className="mb-4 opacity-50"/>
        <p>{label}</p>
    </div>
);
