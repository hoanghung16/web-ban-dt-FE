import React from 'react';
import { Save, Store, Globe, Mail, ShieldAlert } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Cài đặt Hệ thống</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            <Store size={18} /> Cửa hàng
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
            <Globe size={18} /> Tên miền & SEO
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
            <Mail size={18} /> Email & Thông báo
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
            <ShieldAlert size={18} /> Bảo mật
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Thông tin cửa hàng */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tên cửa hàng *</label>
                <input
                  type="text"
                  defaultValue="THE KING Store"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại liên hệ *</label>
                <input
                  type="text"
                  defaultValue="1900 1008"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email chăm sóc khách hàng *</label>
                <input
                  type="email"
                  defaultValue="support@theking.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Địa chỉ cửa hàng</label>
                <textarea
                  rows="3"
                  defaultValue="Số 1 Đại Cồ Việt, Phường Bách Khoa, Quận Hai Bà Trưng, Hà Nội"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Logo */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Logo & Branding</h3>
            <div className="flex gap-6 items-start">
              <div>
                <div className="w-32 h-32 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                  <span className="font-bold text-xl">THE KING</span>
                </div>
                <button className="mt-3 w-full py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  Thay đổi Logo
                </button>
              </div>
              <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Định dạng file khuyến nghị: PNG, SVG (trong suốt).</p>
                <p className="text-sm text-slate-600 mb-2">Kích thước tốt nhất: 200x50 pixel.</p>
                <p className="text-sm text-slate-600">Dung lượng tối đa: 2MB.</p>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Tiền tệ */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Cấu hình khu vực</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tiền tệ mặc định</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>VND (đ)</option>
                  <option>USD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Múi giờ</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>(GMT+07:00) Băng Cốc, Hà Nội, TP Hồ Chí Minh</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save size={20} />
            Lưu Cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
