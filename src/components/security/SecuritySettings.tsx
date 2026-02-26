import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Fingerprint, Key, Smartphone, 
  CheckCircle2, AlertTriangle, Plus, Trash2,
  Lock, Eye, QrCode, RefreshCw, ShieldCheck,
  Monitor, Laptop, TabletSmartphone, Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWebAuthn } from "@/hooks/useWebAuthn";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SecuritySettings() {
  const {
    credentials,
    loading,
    registering,
    deleting,
    fetchCredentials,
    registerPasskey,
    deleteCredential,
    authenticateWithPasskey,
    setupTOTP,
    verifyTOTP
  } = useWebAuthn();

  const [deviceName, setDeviceName] = useState("");
  const [totpSecret, setTotpSecret] = useState<{ secret: string; uri: string } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [showTotpSetup, setShowTotpSetup] = useState(false);
  const [showPasskeyDialog, setShowPasskeyDialog] = useState(false);
  const [testingPasskey, setTestingPasskey] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleRegisterPasskey = async () => {
    if (!deviceName.trim()) {
      toast.error("Por favor ingresa un nombre para identificar este dispositivo");
      return;
    }
    const success = await registerPasskey(deviceName);
    if (success) {
      setDeviceName("");
      setShowPasskeyDialog(false);
      toast.success("¡Passkey registrada exitosamente!", {
        description: "Ahora puedes usar autenticación biométrica para iniciar sesión"
      });
    }
  };

  const handleDeleteCredential = async (credentialId: string) => {
    await deleteCredential(credentialId);
  };

  const handleTestPasskey = async () => {
    setTestingPasskey(true);
    try {
      const success = await authenticateWithPasskey();
      if (success) {
        toast.success("¡Autenticación exitosa!", {
          description: "Tu passkey funciona correctamente"
        });
      }
    } finally {
      setTestingPasskey(false);
    }
  };

  const handleSetupTOTP = async () => {
    const result = await setupTOTP();
    if (result) {
      setTotpSecret(result);
      setShowTotpSetup(true);
    }
  };

  const handleVerifyTOTP = async () => {
    const success = await verifyTOTP(totpCode);
    if (success) {
      setShowTotpSetup(false);
      setTotpCode("");
      setTotpSecret(null);
      toast.success("¡TOTP configurado exitosamente!");
    }
  };

  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName.toLowerCase();
    if (name.includes("mobile") || name.includes("phone") || name.includes("iphone") || name.includes("android")) {
      return TabletSmartphone;
    }
    if (name.includes("laptop") || name.includes("macbook")) {
      return Laptop;
    }
    return Monitor;
  };

  const webauthnCredentials = credentials.filter(c => c.credential_type === 'webauthn');
  const totpCredentials = credentials.filter(c => c.credential_type === 'totp');
  const securityScore = (webauthnCredentials.length > 0 ? 40 : 0) + (totpCredentials.length > 0 ? 40 : 0) + 20;

  return (
    <div className="space-y-6">
      {/* Security Header */}
      <div className="flex items-center gap-4">
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Shield className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum">
            Protocolo OMEGA
          </h2>
          <p className="text-muted-foreground">
            Seguridad avanzada WebAuthn + MFA
          </p>
        </div>
      </div>

      {/* Security Score */}
      <Card className="glass-effect border-primary/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Puntuación de Seguridad
          </h3>
          <Badge className={`text-lg px-4 py-1 ${
            securityScore >= 80 ? 'bg-emerald-500' : 
            securityScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
          }`}>
            {securityScore}/100
          </Badge>
        </div>
        
        <div className="h-3 rounded-full bg-muted overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${securityScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${
              securityScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 
              securityScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 
              'bg-gradient-to-r from-red-500 to-red-400'
            }`}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border transition-all ${
            webauthnCredentials.length > 0 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="w-5 h-5" />
              <span className="font-medium">Passkeys</span>
              {webauthnCredentials.length > 0 && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {webauthnCredentials.length > 0 
                ? `${webauthnCredentials.length} dispositivo(s) registrado(s)`
                : 'No configurado (+40 pts)'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border transition-all ${
            totpCredentials.length > 0 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">TOTP/2FA</span>
              {totpCredentials.length > 0 && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {totpCredentials.length > 0 ? 'Activo' : 'No configurado (+40 pts)'}
            </p>
          </div>

          <div className="p-4 rounded-lg border bg-primary/10 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Cifrado</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Post-Cuántico (Dilithium-5)
            </p>
          </div>
        </div>
      </Card>

      {/* WebAuthn / Passkeys */}
      <Card className="glass-effect border-primary/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-bold">Passkeys (WebAuthn)</h3>
              <p className="text-sm text-muted-foreground">
                Autenticación biométrica sin contraseñas
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-5 h-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Las Passkeys usan la seguridad biométrica de tu dispositivo (huella, Face ID) para autenticarte sin necesidad de contraseñas.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Existing Credentials */}
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {webauthnCredentials.map((cred) => {
              const DeviceIcon = getDeviceIcon(cred.device_name || '');
              return (
                <motion.div
                  key={cred.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <DeviceIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{cred.device_name || 'Passkey'}</p>
                      <p className="text-xs text-muted-foreground">
                        Registrado: {new Date(cred.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {cred.last_used_at && (
                          <> • Último uso: {new Date(cred.last_used_at).toLocaleDateString('es-MX')}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cred.is_primary && (
                      <Badge className="bg-primary/20 text-primary">Principal</Badge>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/20"
                          disabled={deleting === cred.id}
                        >
                          {deleting === cred.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-effect border-destructive/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-destructive" />
                            Eliminar Passkey
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de eliminar "{cred.device_name || 'Passkey'}"? 
                            No podrás usar este dispositivo para iniciar sesión.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCredential(cred.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {webauthnCredentials.length === 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground border border-dashed border-primary/20 rounded-lg"
            >
              <Fingerprint className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No tienes passkeys registradas</p>
              <p className="text-sm mt-1">Registra una para acceder de forma segura y sin contraseñas</p>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Dialog open={showPasskeyDialog} onOpenChange={setShowPasskeyDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-quantum hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Nueva Passkey
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect border-primary/30">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-primary" />
                  Registrar Passkey
                </DialogTitle>
                <DialogDescription>
                  Asigna un nombre a este dispositivo para identificarlo fácilmente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre del dispositivo</label>
                  <Input
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="Ej: Mi iPhone, Laptop trabajo, MacBook personal..."
                    className="glass-effect border-primary/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Usa un nombre descriptivo para identificar este dispositivo
                  </p>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">¿Qué sucederá?</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Tu navegador te pedirá verificación biométrica</li>
                    <li>• Se creará una clave segura única para este dispositivo</li>
                    <li>• Podrás iniciar sesión sin contraseña usando esta passkey</li>
                  </ul>
                </div>

                <Button
                  onClick={handleRegisterPasskey}
                  disabled={registering || !deviceName.trim()}
                  className="w-full bg-gradient-quantum hover:opacity-90"
                >
                  {registering ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Registrando...
                    </motion.div>
                  ) : (
                    <>
                      <Fingerprint className="w-5 h-5 mr-2" />
                      Registrar Passkey
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {webauthnCredentials.length > 0 && (
            <Button
              variant="outline"
              onClick={handleTestPasskey}
              disabled={testingPasskey}
              className="border-primary/30 hover:bg-primary/20"
            >
              {testingPasskey ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                </motion.div>
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              Probar Passkey
            </Button>
          )}
        </div>
      </Card>

      {/* TOTP / 2FA */}
      <Card className="glass-effect border-primary/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-bold">Autenticador (TOTP)</h3>
              <p className="text-sm text-muted-foreground">
                Códigos temporales con Google Authenticator o similar
              </p>
            </div>
          </div>
        </div>

        {totpCredentials.length > 0 ? (
          <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>TOTP configurado y activo</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400">Protegido</Badge>
          </div>
        ) : showTotpSetup && totpSecret ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background/50 border border-primary/20 text-center">
              <QrCode className="w-24 h-24 mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground mb-2">
                Escanea con tu app de autenticación
              </p>
              <code className="text-xs font-mono bg-background/80 px-3 py-1 rounded break-all">
                {totpSecret.secret}
              </code>
            </div>
            
            <div className="flex gap-3">
              <Input
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Ingresa el código de 6 dígitos"
                maxLength={6}
                className="glass-effect border-primary/30 text-center text-2xl tracking-widest"
              />
              <Button
                onClick={handleVerifyTOTP}
                disabled={totpCode.length !== 6}
                className="bg-gradient-quantum"
              >
                Verificar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleSetupTOTP}
            variant="outline"
            className="w-full border-primary/30 hover:bg-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Configurar Autenticador
          </Button>
        )}
      </Card>

      {/* Security Recommendations */}
      <Card className={`glass-effect p-6 transition-all ${
        securityScore >= 80 
          ? 'border-emerald-500/20' 
          : 'border-amber-500/20'
      }`}>
        <div className="flex items-start gap-3">
          {securityScore >= 80 ? (
            <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
          )}
          <div>
            <h3 className={`font-bold mb-2 ${
              securityScore >= 80 ? 'text-emerald-500' : 'text-amber-500'
            }`}>
              {securityScore >= 80 ? '¡Excelente Seguridad!' : 'Recomendaciones de Seguridad'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {webauthnCredentials.length === 0 && (
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Registra al menos 1 passkey para autenticación sin contraseña
                </li>
              )}
              {webauthnCredentials.length === 1 && (
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Registra una passkey adicional como respaldo
                </li>
              )}
              {totpCredentials.length === 0 && (
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Configura TOTP como método de respaldo
                </li>
              )}
              {securityScore >= 80 && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Tu cuenta tiene protección avanzada activa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Revisa periódicamente los dispositivos autorizados
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
