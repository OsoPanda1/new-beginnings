import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Edit2, Image as ImageIcon, Eye, Camera, Settings, Award, Zap } from 'lucide-react';
// AnimatePresence used below
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '', location: '' });
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

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
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (profileData) {
      setProfile(profileData);
      setEditForm({
        username: profileData.username || '',
        bio: profileData.bio || '',
        location: profileData.location || ''
      });
    }
    setLoaded(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update(editForm)
      .eq('id', user.id);
    
    if (error) {
      toast.error('Error al actualizar perfil');
    } else {
      toast.success('Perfil actualizado');
      setIsEditing(false);
      loadUserData();
    }
  };

  if (!loaded) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-primary via-primary-glow to-primary relative">
          <div className="absolute inset-0 opacity-60">
            <motion.div className="absolute w-[440px] h-[440px] bg-accent/40 blur-3xl rounded-full left-[-120px] top-[-120px] animate-pulse" />
            <motion.div className="absolute w-64 h-64 bg-secondary/30 blur-2xl rounded-full right-10 top-1/4 animate-pulse" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 flex flex-col md:flex-row gap-6 items-center md:items-end">
          <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="relative">
            <div className="absolute inset-0 -m-6 pointer-events-none">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                <div className="absolute w-full h-full border-2 border-accent/30 rounded-full" />
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-accent rounded-full -translate-x-1/2" />
              </motion.div>
            </div>
            <div className="relative w-48 h-48 rounded-full border-4 border-accent bg-gradient-to-br from-accent to-secondary shadow-glow overflow-hidden">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white">
                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                  </div>}
              <Button size="icon" className="absolute bottom-2 right-2 w-10 h-10 bg-accent hover:bg-accent/80">
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center md:items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">{profile?.username || 'Usuario'}</h1>
                  <Badge className="bg-gradient-to-r from-accent to-secondary text-white px-4 py-2">
                    <Award className="w-4 h-4 mr-1" />
                    Free
                  </Badge>
                </div>
                {editForm.location && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" /><span>{editForm.location}</span>
                  </div>
                )}
                <p className="text-foreground max-w-2xl">{editForm.bio || 'Miembro TAMV MD-X4™ quantum-social.'}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(!isEditing)} className="bg-primary-glow hover:bg-primary text-white">
                  <Edit2 className="w-4 h-4 mr-2" />Editar Perfil
                </Button>
                <Button variant="outline" className="border-primary text-foreground hover:bg-primary/10">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-8 justify-center md:justify-start text-center">
              <div><div className="text-2xl font-bold text-accent">0</div><div className="text-sm text-muted-foreground">Posts</div></div>
              <div><div className="text-2xl font-bold text-secondary">0</div><div className="text-sm text-muted-foreground">Credits</div></div>
              <div><div className="text-2xl font-bold text-accent-glow">0</div><div className="text-sm text-muted-foreground">Arte</div></div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <Card className="bg-card backdrop-blur-xl border-accent/30 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Editar Perfil</h3>
              <div className="space-y-4">
                <div><label className="text-foreground mb-2 block">Usuario</label>
                  <Input value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} className="bg-input border-border text-foreground" />
                </div>
                <div><label className="text-foreground mb-2 block">Ubicación</label>
                  <Input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Ciudad, País" className="bg-input border-border text-foreground" />
                </div>
                <div><label className="text-foreground mb-2 block">Bio</label>
                  <Textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Cuéntanos sobre ti..." className="bg-input border-border text-foreground min-h-[100px]" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} className="bg-gradient-quantum hover:opacity-90">
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="border-border text-foreground">Cancelar</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card border-b border-primary/20">
            <TabsTrigger value="overview"><Eye className="w-4 h-4 mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="media"><ImageIcon className="w-4 h-4 mr-2" /> Media</TabsTrigger>
            <TabsTrigger value="dreamspaces"><Zap className="w-4 h-4 mr-2" /> DreamSpaces</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4">
              <Card className="p-6 bg-card border-accent/20">
                <h3 className="text-xl font-bold text-foreground mb-4">Actividad Reciente</h3>
                <p className="text-muted-foreground">No hay actividad reciente</p>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="media">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dreamspaces">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30">
                <h3 className="text-lg font-bold text-foreground mb-2">Crea tu primer DreamSpace</h3>
                <p className="text-muted-foreground text-sm mb-4">Construye experiencias inmersivas</p>
                <Button className="bg-gradient-quantum">Crear Ahora</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
