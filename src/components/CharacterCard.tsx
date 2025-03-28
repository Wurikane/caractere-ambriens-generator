
import React from 'react';
import { Card } from './ui/card';
import { Character } from '@/types/character';
import { Eye, Lock, Edit, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface CharacterCardProps {
  character: Character;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onGeneratePDF: (id: string) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  onView, 
  onEdit,
  onGeneratePDF
}) => {
  return (
    <div className="victorian-card hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="victorian-title text-xl">{character.name}</h3>
        {character.locked && (
          <Lock className="h-5 w-5 text-secondary" />
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-muted-foreground text-sm">
          <span className="text-primary/80">Génération:</span> {character.generation}
        </p>
        <p className="text-muted-foreground text-sm">
          <span className="text-primary/80">Points:</span> {character.pointsTotal}
        </p>
        <p className="text-muted-foreground text-sm">
          <span className="text-primary/80">Pouvoirs:</span> {character.powers.length > 0 
            ? character.powers.map(p => p.name).join(', ') 
            : 'Aucun'}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 victorian-button bg-opacity-20 hover:bg-opacity-30"
          onClick={() => onView(character.id)}
        >
          <Eye className="h-4 w-4 mr-2" /> Voir
        </Button>
        
        {!character.locked && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 victorian-button bg-opacity-20 hover:bg-opacity-30"
            onClick={() => onEdit(character.id)}
          >
            <Edit className="h-4 w-4 mr-2" /> Éditer
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 victorian-button bg-opacity-20 hover:bg-opacity-30"
          onClick={() => onGeneratePDF(character.id)}
        >
          <FileText className="h-4 w-4 mr-2" /> PDF
        </Button>
      </div>
    </div>
  );
};

export default CharacterCard;
