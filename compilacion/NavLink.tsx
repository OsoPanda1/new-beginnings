import { useState, forwardRef } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  LayoutDashboard,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  NavLink as RouterNavLink,
  NavLinkProps,
} from "react-router-dom";
import { cn } from "@/lib/utils";

/* -------------------- NavLink compat -------------------- */

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            "inline-flex items-center gap-2 text-sm transition-colors",
            className,
            isPending && pendingClassName,
            isActive && activeClassName,
          )
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

/* -------------------- Academic accordion nav -------------------- */

type SectionId = "programa" | "formacion" | "comunidad" | "gestion";

const sections: {
  id: SectionId;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: { to: string; label: string; description?: string }[];
}[] = [
  {
    id: "programa",
    label: "Programa Académico",
    icon: GraduationCap,
    items: [
      {
        to: "/programa",
        label: "Visión general",
        description: "Estructura del máster y objetivos formativos",
      },
      {
        to: "/modulos",
        label: "Plan de estudios",
        description: "Detalle de los 10 módulos de formación",
      },
    ],
  },
  {
    id: "formacion",
    label: "Formación y Certificación",
    icon: BookOpen,
    items: [
      {
        to: "/metodologia",
        label: "Metodología UTAMV",
        description: "Modelo de aprendizaje y evaluación continua",
      },
      {
        to: "/certificacion",
        label: "Certificación UTAMV",
        description: "Criterios, rúbricas y validación por QR",
      },
      {
        to: "/recursos",
        label: "Recursos académicos",
        description: "Materiales, guías y bibliografía recomendada",
      },
    ],
  },
  {
    id: "comunidad",
    label: "Comunidad y Acompañamiento",
    icon: Users,
    items: [
      {
        to: "/expertos",
        label: "Claustro académico",
        description: "Expertos y mentores del programa",
      },
      {
        to: "/comunidad",
        label: "Comunidad UTAMV",
        description: "Red de estudiantes y egresados",
      },
      {
        to: "/soporte",
        label: "Soporte y tutoría",
        description: "Acompañamiento humano e IA",
      },
    ],
  },
  {
    id: "gestion",
    label: "Gestión Académica",
    icon: LayoutDashboard,
    items: [
      {
        to: "/dashboard",
        label: "Mi Dashboard",
        description: "Progreso, exámenes y certificados",
      },
      {
        to: "/documentos",
        label: "Documentos oficiales",
        description: "Reglamento, términos y políticas",
      },
      {
        to: "/verificacion",
        label: "Verificación de títulos",
        description: "Consulta pública de certificados UTAMV",
      },
    ],
  },
];

const AcademicAccordionNav = () => {
  const [openSection, setOpenSection] = useState<SectionId | null>("programa");

  const toggleSection = (id: SectionId) => {
    setOpenSection((current) => (current === id ? null : id));
  };

  return (
    <nav className="w-full space-y-2">
      {sections.map((section) => {
        const Icon = section.icon;
        const isOpen = openSection === section.id;

        return (
          <div
            key={section.id}
            className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden"
          >
            {/* Header de sección */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-left",
                "hover:bg-muted/60 transition-colors",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-silver-primary" />
                </div>
                <span className="font-display text-sm font-semibold text-foreground">
                  {section.label}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {/* Items */}
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <ul className="px-3 pb-3 space-y-1">
                  {section.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className="flex flex-col gap-0.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                        activeClassName="bg-muted/80 text-foreground border border-silver-primary/40"
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.description && (
                          <span className="text-[11px] text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export { NavLink, AcademicAccordionNav };
