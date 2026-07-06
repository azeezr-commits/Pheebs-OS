export type ProspectNiche = 'Salon' | 'Med Spa' | 'Spa' | 'Dental' | 'Fitness' | 'Custom';
export type ProspectDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type ProspectPersonality = 'Friendly' | 'Busy' | 'Skeptical' | 'Founder' | 'Multi-location' | 'Budget Sensitive';

export interface ProspectProfile {
  id: string;
  name: string;
  businessName: string;
  niche: ProspectNiche;
  website: string;
  difficulty: ProspectDifficulty;
  personality: ProspectPersonality;
}
