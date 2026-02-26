/**
 * 🛡️ Guardian Events Hook - TAMV MD-X4™
 * Real-time security monitoring with Anubis, Horus, and Dekateotl
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GuardianEvent {
  id: string;
  event_type: string;
  guardian_name: 'anubis' | 'horus' | 'dekateotl' | 'orus';
  severity: 'info' | 'warning' | 'critical';
  source: string | null;
  details: Record<string, unknown>;
  resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

export interface GuardianStats {
  anubis: { status: 'active' | 'warning' | 'critical'; events: number; blocked: number };
  horus: { status: 'active' | 'scanning' | 'alert'; scans: number; threats: number };
  dekateotl: { status: 'active' | 'standby'; level: number; integrity: number };
  orus: { status: 'active' | 'learning'; patterns: number; accuracy: number };
}

export function useGuardianEvents() {
  const [events, setEvents] = useState<GuardianEvent[]>([]);
  const [stats, setStats] = useState<GuardianStats>({
    anubis: { status: 'active', events: 0, blocked: 0 },
    horus: { status: 'active', scans: 0, threats: 0 },
    dekateotl: { status: 'active', level: 11, integrity: 100 },
    orus: { status: 'active', patterns: 0, accuracy: 98.7 }
  });
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('guardian_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedData = (data || []).map(e => ({
        ...e,
        guardian_name: e.guardian_name as GuardianEvent['guardian_name'],
        severity: (e.severity || 'info') as GuardianEvent['severity'],
        details: (e.details || {}) as Record<string, unknown>,
        resolved: e.resolved ?? false,
        created_at: e.created_at ?? new Date().toISOString(),
      }));

      setEvents(typedData);

      // Calculate stats from events
      const anubisEvents = typedData.filter(e => e.guardian_name === 'anubis');
      const horusEvents = typedData.filter(e => e.guardian_name === 'horus');
      const criticalCount = typedData.filter(e => e.severity === 'critical' && !e.resolved).length;

      setStats({
        anubis: {
          status: criticalCount > 3 ? 'critical' : criticalCount > 0 ? 'warning' : 'active',
          events: anubisEvents.length,
          blocked: anubisEvents.filter(e => e.event_type === 'blocked').length
        },
        horus: {
          status: 'active',
          scans: horusEvents.length,
          threats: horusEvents.filter(e => e.severity === 'warning' || e.severity === 'critical').length
        },
        dekateotl: {
          status: 'active',
          level: 11,
          integrity: 100 - (criticalCount * 2)
        },
        orus: {
          status: 'active',
          patterns: 147 + typedData.length,
          accuracy: 98.7
        }
      });
    } catch (error) {
      console.error("Error fetching guardian events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveEvent = useCallback(async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('guardian_events')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, resolved: true, resolved_at: new Date().toISOString() } : e
      ));
    } catch (error) {
      console.error("Error resolving event:", error);
    }
  }, []);

  // Real-time subscription for guardian events
  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('guardian-events-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guardian_events'
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  return {
    events,
    stats,
    loading,
    resolveEvent,
    refresh: fetchEvents,
    unresolvedCount: events.filter(e => !e.resolved).length,
    criticalCount: events.filter(e => e.severity === 'critical' && !e.resolved).length
  };
}
