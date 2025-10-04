"use client";

import { useState } from "react";
import { Container, Typography, Button, TextField, List, ListItem } from "@mui/material";

export default function CSRPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=5`
      );
      const data = await res.json();
      setResults(data.hits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Client-Side Rendering (CSR)
      </Typography>
      <Typography paragraph>
        This page demonstrates <b>CSR</b>. The data is fetched <i>only after you click search</i>.
      </Typography>

      <TextField
        label="Search Stories"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>

      {loading && <Typography sx={{ mt: 2 }}>Searching...</Typography>}

      {!loading && results.length === 0 && (
        <Typography sx={{ mt: 2 }}>No results.</Typography>
      )}

      <List>
        {results.map((story) => (
          <ListItem key={story.objectID}>
            <a
              href={story.url || "http://codinggita.com/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {story.title}
            </a>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
