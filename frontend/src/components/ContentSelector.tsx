import { useState } from "react";
import "./ContentSelector.css";

interface ContentSelectorProps {
  contentIds: string[];
  onGetRecommendations: (contentId: string) => void;
  loading: boolean;
  error: string | null;
}

const ContentSelector: React.FC<ContentSelectorProps> = ({
  contentIds,
  onGetRecommendations,
  loading,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
  };

  const handleGetRecommendations = () => {
    if (!selectedId) {
      alert("Please select a Article ID");
      return;
    }

    setIsLoading(true);

    // Simulate a short delay to show loading animation
    setTimeout(() => {
      onGetRecommendations(selectedId);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="content-selector">
      <h2>Select Article ID</h2>
      <p>Choose a Article ID to get personalized recommendations:</p>

      <div className="selector-controls">
        <select
          value={selectedId}
          onChange={handleSelectChange}
          disabled={loading || contentIds.length === 0}
        >
          <option value="" disabled>
            {loading
              ? "Loading Article IDs..."
              : contentIds.length === 0
                ? "No Article IDs available"
                : "Select a Article ID"}
          </option>

          {contentIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>

        <button
          onClick={handleGetRecommendations}
          disabled={loading || !selectedId || contentIds.length === 0}
        >
          Get Recommendations
          {isLoading && <span className="loader"></span>}
        </button>
      </div>
    </div>
  );
};

export default ContentSelector;
