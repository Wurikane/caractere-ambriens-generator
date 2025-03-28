
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Character } from '@/types/character';
import { X, Plus } from 'lucide-react';

interface ProfileTabProps {
  formData: Character;
  updateFormData: (field: string, value: any) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ formData, updateFormData }) => {
  const [newContribution, setNewContribution] = React.useState('');
  const [newWeakness, setNewWeakness] = React.useState('');
  const [newAlly, setNewAlly] = React.useState('');
  const [newEnemy, setNewEnemy] = React.useState('');

  const handleAddListItem = (field: 'contributions' | 'weaknesses' | 'allies' | 'enemies', value: string) => {
    if (!value.trim()) return;
    
    updateFormData(field, [...formData[field], value.trim()]);
    
    // Reset the input field
    switch (field) {
      case 'contributions':
        setNewContribution('');
        break;
      case 'weaknesses':
        setNewWeakness('');
        break;
      case 'allies':
        setNewAlly('');
        break;
      case 'enemies':
        setNewEnemy('');
        break;
    }
  };

  const handleRemoveListItem = (field: 'contributions' | 'weaknesses' | 'allies' | 'enemies', index: number) => {
    updateFormData(field, formData[field].filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            className="victorian-input"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Nom du personnage"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="origin">Origine</Label>
          <Input
            id="origin"
            className="victorian-input"
            value={formData.origin}
            onChange={(e) => updateFormData('origin', e.target.value)}
            placeholder="Royaume, Ombre, etc."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="age">Âge</Label>
          <Input
            id="age"
            type="number"
            className="victorian-input"
            value={formData.age || ''}
            onChange={(e) => updateFormData('age', parseInt(e.target.value) || 0)}
            placeholder="Âge du personnage"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbole personnel</Label>
          <Input
            id="symbol"
            className="victorian-input"
            value={formData.symbol}
            onChange={(e) => updateFormData('symbol', e.target.value)}
            placeholder="Emblème, armoiries, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="generation">Génération</Label>
          <Select
            value={formData.generation.toString()}
            onValueChange={(value) => updateFormData('generation', parseInt(value))}
          >
            <SelectTrigger className="victorian-input">
              <SelectValue placeholder="Choisir la génération" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Première génération</SelectItem>
              <SelectItem value="2">Deuxième génération</SelectItem>
              <SelectItem value="3">Troisième génération</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="karma">Karma ({formData.karma})</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateFormData('karma', Math.max(-10, formData.karma - 1))}
            className="victorian-button bg-transparent"
          >
            -
          </Button>
          <input
            type="range"
            min="-10"
            max="10"
            value={formData.karma}
            onChange={(e) => updateFormData('karma', parseInt(e.target.value))}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateFormData('karma', Math.min(10, formData.karma + 1))}
            className="victorian-button bg-transparent"
          >
            +
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {formData.karma > 0 
            ? `Karma positif: -${formData.karma * 10} points` 
            : formData.karma < 0 
              ? `Karma négatif: +${Math.abs(formData.karma * 10)} points` 
              : 'Karma neutre: 0 points'}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Contributions (+10 points chacune)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.contributions.map((contribution, index) => (
            <Badge key={index} className="bg-primary/30 text-primary-foreground">
              {contribution}
              <button
                type="button"
                onClick={() => handleRemoveListItem('contributions', index)}
                className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newContribution}
            onChange={(e) => setNewContribution(e.target.value)}
            placeholder="Nouvelle contribution"
            className="victorian-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddListItem('contributions', newContribution)}
            className="victorian-button bg-transparent"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Faiblesses (-15 points chacune)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.weaknesses.map((weakness, index) => (
            <Badge key={index} className="bg-secondary/30 text-secondary-foreground">
              {weakness}
              <button
                type="button"
                onClick={() => handleRemoveListItem('weaknesses', index)}
                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newWeakness}
            onChange={(e) => setNewWeakness(e.target.value)}
            placeholder="Nouvelle faiblesse"
            className="victorian-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddListItem('weaknesses', newWeakness)}
            className="victorian-button bg-transparent"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Alliés (-5 points chacun)</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.allies.map((ally, index) => (
              <Badge key={index} className="bg-primary/30 text-primary-foreground">
                {ally}
                <button
                  type="button"
                  onClick={() => handleRemoveListItem('allies', index)}
                  className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newAlly}
              onChange={(e) => setNewAlly(e.target.value)}
              placeholder="Nouvel allié"
              className="victorian-input"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddListItem('allies', newAlly)}
              className="victorian-button bg-transparent"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Ennemis (+5 points chacun)</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.enemies.map((enemy, index) => (
              <Badge key={index} className="bg-secondary/30 text-secondary-foreground">
                {enemy}
                <button
                  type="button"
                  onClick={() => handleRemoveListItem('enemies', index)}
                  className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newEnemy}
              onChange={(e) => setNewEnemy(e.target.value)}
              placeholder="Nouvel ennemi"
              className="victorian-input"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddListItem('enemies', newEnemy)}
              className="victorian-button bg-transparent"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
