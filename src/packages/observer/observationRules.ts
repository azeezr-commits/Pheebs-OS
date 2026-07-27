/**
 * Declarative Observation Configuration Rules
 * Replaces hardcoded string checks with declarative validation logic.
 */

export interface FieldValidationRule {
  mustNotEqual: string[];
  minimumCharacters?: number;
  cannotContain?: string[];
  mustBePositiveNumber?: boolean;
}

export const OBSERVATION_RULES: Record<string, FieldValidationRule> = {
  businessName: {
    mustNotEqual: ['maps', 'google', 'home', 'target business', 'null', 'undefined'],
    minimumCharacters: 3,
    cannotContain: ['.com', 'http', 'https'],
  },
  website: {
    mustNotEqual: ['null', 'undefined'],
    minimumCharacters: 5,
    cannotContain: ['maps.app.goo.gl', 'google.com/maps'],
  },
  address: {
    mustNotEqual: ['metropolitan district', 'null', 'undefined'],
    minimumCharacters: 5,
  },
  rating: {
    mustNotEqual: [],
    mustBePositiveNumber: true,
  },
  reviewCount: {
    mustNotEqual: [],
    mustBePositiveNumber: true,
  },
};
