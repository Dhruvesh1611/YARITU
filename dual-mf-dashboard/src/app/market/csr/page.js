"use client";

import { useState } from "react";
import { Container, Typography, Button, CircularProgress, List, ListItem, ListItemText } from "@mui/material";

export default function CSRPage() {
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        CSR Example
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        This page fetches stock data <b>only on the client</b> after clicking the button.
      </Typography>

      <Button variant="contained" onClick={fetchStocks} sx={{ mt: 2 }}>
        Fetch Stocks
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      <List sx={{ mt: 2 }}>
        {stocks.map((stock) => (
          <ListItem key={stock.id} divider>
            <ListItemText
              primary={stock.title}
              secondary={`Stock ID: ${stock.id}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
