
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CharacterCharacteristics } from '@/types/character';

interface CharacteristicsTabProps {
  characteristics: CharacterCharacteristics;
  updateCharacteristics: (field: string, value: number) => void;
}

const CharacteristicsTab: React.FC<CharacteristicsTabProps> = ({ 
  characteristics, 
  updateCharacteristics 
}) => {
  // Calculer les caractéristiques principales
  useEffect(() => {
    const physical = Math.floor((characteristics.dexterity + characteristics.strength + characteristics.reflex) / 3);
    const enduranceTotal = Math.floor((characteristics.adaptation + characteristics.regeneration + characteristics.endurance) / 3);
    const psyche = Math.floor((characteristics.intelligence + characteristics.concentration + characteristics.will) / 3);
    const perception = Math.floor((characteristics.senses + characteristics.sixthSense + characteristics.empathy) / 3);
    const charisma = Math.floor((characteristics.eloquence + characteristics.intimidation + characteristics.appearance) / 3);
    
    updateCharacteristics('physical', physical);
    updateCharacteristics('enduranceTotal', enduranceTotal);
    updateCharacteristics('psyche', psyche);
    updateCharacteristics('perception', perception);
    updateCharacteristics('charisma', charisma);
  }, [
    characteristics.dexterity, characteristics.strength, characteristics.reflex,
    characteristics.adaptation, characteristics.regeneration, characteristics.endurance,
    characteristics.intelligence, characteristics.concentration, characteristics.will,
    characteristics.senses, characteristics.sixthSense, characteristics.empathy,
    characteristics.eloquence, characteristics.intimidation, characteristics.appearance
  ]);

  const renderCharacteristic = (
    name: string, 
    label: string, 
    value: number,
    min: number = 0,
    max: number = 100,
    step: number = 5
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor={name}>{label}</Label>
          <span className="text-primary font-medium">{value}</span>
        </div>
        <Slider
          id={name}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([val]) => updateCharacteristics(name, val)}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-5 gap-4 p-4 bg-black/20 border border-primary/30 rounded-sm">
        <div className="space-y-1 text-center">
          <h3 className="text-primary font-medium">Physique</h3>
          <p className="text-2xl font-bold">{characteristics.physical}</p>
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-primary font-medium">Endurance</h3>
          <p className="text-2xl font-bold">{characteristics.enduranceTotal}</p>
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-primary font-medium">Psyché</h3>
          <p className="text-2xl font-bold">{characteristics.psyche}</p>
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-primary font-medium">Perception</h3>
          <p className="text-2xl font-bold">{characteristics.perception}</p>
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-primary font-medium">Charisme</h3>
          <p className="text-2xl font-bold">{characteristics.charisma}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg">Caractéristiques Physiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCharacteristic('dexterity', 'Dextérité', characteristics.dexterity)}
          {renderCharacteristic('strength', 'Force', characteristics.strength)}
          {renderCharacteristic('reflex', 'Réflexe', characteristics.reflex)}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg">Caractéristiques d'Endurance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCharacteristic('adaptation', 'Adaptation', characteristics.adaptation)}
          {renderCharacteristic('regeneration', 'Régénération', characteristics.regeneration)}
          {renderCharacteristic('endurance', 'Résistance', characteristics.endurance)}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg">Caractéristiques Psychiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCharacteristic('intelligence', 'Intelligence', characteristics.intelligence)}
          {renderCharacteristic('concentration', 'Concentration', characteristics.concentration)}
          {renderCharacteristic('will', 'Volonté', characteristics.will)}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg">Caractéristiques de Perception</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCharacteristic('senses', 'Sens', characteristics.senses)}
          {renderCharacteristic('sixthSense', '6e Sens', characteristics.sixthSense)}
          {renderCharacteristic('empathy', 'Empathie', characteristics.empathy)}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="victorian-title text-lg">Caractéristiques de Charisme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCharacteristic('eloquence', 'Éloquence', characteristics.eloquence)}
          {renderCharacteristic('intimidation', 'Intimidation', characteristics.intimidation)}
          {renderCharacteristic('appearance', 'Apparence', characteristics.appearance)}
        </div>
      </div>
    </div>
  );
};

export default CharacteristicsTab;
