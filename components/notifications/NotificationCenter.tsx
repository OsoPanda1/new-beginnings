/**
 * 🔔 Notification Center - TAMV MD-X4™
 * Real-time notification dropdown with animations
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, CheckCheck, Trash2, X, Shield, 
  AlertTriangle, CheckCircle, Gift, Info,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  guardian: Shield,
  warning: AlertTriangle,
  error: AlertTriangle,
  success: CheckCircle,
  reward: Gift,
  info: Info
};

const typeColors: Record<string, string> = {
  guardian: "text-primary bg-primary/20",
  warning: "text-amber-500 bg-amber-500/20",
  error: "text-destructive bg-destructive/20",
  success: "text-emerald-500 bg-emerald-500/20",
  reward: "text-accent bg-accent/20",
  info: "text-blue-500 bg-blue-500/20"
};

function NotificationItem({ 
  notification, 
  onMarkRead, 
  onDelete,
  onNavigate 
}: { 
  notification: Notification; 
  onMarkRead: () => void;
  onDelete: () => void;
  onNavigate?: () => void;
}) {
  const Icon = typeIcons[notification.type] || Bell;
  const colorClass = typeColors[notification.type] || typeColors.info;

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'ahora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-3 rounded-lg border transition-all cursor-pointer group ${
        notification.is_read 
          ? 'bg-background/50 border-border/50' 
          : 'bg-primary/5 border-primary/20 hover:border-primary/40'
      }`}
      onClick={() => {
        if (!notification.is_read) onMarkRead();
        if (notification.action_url && onNavigate) onNavigate();
      }}
    >
      <div className="flex gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium truncate ${
              notification.is_read ? 'text-muted-foreground' : 'text-foreground'
            }`}>
              {notification.title}
            </p>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {timeAgo(notification.created_at)}
            </span>
          </div>
          {notification.message && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
          )}
          {notification.action_url && (
            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
              <ExternalLink className="w-3 h-3" />
              <span>Ver más</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
}

export function NotificationCenter() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/10"
        >
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge className="h-5 min-w-5 px-1 bg-destructive text-destructive-foreground text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 glass-effect border-primary/20"
        align="end"
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-foreground">Notificaciones</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={markAllAsRead}
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="p-2 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <AnimatePresence>
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={() => markAsRead(notification.id)}
                    onDelete={() => deleteNotification(notification.id)}
                    onNavigate={() => {
                      if (notification.action_url) {
                        navigate(notification.action_url);
                        setOpen(false);
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
