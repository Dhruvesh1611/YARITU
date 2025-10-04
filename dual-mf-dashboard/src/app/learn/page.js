"use client";

import { Container, Typography, Box } from "@mui/material";

export default function LearnPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Learn Rendering Methods
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">CSR (Client-Side Rendering)</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          The page loads first, then data is fetched and rendered in the
          browser using JavaScript.
        </Typography>

        <Typography variant="h6">SSR (Server-Side Rendering)</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          The server prepares the HTML with data on every request, so users see
          a fully loaded page immediately.
        </Typography>

        <Typography variant="h6">SSG (Static Site Generation)</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Pages are pre-rendered at build time. Super fast but data is fixed
          until you rebuild.
        </Typography>

        <Typography variant="h6">ISR (Incremental Static Regeneration)</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Like SSG but allows revalidation after a time interval, so content can
          update without full rebuilds.
        </Typography>
      </Box>
    </Container>
  );
}
