import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Award, Users, Star, PlayCircle } from "lucide-react";
import universityHero from "@/assets/university-hero.jpg";

export default function University() {
  const [_user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    supabase.auth.getSession().then(({ data: { session } }) => 
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const courses = [
    { id: 1, title: "Arquitectura Quantum", instructor: "Dr. Valentinus", level: "Avanzado", students: 1247, rating: 4.9, image: "/src/assets/future-city.webp" },
    { id: 2, title: "DreamSpaces Creation", instructor: "Isabella AI™", level: "Intermedio", students: 2891, rating: 5.0, image: "/src/assets/dreamspace-hero.webp" },
    { id: 3, title: "Sensorial Immersion", instructor: "Phoenix Protocol", level: "Principiante", students: 3456, rating: 4.8, image: "/src/assets/metaverse-city.webp" },
    { id: 4, title: "IA Emocional Ética", instructor: "Anubis Sentinel", level: "Avanzado", students: 987, rating: 4.9, image: "/src/assets/hero-tech.webp" },
    { id: 5, title: "Economía Cuántica", instructor: "Cattleya Protocol", level: "Intermedio", students: 1567, rating: 4.7, image: "/src/assets/gallery-preview.webp" },
    { id: 6, title: "XR Development", instructor: "TAMV Core Team", level: "Avanzado", students: 2134, rating: 4.9, image: "/src/assets/future-city.webp" },
  ];

  const certifications = [
    { id: 1, name: "Quantum Developer Certified", icon: Award },
    { id: 2, name: "DreamSpace Architect", icon: Star },
    { id: 3, name: "Sensorial Designer", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-dark to-background">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 overflow-hidden"
      >
        <img
          src={universityHero}
          alt="University Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full glow-quantum mb-6">
              <GraduationCap className="w-5 h-5 text-primary-glow animate-pulse" />
              <span className="text-sm font-orbitron text-foreground/80">TAMV UNIVERSITY™</span>
            </div>
            <h1 className="text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-quantum mb-4 drop-shadow-lg">
              Academia Multisensorial
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Aprende a crear experiencias inmersivas, desarrollar IA consciente y diseñar economías cuánticas
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Estudiantes Activos", value: "12.4K+", icon: Users },
            { label: "Cursos Premium", value: "47", icon: BookOpen },
            { label: "Certificaciones", value: "15", icon: Award },
            { label: "Rating Promedio", value: "4.9", icon: Star },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-effect p-6 text-center border-primary/20 hover:border-primary/40 transition-all">
                <stat.icon className="w-8 h-8 text-accent-glow mx-auto mb-3" />
                <div className="text-3xl font-orbitron font-bold text-gradient-quantum">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-orbitron font-bold text-foreground mb-8">Cursos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-effect overflow-hidden border-primary/20 hover:border-accent/60 transition-all group cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-quantum">{course.level}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-accent-glow" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-orbitron font-bold text-foreground mb-2 group-hover:text-accent-glow transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Por {course.instructor}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-gradient-quantum" size="sm">
                      Inscribirse
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-orbitron font-bold text-foreground mb-8">Certificaciones Oficiales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-effect p-8 text-center border-accent/30 hover:border-accent hover:shadow-glow transition-all">
                  <cert.icon className="w-16 h-16 text-accent-glow mx-auto mb-4" />
                  <h3 className="text-lg font-orbitron font-bold text-foreground">{cert.name}</h3>
                  <Button variant="outline" className="mt-4 border-accent/50">
                    Ver Detalles
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-12 text-center border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10"
        >
          <h2 className="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-quantum mb-4">
            ¿Listo para Evolucionar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a la primera academia multisensorial del metaverso y conviértete en arquitecto del futuro digital
          </p>
          <Button size="lg" className="bg-gradient-quantum px-12 py-6 text-lg font-orbitron">
            <GraduationCap className="w-6 h-6 mr-2" />
            Comenzar Ahora
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
