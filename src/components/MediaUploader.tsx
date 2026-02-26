import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Image, Video, Music, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaUploaderProps {
  onUploadComplete: (urls: string[], types: string[]) => void;
  userId: string;
}

export default function MediaUploader({ onUploadComplete, userId }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; type: string; file: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.split('/')[0],
      file
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (previews.length === 0) return;
    
    setUploading(true);
    const uploadedUrls: string[] = [];
    const uploadedTypes: string[] = [];

    try {
      for (const preview of previews) {
        const fileExt = preview.file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${Math.random()}.${fileExt}`;
        const bucket = preview.type === 'image' ? 'posts' : 
                      preview.type === 'video' ? 'streams' : 
                      preview.type === 'audio' ? 'dreamspaces' : 'posts';

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, preview.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
        uploadedTypes.push(preview.type);
      }

      onUploadComplete(uploadedUrls, uploadedTypes);
      setPreviews([]);
      toast.success(`${uploadedUrls.length} archivo(s) subido(s)`);
    } catch (error: any) {
      toast.error('Error al subir archivos: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border-accent/30 hover:border-accent"
        >
          <Upload className="w-4 h-4 mr-2" />
          Seleccionar Archivos
        </Button>

        {previews.length > 0 && (
          <Button
            onClick={uploadFiles}
            disabled={uploading}
            className="bg-gradient-quantum"
            size="sm"
          >
            {uploading ? 'Subiendo...' : `Subir ${previews.length} archivo(s)`}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-accent/20"
              >
                {preview.type === 'image' ? (
                  <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                ) : preview.type === 'video' ? (
                  <video src={preview.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    {getIcon(preview.type)}
                  </div>
                )}
                
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePreview(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}