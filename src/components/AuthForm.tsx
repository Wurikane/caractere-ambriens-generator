
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

type AuthFormProps = {
  onSuccess: () => void;
};

type FormValues = {
  email: string;
  password: string;
  otp?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>();
  const { toast } = useToast();
  const [otpValue, setOtpValue] = useState('');

  const onSubmit = (data: FormValues) => {
    if (isLogin && !showOtp) {
      // Simuler l'envoi de l'OTP
      setTimeout(() => {
        setShowOtp(true);
        toast({
          title: "Code envoyé",
          description: "Un code de vérification a été envoyé à votre adresse e-mail",
        });
      }, 1000);
      return;
    }

    // Si OTP est actif, vérifier qu'il a 6 chiffres
    if (showOtp && (otpValue.length !== 6 || !/^\d+$/.test(otpValue))) {
      toast({
        title: "Code invalide",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive"
      });
      return;
    }

    // Simuler la connexion/inscription réussie
    setTimeout(() => {
      toast({
        title: isLogin ? "Connexion réussie" : "Inscription réussie",
        description: isLogin ? "Bienvenue dans le monde d'Ambre" : "Votre compte a été créé avec succès",
      });
      onSuccess();
    }, 1500);
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setValue('otp', value);
  };

  return (
    <div className="victorian-card max-w-md w-full mx-auto animate-fade-in">
      <h2 className="victorian-title text-2xl mb-6">
        {isLogin ? "Connexion" : "Inscription"}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground/90">Adresse e-mail</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              className="victorian-input pl-10"
              placeholder="votre@email.com"
              {...register("email", { required: "L'email est requis" })}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground/90">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="victorian-input pl-10"
              placeholder="••••••••"
              {...register("password", { 
                required: "Le mot de passe est requis",
                minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" }
              })}
            />
            <button 
              type="button"
              className="absolute right-3 top-2.5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        {showOtp && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="otp" className="text-foreground/90">Code de vérification</Label>
            <InputOTP 
              maxLength={6} 
              value={otpValue}
              onChange={handleOtpChange}
              className="gap-2 justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="victorian-input w-12 h-12" />
                <InputOTPSlot index={1} className="victorian-input w-12 h-12" />
                <InputOTPSlot index={2} className="victorian-input w-12 h-12" />
                <InputOTPSlot index={3} className="victorian-input w-12 h-12" />
                <InputOTPSlot index={4} className="victorian-input w-12 h-12" />
                <InputOTPSlot index={5} className="victorian-input w-12 h-12" />
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && (
              <p className="text-destructive text-sm">{errors.otp.message}</p>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className="victorian-button w-full mt-6"
        >
          {isLogin 
            ? (showOtp ? "Vérifier" : "Envoyer le code") 
            : "Créer un compte"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          className="text-primary/80 hover:text-primary text-sm"
          onClick={() => {
            setIsLogin(!isLogin);
            setShowOtp(false);
            setOtpValue('');
          }}
        >
          {isLogin 
            ? "Vous n'avez pas de compte ? Inscrivez-vous" 
            : "Déjà un compte ? Connectez-vous"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
