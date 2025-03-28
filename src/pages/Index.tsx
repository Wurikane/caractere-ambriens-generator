
import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import CharacterCard from '@/components/CharacterCard';
import CharacterForm from '@/components/CharacterForm';
import CharacterSheet from '@/components/CharacterSheet';
import { Button } from '@/components/ui/button';
import { Character } from '@/types/character';
import { Plus, UserCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enum pour les différents états de l'interface
enum AppView {
  LOGIN,
  DASHBOARD,
  CREATE_CHARACTER,
  EDIT_CHARACTER,
  VIEW_CHARACTER
}

const Index = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  // Effet pour charger les personnages du stockage local
  useEffect(() => {
    const savedCharacters = localStorage.getItem('ambrien-characters');
    if (savedCharacters) {
      try {
        setCharacters(JSON.parse(savedCharacters));
      } catch (error) {
        console.error('Erreur lors du chargement des personnages:', error);
      }
    }
  }, []);

  // Effet pour sauvegarder les personnages dans le stockage local
  useEffect(() => {
    if (characters.length > 0) {
      localStorage.setItem('ambrien-characters', JSON.stringify(characters));
    }
  }, [characters]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView(AppView.DASHBOARD);
  };

  const handleCreateCharacter = () => {
    setSelectedCharacter(null);
    setView(AppView.CREATE_CHARACTER);
  };

  const handleViewCharacter = (id: string) => {
    const character = characters.find(c => c.id === id);
    if (character) {
      setSelectedCharacter(character);
      setView(AppView.VIEW_CHARACTER);
    }
  };

  const handleEditCharacter = (id: string) => {
    const character = characters.find(c => c.id === id);
    if (character) {
      if (character.locked) {
        toast({
          title: "Personnage verrouillé",
          description: "Ce personnage ne peut pas être modifié car il est verrouillé",
          variant: "destructive"
        });
        return;
      }
      setSelectedCharacter(character);
      setView(AppView.EDIT_CHARACTER);
    }
  };

  const handleSaveCharacter = (character: Character) => {
    if (characters.some(c => c.id === character.id)) {
      // Mettre à jour un personnage existant
      setCharacters(characters.map(c => c.id === character.id ? character : c));
    } else {
      // Ajouter un nouveau personnage
      setCharacters([...characters, character]);
    }
    setView(AppView.DASHBOARD);
  };

  const handleLockToggle = (character: Character) => {
    setCharacters(characters.map(c => c.id === character.id ? character : c));
    setSelectedCharacter(character);
  };

  const renderView = () => {
    switch (view) {
      case AppView.LOGIN:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold font-playfair text-primary mb-4">
                Générateur de Personnages Ambriens
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Bienvenue dans l'univers d'Ambre. Créez et gérez vos personnages
                pour vos aventures dans les Cours et les Ombres.
              </p>
            </div>
            <AuthForm onSuccess={handleLoginSuccess} />
          </div>
        );
        
      case AppView.DASHBOARD:
        return (
          <div className="container mx-auto p-6">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold font-playfair text-primary mb-4">
                Générateur de Personnages Ambriens
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Gérez vos personnages pour vos aventures à travers les Ombres et les Cours.
              </p>
            </header>
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="victorian-title text-2xl">Vos Personnages</h2>
              <Button 
                className="victorian-button"
                onClick={handleCreateCharacter}
              >
                <Plus className="mr-2 h-4 w-4" /> Créer un Personnage
              </Button>
            </div>
            
            {characters.length === 0 ? (
              <div className="victorian-border p-8 text-center">
                <UserCircle className="mx-auto h-12 w-12 text-primary/60 mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun personnage pour le moment</h3>
                <p className="text-muted-foreground mb-6">
                  Créez votre premier personnage pour commencer votre aventure dans Ambre
                </p>
                <Button 
                  className="victorian-button"
                  onClick={handleCreateCharacter}
                >
                  <Plus className="mr-2 h-4 w-4" /> Créer un Personnage
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <CharacterCard 
                    key={character.id}
                    character={character}
                    onView={handleViewCharacter}
                    onEdit={handleEditCharacter}
                  />
                ))}
              </div>
            )}
          </div>
        );
        
      case AppView.CREATE_CHARACTER:
      case AppView.EDIT_CHARACTER:
        return (
          <div className="container mx-auto p-6">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold font-playfair text-primary mb-2">
                {view === AppView.CREATE_CHARACTER ? 'Créer un Personnage' : 'Modifier un Personnage'}
              </h1>
            </header>
            
            <CharacterForm 
              character={selectedCharacter || undefined}
              onSave={handleSaveCharacter}
              onCancel={() => setView(AppView.DASHBOARD)}
            />
          </div>
        );
        
      case AppView.VIEW_CHARACTER:
        return (
          <div className="container mx-auto p-6">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold font-playfair text-primary mb-2">
                Fiche de Personnage
              </h1>
            </header>
            
            {selectedCharacter && (
              <CharacterSheet 
                character={selectedCharacter}
                readOnly={true}
                onBack={() => setView(AppView.DASHBOARD)}
                onLockToggle={handleLockToggle}
              />
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="ambrien-pattern min-h-screen">
      {renderView()}
    </div>
  );
};

export default Index;
