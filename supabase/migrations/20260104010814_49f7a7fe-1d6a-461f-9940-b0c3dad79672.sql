-- =====================================================
-- TAMV MD-X4 PRODUCTION DATABASE SCHEMA
-- BookPI, Nubiwallet, Lotería y Auth Avanzada
-- =====================================================

-- 1. BOOKPI - Registro de Propiedad Intelectual
CREATE TABLE public.ip_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_hash TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL CHECK (content_type IN ('documento', 'arte', 'codigo', 'musica', 'video', 'otro')),
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'verificado', 'anclado')),
  block_number BIGINT,
  msr_transaction_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. NUBIWALLET - Ledger de Doble Entrada
CREATE TABLE public.wallet_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_mxn NUMERIC(18,2) NOT NULL DEFAULT 0.00,
  balance_tamv NUMERIC(18,2) NOT NULL DEFAULT 0.00,
  balance_usd NUMERIC(18,2) NOT NULL DEFAULT 0.00,
  frozen_balance NUMERIC(18,2) NOT NULL DEFAULT 0.00,
  daily_limit NUMERIC(18,2) NOT NULL DEFAULT 50000.00,
  wallet_address TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  is_frozen BOOLEAN DEFAULT false,
  freeze_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallet_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('send', 'receive', 'swap', 'reward', 'lottery_win', 'lottery_buy', 'deposit', 'withdraw')),
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('MXN', 'TAMV', 'USD')),
  counterparty TEXT,
  counterparty_user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  msr_hash TEXT,
  fee_amount NUMERIC(18,4) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 3. LOTERÍA VRF - Sistema de Sorteos
CREATE TABLE public.lottery_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  prize_pool NUMERIC(18,2) NOT NULL DEFAULT 0,
  ticket_price NUMERIC(18,2) NOT NULL,
  max_tickets INTEGER NOT NULL,
  tickets_sold INTEGER NOT NULL DEFAULT 0,
  draw_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'drawing', 'completed', 'cancelled')),
  winner_user_id UUID REFERENCES auth.users(id),
  vrf_request_id TEXT,
  vrf_random_number TEXT,
  vrf_proof TEXT,
  chainlink_subscription_id TEXT,
  quantum_split_creator NUMERIC(5,2) DEFAULT 70.00,
  quantum_split_resilience NUMERIC(5,2) DEFAULT 20.00,
  quantum_split_infra NUMERIC(5,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE public.lottery_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.lottery_draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number INTEGER NOT NULL,
  purchase_transaction_id UUID REFERENCES public.wallet_transactions(id),
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(draw_id, ticket_number)
);

-- 4. AUTH AVANZADA - WebAuthn & MFA
CREATE TABLE public.user_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  credential_type TEXT NOT NULL CHECK (credential_type IN ('webauthn', 'totp', 'backup_code')),
  public_key TEXT,
  counter BIGINT DEFAULT 0,
  device_name TEXT,
  transports TEXT[],
  is_primary BOOLEAN DEFAULT false,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.mfa_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('webauthn', 'totp', 'email', 'sms')),
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  details JSONB DEFAULT '{}',
  msr_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- IP Records (BookPI)
ALTER TABLE public.ip_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own IP records"
  ON public.ip_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public verified records"
  ON public.ip_records FOR SELECT
  USING (status = 'anclado');

CREATE POLICY "Users can create own IP records"
  ON public.ip_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending records"
  ON public.ip_records FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pendiente');

-- Wallet Accounts
ALTER TABLE public.wallet_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON public.wallet_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON public.wallet_accounts FOR UPDATE
  USING (auth.uid() = user_id AND is_frozen = false);

-- Wallet Transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
  ON public.wallet_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Lottery Draws
ALTER TABLE public.lottery_draws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active lottery draws"
  ON public.lottery_draws FOR SELECT
  USING (status IN ('active', 'completed'));

CREATE POLICY "Admins can manage lottery draws"
  ON public.lottery_draws FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Lottery Tickets
ALTER TABLE public.lottery_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON public.lottery_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase tickets"
  ON public.lottery_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Credentials (WebAuthn)
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credentials"
  ON public.user_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own credentials"
  ON public.user_credentials FOR ALL
  USING (auth.uid() = user_id);

-- MFA Challenges
ALTER TABLE public.mfa_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges"
  ON public.mfa_challenges FOR SELECT
  USING (auth.uid() = user_id);

-- Security Audit Log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs"
  ON public.security_audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs"
  ON public.security_audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to create wallet on user signup
CREATE OR REPLACE FUNCTION public.create_wallet_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallet_accounts (user_id, wallet_address)
  VALUES (NEW.id, 'nubi_' || substr(NEW.id::text, 1, 8) || '_' || encode(gen_random_bytes(8), 'hex'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for wallet creation
CREATE TRIGGER on_user_created_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_wallet_on_signup();

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'info',
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (user_id, action, resource_type, resource_id, severity, details)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_severity, p_details)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to process lottery ticket purchase
CREATE OR REPLACE FUNCTION public.purchase_lottery_ticket(
  p_draw_id UUID,
  p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_ticket_id UUID;
  v_ticket_number INTEGER;
  v_ticket_price NUMERIC;
  v_wallet_id UUID;
  v_current_balance NUMERIC;
BEGIN
  -- Get draw info
  SELECT ticket_price, tickets_sold + 1 INTO v_ticket_price, v_ticket_number
  FROM public.lottery_draws
  WHERE id = p_draw_id AND status = 'active'
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sorteo no disponible';
  END IF;
  
  -- Get wallet and check balance
  SELECT id, balance_mxn INTO v_wallet_id, v_current_balance
  FROM public.wallet_accounts
  WHERE user_id = p_user_id AND is_frozen = false
  FOR UPDATE;
  
  IF v_current_balance < v_ticket_price THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;
  
  -- Deduct balance
  UPDATE public.wallet_accounts
  SET balance_mxn = balance_mxn - v_ticket_price,
      updated_at = now()
  WHERE id = v_wallet_id;
  
  -- Create ticket
  INSERT INTO public.lottery_tickets (draw_id, user_id, ticket_number)
  VALUES (p_draw_id, p_user_id, v_ticket_number)
  RETURNING id INTO v_ticket_id;
  
  -- Update draw stats
  UPDATE public.lottery_draws
  SET tickets_sold = tickets_sold + 1,
      prize_pool = prize_pool + (v_ticket_price * 0.7)
  WHERE id = p_draw_id;
  
  RETURN v_ticket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.lottery_draws;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_transactions;