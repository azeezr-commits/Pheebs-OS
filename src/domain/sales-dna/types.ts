export type WisdomSource = 'Robin' | 'Ashish' | 'Piyush' | 'Kripali' | 'Customer Calls' | 'Winning Calls' | 'Lost Calls';

export interface SalesDNAPlay {
  id: string;
  rule: string;
  reason: string;
  example: string;
  howToApply: string;
  relatedObjections: string[];
  relatedStories: string[];
  source: WisdomSource;
  createdAt: string;
}
