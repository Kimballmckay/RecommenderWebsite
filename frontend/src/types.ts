export interface Recommendation {
    contentId: string;
    score: number;
  }
  
  export interface RecommendationMap {
    [contentId: string]: Recommendation[];
  }