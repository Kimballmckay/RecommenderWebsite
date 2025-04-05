import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>News Article Recommender System</h1>
      <p>
        Select a Article ID to see article recommendations based on
        collaborative and content-based modeling
      </p>
    </header>
  );
};

export default Header;
