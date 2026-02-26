import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import utamvLogo from '@/assets/utamv-logo-campus.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isPaid } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { 
      href: '/programas', 
      label: 'PROGRAMAS', 
      submenu: [
        { href: '/programas/maestrias', label: 'Maestrías' },
        { href: '/programas/master-profesional', label: 'Máster Profesional' },
        { href: '/programas/diplomados', label: 'Diplomados' },
        { href: '/programas/certificaciones', label: 'Certificaciones' }
      ]
    },
    { 
      href: '/docentes', 
      label: 'DOCENTES',
      submenu: [
        { href: '/docentes/rectoria', label: 'Rectoría' },
        { href: '/docentes/directivos', label: 'Directivos' },
        { href: '/docentes/profesores', label: 'Profesores' }
      ]
    },
    { 
      href: '/investigacion', 
      label: 'INVESTIGACIÓN',
      submenu: [
        { href: '/investigacion/proyectos', label: 'Proyectos' },
        { href: '/investigacion/publicaciones', label: 'Publicaciones' }
      ]
    },
    { 
      href: '/admisiones', 
      label: 'ADMISIONES',
      submenu: [
        { href: '/admisiones/requisitos', label: 'Requisitos' },
        { href: '/admisiones/proceso', label: 'Proceso' },
        { href: '/admisiones/contacto', label: 'Contacto' }
      ]
    },
    { href: '/campus-virtual', label: 'CAMPUS VIRTUAL' },
    { href: '/preguntas-frecuentes', label: 'PREGUNTAS FRECUENTES' },
    { href: '/ayuda', label: 'AYUDA' },
  ];

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0A1128]/95 backdrop-blur-md border-b border-platinum/30 shadow-lg'
          : 'bg-[#0A1128]/80 backdrop-blur-sm border-b border-platinum/20'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-xl overflow-hidden transition-transform duration-500 group-hover:scale-110 shadow-platinum">
              <img
                src={utamvLogo}
                alt="UTAMV"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-xl font-bold tracking-widest text-white leading-tight">
                UTAMV
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-platinum/80">
                Universidad de Tecnología Avanzada, Marketing y Versatilidad
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.submenu ? (
                  <div className="flex items-center gap-1 px-4 py-3 text-xs font-semibold tracking-[0.12em] transition-all duration-300 rounded-lg hover:bg-platinum/5 cursor-pointer">
                    <span className={`${
                      isActive(link.href)
                        ? 'text-platinum'
                        : 'text-white/70 hover:text-platinum'
                    }`}>
                      {link.label}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </div>
                ) : (
                  <Link
                    to={link.href === '/campus-virtual' && !user ? '/auth' : link.href}
                    className={`px-4 py-3 text-xs font-semibold tracking-[0.12em] transition-all duration-300 rounded-lg ${
                      isActive(link.href)
                        ? 'text-platinum bg-platinum/10 border border-platinum/30'
                        : 'text-white/70 hover:text-platinum hover:bg-white/5 border border-transparent hover:border-platinum/20'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
                
                {link.submenu && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#0A1128]/95 backdrop-blur-md border border-platinum/30 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    {link.submenu.map((subLink) => (
                      <Link
                        key={subLink.href}
                        to={subLink.href}
                        className="block px-4 py-3 text-xs text-white/70 hover:text-platinum hover:bg-platinum/5 transition-all duration-200"
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden xl:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-xs text-white/60 max-w-[160px] truncate">
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-platinum/50 text-platinum hover:bg-platinum/10 hover:border-platinum"
                >
                  <Link to={isPaid ? '/campus-virtual' : '/admisiones'}>
                    {isPaid ? 'Campus Virtual' : 'Admisiones'}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white/70 hover:text-platinum hover:bg-white/5"
                >
                  <Link to="/auth">Iniciar sesión</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-platinum/50 text-platinum hover:bg-platinum/10 hover:border-platinum"
                >
                  <Link to="/admisiones">Admisiones</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="xl:hidden p-2 text-white/70 hover:text-platinum transition-colors"
            aria-label="Menú de navegación"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-24 left-0 right-0 bg-[#0A1128]/98 backdrop-blur-md border-b border-platinum/30 animate-slide-up">
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <div key={link.href} className="space-y-2">
                  {link.submenu ? (
                    <div className="space-y-1">
                      <div className="py-4 px-6 rounded-xl text-sm font-semibold tracking-wider text-white/70 hover:text-platinum hover:bg-white/5 transition-all">
                        {link.label}
                      </div>
                      <div className="pl-8 space-y-1">
                        {link.submenu.map((subLink) => (
                          <Link
                            key={subLink.href}
                            to={subLink.href}
                            className="block py-3 px-6 rounded-lg text-xs text-white/60 hover:text-platinum hover:bg-platinum/5 transition-all border-l-2 border-transparent hover:border-platinum/50"
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.href === '/campus-virtual' && !user ? '/auth' : link.href}
                      className={`py-4 px-6 rounded-xl text-sm font-semibold tracking-wider transition-all ${
                        isActive(link.href)
                          ? 'bg-platinum/10 text-platinum border border-platinum/30'
                          : 'text-white/70 hover:text-platinum hover:bg-white/5 border border-transparent hover:border-platinum/20'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-platinum/20">
                {user ? (
                  <Button 
                    variant="outline" 
                    asChild
                    className="border-platinum/50 text-platinum hover:bg-platinum/10 hover:border-platinum"
                  >
                    <Link to={isPaid ? '/campus-virtual' : '/admisiones'}>
                      {isPaid ? 'Campus Virtual' : 'Admisiones'}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      asChild
                      className="text-white/70 hover:text-platinum hover:bg-white/5"
                    >
                      <Link to="/auth">Iniciar sesión</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild
                      className="border-platinum/50 text-platinum hover:bg-platinum/10 hover:border-platinum"
                    >
                      <Link to="/admisiones">Admisiones</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
