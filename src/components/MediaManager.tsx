import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Video, Music, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  preview?: string | undefined;
}

interface MediaManagerProps {
  onMediaSelect?: (files: MediaFile[]) => void;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video' | 'audio' | 'document')[];
}

export default function MediaManager({ 
  onMediaSelect, 
  maxFiles = 5,
  allowedTypes = ['image', 'video', 'audio', 'document']
}: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles: File[]) => {
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    const newFiles: MediaFile[] = selectedFiles.map((file) => {
      const type = getFileType(file);
      const previewUrl = type === 'image' ? URL.createObjectURL(file) : undefined;
      return {
        id: Math.random().toString(36),
        type,
        url: URL.createObjectURL(file),
        name: file.name,
        preview: previewUrl,
      };
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onMediaSelect?.(updatedFiles);
    toast.success(`${newFiles.length} archivo(s) añadido(s)`);
  };

  const getFileType = (file: File): MediaFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onMediaSelect?.(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const getIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all ${isDragging 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-primary/30 hover:border-primary/50'
          }
        `}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={allowedTypes.map(t => {
            switch(t) {
              case 'image': return 'image/*';
              case 'video': return 'video/*';
              case 'audio': return 'audio/*';
              default: return '*/*';
            }
          }).join(',')}
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="font-orbitron font-bold mb-2">Arrastra archivos aquí</h3>
        <p className="text-sm text-muted-foreground">
          o haz clic para seleccionar ({maxFiles - files.length} restantes)
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Soporta: imágenes, videos, audio, documentos
        </p>
      </motion.div>

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="relative p-3 glass-effect">
              <Button
                size="icon"
                variant="ghost"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90"
                onClick={() => removeFile(file.id)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="aspect-square rounded-lg bg-muted/50 flex items-center justify-center mb-2 overflow-hidden">
                {file.type === 'image' && file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                ) : file.type === 'video' ? (
                  <video src={file.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-primary">{getIcon(file.type)}</div>
                )}
              </div>

              <p className="text-xs truncate text-center">{file.name}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
