import { Link } from 'react-router-dom';
import { Globe, Mail, ExternalLink } from 'lucide-react';
import utamvLogo from '@/assets/utamv-logo-campus.png';

const Footer = () => {
  const columns = {
    academia: [
      { label: 'Programas', href: '/programas' },
      { label: 'Docentes', href: '/docentes' },
      { label: 'Investigación', href: '/investigacion' },
      { label: 'Modelo Académico', href: '/#modelo' },
    ],
    estudiantes: [
      { label: 'Admisiones', href: '/admisiones' },
      { label: 'Campus Virtual', href: '/campus-virtual' },
      { label: 'Verificar Certificado', href: '/verificar-certificado' },
      { label: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
      { label: 'Ayuda', href: '/ayuda' },
    ],
    legal: [
      { label: 'Términos y Condiciones', href: '#' },
      { label: 'Política de Privacidad', href: '#' },
      { label: 'Política de Reembolso', href: '#' },
    ],
  };

  return (
    <footer className="bg-[#0A1128] border-t border-platinum/30">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl overflow-hidden">
                <img src={utamvLogo} alt="UTAMV" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-display text-lg font-bold tracking-widest text-white">UTAMV</p>
                <p className="text-[10px] text-platinum/70 tracking-wider uppercase">Universidad de Tecnología Avanzada, Marketing y Versatilidad</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Universidad Tecnológica Avanzada del Marketing Virtual. 
              Formación académica de excelencia desde Latinoamérica.
            </p>
            <p className="text-xs text-platinum/50 italic">
              Plataforma creada con Tecnología TAMV ONLINE
            </p>
          </div>

          {/* Academia */}
          <div>
            <h4 className="font-display text-xs font-semibold text-platinum mb-4 tracking-[0.2em] uppercase">Academia</h4>
            <ul className="space-y-3">
              {columns.academia.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-platinum transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Estudiantes */}
          <div>
            <h4 className="font-display text-xs font-semibold text-platinum mb-4 tracking-[0.2em] uppercase">Estudiantes</h4>
            <ul className="space-y-3">
              {columns.estudiantes.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-platinum transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display text-xs font-semibold text-platinum mb-4 tracking-[0.2em] uppercase">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:utamv.master@atomicmail.io" className="flex items-center gap-2 text-sm text-white/60 hover:text-platinum transition-colors">
                  <Mail className="w-4 h-4" />
                  utamv.master@atomicmail.io
                </a>
              </li>
              <li>
                <a href="mailto:tamvonlinenetwork@outlook.es" className="flex items-center gap-2 text-sm text-white/60 hover:text-platinum transition-colors">
                  <Mail className="w-4 h-4" />
                  tamvonlinenetwork@outlook.es
                </a>
              </li>
              <li>
                <a href="https://orcid.org/0009-0008-5050-1539" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/60 hover:text-platinum transition-colors">
                  <Globe className="w-4 h-4" />
                  ORCID Rector
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
            <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-platinum/20">
              <p className="text-[10px] text-platinum/70 uppercase tracking-wider mb-1">Dirección Académica</p>
              <p className="text-sm font-medium text-white">Edwin Oswaldo Castillo Trejo</p>
              <p className="text-xs text-white/60">Rector del Campus UTAMV</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-platinum/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} UTAMV – Universidad Tecnológica Avanzada del Marketing Virtual. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              {columns.legal.map((link, i) => (
                <a key={i} href={link.href} className="text-[10px] text-white/50 hover:text-platinum transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-[10px] text-platinum/40 mt-6 tracking-wider">
            Orgullosamente Realmontenses – Formando líderes digitales desde 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
