import React from 'react';
import {
  ChefHat,
  Sparkles,
  Heart,
  Award,
  Clock,
  ShieldCheck,
  Utensils,
  ArrowRight,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useRestaurant();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-serif-title">
          Notre Histoire
        </span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-extrabold text-[#1A1A1A]">
          L'Élégance & La Passion Culinaire
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          Fondé avec l'ambition de célébrer la richesse des terroirs malgaches et les techniques de la haute gastronomie internationale.
        </p>
      </div>

      {/* Main Story & Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative rounded-xl overflow-hidden border border-[#E5E1D8] shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"
            alt="Chef de Cuisine"
            className="w-full h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-white/95 border border-[#E5E1D8] backdrop-blur-md shadow-xs">
            <span className="text-xs font-bold text-[#C5A059] block font-serif-title">
              Chef Exécutif & Fondateur
            </span>
            <span className="text-sm font-bold text-[#1A1A1A]">Maître Andry R.</span>
          </div>
        </div>

        <div className="space-y-5 text-sm text-stone-600 leading-relaxed">
          <h2 className="font-serif-title text-2xl font-bold text-[#1A1A1A]">
            Une Philosophie Basée sur la Fraîcheur et l'Excellence
          </h2>
          <p>
            Au restaurant <strong className="text-[#1A1A1A]">{settings.name}</strong>, chaque assiette est une ode aux sens. Nous collaborons quotidiennement avec des éleveurs locaux de zébus des Hautes Terres, des pêcheurs artisanaux de la côte Est et Ouest de Madagascar, et des producteurs de vanille bourbon et d'épices rares.
          </p>
          <p>
            Notre brigade transforme ces matières premières nobles en créations contemporaines, où textures croquantes, jus corsés et parfums envoûtants s'accordent en parfaite harmonie.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white border border-[#E5E1D8] shadow-xs">
              <span className="font-serif-title font-bold text-2xl text-[#C5A059] block font-mono">
                100%
              </span>
              <span className="text-xs text-stone-500 font-medium">Ingrédients frais & locaux</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5E1D8] shadow-xs">
              <span className="font-serif-title font-bold text-2xl text-[#C5A059] block font-mono">
                15+
              </span>
              <span className="text-xs text-stone-500 font-medium">Années de savoir-faire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="p-8 bg-white border border-[#E5E1D8] rounded-xl space-y-6 shadow-xs">
        <h3 className="font-serif-title font-bold text-xl text-[#1A1A1A] text-center">
          Nos 3 Engagements Royaux
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
          <div className="p-5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] mb-2">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1A1A1A] text-sm">Sélection Rigoureuse</h4>
            <p className="text-stone-500 leading-relaxed">
              Viandes maturées, camarons géants de mer profonde et épices cueillies à maturité optimale.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1A1A1A] text-sm">Hygiène & Précision</h4>
            <p className="text-stone-500 leading-relaxed">
              Normes sanitaires strictes, traçabilité irréprochable et maîtrise parfaite des cuissons sous vide et braisées.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1A1A1A] text-sm">Hospitalité Royale</h4>
            <p className="text-stone-500 leading-relaxed">
              Un accueil chaleureux, un service attentionné et une écoute personnalisée pour chacun de nos convives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
