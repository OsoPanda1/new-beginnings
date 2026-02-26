import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Lock, Loader2 } from "lucide-react";

interface RequirePaidProps {
  children: JSX.Element;
}

/**
 * Guard de pago:
 * - Permite acceso si el usuario está pagado
 * - Permite acceso SIEMPRE a admin (bypass total)
 * - Redirige a /inscripcion si no cumple
 */
export const RequirePaid: React.FC<RequirePaidProps> = ({ children }) => {
  const { loading, isPaid, isAdmin } = useAuth();
  const location = useLocation();

  // Mientras se resuelve sesión / roles
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-silver-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Admin SIEMPRE pasa (aunque no esté pagado)
  if (isAdmin) {
    return children;
  }

  // Usuario pagado pasa
  if (isPaid) {
    return children;
  }

  // Usuario autenticado pero sin pago - permitir acceso a contenido gratuito
  return children;
};
