
import React, { useState } from 'react';
import { CharacterPower } from '@/types/character';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PowersTabProps {
  powers: CharacterPower[];
  updatePowers: (powers: CharacterPower[]) => void;
}

const AVAILABLE_POWERS = [
  { 
    id: 'pattern', 
    name: 'La Marelle', 
    description: 'Permet de se déplacer entre les Ombres et d\'influencer la réalité.',
    difficulty: 'Très élevée',
    cost: 150
  },
  { 
    id: 'logrus', 
    name: 'Le Logrus', 
    description: 'Permet de manipuler les forces du Chaos et d\'atteindre des objets à distance.',
    difficulty: 'Très élevée',
    cost: 150
  },
  { 
    id: 'trump', 
    name: 'Les Atouts', 
    description: 'Permet de créer des cartes magiques pour communiquer et se téléporter.',
    difficulty: 'Élevée',
    cost: 120
  },
  { 
    id: 'shapeshifting', 
    name: 'Métamorphose', 
    description: 'Permet de changer de forme et d\'apparence.',
    difficulty: 'Moyenne',
    cost: 100
  },
  { 
    id: 'sorcery', 
    name: 'Sorcellerie', 
    description: 'Permet de lancer des sorts et de créer des effets magiques.',
    difficulty: 'Moyenne',
    cost: 100
  },
  { 
    id: 'conjuration', 
    name: 'Conjuration', 
    description: 'Permet de créer des objets à partir de rien.',
    difficulty: 'Moyenne',
    cost: 90
  },
  { 
    id: 'powerwords', 
    name: 'Mots de Pouvoir', 
    description: 'Permet d\'invoquer des effets magiques instantanés par des mots.',
    difficulty: 'Facile',
    cost: 80
  },
  { 
    id: 'artifacts', 
    name: 'Artefacts', 
    description: 'Permet d\'utiliser et de créer des objets magiques.',
    difficulty: 'Facile',
    cost: 70
  },
  { 
    id: 'shadow_walking', 
    name: 'Marche dans les Ombres', 
    description: 'Permet de voyager entre les Ombres sans la Marelle ou le Logrus.',
    difficulty: 'Facile',
    cost: 60
  },
  { 
    id: 'broken_pattern', 
    name: 'Marelle Brisée', 
    description: 'Version imparfaite de la Marelle, moins puissante mais plus accessible.',
    difficulty: 'Élevée',
    cost: 110
  },
  { 
    id: 'constructs', 
    name: 'Constructions', 
    description: 'Permet de créer des structures magiques permanentes.',
    difficulty: 'Moyenne',
    cost: 90
  },
  { 
    id: 'blood_curse', 
    name: 'Malédiction de Sang', 
    description: 'Permet de lancer des malédictions puissantes liées au sang.',
    difficulty: 'Élevée',
    cost: 120
  },
  { 
    id: 'jewel_manipulation', 
    name: 'Manipulation de la Joyau', 
    description: 'Permet de manipuler la Joyau du Jugement et ses pouvoirs.',
    difficulty: 'Très élevée',
    cost: 150
  }
];

const PowersTab: React.FC<PowersTabProps> = ({ powers, updatePowers }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPower = (power: typeof AVAILABLE_POWERS[0]) => {
    if (powers.length >= 3) {
      toast({
        title: "Limite atteinte",
        description: "Vous ne pouvez pas avoir plus de 3 pouvoirs",
        variant: "destructive"
      });
      return;
    }
    
    if (powers.some(p => p.id === power.id)) {
      toast({
        title: "Pouvoir déjà sélectionné",
        description: `Vous possédez déjà ${power.name}`,
        variant: "destructive"
      });
      return;
    }
    
    const newPower: CharacterPower = {
      id: power.id,
      name: power.name,
      level: 1,
      description: power.description,
      cost: power.cost,
      progress: 0
    };
    
    updatePowers([...powers, newPower]);
    setDialogOpen(false);
    
    toast({
      title: "Pouvoir ajouté",
      description: `${power.name} a été ajouté à vos pouvoirs`
    });
  };

  const handleRemovePower = (powerId: string) => {
    updatePowers(powers.filter(p => p.id !== powerId));
    
    toast({
      title: "Pouvoir retiré",
      description: "Le pouvoir a été retiré de votre personnage"
    });
  };

  const handleUpdatePowerLevel = (powerId: string, level: number) => {
    updatePowers(powers.map(p => 
      p.id === powerId ? { ...p, level, progress: 0 } : p
    ));
  };

  const handleUpdatePowerProgress = (powerId: string, progress: number) => {
    updatePowers(powers.map(p => 
      p.id === powerId ? { ...p, progress } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-black/20 border border-primary/30 rounded-sm">
        <p className="text-sm text-muted-foreground mb-2">
          Les personnages peuvent posséder jusqu'à 3 Pouvoirs. Chaque Pouvoir a un coût en points
          qui est déduit de votre total disponible. Les Pouvoirs les plus puissants sont aussi
          les plus coûteux.
        </p>
        <p className="text-sm text-muted-foreground">
          Chaque Pouvoir dispose d'une feuille de progression qui permet de suivre son évolution
          et son utilisation dans le jeu.
        </p>
      </div>
      
      {powers.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-primary/50 rounded-sm">
          <p className="text-muted-foreground mb-4">Aucun pouvoir sélectionné</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="victorian-button">
                <Plus size={18} className="mr-2" /> Ajouter un Pouvoir
              </Button>
            </DialogTrigger>
            <DialogContent className="victorian-card max-w-3xl">
              <DialogHeader>
                <DialogTitle className="victorian-title text-xl mb-4">Choisir un Pouvoir</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-2">
                {AVAILABLE_POWERS.map((power) => (
                  <div 
                    key={power.id} 
                    className="victorian-border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleAddPower(power)}
                  >
                    <h3 className="text-primary font-medium mb-1">{power.name}</h3>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Difficulté: {power.difficulty}</span>
                      <span className="text-primary font-bold">{power.cost} points</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{power.description}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-6">
          {powers.map((power) => (
            <div key={power.id} className="victorian-border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-primary font-medium text-lg">{power.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-primary/40">{power.cost} points</Badge>
                  <button
                    type="button"
                    onClick={() => handleRemovePower(power.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{power.description}</p>
              
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Niveau d'expertise: {power.level}</Label>
                    <span className="text-xs text-muted-foreground">
                      {power.level === 1 ? 'Novice' : 
                        power.level === 2 ? 'Apprenti' : 
                        power.level === 3 ? 'Adepte' : 
                        power.level === 4 ? 'Expert' : 'Maître'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`flex-1 p-2 border ${
                          power.level === level 
                            ? 'bg-primary/40 border-primary' 
                            : 'bg-transparent border-muted hover:border-primary/50'
                        } rounded-sm transition-colors`}
                        onClick={() => handleUpdatePowerLevel(power.id, level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Progression vers le niveau suivant: {power.progress}%</Label>
                  </div>
                  <div className="w-full bg-muted/30 rounded-sm h-2">
                    <div 
                      className="bg-primary h-2 rounded-sm transition-all"
                      style={{ width: `${power.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="victorian-button bg-transparent text-xs"
                      onClick={() => handleUpdatePowerProgress(power.id, Math.max(0, power.progress - 10))}
                    >
                      -10%
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="victorian-button bg-transparent text-xs"
                      onClick={() => handleUpdatePowerProgress(power.id, Math.min(100, power.progress + 10))}
                    >
                      +10%
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {powers.length < 3 && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="victorian-button w-full">
                  <Plus size={18} className="mr-2" /> Ajouter un Pouvoir ({powers.length}/3)
                </Button>
              </DialogTrigger>
              <DialogContent className="victorian-card max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="victorian-title text-xl mb-4">Choisir un Pouvoir</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-2">
                  {AVAILABLE_POWERS
                    .filter(power => !powers.some(p => p.id === power.id))
                    .map((power) => (
                      <div 
                        key={power.id} 
                        className="victorian-border cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleAddPower(power)}
                      >
                        <h3 className="text-primary font-medium mb-1">{power.name}</h3>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Difficulté: {power.difficulty}</span>
                          <span className="text-primary font-bold">{power.cost} points</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{power.description}</p>
                      </div>
                    ))
                  }
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default PowersTab;
