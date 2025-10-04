import { useState } from 'react';

function App() {
  const [selectedApi, setSelectedApi] = useState('');
  const [data, setData] = useState(null);

  const API_OPTIONS = [
    { value: 'pokemon', label: 'Pokémon API' },
    { value: 'github', label: 'GitHub API' },
    { value: 'weather', label: 'OpenWeather API' },
  ];

  const handleApiSelect = (e) => {
    setSelectedApi(e.target.value);
  };

  const handleFetch = () => {
    console.log(`Fetching data from ${selectedApi} API`);
    // This will be implemented with real API calls later
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">API Explorer</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          {/* API Selection Dropdown and Fetch Button */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={selectedApi}
              onChange={handleApiSelect}
              className="p-3 border border-gray-300 rounded-md flex-1 cursor-pointer"
            >
              <option value="">Select an API</option>
              {API_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleFetch}
              disabled={!selectedApi}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              Fetch Data
            </button>
          </div>

          {/* Data Display Section */}
          <div className="border border-gray-200 rounded-md p-4 min-h-[200px] bg-gray-50">
            {data ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data fetched yet. Select an API and click "Fetch Data".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 