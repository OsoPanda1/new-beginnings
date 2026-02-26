import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookPIRequest {
  action: 'register' | 'verify' | 'anchor' | 'get_certificate';
  record_id?: string;
  title?: string;
  description?: string;
  content_type?: string;
  content?: string;
  file_hash?: string;
}

// Generate SHA-256 hash of content
async function generateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate MSR transaction hash (simulated blockchain anchoring)
async function anchorToMSR(contentHash: string, userId: string): Promise<{ txHash: string; blockNumber: number }> {
  const timestamp = Date.now();
  const combined = `${contentHash}${userId}${timestamp}`;
  const txHash = await generateContentHash(combined);
  
  // Simulate block number (in production, this comes from actual blockchain)
  const blockNumber = 18000000 + Math.floor(Math.random() * 500000);
  
  return { txHash, blockNumber };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const body = await req.json() as BookPIRequest;
    const { action, record_id, title, description, content_type, content, file_hash } = body;

    console.log(`[BookPI] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'register': {
        if (!title || !content_type) {
          throw new Error('Title and content type are required');
        }

        // Generate content hash
        const contentToHash = content || file_hash || `${title}${description || ''}${Date.now()}`;
        const contentHash = await generateContentHash(contentToHash);

        // Check for duplicate hash
        const { data: existing } = await supabase
          .from('ip_records')
          .select('id')
          .eq('content_hash', contentHash)
          .single();

        if (existing) {
          throw new Error('Content already registered with this hash');
        }

        // Create IP record
        const { data: record, error: insertError } = await supabase
          .from('ip_records')
          .insert({
            user_id: user.id,
            title: title,
            description: description,
            content_hash: contentHash,
            content_type: content_type,
            status: 'pendiente',
            metadata: {
              original_filename: file_hash ? 'uploaded_file' : null,
              registration_ip: req.headers.get('x-forwarded-for') || 'unknown'
            }
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: user.id,
          p_action: 'IP_RECORD_CREATED',
          p_resource_type: 'ip_record',
          p_resource_id: record.id,
          p_severity: 'info',
          p_details: { title: title, content_type: content_type }
        });

        console.log(`[BookPI] Record created: ${record.id}`);

        return new Response(JSON.stringify({
          success: true,
          record: record,
          content_hash: contentHash
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'anchor': {
        if (!record_id) {
          throw new Error('Record ID required');
        }

        // Get record
        const { data: record, error: recordError } = await supabase
          .from('ip_records')
          .select('*')
          .eq('id', record_id)
          .eq('user_id', user.id)
          .single();

        if (recordError || !record) {
          throw new Error('Record not found');
        }

        if (record.status === 'anclado') {
          throw new Error('Record already anchored');
        }

        // Anchor to MSR blockchain
        const { txHash, blockNumber } = await anchorToMSR(record.content_hash, user.id);

        // Update record
        const { data: updatedRecord, error: updateError } = await supabase
          .from('ip_records')
          .update({
            status: 'anclado',
            msr_transaction_hash: txHash,
            block_number: blockNumber,
            updated_at: new Date().toISOString()
          })
          .eq('id', record_id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: user.id,
          p_action: 'IP_RECORD_ANCHORED',
          p_resource_type: 'ip_record',
          p_resource_id: record_id,
          p_severity: 'info',
          p_details: { tx_hash: txHash, block_number: blockNumber }
        });

        console.log(`[BookPI] Record anchored: ${record_id} at block ${blockNumber}`);

        return new Response(JSON.stringify({
          success: true,
          record: updatedRecord,
          msr: {
            transaction_hash: txHash,
            block_number: blockNumber
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'verify': {
        const hashToVerify = file_hash || content;
        if (!hashToVerify && !record_id) {
          throw new Error('Hash, content, or record ID required for verification');
        }

        let contentHash = hashToVerify;
        if (content && !file_hash) {
          contentHash = await generateContentHash(content);
        }

        // Search for matching record
        let query = supabase.from('ip_records').select('*, profiles:user_id(username, full_name)');
        
        if (record_id) {
          query = query.eq('id', record_id);
        } else if (contentHash) {
          query = query.eq('content_hash', contentHash);
        }

        const { data: records, error: searchError } = await query;

        if (searchError) {
          throw searchError;
        }

        const verified = records && records.length > 0;

        return new Response(JSON.stringify({
          success: true,
          verified: verified,
          records: records || [],
          searched_hash: contentHash
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get_certificate': {
        if (!record_id) {
          throw new Error('Record ID required');
        }

        const { data: record, error: recordError } = await supabase
          .from('ip_records')
          .select('*, profiles:user_id(username, full_name)')
          .eq('id', record_id)
          .eq('status', 'anclado')
          .single();

        if (recordError || !record) {
          throw new Error('Anchored record not found');
        }

        const certificate = {
          certificate_id: `TAMV-BPI-${record.id.substring(0, 8).toUpperCase()}`,
          title: record.title,
          author: record.profiles?.full_name || record.profiles?.username,
          content_hash: record.content_hash,
          content_type: record.content_type,
          registration_date: record.created_at,
          anchor_date: record.updated_at,
          msr_transaction: record.msr_transaction_hash,
          block_number: record.block_number,
          issuer: 'TAMV MD-X4™ BookPI Protocol',
          verification_url: `https://tamv.dev/verify/${record.id}`
        };

        return new Response(JSON.stringify({
          success: true,
          certificate: certificate
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('[BookPI] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
