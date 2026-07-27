export interface IndustryKnowledgePack {
  industry: string;
  importantEvidence: string[];
  ignore: string[];
  weights: Record<string, number>;
  expectedReviewThreshold: number;
}

const DEFAULT_PACK: IndustryKnowledgePack = {
  industry: 'general',
  importantEvidence: ['booking_link', 'review_count', 'rating'],
  ignore: ['social_followers'],
  weights: {
    booking_link: 10,
    review_count: 8,
    rating: 6,
    photos_count: 3,
  },
  expectedReviewThreshold: 50,
};

const DENTAL_PACK: IndustryKnowledgePack = {
  industry: 'dental',
  importantEvidence: ['booking_link', 'review_count', 'emergency_services', 'treatment_pages'],
  ignore: ['instagram_activity'],
  weights: {
    booking_link: 10,
    review_count: 8,
    emergency_services: 7,
    rating: 6,
  },
  expectedReviewThreshold: 100,
};

const SALON_PACK: IndustryKnowledgePack = {
  industry: 'salon',
  importantEvidence: ['booking_link', 'instagram_activity', 'photos_count'],
  ignore: ['emergency_services'],
  weights: {
    booking_link: 10,
    photos_count: 8,
    review_count: 6,
    rating: 6,
  },
  expectedReviewThreshold: 75,
};

const RESTAURANT_PACK: IndustryKnowledgePack = {
  industry: 'restaurant',
  importantEvidence: ['review_count', 'rating', 'menu_page', 'booking_link'],
  ignore: ['treatment_pages'],
  weights: {
    review_count: 10,
    rating: 9,
    booking_link: 7,
    photos_count: 5,
  },
  expectedReviewThreshold: 150,
};

const KNOWLEDGE_PACKS: Record<string, IndustryKnowledgePack> = {
  general: DEFAULT_PACK,
  dental: DENTAL_PACK,
  salon: SALON_PACK,
  restaurant: RESTAURANT_PACK,
};

export function getKnowledgePack(industry: string): IndustryKnowledgePack {
  const key = industry.toLowerCase();
  return KNOWLEDGE_PACKS[key] || DEFAULT_PACK;
}
