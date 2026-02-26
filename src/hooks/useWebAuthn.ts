import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WebAuthnCredential {
  id: string;
  credential_id: string;
  credential_type: 'webauthn' | 'totp' | 'backup_code';
  device_name: string | null;
  is_primary: boolean;
  last_used_at: string | null;
  created_at: string;
}

export function useWebAuthn() {
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCredentials((data || []) as WebAuthnCredential[]);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  }, []);

  const registerPasskey = async (deviceName?: string) => {
    setRegistering(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión');
        return false;
      }

      // Check WebAuthn support
      if (!window.PublicKeyCredential) {
        toast.error('Tu navegador no soporta WebAuthn');
        return false;
      }

      // Get registration options
      const { data: optionsData, error: optionsError } = await supabase.functions.invoke('webauthn-auth', {
        body: { action: 'register_options', user_id: user.id }
      });

      if (optionsError || !optionsData.success) {
        throw new Error(optionsData?.error || 'Error getting options');
      }

      const options = optionsData.options;

      // Convert challenge from base64url to ArrayBuffer
      const challengeBuffer = Uint8Array.from(
        atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0)
      );

      // Convert user.id to ArrayBuffer
      const userIdBuffer = new TextEncoder().encode(options.user.id);

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challengeBuffer,
          rp: options.rp,
          user: {
            ...options.user,
            id: userIdBuffer
          },
          pubKeyCredParams: options.pubKeyCredParams,
          authenticatorSelection: options.authenticatorSelection,
          timeout: options.timeout,
          attestation: options.attestation
        }
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No se pudo crear la credencial');
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      // Verify registration
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('webauthn-auth', {
        body: {
          action: 'register_verify',
          user_id: user.id,
          credential: {
            id: credential.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            response: {
              clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(response.clientDataJSON))),
              attestationObject: btoa(String.fromCharCode(...new Uint8Array(response.attestationObject)))
            },
            type: credential.type,
            transports: (response as AuthenticatorAttestationResponse).getTransports?.() || ['internal']
          },
          device_name: deviceName || 'Passkey'
        }
      });

      if (verifyError || !verifyData.success) {
        throw new Error(verifyData?.error || 'Error verifying');
      }

      toast.success('Passkey registrada exitosamente');
      await fetchCredentials();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar passkey';
      toast.error(errorMessage);
      return false;
    } finally {
      setRegistering(false);
    }
  };

  const deleteCredential = async (credentialId: string) => {
    setDeleting(credentialId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión');
        return false;
      }

      const { error } = await supabase
        .from('user_credentials')
        .delete()
        .eq('id', credentialId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Dispositivo eliminado');
      await fetchCredentials();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar';
      toast.error(errorMessage);
      return false;
    } finally {
      setDeleting(null);
    }
  };

  const authenticateWithPasskey = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión primero');
        return false;
      }

      // Get login options
      const { data: optionsData, error: optionsError } = await supabase.functions.invoke('webauthn-auth', {
        body: { action: 'login_options', user_id: user.id }
      });

      if (optionsError || !optionsData.success) {
        throw new Error(optionsData?.error || 'Error getting options');
      }

      const options = optionsData.options;

      // Convert challenge
      const challengeBuffer = Uint8Array.from(
        atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0)
      );

      // Convert allowCredentials
      const allowCredentials = options.allowCredentials.map((cred: { id: string; type: string; transports: string[] }) => ({
        ...cred,
        id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
      }));

      // Get credential
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challengeBuffer,
          allowCredentials,
          userVerification: options.userVerification,
          timeout: options.timeout
        }
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No se pudo obtener la credencial');
      }

      const response = credential.response as AuthenticatorAssertionResponse;

      // Verify authentication
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('webauthn-auth', {
        body: {
          action: 'login_verify',
          user_id: user.id,
          credential: {
            id: credential.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            response: {
              clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(response.clientDataJSON))),
              authenticatorData: btoa(String.fromCharCode(...new Uint8Array(response.authenticatorData))),
              signature: btoa(String.fromCharCode(...new Uint8Array(response.signature)))
            },
            type: credential.type
          }
        }
      });

      if (verifyError || !verifyData.success) {
        throw new Error(verifyData?.error || 'Error verifying');
      }

      toast.success('Autenticación exitosa');
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setupTOTP = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('webauthn-auth', {
        body: { action: 'generate_totp', user_id: user.id }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Error generating TOTP');
      }

      await fetchCredentials();
      return { secret: data.secret, uri: data.uri };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al configurar TOTP';
      toast.error(errorMessage);
      return null;
    }
  };

  const verifyTOTP = async (code: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('webauthn-auth', {
        body: { action: 'verify_totp', user_id: user.id, totp_code: code }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Error verifying TOTP');
      }

      if (data.verified) {
        toast.success('Código verificado');
        return true;
      } else {
        toast.error('Código incorrecto');
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error de verificación';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    credentials,
    loading,
    registering,
    deleting,
    fetchCredentials,
    registerPasskey,
    deleteCredential,
    authenticateWithPasskey,
    setupTOTP,
    verifyTOTP
  };
}
