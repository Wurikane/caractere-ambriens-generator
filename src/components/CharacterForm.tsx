
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ProfileTab from './character-tabs/ProfileTab';
import CharacteristicsTab from './character-tabs/CharacteristicsTab';
import BloodlinksTab from './character-tabs/BloodlinksTab';
import PowersTab from './character-tabs/PowersTab';
import { Character } from '@/types/character';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp } from 'lucide-react';

interface CharacterFormProps {
  character?: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ 
  character, 
  onSave, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<Character>(
    character || {
      id: crypto.randomUUID(),
      name: '',
      origin: '',
      age: 0,
      symbol: '',
      generation: 1,
      karma: 0,
      contributions: [],
      weaknesses: [],
      allies: [],
      enemies: [],
      characteristics: {
        // Valeurs par défaut
        dexterity: 0,
        strength: 0,
        reflex: 0,
        adaptation: 0,
        regeneration: 0,
        endurance: 0,
        intelligence: 0,
        concentration: 0,
        will: 0,
        senses: 0,
        sixthSense: 0,
        empathy: 0,
        eloquence: 0,
        intimidation: 0,
        appearance: 0,
        // Calculées
        physical: 0,
        enduranceTotal: 0,
        psyche: 0,
        perception: 0,
        charisma: 0
      },
      bloodlinks: {
        parents: [],
        children: [],
        siblings: []
      },
      powers: [],
      skills: [],
      pointsBase: 0,
      pointsTotal: 0,
      pointsUsed: 0,
      locked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );
  const { toast } = useToast();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Mise à jour du calcul des points de base selon la génération
  React.useEffect(() => {
    const basePoints = formData.generation === 1 
      ? 800 
      : formData.generation === 2 
        ? 600 
        : 400;
        
    setFormData(prev => ({
      ...prev,
      pointsBase: basePoints,
      pointsTotal: calculateTotalPoints(basePoints, prev)
    }));
  }, [formData.generation, formData.karma, formData.weaknesses, formData.allies, formData.enemies, formData.contributions]);

  // Calcul du total des points disponibles
  const calculateTotalPoints = (basePoints: number, character: Character) => {
    let total = basePoints;
    
    // Ajouter des points pour le karma négatif et les faiblesses
    total += character.karma < 0 ? Math.abs(character.karma) * 10 : 0;
    total += character.weaknesses.length * 15;
    
    // Soustraire des points pour le karma positif, les alliés et les contributions
    total -= character.karma > 0 ? character.karma * 10 : 0;
    total -= character.allies.length * 5;
    total -= character.contributions.length * 10;
    
    // Les ennemis ajoutent des points
    total += character.enemies.length * 5;
    
    return total;
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { 
        ...prev, 
        [field]: value,
        updatedAt: new Date().toISOString() 
      };
      
      return updated;
    });
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section as keyof Character],
          [field]: value
        },
        updatedAt: new Date().toISOString()
      };
      
      return updated;
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowBackToTop(target.scrollTop > 300);
  };

  const scrollToTop = () => {
    const formContainer = document.getElementById('character-form-container');
    if (formContainer) {
      formContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    // Vérifier si les champs obligatoires sont remplis
    if (!formData.name) {
      toast({
        title: "Informations incomplètes",
        description: "Le nom du personnage est obligatoire",
        variant: "destructive"
      });
      setActiveTab('profile');
      return;
    }

    // Mettre à jour la date de modification
    const finalCharacter = {
      ...formData,
      updatedAt: new Date().toISOString()
    };

    onSave(finalCharacter);
    toast({
      title: "Personnage sauvegardé",
      description: `${finalCharacter.name} a été enregistré avec succès`
    });
  };

  return (
    <div 
      id="character-form-container"
      className="victorian-border overflow-y-auto max-h-[80vh]"
      onScroll={handleScroll}
    >
      <h2 className="victorian-title text-2xl mb-6">
        {character ? `Modifier: ${character.name}` : 'Nouveau Personnage Ambrien'}
      </h2>
      
      <div className="points-summary mb-6 p-3 border border-primary/30 bg-black/20 rounded-sm">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Points de base (Gen {formData.generation}):</span>
          <span className="text-primary">{formData.pointsBase}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Modificateurs:</span>
          <span className={`${formData.pointsTotal - formData.pointsBase > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formData.pointsTotal - formData.pointsBase > 0 ? '+' : ''}
            {formData.pointsTotal - formData.pointsBase}
          </span>
        </div>
        <div className="flex justify-between font-medium mt-1 pt-1 border-t border-primary/20">
          <span>Total disponible:</span>
          <span className="text-primary">{formData.pointsTotal}</span>
        </div>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="profile" className="victorian-tab">Profil</TabsTrigger>
          <TabsTrigger value="characteristics" className="victorian-tab">Caractéristiques</TabsTrigger>
          <TabsTrigger value="bloodlinks" className="victorian-tab">Liens de Sang</TabsTrigger>
          <TabsTrigger value="powers" className="victorian-tab">Pouvoirs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="animate-fade-in">
          <ProfileTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        </TabsContent>
        
        <TabsContent value="characteristics" className="animate-fade-in">
          <CharacteristicsTab 
            characteristics={formData.characteristics}
            updateCharacteristics={(field, value) => 
              updateNestedFormData('characteristics', field, value)
            }
          />
        </TabsContent>
        
        <TabsContent value="bloodlinks" className="animate-fade-in">
          <BloodlinksTab 
            bloodlinks={formData.bloodlinks}
            updateBloodlinks={(field, value) => 
              updateNestedFormData('bloodlinks', field, value)
            }
          />
        </TabsContent>
        
        <TabsContent value="powers" className="animate-fade-in">
          <PowersTab 
            powers={formData.powers}
            updatePowers={(powers) => updateFormData('powers', powers)}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-8 pt-4 border-t border-primary/20">
        <Button 
          variant="outline" 
          className="victorian-button bg-transparent hover:bg-muted"
          onClick={onCancel}
        >
          Annuler
        </Button>
        
        <Button 
          className="victorian-button"
          onClick={handleSave}
        >
          Sauvegarder
        </Button>
      </div>
      
      {showBackToTop && (
        <Button
          className="fixed bottom-4 right-4 rounded-full w-10 h-10 p-0 bg-primary/80 hover:bg-primary"
          onClick={scrollToTop}
        >
          <ArrowUp size={20} />
        </Button>
      )}
    </div>
  );
};

export default CharacterForm;
