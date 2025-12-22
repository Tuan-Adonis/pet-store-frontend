
import React, { createContext, useContext, useState } from 'react';

type Language = 'vi';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const translations: Record<string, string> = {
    // Nav
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.services': 'Dịch vụ',
    'nav.about': 'Thông tin',
    'nav.contact': 'Liên hệ',
    'nav.cart': 'Giỏ hàng',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    'nav.dashboard': 'Thống kê',
    'nav.orders': 'Hóa đơn',
    'nav.appointments': 'Lịch hẹn',
    'nav.profile': 'Hồ sơ cá nhân',
    
    // Status
    'status.pending': 'Chờ xác nhận',
    'status.accepted': 'Đã nhận đơn',
    'status.shipping': 'Đang giao hàng',
    'status.completed': 'Hoàn thành',
    'status.cancelled': 'Đã hủy',
    'status.req_cancel': 'Yêu cầu hủy',
    'status.re_delivery': 'Giao lại',
    'status.in_progress': 'Đang thực hiện',

    // Staff Stats
    'staff.stats.revenue_order': 'Doanh thu Đơn hàng',
    'staff.stats.revenue_service': 'Doanh thu Dịch vụ',
    'staff.stats.completed_orders': 'Đơn hoàn thành',
    'staff.stats.late_orders': 'Đơn giao trễ',
    'staff.chart.title': 'Biểu đồ hiệu suất',
    'staff.chart.placeholder': '(Biểu đồ chi tiết sẽ được cập nhật trong phiên bản sau)',

    // Common
    'common.search': 'Tìm kiếm...',
    'common.search_name': 'Tìm theo tên...',
    'common.search_phone': 'Tìm theo SĐT...',
    'common.note': 'Ghi chú',
    'common.total': 'Tổng cộng',
    'common.actions': 'Hành động',
    'common.detail': 'Chi tiết',
    'common.close': 'Đóng',
    'common.confirm': 'Xác nhận',
    'common.cancel': 'Hủy bỏ',
    'common.customer': 'Khách hàng',
    'common.address': 'Địa chỉ',
    'common.payment': 'Thanh toán',
    'common.reason': 'Lý do',
    'common.date': 'Ngày',
    'common.time': 'Giờ',
    'common.pet_info': 'Thông tin thú cưng',
    'common.service_info': 'Thông tin dịch vụ',
    
    // Actions
    'action.receive_order': 'Tiếp nhận đơn hàng',
    'action.receive_appt': 'Tiếp nhận lịch hẹn',
    'action.process_shipping': 'Chuyển trạng thái: Đang giao',
    'action.process_redelivery': 'Giao lại',
    'action.process_complete': 'Hoàn thành',
    'action.cancel_order': 'Hủy đơn',
    'action.cancel_appt': 'Hủy lịch & Báo khách',
    'action.confirm_cancel': 'Xác nhận hủy yêu cầu',
    'action.enter_reason': 'Nhập lý do hủy...',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hardcoded to Vietnamese
  const language: Language = 'vi';

  const t = (key: string) => {
    return translations[key] || key;
  };

  const formatCurrency = (amount: number) => {
    // Format using English locale for commas, then append VNĐ
    return amount.toLocaleString('en-US') + ' VNĐ';
  };

  return (
    <LanguageContext.Provider value={{ language, t, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
