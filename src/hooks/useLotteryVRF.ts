import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LotteryDraw {
  id: string;
  name: string;
  description: string | null;
  prize_pool: number;
  ticket_price: number;
  max_tickets: number;
  tickets_sold: number;
  draw_date: string;
  status: 'active' | 'drawing' | 'completed' | 'cancelled';
  winner_user_id: string | null;
  vrf_random_number: string | null;
  vrf_proof: string | null;
  created_at: string;
}

interface LotteryTicket {
  id: string;
  draw_id: string;
  ticket_number: number;
  is_winner: boolean;
  created_at: string;
}

export function useLotteryVRF() {
  const [draws, setDraws] = useState<LotteryDraw[]>([]);
  const [myTickets, setMyTickets] = useState<LotteryTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const fetchDraws = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .in('status', ['active', 'completed'])
        .order('draw_date', { ascending: true });

      if (error) throw error;
      setDraws((data || []) as LotteryDraw[]);
    } catch (error) {
      console.error('Error fetching draws:', error);
    }
  }, []);

  const fetchMyTickets = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('lottery_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyTickets((data || []) as LotteryTicket[]);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  }, []);

  const purchaseTicket = async (drawId: string) => {
    setPurchasing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión para comprar boletos');
        return null;
      }

      const { data, error } = await supabase.rpc('purchase_lottery_ticket', {
        p_draw_id: drawId,
        p_user_id: user.id
      });

      if (error) throw error;

      toast.success('¡Boleto comprado exitosamente!');
      await fetchDraws();
      await fetchMyTickets();
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al comprar boleto';
      toast.error(errorMessage);
      return null;
    } finally {
      setPurchasing(false);
    }
  };

  const executeDraw = async (drawId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('lottery-vrf', {
        body: { action: 'execute_draw', draw_id: drawId }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`¡Sorteo completado! Ganador: Boleto #${data.winner.ticket_number}`);
        await fetchDraws();
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al ejecutar sorteo';
      toast.error(errorMessage);
      return null;
    }
  };

  const verifyVRF = async (drawId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('lottery-vrf', {
        body: { action: 'verify_randomness', draw_id: drawId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error verifying VRF:', error);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDraws(), fetchMyTickets()]);
      setLoading(false);
    };
    init();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('lottery-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lottery_draws' },
        () => {
          fetchDraws();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDraws, fetchMyTickets]);

  return {
    draws,
    myTickets,
    loading,
    purchasing,
    purchaseTicket,
    executeDraw,
    verifyVRF,
    refreshDraws: fetchDraws
  };
}
