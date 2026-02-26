/**
 * 👥 Groups & Communities - TAMV MD-X4™
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Lock, Globe, Crown, Search, Plus } from 'lucide-react';

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState('');

  const groups = [
    { id: 1, name: 'Quantum Creators', members: 1284, type: 'public', verified: true, description: 'Creadores de contenido multisensorial' },
    { id: 2, name: 'DreamSpace Architects', members: 892, type: 'public', verified: true, description: 'Constructores de mundos XR' },
    { id: 3, name: 'AI Consciousness Lab', members: 2103, type: 'private', verified: true, description: 'Investigación de IA consciente' },
    { id: 4, name: 'TAMV University Alumni', members: 456, type: 'public', verified: false, description: 'Comunidad de graduados' },
    { id: 5, name: 'Emotional Economy Guild', members: 678, type: 'private', verified: true, description: 'Economía ética y consciente' },
    { id: 6, name: 'Metaverse Pioneers', members: 1567, type: 'public', verified: true, description: 'Exploradores del metaverso' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-crystal bg-clip-text text-transparent">
                Grupos & Comunidades
              </h1>
              <p className="text-muted-foreground mt-2">Conecta con mentes afines</p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Crear Grupo
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Buscar grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-all border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{group.name}</h3>
                        {group.verified && (
                          <Badge className="bg-primary">
                            <Crown className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{group.members.toLocaleString()} miembros</span>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      {group.type === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {group.type === 'public' ? 'Público' : 'Privado'}
                    </Badge>
                  </div>

                  <Button className="w-full">Unirse</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
