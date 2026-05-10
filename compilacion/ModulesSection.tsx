import { useState } from 'react';
import { ChevronRight, Clock, FileText, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

import module1 from '@/assets/module-1.jpg';
import module2 from '@/assets/module-2.jpg';
import module3 from '@/assets/module-3.jpg';
import module4 from '@/assets/module-4.jpg';
import module5 from '@/assets/module-5.jpg';
import module6 from '@/assets/module-6.jpg';
import module7 from '@/assets/module-7.jpg';
import module8 from '@/assets/module-8.jpg';
import module9 from '@/assets/module-9.jpg';
import module10 from '@/assets/module-10.jpg';

const modules = [
  {
    id: 1,
    title: 'Fundamentos del Marketing Digital 2026',
    description:
      'Historia, evolución y tendencias. Rol de los metadatos en la nueva era digital.',
    image: module1,
    duration: '5 horas',
    lessons: 12,
  },
  {
    id: 2,
    title: 'SEO Avanzado con IA',
    description:
      'Indexación inteligente, optimización semántica y predictiva con inteligencia artificial.',
    image: module2,
    duration: '6 horas',
    lessons: 15,
  },
  {
    id: 3,
    title: 'Geo-Targeting y Localización Estratégica',
    description:
      'Cómo aparecer en búsquedas locales e integración con mapas y clientes cercanos.',
    image: module3,
    duration: '4 horas',
    lessons: 10,
  },
  {
    id: 4,
    title: 'Metadatos y Arquitectura de Información',
    description:
      'Diseño de etiquetas únicas y estrategias de visibilidad en ecosistemas digitales.',
    image: module4,
    duration: '5 horas',
    lessons: 13,
  },
  {
    id: 5,
    title: 'Clientes en Respuestas de IA',
    description:
      'Integración de bases de datos de clientes y técnicas para aparecer en búsquedas personalizadas.',
    image: module5,
    duration: '5 horas',
    lessons: 11,
  },
  {
    id: 6,
    title: 'Marketing Predictivo y Automatización',
    description:
      'IA como motor de campañas y automatización ceremonial y transparente.',
    image: module6,
    duration: '6 horas',
    lessons: 14,
  },
  {
    id: 7,
    title: 'Narrativas Digitales y Branding 2026',
    description:
      'Construcción de identidad sólida y storytelling con metadatos.',
    image: module7,
    duration: '4 horas',
    lessons: 9,
  },
  {
    id: 8,
    title: 'Estrategias Multicanal y Metaverso',
    description:
      'SEO en XR, entornos inmersivos y marketing en ecosistemas híbridos.',
    image: module8,
    duration: '5 horas',
    lessons: 12,
  },
  {
    id: 9,
    title: 'Monetización y Transparencia',
    description:
      'Modelos de negocio éticos. UTAMV como garante de confianza.',
    image: module9,
    duration: '4 horas',
    lessons: 10,
  },
  {
    id: 10,
    title: 'Proyecto Final: Master en Acción',
    description:
      'Caso práctico con clientes reales. Integración de todo lo aprendido.',
    image: module10,
    duration: '6 horas',
    lessons: 8,
  },
];

const ModulesSection = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  return (
    <section
      id="modulos"
      className="py-24 bg-gradient-to-b from-background to-navy-medium/50"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-teal/20 text-teal text-sm font-medium mb-4">
            Plan de Estudios
          </span>
          <h2 className="section-title">10 Módulos de Élite</h2>
          <p className="section-subtitle">
            Cada módulo está diseñado con los más altos estándares académicos
            internacionales. Texto + audio narrado por IA para una experiencia
            de aprendizaje inmersiva.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="module-card cursor-pointer group"
              onMouseEnter={() => setActiveModule(module.id)}
              onMouseLeave={() => setActiveModule(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-48 h-40 md:h-auto overflow-hidden">
                  <img
                    src={module.image}
                    alt={module.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />

                  {/* Module Number */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-silver flex items-center justify-center font-display font-bold text-primary-foreground shadow-silver">
                    {module.id}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <h3 className="font-display text-lg font-semibold mb-2 text-foreground group-hover:text-silver transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {module.lessons} lecciones
                    </span>
                    <span className="flex items-center gap-1 text-silver">
                      <Lock className="w-3 h-3" />
                      Incluido en Master Elite
                    </span>
                  </div>

                  {/* Hover Action */}
                  <div
                    className={`mt-4 flex items-center gap-2 text-teal transition-all duration-300 ${
                      activeModule === module.id
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Vista previa disponible
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exam Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="card-elite p-8 text-center">
            <h3 className="font-display text-2xl font-bold text-gradient-silver mb-4">
              Sistema de Evaluación
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-muted/30 border border-border">
                <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-teal" />
                </div>
                <h4 className="font-semibold mb-2">Exámenes por Módulo</h4>
                <p className="text-sm text-muted-foreground">
                  10 preguntas de opción múltiple + 1 ejercicio práctico al
                  final de cada módulo.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-silver/10 border border-silver/30">
                <div className="w-12 h-12 rounded-full bg-silver/20 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-silver" />
                </div>
                <h4 className="font-semibold mb-2">Examen Final</h4>
                <p className="text-sm text-muted-foreground">
                  50 preguntas globales + Proyecto práctico con validación
                  UTAMV.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button variant="elite" size="xl" asChild>
            <a href="#inscripcion">
              Acceder al Programa Completo
              <ChevronRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
