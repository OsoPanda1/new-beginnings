import {
  Check,
  Sparkles,
  Shield,
  Clock,
  Award,
  Users,
  FileText,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import studentsCelebrating from "@/assets/students-celebrating.jpg";

const PricingSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    { icon: FileText, text: "10 módulos estructurados con lecciones guiadas y audio narrado por IA" },
    { icon: Clock, text: "+50 horas de formación aplicada en marketing digital" },
    { icon: Award, text: "Certificación UTAMV con validación académica y verificación por QR" },
    { icon: Users, text: "Acceso a la comunidad privada de profesionales y egresados" },
    { icon: Headphones, text: "Acompañamiento académico y soporte en español" },
    { icon: Shield, text: "Acceso vitalicio al programa y a sus actualizaciones" },
    { icon: Sparkles, text: "Actualizaciones UTAMV 2026–2027 incluidas sin costo adicional" },
    { icon: Check, text: "Proyecto final guiado con casos y contextos reales" },
  ];

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Inicia sesión para continuar",
          description: "Necesitas una cuenta UTAMV para completar tu inscripción.",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: { origin: window.location.origin },
        },
      );

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast({
        title: "No se pudo iniciar el pago",
        description: "Inténtalo de nuevo en unos minutos o contacta a soporte UTAMV.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="inscripcion"
      className="py-24 bg-gradient-to-b from-background to-navy-medium/30 relative overflow-hidden"
    >
      {/* Background académico */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-15">
        <img
          src={studentsCelebrating}
          alt="Estudiantes celebrando su certificación"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Encabezado */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-silver/18 text-silver text-xs md:text-sm font-semibold tracking-[0.22em] uppercase mb-4">
            Inversión Única • Cohorte Fundadora
          </span>
          <h2 className="section-title">
            Tu decisión de hoy marca la dirección de tu carrera
          </h2>
          <p className="section-subtitle mt-3">
            UTAMV Campus Online | Ficha académica estándar 
          </p>
        </div>

        {/* Tarjeta de pricing */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Glow plateado */}
            <div className="absolute -inset-1 bg-gradient-to-r from-silver-primary via-teal-primary to-silver-primary rounded-3xl blur-lg opacity-50 animate-pulse-silver" />

            <div className="relative bg-card rounded-3xl border-2 border-silver-primary/60 overflow-hidden card-elite">
              {/* Header */}
              <div className="bg-gradient-to-r from-silver-primary/18 via-teal-primary/10 to-silver-primary/18 p-8 text-center border-b border-border">
                <span className="inline-block px-4 py-1 rounded-full bg-silver-primary text-primary-foreground text-xs md:text-sm font-bold tracking-[0.22em] uppercase mb-4">
                  Inscripciones de acceso al Campus
                </span>
                <h3 className="font-display text-3xl font-bold mb-2 text-foreground">
                  Master 2.0 Community Manager NextGen 2026
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Máster en Marketing Digital • Edición 2026
                </p>
              </div>

              {/* Precio */}
              <div className="p-8 text-center border-b border-border">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl text-muted-foreground line-through">
                    $499 USD
                  </span>
                  <span className="px-2 py-1 rounded bg-teal-primary/20 text-teal-primary text-xs md:text-sm font-bold">
                    Beca lanzamiento -60%
                  </span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl md:text-6xl font-display font-bold text-gradient-silver">
                    $199
                  </span>
                  <span className="text-xl text-muted-foreground">USD</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Validacion en CV • Respaldo Academico • Certificación incluida
                </p>
              </div>

              {/* Beneficios */}
              <div className="p-8">
                <div className="grid gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-silver-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-4 h-4 text-silver-primary" />
                      </div>
                      <span className="text-sm text-foreground">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="p-8 pt-0">
                <Button
                  variant="elite"
                  size="xl"
                  className="w-full text-base md:text-lg py-5 md:py-6"
                  onClick={handleEnroll}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Confirmar mi plaza en la cohorte 2026 – $199 USD
                    </>
                  )}
                </Button>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-primary" />
                    <span>Inscripciones seguras con plataformas internacionales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-primary" />
                    <span>Garantías de Educacion Profesional NextGen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confianza */}
        <div className="mt-16 text-center">
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            Métodos de pago aceptados
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 items-center opacity-75 text-xs md:text-sm">
            <div className="px-4 py-2 rounded-lg bg-card border border-border font-medium">
              💳 Visa
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border font-medium">
              💳 Mastercard
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border font-medium">
              💳 American Express
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border font-medium">
              🏦 PayPal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
