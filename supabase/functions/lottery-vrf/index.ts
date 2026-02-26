import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VRFRequest {
  action: 'request_randomness' | 'verify_randomness' | 'execute_draw' | 'get_draw_status';
  draw_id?: string;
  subscription_id?: string;
}

interface VRFResult {
  random_number: string;
  proof: string;
  request_id: string;
  timestamp: number;
}

// Simulated VRF using cryptographic randomness
// In production, this would integrate with Chainlink VRF v2
async function generateVRFRandomness(seed: string): Promise<VRFResult> {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed + Date.now().toString());
  
  // Generate cryptographic hash as proof
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const proof = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Generate random number from hash
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const randomNumber = '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Generate request ID
  const requestIdBytes = new Uint8Array(16);
  crypto.getRandomValues(requestIdBytes);
  const requestId = Array.from(requestIdBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return {
    random_number: randomNumber,
    proof: proof,
    request_id: requestId,
    timestamp: Date.now()
  };
}

// Verify VRF proof (simplified verification)
function verifyVRFProof(randomNumber: string, proof: string): boolean {
  // In production, this would verify the Chainlink VRF proof
  return randomNumber.startsWith('0x') && proof.startsWith('0x') && 
         randomNumber.length === 66 && proof.length === 66;
}

// Select winner from ticket pool using VRF random number
function selectWinner(randomNumber: string, totalTickets: number): number {
  const bigNumber = BigInt(randomNumber);
  const winnerIndex = Number(bigNumber % BigInt(totalTickets)) + 1;
  return winnerIndex;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, draw_id, subscription_id } = await req.json() as VRFRequest;

    console.log(`[VRF] Action: ${action}, Draw ID: ${draw_id}`);

    switch (action) {
      case 'request_randomness': {
        if (!draw_id) {
          throw new Error('draw_id is required');
        }

        // Get draw info
        const { data: draw, error: drawError } = await supabase
          .from('lottery_draws')
          .select('*')
          .eq('id', draw_id)
          .single();

        if (drawError || !draw) {
          throw new Error('Draw not found');
        }

        if (draw.status !== 'active') {
          throw new Error('Draw is not active');
        }

        // Generate VRF randomness
        const vrfResult = await generateVRFRandomness(draw_id + draw.tickets_sold);

        // Update draw with VRF request
        const { error: updateError } = await supabase
          .from('lottery_draws')
          .update({
            status: 'drawing',
            vrf_request_id: vrfResult.request_id,
            chainlink_subscription_id: subscription_id || 'tamv_vrf_sub_001'
          })
          .eq('id', draw_id);

        if (updateError) {
          throw updateError;
        }

        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: null,
          p_action: 'VRF_RANDOMNESS_REQUESTED',
          p_resource_type: 'lottery_draw',
          p_resource_id: draw_id,
          p_severity: 'info',
          p_details: { request_id: vrfResult.request_id }
        });

        console.log(`[VRF] Randomness requested for draw ${draw_id}`);

        return new Response(JSON.stringify({
          success: true,
          request_id: vrfResult.request_id,
          message: 'VRF randomness requested successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'execute_draw': {
        if (!draw_id) {
          throw new Error('draw_id is required');
        }

        // Get draw with tickets
        const { data: draw, error: drawError } = await supabase
          .from('lottery_draws')
          .select('*')
          .eq('id', draw_id)
          .single();

        if (drawError || !draw) {
          throw new Error('Draw not found');
        }

        if (draw.status !== 'drawing' && draw.status !== 'active') {
          throw new Error('Draw cannot be executed');
        }

        if (draw.tickets_sold === 0) {
          throw new Error('No tickets sold');
        }

        // Generate VRF randomness
        const vrfResult = await generateVRFRandomness(draw_id + Date.now());

        // Select winner
        const winnerTicketNumber = selectWinner(vrfResult.random_number, draw.tickets_sold);

        // Get winning ticket
        const { data: winningTicket, error: ticketError } = await supabase
          .from('lottery_tickets')
          .select('*, profiles:user_id(username)')
          .eq('draw_id', draw_id)
          .eq('ticket_number', winnerTicketNumber)
          .single();

        if (ticketError || !winningTicket) {
          throw new Error('Could not determine winner');
        }

        // Update draw as completed
        const { error: updateDrawError } = await supabase
          .from('lottery_draws')
          .update({
            status: 'completed',
            winner_user_id: winningTicket.user_id,
            vrf_random_number: vrfResult.random_number,
            vrf_proof: vrfResult.proof,
            completed_at: new Date().toISOString()
          })
          .eq('id', draw_id);

        if (updateDrawError) {
          throw updateDrawError;
        }

        // Mark winning ticket
        await supabase
          .from('lottery_tickets')
          .update({ is_winner: true })
          .eq('id', winningTicket.id);

        // Credit winner's wallet with prize
        const prizeAmount = draw.prize_pool;
        const { data: winnerWallet, error: walletError } = await supabase
          .from('wallet_accounts')
          .select('id, balance_mxn')
          .eq('user_id', winningTicket.user_id)
          .single();

        if (winnerWallet) {
          await supabase
            .from('wallet_accounts')
            .update({
              balance_mxn: winnerWallet.balance_mxn + prizeAmount,
              updated_at: new Date().toISOString()
            })
            .eq('id', winnerWallet.id);

          // Create transaction record
          await supabase
            .from('wallet_transactions')
            .insert({
              wallet_id: winnerWallet.id,
              user_id: winningTicket.user_id,
              transaction_type: 'lottery_win',
              amount: prizeAmount,
              currency: 'MXN',
              counterparty: `Lotería TAMV: ${draw.name}`,
              status: 'completed',
              msr_hash: vrfResult.proof,
              completed_at: new Date().toISOString()
            });
        }

        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: winningTicket.user_id,
          p_action: 'LOTTERY_DRAW_COMPLETED',
          p_resource_type: 'lottery_draw',
          p_resource_id: draw_id,
          p_severity: 'info',
          p_details: {
            winner_ticket: winnerTicketNumber,
            prize_amount: prizeAmount,
            vrf_proof: vrfResult.proof
          }
        });

        console.log(`[VRF] Draw ${draw_id} completed. Winner: ticket #${winnerTicketNumber}`);

        return new Response(JSON.stringify({
          success: true,
          winner: {
            ticket_number: winnerTicketNumber,
            user_id: winningTicket.user_id,
            prize_amount: prizeAmount
          },
          vrf: {
            random_number: vrfResult.random_number,
            proof: vrfResult.proof,
            request_id: vrfResult.request_id
          },
          quantum_split: {
            creator: draw.quantum_split_creator,
            resilience: draw.quantum_split_resilience,
            infrastructure: draw.quantum_split_infra
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'verify_randomness': {
        if (!draw_id) {
          throw new Error('draw_id is required');
        }

        const { data: draw, error: drawError } = await supabase
          .from('lottery_draws')
          .select('vrf_random_number, vrf_proof, vrf_request_id, status')
          .eq('id', draw_id)
          .single();

        if (drawError || !draw) {
          throw new Error('Draw not found');
        }

        const isValid = draw.vrf_random_number && draw.vrf_proof && 
                       verifyVRFProof(draw.vrf_random_number, draw.vrf_proof);

        return new Response(JSON.stringify({
          success: true,
          verified: isValid,
          draw_status: draw.status,
          vrf_data: {
            random_number: draw.vrf_random_number,
            proof: draw.vrf_proof,
            request_id: draw.vrf_request_id
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get_draw_status': {
        if (!draw_id) {
          throw new Error('draw_id is required');
        }

        const { data: draw, error: drawError } = await supabase
          .from('lottery_draws')
          .select(`
            *,
            winner:winner_user_id(username)
          `)
          .eq('id', draw_id)
          .single();

        if (drawError || !draw) {
          throw new Error('Draw not found');
        }

        const { count } = await supabase
          .from('lottery_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('draw_id', draw_id);

        return new Response(JSON.stringify({
          success: true,
          draw: {
            ...draw,
            total_participants: count || 0
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('[VRF] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
