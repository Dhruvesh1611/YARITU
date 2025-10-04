"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setSearched(true);
    setResults([]);

    try {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=5`
      );
      const data = await res.json();
      setResults(data.hits || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tech News Assignment
      </Typography>

      <Typography>🔹 CSR: Runs in the browser, fetches after load.</Typography>
      <Typography>🔹 SSR: Server renders on request.</Typography>
      <Typography>🔹 SSG: Pre-rendered at build time.</Typography>
      <Typography>🔹 ISR: Like SSG but re-builds periodically.</Typography>

      {/* Navigation */}
      <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        <Button variant="contained" component={Link} href="/top-news" sx={{ mr: 2 }}>
          Go to Top News
        </Button>
        <Button variant="outlined" component={Link} href="/story/38600909">
          Sample Story
        </Button>
      </div>

      {/* CSR Search Widget */}
      <Typography variant="h6">🔍 Search Hacker News</Typography>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          label="Search query"
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            input: { color: "white" },   // text inside
            label: { color: "gray" },    // label color
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",   // default border
              },
              "&:hover fieldset": {
                borderColor: "white",   // hover border
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",   // focused border
              },
            },
          }}
        />


        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {loading && <CircularProgress size={24} />}
      {!loading && searched && results.length === 0 && (
        <Typography>No results.</Typography>
      )}

      <List>
        {results.map((item) => (
          <ListItem key={item.objectID}>{item.title}</ListItem>
        ))}
      </List>
    </Container>
  );
}
