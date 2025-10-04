import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

// ✅ Enable ISR with revalidate: 30 sec
export const revalidate = 30;

export default async function ISRPage() {
  // Fetch mock stock data
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const stocks = await res.json();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        ISR Example
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        This page is generated at build time and revalidated every <b>30 seconds</b>.
      </Typography>

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
