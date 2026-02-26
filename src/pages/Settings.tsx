import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, Bell, Palette, Volume2, 
  Globe, Smartphone, Shield, Moon, Sun, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import SecuritySettings from "@/components/security/SecuritySettings";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
    vibration: true,
    autoplay: false,
    reducedMotion: false,
    highContrast: false,
    language: "es",
    timezone: "America/Mexico_City",
    soundVolume: 70,
    hapticIntensity: 50,
  });

  const handleSave = () => {
    toast.success("Configuración guardada exitosamente");
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-orbitron text-3xl font-bold">Configuración</h1>
              <p className="text-muted-foreground">Personaliza tu experiencia TAMV</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 crystal-glass">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="privacy">Privacidad</TabsTrigger>
            <TabsTrigger value="sensory">Sensorial</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="crystal-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Apariencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Tema</Label>
                      <p className="text-sm text-muted-foreground">Selecciona el tema de la interfaz</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="w-4 h-4 mr-1" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="w-4 h-4 mr-1" />
                        Dark
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Reducir Movimiento</Label>
                      <p className="text-sm text-muted-foreground">Desactiva animaciones complejas</p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(v) => setSettings({...settings, reducedMotion: v})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Alto Contraste</Label>
                      <p className="text-sm text-muted-foreground">Mejora la visibilidad</p>
                    </div>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(v) => setSettings({...settings, highContrast: v})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="crystal-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Idioma y Región
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Select value={settings.language} onValueChange={(v) => setSettings({...settings, language: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Zona Horaria</Label>
                      <Select value={settings.timezone} onValueChange={(v) => setSettings({...settings, timezone: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Mexico_City">México (CDMX)</SelectItem>
                          <SelectItem value="America/New_York">New York</SelectItem>
                          <SelectItem value="Europe/Madrid">Madrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="crystal-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificaciones
                  </CardTitle>
                  <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { id: "push", label: "Notificaciones Push", desc: "Recibe alertas en tiempo real" },
                    { id: "email", label: "Email", desc: "Resúmenes y actualizaciones importantes" },
                    { id: "resonance", label: "Resonancias", desc: "Cuando alguien resuena con tu contenido" },
                    { id: "messages", label: "Mensajes", desc: "Nuevos mensajes y chats" },
                    { id: "lives", label: "Lives", desc: "Cuando creadores que sigues inician un live" },
                    { id: "marketplace", label: "Marketplace", desc: "Ofertas y transacciones" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SecuritySettings />
            </motion.div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="crystal-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacidad y Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { id: "profile", label: "Perfil Público", desc: "Permite que otros usuarios vean tu perfil" },
                    { id: "activity", label: "Mostrar Actividad", desc: "Muestra tu actividad en el ecosistema" },
                    { id: "online", label: "Mostrar Estado Online", desc: "Indica cuando estás conectado" },
                    { id: "data", label: "Recopilar Datos Anónimos", desc: "Ayuda a mejorar TAMV" },
                    { id: "2fa", label: "Autenticación 2FA", desc: "Añade una capa extra de seguridad" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.id !== "2fa"} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Sensory Settings */}
          <TabsContent value="sensory">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="crystal-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Audio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Sonidos del Sistema</Label>
                      <p className="text-sm text-muted-foreground">Efectos de sonido UI</p>
                    </div>
                    <Switch
                      checked={settings.sounds}
                      onCheckedChange={(v) => setSettings({...settings, sounds: v})}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Volumen General</Label>
                      <span className="text-sm text-muted-foreground">{settings.soundVolume}%</span>
                    </div>
                    <Slider
                      value={[settings.soundVolume]}
                      onValueChange={([v]) => setSettings({...settings, soundVolume: v})}
                      max={100}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Autoplay Media</Label>
                      <p className="text-sm text-muted-foreground">Reproduce contenido automáticamente</p>
                    </div>
                    <Switch
                      checked={settings.autoplay}
                      onCheckedChange={(v) => setSettings({...settings, autoplay: v})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="crystal-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Háptico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Vibración</Label>
                      <p className="text-sm text-muted-foreground">Feedback táctil</p>
                    </div>
                    <Switch
                      checked={settings.vibration}
                      onCheckedChange={(v) => setSettings({...settings, vibration: v})}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Intensidad Háptica</Label>
                      <span className="text-sm text-muted-foreground">{settings.hapticIntensity}%</span>
                    </div>
                    <Slider
                      value={[settings.hapticIntensity]}
                      onValueChange={([v]) => setSettings({...settings, hapticIntensity: v})}
                      max={100}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
