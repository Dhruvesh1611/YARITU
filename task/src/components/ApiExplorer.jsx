import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, setSelectedApi, clearData } from '../store/dataSlice';

// Custom hook for tracking keyboard shortcuts
const useKeyPress = (targetKey) => {
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  
  useEffect(() => {
    const downHandler = ({ key }) => key === targetKey && setIsKeyPressed(true);
    const upHandler = ({ key }) => key === targetKey && setIsKeyPressed(false);
    
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);
  
  return isKeyPressed;
};

// API config
const API_LIST = [
  { id: 'pokemon', name: 'PokéAPI', description: 'All the Pokémon data you\'ll ever need' },
  { id: 'github', name: 'GitHub Users', description: 'Information about GitHub users' },
  { id: 'weather', name: 'Weather Data', description: 'Current weather information' },
];

function ApiExplorer() {
  const dispatch = useDispatch();
  const { data, loading, error, selectedApi } = useSelector((state) => state.data);
  const [searchParam, setSearchParam] = useState('');
  const [page, setPage] = useState(1);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Handle keyboard shortcut for fetch (Ctrl+Enter)
  const ctrlPressed = useKeyPress('Control');
  const enterPressed = useKeyPress('Enter');
  
  useEffect(() => {
    if (ctrlPressed && enterPressed && selectedApi) {
      handleFetchClick();
    }
  }, [ctrlPressed, enterPressed, selectedApi]);
  
  // Load user preference for dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('apiExplorerDarkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);
  
  const handleApiChange = (e) => {
    const api = e.target.value;
    dispatch(setSelectedApi(api));
    dispatch(clearData());
    setSearchParam('');
    setPage(1);
    
    // Add to recent searches in localStorage
    try {
      const recent = JSON.parse(localStorage.getItem('recentApis') || '[]');
      if (!recent.includes(api) && api) {
        localStorage.setItem('recentApis', JSON.stringify([api, ...recent].slice(0, 5)));
      }
    } catch (err) {
      console.error('Failed to save recent API', err);
    }
  };
  
  const handleFetchClick = () => {
    if (!selectedApi) return;
    
    let queryStr = '';
    
    // Handle specific API query formats
    if (selectedApi === 'pokemon') {
      if (searchParam.trim()) {
        queryStr = `/${searchParam.toLowerCase().trim()}`;
      } else {
        // Add pagination
        const limit = 12; // Show 12 per page
        const offset = (page - 1) * limit;
        queryStr = `?limit=${limit}&offset=${offset}`;
      }
    } 
    else if (selectedApi === 'github') {
      if (searchParam.trim()) {
        queryStr = `/${searchParam.trim()}`;
      } else {
        queryStr = `?per_page=10&page=${page}`;
      }
    }
    else if (selectedApi === 'weather') {
      queryStr = searchParam ? `?q=${searchParam}&units=metric` : '?q=London&units=metric';
    }
    
    dispatch(fetchData({ apiType: selectedApi, query: queryStr }));
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('apiExplorerDarkMode', String(!darkMode));
  };
  
  const renderApiData = () => {
    if (!data) return null;
    
    // Custom rendering for each API
    switch(selectedApi) {
      case 'pokemon':
        if (data.results) {
          // List view
          return (
            <div className="my-api-grid">
              {data.results.map((pokemon, idx) => (
                <div key={pokemon.name} className={`api-card ${idx % 2 === 0 ? 'card-alt' : ''}`}>
                  <span className="pokemon-number">#{(page-1)*12 + idx + 1}</span>
                  <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                  <div className="card-actions">
                    <button 
                      onClick={() => dispatch(fetchData({ 
                        apiType: 'pokemon', 
                        query: `/${pokemon.name}` 
                      }))}
                      className="details-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          // Single pokemon view
          return (
            <div className="detailed-view">
              <button 
                onClick={() => handleBackToList()} 
                className="back-btn"
              >
                ← Back to list
              </button>
              <div className="pokemon-card">
                <div className="pokemon-header">
                  <h2>{data.name.toUpperCase()}</h2>
                  <span>#{data.id}</span>
                </div>
                
                <div className="pokemon-images">
                  <img 
                    src={data.sprites?.front_default} 
                    alt={`${data.name} front`}
                    className="sprite"
                  />
                  {data.sprites?.back_default && (
                    <img 
                      src={data.sprites.back_default} 
                      alt={`${data.name} back`}
                      className="sprite"
                    />
                  )}
                </div>
                
                <div className="pokemon-details">
                  <div className="stat-group">
                    <h4>Types</h4>
                    <div className="type-badges">
                      {data.types?.map(t => (
                        <span key={t.type.name} className={`type-badge ${t.type.name}`}>
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="stat-group">
                    <h4>Base Stats</h4>
                    <ul className="stats-list">
                      {data.stats?.map(stat => (
                        <li key={stat.stat.name}>
                          <span className="stat-name">{formatStatName(stat.stat.name)}:</span>
                          <span className="stat-value">{stat.base_stat}</span>
                          <div className="stat-bar">
                            <div 
                              className="stat-fill" 
                              style={{width: `${Math.min(100, stat.base_stat/2)}%`}}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
      case 'github':
        return (
          <div className="github-users">
            {Array.isArray(data) ? (
              <div className="user-grid">
                {data.map(user => (
                  <div key={user.id} className="github-card">
                    <div className="user-avatar">
                      <img src={user.avatar_url} alt="" />
                    </div>
                    <div className="user-info">
                      <h3>{user.login}</h3>
                      <a 
                        href={user.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="profile-link"
                      >
                        @{user.login}
                      </a>
                    </div>
                    <button
                      onClick={() => window.open(user.html_url, '_blank')}
                      className="visit-btn"
                    >
                      Visit Profile
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="single-user">
                <div className="user-header">
                  <img src={data.avatar_url} alt={data.login} className="large-avatar" />
                  <div>
                    <h2>{data.name || data.login}</h2>
                    <p className="username">@{data.login}</p>
                    {data.bio && <p className="user-bio">{data.bio}</p>}
                  </div>
                </div>
                
                <div className="user-stats">
                  <div className="stat-box">
                    <span className="stat-value">{data.public_repos}</span>
                    <span className="stat-label">Repositories</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{data.followers}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{data.following}</span>
                    <span className="stat-label">Following</span>
                  </div>
                </div>
                
                <div className="user-links">
                  <a href={data.html_url} target="_blank" rel="noopener noreferrer" className="user-link">
                    GitHub Profile
                  </a>
                  {data.blog && (
                    <a href={ensureHttps(data.blog)} target="_blank" rel="noopener noreferrer" className="user-link">
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'weather':
        return (
          <div className="weather-display">
            <div className="weather-card">
              <div className="weather-header">
                <h2>{data.name}, {data.sys.country}</h2>
                <div className="weather-icon">
                  <img 
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt={data.weather[0].description}
                  />
                </div>
              </div>
              
              <div className="weather-body">
                <div className="current-temp">
                  <span className="temp">{Math.round(data.main.temp)}°C</span>
                  <span className="feels-like">Feels like: {Math.round(data.main.feels_like)}°C</span>
                </div>
                
                <p className="weather-desc">{data.weather[0].description}</p>
                
                <div className="weather-metrics">
                  <div className="metric">
                    <span className="metric-name">Humidity</span>
                    <span className="metric-value">{data.main.humidity}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-name">Wind</span>
                    <span className="metric-value">{data.wind.speed} m/s</span>
                  </div>
                  <div className="metric">
                    <span className="metric-name">Pressure</span>
                    <span className="metric-value">{data.main.pressure} hPa</span>
                  </div>
                </div>
                
                <div className="sunrise-sunset">
                  <div>
                    <span className="time-label">Sunrise:</span>
                    <span className="time-value">{formatTime(data.sys.sunrise, data.timezone)}</span>
                  </div>
                  <div>
                    <span className="time-label">Sunset:</span>
                    <span className="time-value">{formatTime(data.sys.sunset, data.timezone)}</span>
                  </div>
                </div>
              </div>
              
              <div className="weather-footer">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div className="no-data">No data to display</div>;
    }
  };
  
  // Helper functions
  const formatStatName = (name) => {
    return name
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const ensureHttps = (url) => {
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  };
  
  const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleBackToList = () => {
    dispatch(clearData());
    handleFetchClick();
  };
  
  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };
  
  const handlePrevPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };
  
  useEffect(() => {
    if (page > 1 || selectedApi) {
      handleFetchClick();
    }
  }, [page]);
  
  return (
    <div className={`api-explorer ${darkMode ? 'dark-mode' : ''}`}>
      <div className="explorer-toolbar">
        <div className="mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </div>
        
        <div className="api-selector">
          <select 
            value={selectedApi || ''} 
            onChange={handleApiChange}
            className="api-dropdown"
          >
            <option value="">-- Choose an API --</option>
            {API_LIST.map(api => (
              <option key={api.id} value={api.id}>{api.name}</option>
            ))}
          </select>
          
          <button 
            className="info-btn"
            onClick={() => setShowApiInfo(!showApiInfo)}
          >
            ?
          </button>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            placeholder={getPlaceholderText(selectedApi)}
            className="search-input"
            disabled={!selectedApi}
          />
          
          <button
            onClick={handleFetchClick}
            disabled={!selectedApi}
            className="fetch-btn"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
      </div>
      
      {showApiInfo && selectedApi && (
        <div className="api-info">
          <h3>{API_LIST.find(api => api.id === selectedApi)?.name}</h3>
          <p>{API_LIST.find(api => api.id === selectedApi)?.description}</p>
          <div className="search-tips">
            <h4>Search Tips:</h4>
            {selectedApi === 'pokemon' && (
              <p>Enter a Pokémon name or ID, or leave blank to browse the list</p>
            )}
            {selectedApi === 'github' && (
              <p>Enter a GitHub username to see their profile, or leave blank to see random users</p>
            )}
            {selectedApi === 'weather' && (
              <p>Enter a city name (e.g., "London" or "New York")</p>
            )}
          </div>
          <button onClick={() => setShowApiInfo(false)} className="close-btn">Close</button>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={handleFetchClick} className="retry-btn">Try Again</button>
        </div>
      )}
      
      {loading ? (
        <div className="loader-container">
          <div className="custom-loader"></div>
          <p>Fetching data...</p>
        </div>
      ) : (
        <div className="data-container">
          {renderApiData()}
          
          {data && ['pokemon', 'github'].includes(selectedApi) && 
           ((selectedApi === 'pokemon' && data.results) || 
            (selectedApi === 'github' && Array.isArray(data))) && (
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={page === 1}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-indicator">Page {page}</span>
              <button 
                onClick={handleNextPage}
                disabled={selectedApi === 'pokemon' && !data.next}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="keyboard-shortcuts">
        <p>Pro tip: Use Ctrl+Enter to fetch data quickly</p>
      </div>
    </div>
  );
}

// Helper for placeholder text
function getPlaceholderText(apiType) {
  switch(apiType) {
    case 'pokemon':
      return 'Enter Pokémon name (e.g., pikachu)';
    case 'github':
      return 'Enter GitHub username';
    case 'weather':
      return 'Enter city name';
    default:
      return 'Select an API first';
  }
}

export default ApiExplorer; 