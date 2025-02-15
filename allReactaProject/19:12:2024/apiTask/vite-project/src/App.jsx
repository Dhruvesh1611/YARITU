
import React, { useState, useEffect } from "react";

// Main component
const AsyncAPIExample = () => {
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [areaData, setAreaData] = useState(null);
  const [subAreaData, setSubAreaData] = useState(null);
  const [finalData, setFinalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetching all data using async/await
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetching state data
      const stateResponse = await fetch("https://bank-apis.justinclicks.com/API/V1/STATE/");
      const stateJson = await stateResponse.json();
      setStateData(stateJson); // Updating state data

      // Fetching city data for Maharashtra
      const cityResponse = await fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/");
      const cityJson = await cityResponse.json();
      setCityData(cityJson); // Updating city data

      // Fetching area data for Pune
      const areaResponse = await fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/");
      const areaJson = await areaResponse.json();
      setAreaData(areaJson); // Updating area data

      // Fetching sub-area data for Khutbao
      const subAreaResponse = await fetch(
        "https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/"
      );
      const subAreaJson = await subAreaResponse.json();
      setSubAreaData(subAreaJson); // Updating sub-area data

      // Fetching final JSON data
      const finalResponse = await fetch(
        "https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/KHUTBAO/KHUTBHAV.json"
      );
      const finalJson = await finalResponse.json();
      setFinalData(finalJson); // Updating final data
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetching data using Promises
  const fetchWithPromises = () => {
    setLoading(true);
    setError(null);

    fetch("https://bank-apis.justinclicks.com/API/V1/STATE/")
      .then((response) => response.json())
      .then((data) => {
        setStateData(data);
        return fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/");
      })
      .then((response) => response.json())
      .then((data) => {
        setCityData(data);
        return fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/");
      })
      .then((response) => response.json())
      .then((data) => {
        setAreaData(data);
        return fetch(
          "https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/"
        );
      })
      .then((response) => response.json())
      .then((data) => {
        setSubAreaData(data);
        return fetch(
          "https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/KHUTBAO/KHUTBHAV.json"
        );
      })
      .then((response) => response.json())
      .then((data) => {
        setFinalData(data);
      })
      .catch((err) => {
        setError("An error occurred while fetching data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetching data using Callbacks (Proper Callback Example)
  const fetchWithCallbacks = () => {
    setLoading(true);
    setError(null);

    // Helper function to handle fetch requests with callback
    const fetchWithCallback = (url, callback) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => callback(null, data))
        .catch((err) => callback(err, null));
    };

    // Fetching state data
    fetchWithCallback("https://bank-apis.justinclicks.com/API/V1/STATE/", (err, stateJson) => {
      if (err) {
        setError("An error occurred while fetching state data.");
        setLoading(false);
        return;
      }
      setStateData(stateJson);

      // Fetching city data for Maharashtra
      fetchWithCallback("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/", (err, cityJson) => {
        if (err) {
          setError("An error occurred while fetching city data.");
          setLoading(false);
          return;
        }
        setCityData(cityJson);

        // Fetching area data for Pune
        fetchWithCallback("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/", (err, areaJson) => {
          if (err) {
            setError("An error occurred while fetching area data.");
            setLoading(false);
            return;
          }
          setAreaData(areaJson);

          // Fetching sub-area data for Khutbao
          fetchWithCallback("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/", (err, subAreaJson) => {
            if (err) {
              setError("An error occurred while fetching sub-area data.");
              setLoading(false);
              return;
            }
            setSubAreaData(subAreaJson);

            // Fetching final JSON data
            fetchWithCallback("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/KHUTBAO/KHUTBHAV.json", (err, finalJson) => {
              if (err) {
                setError("An error occurred while fetching final data.");
                setLoading(false);
                return;
              }
              setFinalData(finalJson);
              setLoading(false); // All data is fetched
            });
          });
        });
      });
    });
  };

  const fetchWithCallbacks2 = () => {
  setLoading(true);
  setError(null);

  // Fetch state data
  fetch("https://bank-apis.justinclicks.com/API/V1/STATE/")
    .then((stateResponse) => stateResponse.json())
    .then((stateJson) => {
      setStateData(stateJson);
      // Fetch city data for Maharashtra
      fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/")
        .then((cityResponse) => cityResponse.json())
        .then((cityJson) => {
          setCityData(cityJson);
          // Fetch area data for Pune
          fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/")
            .then((areaResponse) => areaResponse.json())
            .then((areaJson) => {
              setAreaData(areaJson);
              // Fetch sub-area data for Khutbao
              fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/")
                .then((subAreaResponse) => subAreaResponse.json())
                .then((subAreaJson) => {
                  setSubAreaData(subAreaJson);
                  // Fetch final JSON data
                  fetch("https://bank-apis.justinclicks.com/API/V1/STATE/MAHARASHTRA/PUNE/KHUTBAO/KHUTBAO/KHUTBHAV.json")
                    .then((finalResponse) => finalResponse.json())
                    .then((finalJson) => {
                      setFinalData(finalJson);
                      setLoading(false); // Loading complete
                    })
                    .catch((err) => {
                      setError("An error occurred while fetching final data.");
                      setLoading(false);
                    });
                })
                .catch((err) => {
                  setError("An error occurred while fetching sub-area data.");
                  setLoading(false);
                });
            })
            .catch((err) => {
              setError("An error occurred while fetching area data.");
              setLoading(false);
            });
        })
        .catch((err) => {
          setError("An error occurred while fetching city data.");
          setLoading(false);
        });
    })
    .catch((err) => {
      setError("An error occurred while fetching state data.");
      setLoading(false);
    });
};


  // Automatically fetch data on component mount
  useEffect(() => {
    // fetchAllData(); // Triggering async/await approach on component load
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Async Programming in React</h1>
      <button onClick={fetchWithPromises} style={{ margin: "10px" }}>
        Fetch with Promises
      </button>
      <button onClick={fetchWithCallbacks} style={{ margin: "10px" }}>
        Fetch with Callbacks
      </button>
      <button onClick={fetchWithCallbacks2} style={{ margin: "10px" }}>
        Fetch with Callbacks Method 2
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>Data:</h2>
        <pre>{JSON.stringify({ stateData, cityData, areaData, subAreaData, finalData }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AsyncAPIExample;

