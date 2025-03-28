
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CharacterBloodlinks } from '@/types/character';
import { Plus, X, User, Users } from 'lucide-react';

interface BloodlinksTabProps {
  bloodlinks: CharacterBloodlinks;
  updateBloodlinks: (field: string, value: any) => void;
}

const BloodlinksTab: React.FC<BloodlinksTabProps> = ({ 
  bloodlinks, 
  updateBloodlinks 
}) => {
  const [newParent, setNewParent] = React.useState('');
  const [newSibling, setNewSibling] = React.useState('');
  const [newChild, setNewChild] = React.useState('');

  const handleAddRelative = (field: 'parents' | 'siblings' | 'children', value: string) => {
    if (!value.trim()) return;
    
    updateBloodlinks(field, [...bloodlinks[field], value.trim()]);
    
    // Reset the input field
    switch (field) {
      case 'parents':
        setNewParent('');
        break;
      case 'siblings':
        setNewSibling('');
        break;
      case 'children':
        setNewChild('');
        break;
    }
  };

  const handleRemoveRelative = (field: 'parents' | 'siblings' | 'children', index: number) => {
    updateBloodlinks(field, bloodlinks[field].filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="p-4 bg-black/20 border border-primary/30 rounded-sm">
        <p className="text-sm text-muted-foreground">
          Cette section sert à définir les liens de sang de votre personnage. Vous pouvez ajouter 
          des parents, des frères et sœurs, et des enfants. Ces informations peuvent être secrètes 
          et visibles uniquement par le Maître de Jeu.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg flex items-center">
          <User size={20} className="mr-2 text-primary/80" />
          Parents
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {bloodlinks.parents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun parent connu</p>
          ) : (
            bloodlinks.parents.map((parent, index) => (
              <Badge key={index} className="bg-primary/30 text-primary-foreground">
                {parent}
                <button
                  type="button"
                  onClick={() => handleRemoveRelative('parents', index)}
                  className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={newParent}
            onChange={(e) => setNewParent(e.target.value)}
            placeholder="Ajouter un parent"
            className="victorian-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddRelative('parents', newParent)}
            className="victorian-button bg-transparent"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg flex items-center">
          <Users size={20} className="mr-2 text-primary/80" />
          Frères et Sœurs
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {bloodlinks.siblings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun frère ou sœur connu</p>
          ) : (
            bloodlinks.siblings.map((sibling, index) => (
              <Badge key={index} className="bg-secondary/30 text-secondary-foreground">
                {sibling}
                <button
                  type="button"
                  onClick={() => handleRemoveRelative('siblings', index)}
                  className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSibling}
            onChange={(e) => setNewSibling(e.target.value)}
            placeholder="Ajouter un frère ou une sœur"
            className="victorian-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddRelative('siblings', newSibling)}
            className="victorian-button bg-transparent"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg flex items-center">
          <User size={20} className="mr-2 text-primary/80" />
          Enfants
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {bloodlinks.children.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun enfant connu</p>
          ) : (
            bloodlinks.children.map((child, index) => (
              <Badge key={index} className="bg-primary/30 text-primary-foreground">
                {child}
                <button
                  type="button"
                  onClick={() => handleRemoveRelative('children', index)}
                  className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={newChild}
            onChange={(e) => setNewChild(e.target.value)}
            placeholder="Ajouter un enfant"
            className="victorian-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddRelative('children', newChild)}
            className="victorian-button bg-transparent"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      <div className="victorian-border p-4 mt-6">
        <h3 className="text-primary font-medium mb-2">Note du Maître de Jeu:</h3>
        <p className="text-sm text-muted-foreground">
          Les arbres généalogiques complets et les lignes de sang cachées peuvent être consultés
          uniquement par le Maître de Jeu dans la section d'administration. Certains liens familiaux
          peuvent être cachés aux joueurs pour des raisons scénaristiques.
        </p>
      </div>
    </div>
  );
};

export default BloodlinksTab;
