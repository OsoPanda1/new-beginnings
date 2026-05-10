import { Shield, Award, Globe, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import certificatePreview from '@/assets/certificate-preview.png';
import hologramUtamv from '@/assets/hologram-utamv.jpg';
import certificationCeremony from '@/assets/certification-ceremony.jpg';

const CertificationSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Validación Académica',
      description: 'Diploma oficial con registro único y verificación pública UTAMV.',
    },
    {
      icon: Award,
      title: 'Holograma Institucional',
      description: 'Sello de autenticidad con tecnología anti-falsificación.',
    },
    {
      icon: Globe,
      title: 'Reconocimiento Internacional',
      description: 'Certificación válida en el ecosistema digital global.',
    },
    {
      icon: Star,
      title: 'Código Único',
      description: 'Identificador blockchain para verificación instantánea.',
    },
  ];

  return (
    <section id="certificacion" className="py-24 bg-gradient-to-b from-navy-medium/50 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <img 
          src={hologramUtamv} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-silver/20 text-silver text-sm font-medium mb-4">
            Acreditación Oficial
          </span>
          <h2 className="section-title">Certificación UTAMV</h2>
          <p className="section-subtitle">
            Tu diploma con validación académica internacional, holograma institucional 
            y código de verificación único.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Certificate Preview */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-silver/20 via-teal/10 to-silver/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            
            <div className="relative rounded-2xl overflow-hidden border-2 border-silver/30 shadow-silver animate-float">
              <img 
                src={certificatePreview} 
                alt="Certificado UTAMV Master Marketing Digital 2026"
                className="w-full h-auto"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-silver text-primary-foreground text-xs font-bold">
                MASTER 360 ELITE
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="font-display text-3xl font-bold mb-4 text-foreground">
                Diploma de <span className="text-gradient-silver">Excelencia</span>
              </h3>
              <p className="text-muted-foreground">
                Al completar exitosamente el Master Elite Profesional en Marketing Digital 2026, 
                recibirás un diploma solemne con todos los elementos de autenticidad académica.
              </p>
            </div>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border hover:border-silver/30 transition-all duration-300 hover:shadow-silver group"
                >
                  <div className="w-12 h-12 rounded-lg bg-silver/10 flex items-center justify-center shrink-0 group-hover:bg-silver/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-silver" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button variant="elite" size="lg" asChild>
                <a href="#inscripcion">
                  <Award className="w-5 h-5" />
                  Obtener Mi Certificación
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card/30 border border-border">
            <CheckCircle className="w-8 h-8 text-teal mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Verificación Pública</h4>
            <p className="text-sm text-muted-foreground">
              Cualquier empresa puede verificar tu certificado en línea.
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-card/30 border border-border">
            <Globe className="w-8 h-8 text-silver mx-auto mb-3" />
            <h4 className="font-semibold mb-2">LinkedIn Ready</h4>
            <p className="text-sm text-muted-foreground">
              Añade tu certificación directamente a tu perfil profesional.
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-card/30 border border-border">
            <Star className="w-8 h-8 text-teal mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Acceso Vitalicio</h4>
            <p className="text-sm text-muted-foreground">
              Tu certificado nunca expira. Válido de por vida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
