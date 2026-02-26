import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IPRecord {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content_hash: string;
  content_type: 'documento' | 'arte' | 'codigo' | 'musica' | 'video' | 'otro';
  file_url: string | null;
  status: 'pendiente' | 'verificado' | 'anclado';
  block_number: number | null;
  msr_transaction_hash: string | null;
  created_at: string;
  updated_at: string;
}

export function useBookPI() {
  const [records, setRecords] = useState<IPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [anchoring, setAnchoring] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ip_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords((data || []) as IPRecord[]);
    } catch (error) {
      console.error('Error fetching IP records:', error);
    }
  }, []);

  const registerIP = async (
    title: string,
    description: string,
    contentType: string,
    content?: string
  ) => {
    setRegistering(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Debes iniciar sesión');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('bookpi-anchor', {
        body: {
          action: 'register',
          title,
          description,
          content_type: contentType,
          content
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Propiedad intelectual registrada');
        await fetchRecords();
        return data.record;
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar';
      toast.error(errorMessage);
      return null;
    } finally {
      setRegistering(false);
    }
  };

  const anchorToMSR = async (recordId: string) => {
    setAnchoring(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Debes iniciar sesión');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('bookpi-anchor', {
        body: {
          action: 'anchor',
          record_id: recordId
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Anclado en bloque #${data.msr.block_number}`);
        await fetchRecords();
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al anclar';
      toast.error(errorMessage);
      return null;
    } finally {
      setAnchoring(false);
    }
  };

  const verifyHash = async (hashOrContent: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('bookpi-anchor', {
        body: {
          action: 'verify',
          file_hash: hashOrContent.startsWith('0x') ? hashOrContent : undefined,
          content: !hashOrContent.startsWith('0x') ? hashOrContent : undefined
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error verifying:', error);
      return null;
    }
  };

  const getCertificate = async (recordId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Debes iniciar sesión');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('bookpi-anchor', {
        body: {
          action: 'get_certificate',
          record_id: recordId
        }
      });

      if (error) throw error;
      return data.certificate;
    } catch (error) {
      console.error('Error getting certificate:', error);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchRecords();
      setLoading(false);
    };
    init();
  }, [fetchRecords]);

  return {
    records,
    loading,
    registering,
    anchoring,
    registerIP,
    anchorToMSR,
    verifyHash,
    getCertificate,
    refreshRecords: fetchRecords
  };
}
