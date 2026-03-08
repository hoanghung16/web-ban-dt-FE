import React from 'react';
import { Smartphone, ShieldCheck, Headphones, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-king-bg border-t border-king-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Grid chia cột */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Cột 1: Thương hiệu */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-black tracking-tight mb-4">
              THE KING <span className="text-gradient block mt-1">Mobile</span>
            </h2>
            <p className="text-king-muted text-sm leading-relaxed mb-6">
              Hệ thống bán lẻ điện thoại di động, phụ kiện chính hãng cao cấp. Mang đến trải nghiệm công nghệ đỉnh cao và dịch vụ chuẩn 5 sao.
            </p>
            <div className="flex gap-4">
              {/* Các nút mạng xã hội mẫu */}
              <a href="#" className="w-10 h-10 rounded-full bg-king-card border border-king-border flex items-center justify-center text-king-muted hover:text-white hover:bg-king-accent transition-all hover:scale-110">
                <span className="font-bold font-serif">f</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-king-card border border-king-border flex items-center justify-center text-king-muted hover:text-white hover:bg-king-accent transition-all hover:scale-110">
                <span className="font-bold">IG</span>
              </a>
            </div>
          </div>

          {/* Cột 2: Sản phẩm */}
          <div>
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <Smartphone size={18} className="text-king-accent" />
              Sản phẩm
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm">iPhone Series</a></li>
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm">Samsung Galaxy</a></li>
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm">Oppo Reno / Find</a></li>
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm">Xiaomi, Vivo</a></li>
            </ul>
          </div>

          {/* Cột 3: Dịch vụ */}
          <div>
             <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <ShieldCheck size={18} className="text-purple-500" />
              Dịch vụ VIP
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-king-border"></div> Thu cũ đổi mới</a></li>
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-king-border"></div> Gói bảo hành rơi vỡ</a></li>
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-king-border"></div> Trả góp 0%</a></li>
              <li><a href="#" className="text-king-muted hover:text-white transition-colors text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-king-border"></div> Sửa chữa cấp tốc</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <Headphones size={18} className="text-indigo-400" />
              Tổng đài hỗ trợ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-king-muted mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Gọi mua hàng</p>
                  <a href="tel:18001111" className="text-king-accent font-black text-lg hover:underline">1800.1111</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                 <Mail size={18} className="text-king-muted mt-0.5" />
                 <div>
                  <p className="text-xs text-king-muted">Email hỗ trợ</p>
                  <p className="text-sm text-white mt-1">cskh@thekingmobile.vn</p>
                 </div>
              </li>
              <li className="flex items-start gap-3">
                 <MapPin size={18} className="text-king-muted mt-0.5" />
                 <div>
                  <p className="text-xs text-king-muted">Hệ thống</p>
                  <p className="text-sm text-white mt-1">25 Showroom toàn quốc</p>
                 </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-king-border text-center md:flex md:justify-between md:text-left">
          <p className="text-king-muted text-xs">
            © {new Date().getFullYear()} The King Mobile. Thiết kế giao diện Dark Mode Premium.
          </p>
          <div className="mt-4 md:mt-0 flex gap-4 justify-center">
            <a href="#" className="text-king-muted hover:text-white text-xs transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-king-muted hover:text-white text-xs transition-colors">Điều khoản dịch vụ</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
