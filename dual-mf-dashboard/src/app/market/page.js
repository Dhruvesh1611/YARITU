"use client";

import { Container, Typography, Grid } from "@mui/material";
import AppLinkCard from "../../components/AppLinkCard";

export default function MarketPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Market Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Explore different rendering strategies with live data examples.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* CSR Example */}
        <Grid item xs={12} sm={6}>
          <AppLinkCard
            title="CSR Example"
            description="Client-side fetch of stock prices"
            href="/market/csr"
          />
        </Grid>

        {/* SSR Example */}
        <Grid item xs={12} sm={6}>
          <AppLinkCard
            title="SSR Example"
            description="Server-rendered stock prices"
            href="/market/ssr"
          />
        </Grid>

        {/* ISR Example */}
        <Grid item xs={12} sm={6}>
          <AppLinkCard
            title="ISR Example"
            description="Static with revalidation every 60s"
            href="/market/isr"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
