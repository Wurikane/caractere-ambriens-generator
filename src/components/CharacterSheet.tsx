
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Character } from '@/types/character';
import ProfileTab from './character-tabs/ProfileTab';
import CharacteristicsTab from './character-tabs/CharacteristicsTab';
import BloodlinksTab from './character-tabs/BloodlinksTab';
import PowersTab from './character-tabs/PowersTab';
import { ArrowLeft, Lock, Unlock, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CharacterSheetProps {
  character: Character;
  readOnly?: boolean;
  onBack: () => void;
  onLockToggle?: (character: Character) => void;
  generatePDF?: boolean;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ 
  character, 
  readOnly = false,
  onBack,
  onLockToggle,
  generatePDF = false
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleLockToggle = () => {
    if (onLockToggle) {
      const updatedCharacter = {
        ...character,
        locked: !character.locked,
        updatedAt: new Date().toISOString()
      };
      onLockToggle(updatedCharacter);
      
      toast({
        title: updatedCharacter.locked ? "Personnage verrouillé" : "Personnage déverrouillé",
        description: updatedCharacter.locked 
          ? "Le personnage ne peut plus être modifié" 
          : "Le personnage peut maintenant être modifié"
      });
    }
  };

  const handleGeneratePDF = async () => {
    if (!sheetRef.current) return;

    try {
      toast({
        title: "Génération du PDF",
        description: "Préparation de la fiche de personnage...",
      });

      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1a1f2c' // Couleur de fond sombre
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`personnage-ambrien-${character.name}.pdf`);

      toast({
        title: "PDF généré avec succès",
        description: `La fiche de personnage ${character.name} a été téléchargée.`,
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Si generatePDF est true, générer automatiquement le PDF
  React.useEffect(() => {
    if (generatePDF) {
      setTimeout(() => {
        handleGeneratePDF();
        if (onBack) onBack();
      }, 500); // Délai pour laisser le temps au composant de se monter
    }
  }, [generatePDF]);

  return (
    <div className="victorian-border overflow-y-auto max-h-[80vh]" ref={sheetRef}>
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="victorian-button bg-transparent"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        
        <h2 className="victorian-title text-2xl">{character.name}</h2>
        
        <div className="flex space-x-2">
          {onLockToggle && (
            <Button 
              variant="outline" 
              size="sm" 
              className="victorian-button bg-transparent"
              onClick={handleLockToggle}
            >
              {character.locked ? (
                <>
                  <Lock className="h-4 w-4 mr-2" /> Verrouillé
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" /> Déverrouillé
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="victorian-button bg-transparent"
            onClick={handleGeneratePDF}
          >
            <FileText className="h-4 w-4 mr-2" /> PDF
          </Button>
        </div>
      </div>
      
      <div className="points-summary mb-6 p-3 border border-primary/30 bg-black/20 rounded-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-muted-foreground text-sm">Génération</p>
            <p className="text-primary font-medium">{character.generation}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Points disponibles</p>
            <p className="text-primary font-medium">{character.pointsTotal}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Karma</p>
            <p className={`font-medium ${
              character.karma > 0 
                ? 'text-green-500' 
                : character.karma < 0 
                  ? 'text-red-500' 
                  : 'text-primary'
            }`}>
              {character.karma > 0 ? '+' : ''}{character.karma}
            </p>
          </div>
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
            formData={character} 
            updateFormData={() => {}} // En lecture seule ou non modifiable
          />
        </TabsContent>
        
        <TabsContent value="characteristics" className="animate-fade-in">
          <CharacteristicsTab 
            characteristics={character.characteristics}
            updateCharacteristics={() => {}} // En lecture seule ou non modifiable
          />
        </TabsContent>
        
        <TabsContent value="bloodlinks" className="animate-fade-in">
          <BloodlinksTab 
            bloodlinks={character.bloodlinks}
            updateBloodlinks={() => {}} // En lecture seule ou non modifiable
          />
        </TabsContent>
        
        <TabsContent value="powers" className="animate-fade-in">
          <PowersTab 
            powers={character.powers}
            updatePowers={() => {}} // En lecture seule ou non modifiable
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CharacterSheet;
