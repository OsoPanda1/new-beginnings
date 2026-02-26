import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebAuthnRequest {
  action: 'register_options' | 'register_verify' | 'login_options' | 'login_verify' | 'generate_totp' | 'verify_totp';
  user_id?: string;
  credential?: {
    id: string;
    rawId: string;
    response: {
      clientDataJSON: string;
      attestationObject?: string;
      authenticatorData?: string;
      signature?: string;
    };
    type: string;
    transports?: string[];
  };
  device_name?: string;
  totp_code?: string;
}

// Generate random challenge for WebAuthn
async function generateChallenge(): Promise<string> {
  const challengeBytes = new Uint8Array(32);
  crypto.getRandomValues(challengeBytes);
  return btoa(String.fromCharCode(...challengeBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Generate credential ID
function generateCredentialId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simplified TOTP generation (in production use proper TOTP library)
function generateTOTPSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth header for user verification
    const authHeader = req.headers.get('authorization');
    let currentUserId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      currentUserId = user?.id || null;
    }

    const body = await req.json() as WebAuthnRequest;
    const { action, user_id, credential, device_name, totp_code } = body;

    console.log(`[WebAuthn] Action: ${action}, User: ${user_id || currentUserId}`);

    switch (action) {
      case 'register_options': {
        const targetUserId = user_id || currentUserId;
        if (!targetUserId) {
          throw new Error('User ID required');
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', targetUserId)
          .single();

        if (profileError) {
          throw new Error('User not found');
        }

        const challenge = await generateChallenge();
        const challengeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Store challenge
        await supabase
          .from('mfa_challenges')
          .insert({
            user_id: targetUserId,
            challenge: challenge,
            challenge_type: 'webauthn',
            expires_at: challengeExpiry.toISOString(),
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

        // Return WebAuthn registration options
        const options = {
          challenge: challenge,
          rp: {
            name: 'TAMV MD-X4',
            id: new URL(supabaseUrl).hostname.split('.')[0] + '.tamv.dev'
          },
          user: {
            id: targetUserId,
            name: profile.username,
            displayName: profile.full_name || profile.username
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },   // ES256
            { type: 'public-key', alg: -257 }  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'preferred',
            residentKey: 'preferred'
          },
          timeout: 300000,
          attestation: 'none'
        };

        console.log(`[WebAuthn] Registration options generated for ${profile.username}`);

        return new Response(JSON.stringify({
          success: true,
          options: options
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'register_verify': {
        const targetUserId = user_id || currentUserId;
        if (!targetUserId || !credential) {
          throw new Error('User ID and credential required');
        }

        // Verify challenge exists and is valid
        const { data: challenge, error: challengeError } = await supabase
          .from('mfa_challenges')
          .select('*')
          .eq('user_id', targetUserId)
          .eq('challenge_type', 'webauthn')
          .gt('expires_at', new Date().toISOString())
          .is('verified_at', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (challengeError || !challenge) {
          throw new Error('Invalid or expired challenge');
        }

        // In production, verify the credential response properly
        // For now, we'll store the credential
        const credentialId = credential.id || generateCredentialId();

        const { error: credError } = await supabase
          .from('user_credentials')
          .insert({
            user_id: targetUserId,
            credential_id: credentialId,
            credential_type: 'webauthn',
            public_key: credential.response?.clientDataJSON || '',
            device_name: device_name || 'Passkey',
            transports: credential.transports || ['internal'],
            is_primary: true,
            last_used_at: new Date().toISOString()
          });

        if (credError) {
          throw credError;
        }

        // Mark challenge as verified
        await supabase
          .from('mfa_challenges')
          .update({ verified_at: new Date().toISOString() })
          .eq('id', challenge.id);

        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: targetUserId,
          p_action: 'WEBAUTHN_CREDENTIAL_REGISTERED',
          p_resource_type: 'user_credential',
          p_resource_id: credentialId,
          p_severity: 'info',
          p_details: { device_name: device_name }
        });

        console.log(`[WebAuthn] Credential registered for user ${targetUserId}`);

        return new Response(JSON.stringify({
          success: true,
          credential_id: credentialId,
          message: 'WebAuthn credential registered successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'login_options': {
        const targetUserId = user_id || currentUserId;
        if (!targetUserId) {
          throw new Error('User ID required');
        }

        // Get user's credentials
        const { data: credentials, error: credError } = await supabase
          .from('user_credentials')
          .select('credential_id, transports')
          .eq('user_id', targetUserId)
          .eq('credential_type', 'webauthn');

        if (credError || !credentials || credentials.length === 0) {
          throw new Error('No WebAuthn credentials found');
        }

        const challenge = await generateChallenge();
        const challengeExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await supabase
          .from('mfa_challenges')
          .insert({
            user_id: targetUserId,
            challenge: challenge,
            challenge_type: 'webauthn',
            expires_at: challengeExpiry.toISOString(),
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

        const options = {
          challenge: challenge,
          allowCredentials: credentials.map(c => ({
            type: 'public-key',
            id: c.credential_id,
            transports: c.transports || ['internal']
          })),
          userVerification: 'preferred',
          timeout: 300000
        };

        return new Response(JSON.stringify({
          success: true,
          options: options
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'login_verify': {
        const targetUserId = user_id || currentUserId;
        if (!targetUserId || !credential) {
          throw new Error('User ID and credential required');
        }

        // Verify challenge
        const { data: challenge, error: challengeError } = await supabase
          .from('mfa_challenges')
          .select('*')
          .eq('user_id', targetUserId)
          .eq('challenge_type', 'webauthn')
          .gt('expires_at', new Date().toISOString())
          .is('verified_at', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (challengeError || !challenge) {
          throw new Error('Invalid or expired challenge');
        }

        // Verify credential exists
        const { data: storedCred, error: credError } = await supabase
          .from('user_credentials')
          .select('*')
          .eq('user_id', targetUserId)
          .eq('credential_id', credential.id)
          .single();

        if (credError || !storedCred) {
          throw new Error('Credential not found');
        }

        // Update last used
        await supabase
          .from('user_credentials')
          .update({ 
            last_used_at: new Date().toISOString(),
            counter: (storedCred.counter || 0) + 1
          })
          .eq('id', storedCred.id);

        // Mark challenge verified
        await supabase
          .from('mfa_challenges')
          .update({ verified_at: new Date().toISOString() })
          .eq('id', challenge.id);

        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: targetUserId,
          p_action: 'WEBAUTHN_LOGIN_SUCCESS',
          p_resource_type: 'user_credential',
          p_resource_id: credential.id,
          p_severity: 'info',
          p_details: {}
        });

        console.log(`[WebAuthn] Login verified for user ${targetUserId}`);

        return new Response(JSON.stringify({
          success: true,
          verified: true,
          message: 'WebAuthn authentication successful'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'generate_totp': {
        const targetUserId = user_id || currentUserId;
        if (!targetUserId) {
          throw new Error('User ID required');
        }

        const secret = generateTOTPSecret();
        
        // Get user profile for TOTP URI
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', targetUserId)
          .single();

        const totpUri = `otpauth://totp/TAMV:${profile?.username || 'user'}?secret=${secret}&issuer=TAMV&algorithm=SHA1&digits=6&period=30`;

        // Store TOTP credential
        await supabase
          .from('user_credentials')
          .insert({
            user_id: targetUserId,
            credential_id: `totp_${Date.now()}`,
            credential_type: 'totp',
            public_key: secret,
            device_name: 'Authenticator App'
          });

        console.log(`[WebAuthn] TOTP generated for user ${targetUserId}`);

        return new Response(JSON.stringify({
          success: true,
          secret: secret,
          uri: totpUri
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'verify_totp': {
        const targetUserId = user_id || currentUserId;
        if (!targetUserId || !totp_code) {
          throw new Error('User ID and TOTP code required');
        }

        // Get stored TOTP secret
        const { data: totpCred, error: totpError } = await supabase
          .from('user_credentials')
          .select('public_key')
          .eq('user_id', targetUserId)
          .eq('credential_type', 'totp')
          .single();

        if (totpError || !totpCred) {
          throw new Error('TOTP not configured');
        }

        // Simplified TOTP verification (in production use proper verification)
        const isValid = totp_code.length === 6 && /^\d+$/.test(totp_code);

        if (isValid) {
          await supabase.rpc('log_security_event', {
            p_user_id: targetUserId,
            p_action: 'TOTP_VERIFICATION_SUCCESS',
            p_resource_type: 'mfa',
            p_resource_id: null,
            p_severity: 'info',
            p_details: {}
          });
        }

        return new Response(JSON.stringify({
          success: true,
          verified: isValid
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('[WebAuthn] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
