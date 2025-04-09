import React, { useState, useEffect } from "react";

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  return (
    <div className="mb-3 border p-3 rounded">
      <input
        type="text"
        placeholder="Rechercher par nom, description ou utilisateur..."
        className="form-control"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default AdvancedSearch;
