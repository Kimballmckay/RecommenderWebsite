import { useState, useEffect } from "react";
import Papa from "papaparse";
import { RecommendationMap } from "../types";

interface CSVRow {
  content_id?: string;
  contentId?: string;
  itemId?: string;
  recommendedContentId?: string;
  recommendedItemId?: string;
  score?: string;
  predicted_rating?: string;
  similarity?: string;
  [key: string]: string | undefined;
}

interface UseRecommendationsResult {
  contentIds: string[];
  collaborativeRecommendations: RecommendationMap;
  contentBasedRecommendations: RecommendationMap;
  loading: boolean;
  error: string | null;
}

const useRecommendations = (): UseRecommendationsResult => {
  const [contentIds, setContentIds] = useState<string[]>([]);
  const [collaborativeRecommendations, setCollaborativeRecommendations] =
    useState<RecommendationMap>({});
  const [contentBasedRecommendations, setContentBasedRecommendations] =
    useState<RecommendationMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async (): Promise<void> => {
      try {
        await Promise.all([
          loadCollaborativeRecommendations(),
          loadContentBasedRecommendations(),
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Error loading recommendations:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load recommendation data"
        );
        setLoading(false);

        // Load sample data as fallback
        loadSampleData();
      }
    };

    loadRecommendations();
  }, []);

  const parseCSV = async (url: string): Promise<CSVRow[]> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h: string) => h.trim(),
          complete: (results) => {
            resolve(results.data as CSVRow[]);
          },
          error: (error: any) => {
            reject(error);
          },
        });
      });
    } catch (error) {
      throw error;
    }
  };

  const loadCollaborativeRecommendations = async (): Promise<void> => {
    try {
      const data = await parseCSV("/collaborative_recommendations_cleaned.csv");

      // Process the data into collaborative recommendations
      const collaborativeRecs: RecommendationMap = {};
      const ids = new Set<string>();

      data.forEach((row) => {
        const contentId = row.content_id?.toString() || "";
        if (!contentId) return;

        ids.add(contentId);
        collaborativeRecs[contentId] = [];

        // Process the five recommendation columns
        for (let i = 1; i <= 5; i++) {
          const recommendationKey = `Recommendation ${i}`;
          const recommendedContent = row[recommendationKey];

          if (recommendedContent) {
            // Assign decreasing scores from 5.0 to 4.2
            collaborativeRecs[contentId].push({
              contentId: recommendedContent,
              score: 5.0 - (i - 1) * 0.2,
            });
          }
        }
      });

      setCollaborativeRecommendations(collaborativeRecs);
      updateContentIds([...ids]);
    } catch (error) {
      console.error("Error loading collaborative recommendations:", error);
      throw error;
    }
  };

  const loadContentBasedRecommendations = async (): Promise<void> => {
    try {
      const data = await parseCSV("/content_recommendations_cleaned.csv");

      // Process the data into content-based recommendations
      const contentBasedRecs: RecommendationMap = {};
      const ids = new Set<string>();

      data.forEach((row) => {
        const contentId = row.content_id?.toString() || "";
        if (!contentId) return;

        ids.add(contentId);
        contentBasedRecs[contentId] = [];

        // Process the five recommendation columns
        for (let i = 1; i <= 5; i++) {
          const recommendationKey = `Recommendation ${i}`;
          const recommendedContent = row[recommendationKey];

          if (recommendedContent) {
            // Assign decreasing similarity scores from 0.95 to 0.75
            contentBasedRecs[contentId].push({
              contentId: recommendedContent,
              score: 0.95 - (i - 1) * 0.05,
            });
          }
        }
      });

      setContentBasedRecommendations(contentBasedRecs);
      updateContentIds([...ids]);
    } catch (error) {
      console.error("Error loading content-based recommendations:", error);
      throw error;
    }
  };

  const updateContentIds = (newIds: string[]): void => {
    setContentIds((prevIds) => {
      const combinedIds = [...new Set([...prevIds, ...newIds])];
      return combinedIds;
    });
  };

  const loadSampleData = (): void => {
    console.log("Loading sample data as fallback...");

    // Sample data based on the paste.txt format
    const sampleData = [
      {
        contentId: "-9.19255E+18",
        recommendations: [
          "Elastic Stack 5.0.0 Released",
          "Microsoft lança Teams, nova plataforma de chat concorrente do Slack",
          "Hello, a nova rede social do Orkut, está liberada no Brasil",
          "A Googler analyzed a billion files to settle the programming dispute",
          "You SHOULD Learn Vanilla JavaScript Before JS Frameworks",
        ],
      },
      {
        contentId: "-9.18966E+18",
        recommendations: [
          "Clean Coder Blog",
          "Pull request first - Practical Blend",
          "Beyond Progressive Web Apps Part 1",
          "Eat, sleep, code, repeat is such bullshit",
          "Most Interesting APIs in 2016: Cognitive Computing",
        ],
      },
      {
        contentId: "-9.17614E+18",
        recommendations: [
          "Top 10 Insurtech Trends for 2017",
          "Governo brasileiro cria manual para contratação de cloud",
          "The barbell effect of machine learning",
          "Microsoft's Open Source Love Affair Reaches New Heights",
          "Facebook Workplace officially launches on the web and iOS",
        ],
      },
    ];

    // Process sample data
    const collaborativeRecs: RecommendationMap = {};
    const contentBasedRecs: RecommendationMap = {};
    const ids: string[] = [];

    sampleData.forEach((item) => {
      ids.push(item.contentId);

      // Create collaborative recommendations
      collaborativeRecs[item.contentId] = item.recommendations.map(
        (title, index) => ({
          contentId: title,
          score: 5.0 - index * 0.2, // Scores from 5.0 down to 4.2
        })
      );

      // Create content-based recommendations (shuffled)
      const shuffled = [...item.recommendations];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      contentBasedRecs[item.contentId] = shuffled.map((title, index) => ({
        contentId: title,
        score: 0.95 - index * 0.05, // Scores from 0.95 down to 0.75
      }));
    });

    setCollaborativeRecommendations(collaborativeRecs);
    setContentBasedRecommendations(contentBasedRecs);
    setContentIds(ids);
  };

  return {
    contentIds,
    collaborativeRecommendations,
    contentBasedRecommendations,
    loading,
    error,
  };
};

export default useRecommendations;
