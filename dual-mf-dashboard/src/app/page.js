"use client";

import { Container, Typography, Grid } from "@mui/material";
import NavBar from "../components/NavBar";
import AppLinkCard from "../components/AppLinkCard";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          📊 Dual Router MF Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome! This project demonstrates <b>Next.js App Router</b> and <b>Pages Router</b>
          working together. Explore mutual fund data with different rendering methods:
          <b> SSG, ISR, SSR, CSR</b>.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <AppLinkCard
              title="Learn (App Router)"
              description="Explore funds, tools, and rendering demos under /learn/*"
              href="/learn"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppLinkCard
              title="Market (Pages Router)"
              description="Check market snapshot, compare funds, and more under /market/*"
              href="/market"
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
