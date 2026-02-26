import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Trash2, Pin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  // We'll store user info locally
  user_name?: string;
}

interface LessonCommentsProps {
  lessonId: string;
}

const LessonComments = ({ lessonId }: LessonCommentsProps) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("lesson_comments")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: true });

    if (data) setComments(data as Comment[]);
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    setLoading(true);

    const { error } = await supabase.from("lesson_comments").insert({
      lesson_id: lessonId,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo enviar el comentario.", variant: "destructive" });
    } else {
      setNewComment("");
      fetchComments();
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase.from("lesson_comments").delete().eq("id", commentId);
    if (!error) fetchComments();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h4 className="flex items-center gap-2 text-lg font-display font-semibold text-foreground mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        Comentarios de la lección ({comments.length})
      </h4>

      {/* Comment list */}
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Sé el primero en comentar esta lección.
          </p>
        )}
        {comments.map((c) => (
          <div key={c.id} className={`flex gap-3 p-3 rounded-xl ${c.is_pinned ? "bg-primary/5 border border-primary/20" : "bg-muted/30"}`}>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {(c.user_name || "U")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {c.is_pinned && <Pin className="w-3 h-3 text-primary" />}
                <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
              </div>
              <p className="text-sm text-foreground">{c.content}</p>
            </div>
            {(c.user_id === user?.id || isAdmin) && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(c.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* New comment */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          disabled={loading}
          maxLength={500}
        />
        <Button type="submit" disabled={!newComment.trim() || loading} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default LessonComments;
