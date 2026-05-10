import { Link } from "react-router-dom";
import { Award, ExternalLink, Globe } from "lucide-react";
import edwinCastillo from "@/assets/edwin-castillo.jpg";
import renataJazmin from "@/assets/renata-jazmin.jpg";
import aiAssistant from "@/assets/ai-assistant.jpg";
import campusLatinamerica from "@/assets/campus-latinamerica.jpg";

const InstructorsSection = () => {
  const instructors = [
    {
      name: "Dr. Edwin Oswaldo Castillo Trejo",
      role: "Rector Director, UTAMV Campus Online",
      Bio: Fundador y CEO de TAMV Online Network; Rector fundador de UTAMV",
      specialty: "Tecnologías Avanzadas Aplicadas a la Educación Digital y Ecosistemas Metaversales. Esto alinea con la misión de UTAMV como campus universitario online enfocado en formación profesional de alto nivel en entornos inmersivos y digitales.",
      expertise: "Expertise: Arquitecto de Ecosistemas Metaversales Digitales | +5 años liderando TAMV/UTAMV, AI-Blockchain, Educación Inmersiva, Seguridad Federada",
      image: edwinCastillo,
      orcid: "0009-0008-5050-1539",
      highlight:
        "Diseña arquitecturas de posicionamiento avanzado para empresas latinoamericanas con enfoque en datos y metadatos. Arquiecto Fullstack al mando del proyecto civilizatorio TAMV MD-X4 PRIMER ECOSISTEMA FEDERADO NATIVO XR, VR, 3D Y 4D A NIVEL MUNDIAL",
    },
    {
      name: "Renata Jazmin",
      role: "Co-Directora Académica",
      specialty: "CEO Fundadora – Orbita Digital",
      expertise: "Marketing Internacional y expansión de marcas en mercados globales",
      image: renataJazmin,
      highlight:
        "Ha liderado campañas de marketing digital con alcance en múltiples países de Latinoamérica y Europa.",
    },
    {
      name: "Isabella Villaseñor",
      role: "AI Course Guide",
      specialty: "Tutora Académica Virtual",
      expertise: "Narración guiada de lecciones y soporte académico 24/7",
      image: aiAssistant,
      isAI: true,
      highlight:
        "Acompaña tu progreso, narra las lecciones con voz femenina profesional y responde dudas frecuentes dentro del campus.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={campusLatinamerica}
          alt="Campus UTAMV Latinoamérica"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal/15 text-teal text-xs md:text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Cuerpo Académico UTAMV
          </span>
          <h2 className="section-title">
            Expertos de Clase Mundial, con ADN Latinoamericano
          </h2>
          <p className="section-subtitle">
            Tu formación está guiada por académicos, fundadores y una guía IA
            diseñada para acompañarte en cada módulo, con enfoque en la realidad
            del marketing digital en Latinoamérica.
          </p>
        </div>

        {/* Context strip */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="rounded-2xl border border-silver/30 bg-card/60 px-6 py-4 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1 text-left">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-1">
                Modelo académico
              </p>
              <p className="text-sm text-muted-foreground">
                El Máster combina dirección académica humana, experiencia
                empresarial real y una guía IA especializada, garantizando rigor
                profesional sin perder cercanía ni contexto latinoamericano.
              </p>
            </div>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {instructors.map((instructor, index) => (
            <article key={index} className="group text-center">
              <div className="relative mb-6 mx-auto w-48 h-48">
                {/* Glow */}
                <div
                  className={`absolute -inset-2 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 ${
                    instructor.isAI ? "bg-teal" : "bg-silver"
                  }`}
                />

                {/* Image */}
                <div
                  className={`relative w-full h-full rounded-full overflow-hidden border-4 ${
                    instructor.isAI ? "border-teal/60" : "border-silver/60"
                  } group-hover:border-silver transition-colors duration-300`}
                >
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Badge */}
                {instructor.isAI && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal text-foreground text-xs font-bold shadow-sm">
                    AI GUIDE
                  </div>
                )}
              </div>

              <h3 className="font-display text-xl font-semibold mb-1 text-foreground">
                {instructor.name}
              </h3>
              <p
                className={`text-sm font-medium mb-1 ${
                  instructor.isAI ? "text-teal" : "text-silver"
                }`}
              >
                {instructor.role}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                {instructor.specialty}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {instructor.expertise}
              </p>
              {instructor.highlight && (
                <p className="text-xs text-muted-foreground/80 italic max-w-xs mx-auto">
                  {instructor.highlight}
                </p>
              )}

              {/* ORCID */}
              {instructor.orcid && (
                <a
                  href={`https://orcid.org/${instructor.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-silver hover:text-foreground transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  ORCID: {instructor.orcid}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </article>
          ))}
        </div>

        {/* View More Link */}
        <div className="mt-12 text-center">
          <Link
            to="/expertos"
            className="inline-flex items-center gap-2 text-silver hover:text-foreground transition-colors font-medium text-sm"
          >
            Ver perfiles académicos completos
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Pride Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-card/60 border border-silver/40 backdrop-blur-sm">
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Nacido desde</p>
              <p className="font-display text-xl font-bold text-gradient-silver">
                Latinoamérica
              </p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Para el</p>
              <p className="font-display text-xl font-bold text-teal">
                Mundo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorsSection;
