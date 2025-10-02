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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header/Navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-md">
        <nav className="max-w-screen-large mx-auto px-4 flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl">📖</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-0">Digital Library</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#hero" className="text-gray-600 dark:text-gray-300 font-medium px-4 py-2 rounded-md transition-all duration-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 no-underline">Beranda</a>
            <a href="#stats" className="text-gray-600 dark:text-gray-300 font-medium px-4 py-2 rounded-md transition-all duration-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 no-underline">Statistik</a>
            <a href="#features" className="text-gray-600 dark:text-gray-300 font-medium px-4 py-2 rounded-md transition-all duration-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 no-underline">Fitur</a>
            <a href="#about" className="text-gray-600 dark:text-gray-300 font-medium px-4 py-2 rounded-md transition-all duration-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 no-underline">Tentang</a>
            <button className="inline-flex items-center justify-center px-6 py-2 border-none rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 no-underline bg-blue-500 text-white hover:bg-blue-600 hover:transform hover:-translate-y-px">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="block md:hidden bg-transparent border-none text-xl text-gray-900 dark:text-white cursor-pointer z-[60] fixed right-4 top-6 transition-all duration-300 hover:scale-110" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-60 backdrop-blur-sm z-50 animate-fade-in" onClick={toggleMobileMenu}>
            <div className="fixed top-0 right-0 w-80 h-screen bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl p-8 flex flex-col gap-4 z-50 pt-24" onClick={(e) => e.stopPropagation()}>
              <div className="pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">Menu</h3>
              </div>
              <a href="#hero" className="text-gray-900 dark:text-white text-base font-medium no-underline p-4 rounded-md transition-all duration-300 flex items-center gap-4 border-l-2 border-transparent hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-l-blue-500 hover:transform hover:translate-x-1" onClick={toggleMobileMenu}>
                <span className="text-xl w-6 inline-block">🏠</span>
                Beranda
              </a>
              <a href="#stats" className="text-gray-900 dark:text-white text-base font-medium no-underline p-4 rounded-md transition-all duration-300 flex items-center gap-4 border-l-2 border-transparent hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-l-blue-500 hover:transform hover:translate-x-1" onClick={toggleMobileMenu}>
                <span className="text-xl w-6 inline-block">📊</span>
                Statistik
              </a>
              <a href="#features" className="text-gray-900 dark:text-white text-base font-medium no-underline p-4 rounded-md transition-all duration-300 flex items-center gap-4 border-l-2 border-transparent hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-l-blue-500 hover:transform hover:translate-x-1" onClick={toggleMobileMenu}>
                <span className="text-xl w-6 inline-block">⭐</span>
                Fitur
              </a>
              <a href="#about" className="text-gray-900 dark:text-white text-base font-medium no-underline p-4 rounded-md transition-all duration-300 flex items-center gap-4 border-l-2 border-transparent hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-l-blue-500 hover:transform hover:translate-x-1" onClick={toggleMobileMenu}>
                <span className="text-xl w-6 inline-block">ℹ️</span>
                Tentang
              </a>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
              <button className="inline-flex items-center justify-center px-6 py-2 border-none rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 no-underline bg-blue-500 text-white hover:bg-blue-600 hover:transform hover:-translate-y-px w-full justify-center flex items-center gap-2" onClick={toggleMobileMenu}>
                <span className="text-xl w-6 inline-block">🚀</span>
                Masuk
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center py-16">
        <div className="max-w-screen-large mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Selamat Datang di Era Baru 
              <span className="text-blue-500"> Perpustakaan Digital</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 text-gray-600 dark:text-gray-300">
              Jelajahi ribuan koleksi buku digital, jurnal, dan artikel penelitian terbaru. 
              Akses pengetahuan tak terbatas dengan teknologi modern yang mudah digunakan.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <a href="#features" className="inline-flex items-center justify-center px-8 py-4 border-none rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 no-underline bg-blue-500 text-white hover:bg-blue-600 hover:transform hover:-translate-y-px w-full md:w-auto max-w-xs mx-auto md:mx-0 smooth-scroll">
                Mulai Eksplorasi
              </a>
              <a href="#about" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 no-underline text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full md:w-auto max-w-xs mx-auto md:mx-0 smooth-scroll">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="relative h-72">
              <div className="relative w-full h-full">
                <div className="absolute text-5xl animate-float top-8 left-8" style={{ animationDelay: '0s' }}>📖</div>
                <div className="absolute text-5xl animate-float top-4 right-16" style={{ animationDelay: '0.5s' }}>📚</div>
                <div className="absolute text-5xl animate-float bottom-16 left-1/3" style={{ animationDelay: '1s' }}>📓</div>
                <div className="absolute text-5xl animate-float bottom-8 right-8" style={{ animationDelay: '1.5s' }}>📔</div>
                <div className="absolute text-4xl animate-float top-1/2 left-4" style={{ animationDelay: '2s' }}>📄</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
            <section id="stats" className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-screen-large mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">Digital Library Stats</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Lihat pencapaian dan pertumbuhan platform perpustakaan digital terdepan di Indonesia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-md dark:shadow-xl transition-all duration-300 text-center animate-fade-in hover:transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="text-5xl mb-4 opacity-90 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl mb-2 font-extrabold leading-tight bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent">{stat.number}</h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{stat.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug mb-4">{stat.description}</p>
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800 font-semibold inline-block text-blue-500">
                    {stat.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-screen-large mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Nikmati berbagai fitur canggih yang dirancang khusus untuk memberikan pengalaman membaca terbaik
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-md dark:shadow-xl transition-all duration-300 text-center animate-fade-in hover:transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="text-5xl mb-4 opacity-90 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug mb-4">{feature.description}</p>
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800 font-semibold inline-block text-blue-500">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-screen-large mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6">Tentang Digital Library</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Digital Library adalah platform perpustakaan digital modern yang menghubungkan 
                pengguna dengan koleksi literatur terlengkap dan terbaru. Kami berkomitmen untuk 
                menyediakan akses mudah dan cepat ke berbagai sumber pengetahuan.
              </p>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Dengan teknologi pencarian yang canggih dan antarmuka yang user-friendly, 
                kami memastikan setiap pengguna dapat menemukan informasi yang mereka butuhkan 
                dengan mudah dan efisien.
              </p>
              <a href="#hero" className="inline-flex items-center justify-center px-6 py-2 border-none rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 no-underline bg-blue-500 text-white hover:bg-blue-600 hover:transform hover:-translate-y-px smooth-scroll">Bergabung Sekarang</a>
            </div>
            <div className="">
              <div className="relative h-96 flex items-center justify-center">
                <div className="relative w-72 h-72">
                  <div className="absolute border-2 border-blue-500 rounded-full animate-rotate w-24 h-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                  <div className="absolute border-2 border-blue-500 rounded-full animate-rotate w-48 h-48 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ animationDelay: '-5s' }}></div>
                  <div className="absolute border-2 border-blue-500 rounded-full animate-rotate w-72 h-72 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10" style={{ animationDelay: '-10s' }}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-blue-500">📚</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-600 py-16">
        <div className="max-w-screen-large mx-auto px-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-12 rounded-lg text-center">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl mb-4">Siap Memulai Perjalanan Literasi Digital?</h2>
            <p className="text-white text-opacity-90 text-lg mb-6">
              Daftarkan diri Anda sekarang dan nikmati akses tak terbatas ke ribuan koleksi buku digital terbaik.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <a href="#hero" className="inline-flex items-center justify-center px-8 py-4 border-none rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 no-underline bg-white text-blue-500 hover:bg-white hover:bg-opacity-90 hover:transform hover:-translate-y-1 w-full md:w-auto max-w-xs mx-auto md:mx-0 smooth-scroll">Daftar Gratis</a>
              <a href="#features" className="inline-flex items-center justify-center px-8 py-4 border border-white border-opacity-30 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 no-underline text-white hover:bg-white hover:bg-opacity-10 w-full md:w-auto max-w-xs mx-auto md:mx-0 smooth-scroll">Lihat Demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-12 pb-6">
        <div className="max-w-screen-large mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-1 max-w-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-2xl">📖</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Digital Library</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Platform perpustakaan digital terdepan untuk akses literatur modern dan komprehensif.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="min-w-max">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layanan</h4>
                <ul className="list-none p-0 flex flex-wrap gap-4">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Koleksi Buku</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Jurnal Digital</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">E-Magazine</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Audio Books</a></li>
                </ul>
              </div>
              
              <div className="min-w-max">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bantuan</h4>
                <ul className="list-none p-0 flex flex-wrap gap-4">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">FAQ</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Panduan</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Kontak Support</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Lapor Bug</a></li>
                </ul>
              </div>
              
              <div className="min-w-max">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ikuti Kami</h4>
                <div className="flex gap-4">
                  <a href="#" className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md text-lg no-underline transition-all duration-300 hover:bg-blue-500 hover:text-white hover:transform hover:-translate-y-1" aria-label="Facebook">📘</a>
                  <a href="#" className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md text-lg no-underline transition-all duration-300 hover:bg-blue-500 hover:text-white hover:transform hover:-translate-y-1" aria-label="Twitter">🐦</a>
                  <a href="#" className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md text-lg no-underline transition-all duration-300 hover:bg-blue-500 hover:text-white hover:transform hover:-translate-y-1" aria-label="Instagram">📷</a>
                  <a href="#" className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md text-lg no-underline transition-all duration-300 hover:bg-blue-500 hover:text-white hover:transform hover:-translate-y-1" aria-label="LinkedIn">💼</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-300">
                © 2024 Digital Library. Semua hak cipta dilindungi.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Privasi</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Syarat & Ketentuan</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 no-underline transition-colors duration-300 hover:text-blue-500">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
