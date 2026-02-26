import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletAccount {
  id: string;
  user_id: string;
  balance_mxn: number;
  balance_tamv: number;
  balance_usd: number;
  frozen_balance: number;
  daily_limit: number;
  wallet_address: string | null;
  is_verified: boolean;
  is_frozen: boolean;
}

interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: 'send' | 'receive' | 'swap' | 'reward' | 'lottery_win' | 'lottery_buy' | 'deposit' | 'withdraw';
  amount: number;
  currency: 'MXN' | 'TAMV' | 'USD';
  counterparty: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  msr_hash: string | null;
  created_at: string;
  completed_at: string | null;
}

export function useNubiwallet() {
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchWallet = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wallet_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setWallet(data as WalletAccount | null);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions((data || []) as WalletTransaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  const sendFunds = async (
    amount: number,
    currency: 'MXN' | 'TAMV' | 'USD',
    recipientAddress: string
  ) => {
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !wallet) {
        toast.error('Debes iniciar sesión');
        return false;
      }

      // Check balance
      const balanceKey = `balance_${currency.toLowerCase()}` as keyof WalletAccount;
      const currentBalance = wallet[balanceKey] as number;
      
      if (currentBalance < amount) {
        toast.error('Saldo insuficiente');
        return false;
      }

      // Create transaction
      const { error: txError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          user_id: user.id,
          transaction_type: 'send',
          amount: amount,
          currency: currency,
          counterparty: recipientAddress,
          status: 'completed',
          completed_at: new Date().toISOString()
        });

      if (txError) throw txError;

      // Update balance
      const { error: updateError } = await supabase
        .from('wallet_accounts')
        .update({
          [balanceKey]: currentBalance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

      toast.success('Transferencia enviada exitosamente');
      await fetchWallet();
      await fetchTransactions();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar fondos';
      toast.error(errorMessage);
      return false;
    } finally {
      setSending(false);
    }
  };

  const swapCurrency = async (
    fromCurrency: 'MXN' | 'TAMV' | 'USD',
    toCurrency: 'MXN' | 'TAMV' | 'USD',
    amount: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !wallet) {
        toast.error('Debes iniciar sesión');
        return false;
      }

      // Exchange rates (simplified)
      const rates: Record<string, Record<string, number>> = {
        MXN: { TAMV: 0.5, USD: 0.058 },
        TAMV: { MXN: 2, USD: 0.116 },
        USD: { MXN: 17.2, TAMV: 8.6 }
      };

      const fromKey = `balance_${fromCurrency.toLowerCase()}` as keyof WalletAccount;
      const toKey = `balance_${toCurrency.toLowerCase()}` as keyof WalletAccount;
      
      const fromBalance = wallet[fromKey] as number;
      const toBalance = wallet[toKey] as number;
      
      if (fromBalance < amount) {
        toast.error('Saldo insuficiente');
        return false;
      }

      const convertedAmount = amount * (rates[fromCurrency][toCurrency] || 1);

      // Create swap transaction
      await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          user_id: user.id,
          transaction_type: 'swap',
          amount: amount,
          currency: fromCurrency,
          counterparty: `Swap ${fromCurrency} → ${toCurrency}`,
          status: 'completed',
          completed_at: new Date().toISOString()
        });

      // Update balances
      await supabase
        .from('wallet_accounts')
        .update({
          [fromKey]: fromBalance - amount,
          [toKey]: toBalance + convertedAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      toast.success(`Intercambio completado: ${amount} ${fromCurrency} → ${convertedAmount.toFixed(2)} ${toCurrency}`);
      await fetchWallet();
      await fetchTransactions();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el intercambio';
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchWallet(), fetchTransactions()]);
      setLoading(false);
    };
    init();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('wallet-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wallet_transactions' },
        () => {
          fetchTransactions();
          fetchWallet();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWallet, fetchTransactions]);

  return {
    wallet,
    transactions,
    loading,
    sending,
    sendFunds,
    swapCurrency,
    refreshWallet: fetchWallet
  };
}
