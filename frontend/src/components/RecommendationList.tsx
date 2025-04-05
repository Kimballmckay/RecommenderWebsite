import React from "react";
import { Recommendation } from "../types";
import "./RecommendationList.css";

interface RecommendationListProps {
  title: string;
  description: string;
  recommendations: Recommendation[];
  selectedContentId: string;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  title,
  description,
  recommendations,
  selectedContentId,
}) => {
  return (
    <div className="recommendation-list-container">
      <h2>{title}</h2>
      <p>{description}</p>

      {!selectedContentId ? (
        <div className="recommendation-placeholder">
          Select a content ID to see recommendations
        </div>
      ) : recommendations.length === 0 ? (
        <div className="recommendation-placeholder">
          No recommendations available for this content
        </div>
      ) : (
        <ul className="recommendation-list">
          {recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              <div className="recommendation-rank">#{index + 1}</div>
              <div className="recommendation-content">
                <div className="recommendation-title">{rec.contentId}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendationList;