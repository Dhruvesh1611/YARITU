import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, clearData } from "./redux/dataSlice";
import "./App.css";

function App() {
  const [selectedApi, setSelectedApi] = useState("https://pokeapi.co/api/v2/pokemon?limit=10");
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.data);

  // API options with labels and URLs
  const apiOptions = [
    { label: "Pokémon API", url: "https://pokeapi.co/api/v2/pokemon?limit=10" },
    { label: "GitHub Users API", url: "https://api.github.com/users" },
    { label: "JSON Placeholder Posts", url: "https://jsonplaceholder.typicode.com/posts" },
    { label: "Random User API", url: "https://randomuser.me/api/?results=5" }
  ];

  const handleApiChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedApi(selectedValue);
  };

  // Function to handle fetching data
  const handleFetchData = () => {
    dispatch(clearData());
    dispatch(fetchData(selectedApi));
  };

  // Function to format Pokémon data into a list of names
  const renderPokemonList = (data) => {
    if (!data || !data.results) return null;
    
    return (
      <div className="pokemon-list">
        <h3>Pokémon List</h3>
        <ul>
          {data.results.map((pokemon, index) => (
            <li key={pokemon.name} className="pokemon-item">
              <span className="pokemon-number">#{index + 1}</span>
              <span className="pokemon-name">{pokemon.name}</span>
              <a 
                href={pokemon.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pokemon-details-link"
              >
                View Details
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Function to render data based on API type
  const renderData = () => {
    if (!data) return null;
    
    // For Pokémon API
    if (selectedApi.includes('pokeapi.co')) {
      return renderPokemonList(data);
    }
    
    // For other APIs, show the JSON data
    return (
      <div className="data-display">
        <h3>API Response</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>API Explorer</h1>
        <p>Select an API endpoint from the dropdown and click the fetch button to see the results</p>
      </div>

      <div className="control-panel">
        <div className="select-container">
          <label htmlFor="api-select">Choose API:</label>
          <select 
            id="api-select"
            value={selectedApi} 
            onChange={handleApiChange}
            className="api-select"
          >
            {apiOptions.map(api => (
              <option key={api.url} value={api.url}>
                {api.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="fetch-button"
          onClick={handleFetchData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Data"}
        </button>
      </div>

      <div className="result-container">
        {loading && <div className="loader"></div>}
        
        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button 
              className="retry-button" 
              onClick={handleFetchData}
            >
              Retry
            </button>
          </div>
        )}
        
        {data && !loading && !error && renderData()}
      </div>
    </div>
  );
}

export default App;
