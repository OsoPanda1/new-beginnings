import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DreamSpace {
  id: string;
  title: string;
  description: string | null;
  space_type: string | null;
  thumbnail_url: string | null;
  views_count: number | null;
  resonance_score: number | null;
  is_public: boolean | null;
  scene_data: any;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateDreamSpaceData {
  title: string;
  description?: string;
  space_type?: string;
  thumbnail_url?: string;
  is_public?: boolean;
  scene_data?: any;
}

export function useDreamSpaces() {
  const [spaces, setSpaces] = useState<DreamSpace[]>([]);
  const [mySpaces, setMySpaces] = useState<DreamSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchPublicSpaces = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('dreamspaces')
        .select('*')
        .eq('is_public', true)
        .order('views_count', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setSpaces(data || []);
    } catch (error) {
      console.error('Error fetching public dreamspaces:', error);
    }
  }, []);

  const fetchMySpaces = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('dreamspaces')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMySpaces(data || []);
    } catch (error) {
      console.error('Error fetching my dreamspaces:', error);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPublicSpaces(), fetchMySpaces()]);
    setLoading(false);
  }, [fetchPublicSpaces, fetchMySpaces]);

  const createSpace = async (spaceData: CreateDreamSpaceData) => {
    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión para crear un DreamSpace');
        return { data: null, error: 'No autenticado' };
      }

      const { data, error } = await supabase
        .from('dreamspaces')
        .insert({
          user_id: user.id,
          title: spaceData.title,
          description: spaceData.description || null,
          space_type: spaceData.space_type || 'custom',
          thumbnail_url: spaceData.thumbnail_url || null,
          is_public: spaceData.is_public ?? true,
          scene_data: spaceData.scene_data || {},
          views_count: 0,
          resonance_score: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('DreamSpace creado exitosamente');
      await fetchAll();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating dreamspace:', error);
      toast.error('Error al crear el DreamSpace');
      return { data: null, error };
    } finally {
      setCreating(false);
    }
  };

  const updateSpace = async (id: string, updates: Partial<CreateDreamSpaceData>) => {
    try {
      const { data, error } = await supabase
        .from('dreamspaces')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('DreamSpace actualizado');
      await fetchAll();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating dreamspace:', error);
      toast.error('Error al actualizar');
      return { data: null, error };
    }
  };

  const deleteSpace = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dreamspaces')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('DreamSpace eliminado');
      await fetchAll();
      return { error: null };
    } catch (error) {
      console.error('Error deleting dreamspace:', error);
      toast.error('Error al eliminar');
      return { error };
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const { data: current } = await supabase
        .from('dreamspaces')
        .select('views_count')
        .eq('id', id)
        .single();

      if (current) {
        await supabase
          .from('dreamspaces')
          .update({ views_count: (current.views_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  useEffect(() => {
    fetchAll();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('dreamspaces-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dreamspaces' },
        () => {
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  return {
    spaces,
    mySpaces,
    loading,
    creating,
    fetchPublicSpaces,
    fetchMySpaces,
    createSpace,
    updateSpace,
    deleteSpace,
    incrementViews
  };
}
