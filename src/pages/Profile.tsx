import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Edit2, Image as ImageIcon, Eye, Camera, Settings, Award, Zap, 
  Upload, Save, X, Globe, Lock, Bell, Moon, Sun, Palette, Shield,
  User, Mail, Link as LinkIcon, CheckCircle2, Loader2, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ImmersiveBackground from '@/components/ImmersiveBackground';
import SecuritySettings from '@/components/security/SecuritySettings';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  verified: boolean;
  resonance_score: number;
  credits_balance: number;
}

interface EditForm {
  username: string;
  full_name: string;
  bio: string;
  location: string;
  website: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ 
    username: '', 
    full_name: '',
    bio: '', 
    location: '',
    website: ''
  });
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [stats, setStats] = useState({ posts: 0, artworks: 0, dreamspaces: 0 });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    publicProfile: true,
    showLocation: true,
    emailNotifications: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      navigate('/auth');
      return;
    }
    setUser(authUser);
    
    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (profileData) {
      setProfile(profileData as Profile);
      setEditForm({
        username: profileData.username || '',
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || ''
      });
    }

    // Load stats
    const [postsResult, artworksResult, dreamspacesResult] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', authUser.id),
      supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('user_id', authUser.id),
      supabase.from('dreamspaces').select('id', { count: 'exact', head: true }).eq('user_id', authUser.id)
    ]);

    setStats({
      posts: postsResult.count || 0,
      artworks: artworksResult.count || 0,
      dreamspaces: dreamspacesResult.count || 0
    });

    setLoaded(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          full_name: editForm.full_name,
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
      await loadUserData();
    } catch (error) {
      toast.error('Error al actualizar perfil');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl + '?t=' + Date.now() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Avatar actualizado');
      await loadUserData();
    } catch (error) {
      toast.error('Error al subir avatar');
      console.error(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (!loaded) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-primary" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      <ImmersiveBackground />
      
      {/* Hero Banner */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-primary via-primary-glow to-accent relative overflow-hidden">
          <div className="absolute inset-0 opacity-60">
            <motion.div 
              className="absolute w-[440px] h-[440px] bg-accent/40 blur-3xl rounded-full left-[-120px] top-[-120px]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute w-64 h-64 bg-secondary/30 blur-2xl rounded-full right-10 top-1/4"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 flex flex-col md:flex-row gap-6 items-center md:items-end">
          {/* Avatar */}
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="relative"
          >
            <div className="absolute inset-0 -m-6 pointer-events-none">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute w-full h-full border-2 border-accent/30 rounded-full" />
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-accent rounded-full -translate-x-1/2" />
              </motion.div>
            </div>
            <div className="relative w-48 h-48 rounded-full border-4 border-accent bg-gradient-to-br from-accent to-secondary shadow-glow overflow-hidden">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.username} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white bg-gradient-quantum">
                  {profile?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              
              <Button 
                size="icon" 
                className="absolute bottom-2 right-2 w-10 h-10 bg-accent hover:bg-accent/80"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center md:items-start">
              <div>
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <h1 className="text-4xl font-bold text-foreground">{profile?.username || 'Usuario'}</h1>
                  {profile?.verified && (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  )}
                  <Badge className="bg-gradient-to-r from-accent to-secondary text-white px-4 py-2">
                    <Award className="w-4 h-4 mr-1" />
                    Free
                  </Badge>
                </div>
                {profile?.full_name && (
                  <p className="text-lg text-muted-foreground mb-1">{profile.full_name}</p>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2 justify-center md:justify-start">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <p className="text-foreground max-w-2xl">{profile?.bio || 'Miembro TAMV MD-X4™ quantum-social.'}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="bg-gradient-quantum hover:opacity-90"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-foreground hover:bg-primary/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 justify-center md:justify-start text-center">
              <motion.div whileHover={{ scale: 1.1 }}>
                <div className="text-2xl font-bold text-accent">{stats.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <div className="text-2xl font-bold text-secondary">{profile?.credits_balance?.toFixed(0) || 0}</div>
                <div className="text-sm text-muted-foreground">Credits</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <div className="text-2xl font-bold text-accent-glow">{stats.artworks}</div>
                <div className="text-sm text-muted-foreground">Arte</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <div className="text-2xl font-bold text-primary">{stats.dreamspaces}</div>
                <div className="text-sm text-muted-foreground">DreamSpaces</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
          >
            <Card className="glass-effect border-accent/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Editar Perfil
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Nombre de usuario
                    </Label>
                    <Input 
                      value={editForm.username} 
                      onChange={e => setEditForm({ ...editForm, username: e.target.value })} 
                      className="glass-effect border-primary/30"
                      placeholder="@usuario"
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Nombre completo
                    </Label>
                    <Input 
                      value={editForm.full_name} 
                      onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} 
                      className="glass-effect border-primary/30"
                      placeholder="Tu nombre"
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Ubicación
                    </Label>
                    <Input 
                      value={editForm.location} 
                      onChange={e => setEditForm({ ...editForm, location: e.target.value })} 
                      placeholder="Ciudad, País" 
                      className="glass-effect border-primary/30"
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-4 h-4" />
                      Sitio web
                    </Label>
                    <Input 
                      value={editForm.website} 
                      onChange={e => setEditForm({ ...editForm, website: e.target.value })} 
                      placeholder="https://tusitio.com" 
                      className="glass-effect border-primary/30"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Edit2 className="w-4 h-4" />
                      Biografía
                    </Label>
                    <Textarea 
                      value={editForm.bio} 
                      onChange={e => setEditForm({ ...editForm, bio: e.target.value })} 
                      placeholder="Cuéntanos sobre ti..." 
                      className="glass-effect border-primary/30 min-h-[180px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {editForm.bio.length}/500 caracteres
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleSaveProfile} 
                  className="bg-gradient-quantum hover:opacity-90"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Guardar Cambios
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)} 
                  className="border-primary/30"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm border border-primary/20 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20">
              <Eye className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-primary/20">
              <ImageIcon className="w-4 h-4 mr-2" /> Media
            </TabsTrigger>
            <TabsTrigger value="dreamspaces" className="data-[state=active]:bg-primary/20">
              <Zap className="w-4 h-4 mr-2" /> DreamSpaces
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-primary/20">
              <Settings className="w-4 h-4 mr-2" /> Preferencias
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
              <Shield className="w-4 h-4 mr-2" /> Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 glass-effect border-primary/20">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm text-muted-foreground">
                      Bienvenido a TAMV MD-X4™. Tu cuenta está lista.
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Hoy</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 glass-effect border-primary/20">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  Logros
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-center"
                  >
                    <div className="text-2xl mb-1">🚀</div>
                    <p className="text-xs">Pionero</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-3 rounded-lg bg-muted/50 border border-muted text-center opacity-50"
                  >
                    <div className="text-2xl mb-1">🎨</div>
                    <p className="text-xs">Artista</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-3 rounded-lg bg-muted/50 border border-muted text-center opacity-50"
                  >
                    <div className="text-2xl mb-1">💎</div>
                    <p className="text-xs">Coleccionista</p>
                  </motion.div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="media">
            <Card className="p-6 glass-effect border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-6">Tu Galería</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Subir</p>
                </motion.div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="dreamspaces">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30 cursor-pointer">
                  <h3 className="text-lg font-bold text-foreground mb-2">Crea tu primer DreamSpace</h3>
                  <p className="text-muted-foreground text-sm mb-4">Construye experiencias inmersivas 3D/4D</p>
                  <Button className="bg-gradient-quantum" onClick={() => navigate('/dreamspaces')}>
                    <Zap className="w-4 h-4 mr-2" />
                    Crear Ahora
                  </Button>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="p-6 glass-effect border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Preferencias de Cuenta
              </h3>
              
              <div className="space-y-6">
                {/* Appearance */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Apariencia
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Modo Oscuro</p>
                          <p className="text-sm text-muted-foreground">Activar tema oscuro</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.darkMode}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Privacy */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Privacidad
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Perfil Público</p>
                          <p className="text-sm text-muted-foreground">Cualquiera puede ver tu perfil</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.publicProfile}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, publicProfile: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Mostrar Ubicación</p>
                          <p className="text-sm text-muted-foreground">Tu ubicación será visible</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.showLocation}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, showLocation: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notifications */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Notificaciones Push</p>
                          <p className="text-sm text-muted-foreground">Recibir notificaciones en el navegador</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.notifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Notificaciones por Email</p>
                          <p className="text-sm text-muted-foreground">Recibir actualizaciones por correo</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="bg-gradient-quantum">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Preferencias
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
