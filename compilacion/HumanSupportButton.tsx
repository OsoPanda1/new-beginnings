import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

const HumanSupportButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !user) return;

    setSending(true);

    try {
      // Save ticket to database
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: subject.trim(),
          message: message.trim(),
          status: 'pending'
        });

      if (error) throw error;

      // Also open email client as backup
      const emailBody = `${message}\n\n---\nUsuario: ${user.email}\nID: ${user.id}`;
      const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');

      setSent(true);
      toast({
        title: 'Ticket enviado',
        description: 'Recibirás respuesta en 24-48 horas.',
      });
    } catch (err) {
      console.error('Error creating ticket:', err);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el ticket. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setSubject('');
    setMessage('');
    setSent(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full">
          <Mail className="w-4 h-4" />
          Contactar Soporte Humano
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Soporte Personalizado</DialogTitle>
          <DialogDescription>
            Envía tu consulta y recibirás respuesta en 24-48 horas.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">¡Ticket Enviado!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Revisa tu correo, te hemos abierto un borrador para enviar directamente.
            </p>
            <p className="text-xs text-muted-foreground">
              Email de soporte: <span className="text-primary">{SUPPORT_EMAIL}</span>
            </p>
            <Button onClick={resetForm} className="mt-6">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Asunto</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Problema con el examen del módulo 3"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Mensaje</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe tu consulta o problema con el mayor detalle posible..."
                rows={5}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={sending} className="flex-1 gap-2">
                {sending ? 'Enviando...' : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              También puedes escribir directamente a: <br />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HumanSupportButton;
