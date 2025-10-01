import React, { useState } from 'react';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const features = [
    {
      icon: '📚',
      title: 'Koleksi Digital Lengkap',
      description: 'Akses ribuan buku digital, jurnal, dan artikel penelitian dari berbagai kategori dan bidang ilmu.',
      highlight: 'Lebih dari 125k+ koleksi'
    },
    {
      icon: '🔍',
      title: 'Pencarian Cerdas',
      description: 'Temukan buku yang Anda butuhkan dengan sistem pencarian yang canggih dan filter yang detail.',
      highlight: 'AI-Powered Search'
    },
    {
      icon: '📱',
      title: 'Akses Multi-Platform',
      description: 'Baca koleksi digital kapan saja, di mana saja melalui smartphone, tablet, atau komputer Anda.',
      highlight: 'iOS, Android & Web'
    },
    {
      icon: '👥',
      title: 'Komunitas Pembaca',
      description: 'Bergabung dengan komunitas pembaca, berbagi review, dan dapatkan rekomendasi buku terbaik.',
      highlight: '89k+ Member Aktif'
    },
    {
      icon: '📊',
      title: 'Statistik Membaca',
      description: 'Pantau progress membaca Anda dengan statistik yang detail dan pencapaian yang menarik.',
      highlight: 'Real-time Analytics'
    },
    {
      icon: '🔖',
      title: 'Bookmark & Notes',
      description: 'Simpan halaman favorit dan buat catatan pribadi untuk referensi di masa mendatang.',
      highlight: 'Cloud Sync'
    }
  ];

  const stats = [
    { 
      icon: '📚', 
      number: '125,847+', 
      label: 'Koleksi Digital',
      description: 'Buku, jurnal, artikel & e-magazine',
      growth: '+12% bulan ini'
    },
    { 
      icon: '👥', 
      number: '89,542', 
      label: 'Pengguna Aktif',
      description: 'Member terdaftar & aktif membaca',
      growth: '+847 minggu ini'
    },
    { 
      icon: '📖', 
      number: '2,847,920', 
      label: 'Total Bacaan',
      description: 'Halaman yang telah dibaca',
      growth: '+15k hari ini'
    },
    { 
      icon: '🌍', 
      number: '247', 
      label: 'Negara Terjangkau',
      description: 'Akses global 24/7',
      growth: '99.9% uptime'
    },
    { 
      icon: '⭐', 
      number: '4.9/5', 
      label: 'Rating Pengguna',
      description: 'Dari 45,200+ ulasan',
      growth: 'Meningkat 0.3 poin'
    },
    { 
      icon: '🔍', 
      number: '1.2M+', 
      label: 'Pencarian Harian',
      description: 'Query pencarian per hari',
      growth: '+28% efisiensi'
    }
  ];

  return (
    <div className="dashboard">
      {/* Header/Navigation */}
      <header className="header">
        <nav className="container flex justify-between items-center" style={{ padding: 'var(--space-lg) var(--space-md)' }}>
          <div className="logo flex items-center gap-4">
            <div className="logo-icon">📖</div>
            <h1 className="logo-text">Digital Library</h1>
          </div>
          
          <div className="nav-links flex items-center gap-6">
            <a href="#hero" className="nav-link smooth-scroll">Beranda</a>
            <a href="#stats" className="nav-link smooth-scroll">Statistik</a>
            <a href="#features" className="nav-link smooth-scroll">Fitur</a>
            <a href="#about" className="nav-link smooth-scroll">Tentang</a>
            <button className="btn btn-primary">Masuk</button>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay" onClick={toggleMobileMenu}>
            <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-header">
                <h3 className="mobile-nav-title">Menu</h3>
              </div>
              <a href="#hero" className="mobile-nav-link smooth-scroll" onClick={toggleMobileMenu}>
                <span className="nav-icon">🏠</span>
                Beranda
              </a>
              <a href="#stats" className="mobile-nav-link smooth-scroll" onClick={toggleMobileMenu}>
                <span className="nav-icon">📊</span>
                Statistik
              </a>
              <a href="#features" className="mobile-nav-link smooth-scroll" onClick={toggleMobileMenu}>
                <span className="nav-icon">⭐</span>
                Fitur
              </a>
              <a href="#about" className="mobile-nav-link smooth-scroll" onClick={toggleMobileMenu}>
                <span className="nav-icon">ℹ️</span>
                Tentang
              </a>
              <div className="mobile-nav-divider"></div>
              <button className="btn btn-primary mobile-nav-btn" onClick={toggleMobileMenu}>
                <span className="nav-icon">🚀</span>
                Masuk
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero section">
        <div className="container text-center">
          <div className="hero-content fade-in">
            <h1 className="hero-title mb-6">
              Selamat Datang di Era Baru 
              <span className="text-accent"> Perpustakaan Digital</span>
            </h1>
            <p className="hero-description mb-8">
              Jelajahi ribuan koleksi buku digital, jurnal, dan artikel penelitian terbaru. 
              Akses pengetahuan tak terbatas dengan teknologi modern yang mudah digunakan.
            </p>
            <div className="hero-buttons flex justify-center gap-4">
              <a href="#features" className="btn btn-primary btn-large smooth-scroll">
                Mulai Eksplorasi
              </a>
              <a href="#about" className="btn btn-secondary btn-large smooth-scroll">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
          
          <div className="hero-image mt-8">
            <div className="hero-visual">
              <div className="floating-books">
                <div className="book book-1">📖</div>
                <div className="book book-2">📚</div>
                <div className="book book-3">📓</div>
                <div className="book book-4">📔</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="stats-section section">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2 className="section-title mb-4">Digital Library Stats</h2>
            <p className="section-description">
              Lihat pencapaian dan pertumbuhan platform perpustakaan digital terdepan di Indonesia
            </p>
          </div>
          
          <div className="stats-grid grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card card text-center fade-in">
                <div className="stat-icon mb-3" style={{ fontSize: '2.5rem' }}>
                  {stat.icon}
                </div>
                <h3 className="stat-number text-accent font-bold mb-2">{stat.number}</h3>
                <p className="stat-label font-semibold mb-2">{stat.label}</p>
                <p className="stat-description text-secondary mb-2">{stat.description}</p>
                <div className="stat-growth">
                  <span className="growth-indicator text-accent font-medium">
                    {stat.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section section">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2 className="section-title mb-4">Fitur Unggulan</h2>
            <p className="section-description">
              Nikmati berbagai fitur canggih yang dirancang khusus untuk memberikan pengalaman membaca terbaik
            </p>
          </div>
          
          <div className="features-grid grid grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card text-center fade-in">
                <div className="feature-icon mb-3" style={{ fontSize: '2.5rem' }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title font-bold mb-2">{feature.title}</h3>
                <p className="feature-description text-secondary mb-2">{feature.description}</p>
                <div className="feature-highlight">
                  <span className="highlight-indicator text-accent font-medium">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section section">
        <div className="container">
          <div className="about-content grid grid-cols-2 gap-8 items-center">
            <div className="about-text">
              <h2 className="section-title mb-6">Tentang Digital Library</h2>
              <p className="mb-4">
                Digital Library adalah platform perpustakaan digital modern yang menghubungkan 
                pengguna dengan koleksi literatur terlengkap dan terbaru. Kami berkomitmen untuk 
                menyediakan akses mudah dan cepat ke berbagai sumber pengetahuan.
              </p>
              <p className="mb-6">
                Dengan teknologi pencarian yang canggih dan antarmuka yang user-friendly, 
                kami memastikan setiap pengguna dapat menemukan informasi yang mereka butuhkan 
                dengan mudah dan efisien.
              </p>
              <a href="#hero" className="btn btn-primary smooth-scroll">Bergabung Sekarang</a>
            </div>
            <div className="about-image">
              <div className="about-visual">
                <div className="visual-element">
                  <div className="circle circle-1"></div>
                  <div className="circle circle-2"></div>
                  <div className="circle circle-3"></div>
                  <div className="center-icon">📚</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content card text-center">
            <h2 className="cta-title mb-4">Siap Memulai Perjalanan Literasi Digital?</h2>
            <p className="cta-description mb-6 text-secondary">
              Daftarkan diri Anda sekarang dan nikmati akses tak terbatas ke ribuan koleksi buku digital terbaik.
            </p>
            <div className="cta-buttons flex justify-center gap-4">
              <a href="#hero" className="btn btn-primary btn-large smooth-scroll">Daftar Gratis</a>
              <a href="#features" className="btn btn-ghost smooth-scroll">Lihat Demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo flex items-center gap-4 mb-4">
                <div className="logo-icon">📖</div>
                <h3>Digital Library</h3>
              </div>
              <p className="text-secondary">
                Platform perpustakaan digital terdepan untuk akses literatur modern dan komprehensif.
              </p>
            </div>
            
            <div className="footer-links-group">
              <div className="footer-links">
                <h4 className="footer-title mb-4">Layanan</h4>
                <ul className="link-list horizontal">
                  <li><a href="#" className="footer-link">Koleksi Buku</a></li>
                  <li><a href="#" className="footer-link">Jurnal Digital</a></li>
                  <li><a href="#" className="footer-link">E-Magazine</a></li>
                  <li><a href="#" className="footer-link">Audio Books</a></li>
                </ul>
              </div>
              
              <div className="footer-links">
                <h4 className="footer-title mb-4">Bantuan</h4>
                <ul className="link-list horizontal">
                  <li><a href="#" className="footer-link">FAQ</a></li>
                  <li><a href="#" className="footer-link">Panduan</a></li>
                  <li><a href="#" className="footer-link">Kontak Support</a></li>
                  <li><a href="#" className="footer-link">Lapor Bug</a></li>
                </ul>
              </div>
              
              <div className="footer-links">
                <h4 className="footer-title mb-4">Ikuti Kami</h4>
                <div className="social-links flex gap-4">
                  <a href="#" className="social-link" aria-label="Facebook">📘</a>
                  <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                  <a href="#" className="social-link" aria-label="Instagram">📷</a>
                  <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content flex justify-between items-center">
              <p className="text-secondary">
                © 2024 Digital Library. Semua hak cipta dilindungi.
              </p>
              <div className="footer-bottom-links flex gap-6">
                <a href="#" className="footer-link">Privasi</a>
                <a href="#" className="footer-link">Syarat & Ketentuan</a>
                <a href="#" className="footer-link">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
