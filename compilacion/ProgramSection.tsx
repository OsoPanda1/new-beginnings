import { Target, Brain, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import analyticsDashboard from '@/assets/analytics-dashboard.jpg';

const ProgramSection = () => {
  const pillars = [
    {
      icon: Target,
      title: 'SEO Avanzado',
      description: 'Domina la indexación inteligente y optimización semántica con IA.',
    },
    {
      icon: Brain,
      title: 'Metadatos Estratégicos',
      description: 'Arquitectura de información que posiciona tu marca en el ecosistema digital.',
    },
    {
      icon: Zap,
      title: 'Geo-Targeting',
      description: 'Conecta con clientes locales y aparece en búsquedas geolocalizadas.',
    },
    {
      icon: TrendingUp,
      title: 'Marketing Predictivo',
      description: 'Automatización y campañas impulsadas por inteligencia artificial.',
    },
  ];

  return (
    <section id="programa" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-silver/20 text-silver text-sm font-medium mb-4">
              Sobre el Programa
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Formamos </span>
              <span className="text-gradient-silver">Líderes Digitales</span>
              <span className="text-foreground"> del Futuro</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              El Master Elite Profesional en Marketing Digital 2026 es el primer programa 
              internacional de su clase nacido desde Latinoamérica. Combinamos la excelencia 
              académica con tecnología de vanguardia para prepararte como líder del marketing 
              del futuro.
            </p>

            {/* Pillars Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {pillars.map((pillar, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-xl bg-card/50 border border-border hover:border-silver/30 transition-all duration-300 hover:shadow-silver group"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-silver/10">
                    <pillar.icon className="w-6 h-6 text-silver" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground group-hover:text-silver transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-silver/20 via-teal/10 to-silver/20 rounded-3xl blur-xl opacity-30" />
            
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-card">
              <img 
                src={analyticsDashboard} 
                alt="Panel de Analytics Marketing Digital"
                className="w-full h-auto"
              />
              
              {/* Overlay stats */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-silver">97%</p>
                    <p className="text-xs text-muted-foreground">Empleabilidad</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-teal">4.9★</p>
                    <p className="text-xs text-muted-foreground">Satisfacción</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-foreground">2026</p>
                    <p className="text-xs text-muted-foreground">Actualizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
