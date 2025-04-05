import { useState } from "react";
import Header from "./components/Header";
import ContentSelector from "./components/ContentSelector";
import RecommendationList from "./components/RecommendationList";
import useRecommendations from "./hooks/useRecommendations";
import "./App.css";

function App() {
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const {
    contentIds,
    collaborativeRecommendations,
    contentBasedRecommendations,
    loading,
    error,
  } = useRecommendations();

  const handleGetRecommendations = (contentId: string) => {
    setSelectedContentId(contentId);
  };

  const getCollaborativeRecs = () => {
    return selectedContentId && collaborativeRecommendations[selectedContentId]
      ? collaborativeRecommendations[selectedContentId]
      : [];
  };

  const getContentBasedRecs = () => {
    return selectedContentId && contentBasedRecommendations[selectedContentId]
      ? contentBasedRecommendations[selectedContentId]
      : [];
  };

  return (
    <div className="app-container">
      <Header />

      <div className="main-container">
        <ContentSelector
          contentIds={contentIds}
          onGetRecommendations={handleGetRecommendations}
          loading={loading}
          error={error}
        />

        {error && (
          <div className="error-message">
            Error loading recommendations: {error}
          </div>
        )}

        <div className="recommendations-container">
          <RecommendationList
            title="Collaborative Model Recommendations"
            description="Article Title Recommendations based on selected Article ID"
            recommendations={getCollaborativeRecs()}
            selectedContentId={selectedContentId}
          />

          <RecommendationList
            title="Content Model Recommendations"
            description="Article ID recommendations based on selected Article ID"
            recommendations={getContentBasedRecs()}
            selectedContentId={selectedContentId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
