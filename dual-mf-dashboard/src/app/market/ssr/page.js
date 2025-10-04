import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

// ✅ Force SSR in Next.js App Router
export const dynamic = "force-dynamic";

export default async function SSRPage() {
  // Fetch stock/news data at request time
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5", {
    cache: "no-store", // ensures SSR (fresh fetch every request)
  });
  const stocks = await res.json();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        SSR Example
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        This page fetches stock data <b>on the server</b> every time you refresh.
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
