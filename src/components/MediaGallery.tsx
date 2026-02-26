/**
 * 🎬 Media Gallery Component - TAMV MD-X4™
 * Visualización completa de fotos, videos y audios
 */

import { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio';
}

interface MediaGalleryProps {
  mediaUrls?: string[];
  mediaTypes?: string[];
}

export function MediaGallery({ mediaUrls = [], mediaTypes = [] }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const mediaItems: MediaItem[] = mediaUrls.map((url, index) => ({
    url,
    type: (mediaTypes[index] || 'image') as 'image' | 'video' | 'audio'
  }));

  const renderMediaPreview = (item: MediaItem, index: number) => {
    switch (item.type) {
      case 'image':
        return (
          <div
            key={index}
            className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg border-2 border-primary/20 hover:border-primary/60 transition-all duration-300"
            onClick={() => setSelectedMedia(item)}
          >
            <img
              src={item.url}
              alt={`Media ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <Maximize2 className="w-5 h-5 text-pearl-white" />
            </div>
          </div>
        );

      case 'video':
        return (
          <div
            key={index}
            className="relative group cursor-pointer aspect-video overflow-hidden rounded-lg border-2 border-accent/20 hover:border-accent/60 transition-all duration-300"
            onClick={() => setSelectedMedia(item)}
          >
            <video
              src={item.url}
              className="w-full h-full object-cover"
              muted
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div
            key={index}
            className="relative group cursor-pointer aspect-video overflow-hidden rounded-lg border-2 border-crystal/20 hover:border-crystal/60 transition-all duration-300 bg-gradient-to-br from-primary/10 to-accent/10"
            onClick={() => setSelectedMedia(item)}
          >
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
              <div className="w-20 h-20 rounded-full bg-crystal/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Volume2 className="w-10 h-10 text-crystal" />
              </div>
              <p className="text-sm text-muted-foreground">Audio {index + 1}</p>
            </div>
          </div>
        );
    }
  };

  const renderFullMediaView = (item: MediaItem) => {
    switch (item.type) {
      case 'image':
        return (
          <img
            src={item.url}
            alt="Full view"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        );

      case 'video':
        return (
          <div className="relative max-w-full">
            <video
              src={item.url}
              className="max-w-full max-h-[80vh] rounded-lg"
              controls
              autoPlay
              muted={isMuted}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/60 backdrop-blur-sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="w-full max-w-md p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-crystal/20 backdrop-blur-sm flex items-center justify-center">
                <Volume2 className="w-16 h-16 text-crystal" />
              </div>
              <audio
                src={item.url}
                controls
                autoPlay
                className="w-full"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {mediaItems.map((item, index) => renderMediaPreview(item, index))}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-xl border-primary/20">
          <div className="flex items-center justify-center p-4">
            {selectedMedia && renderFullMediaView(selectedMedia)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
