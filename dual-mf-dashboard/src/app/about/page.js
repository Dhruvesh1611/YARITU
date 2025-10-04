import { Container, Typography, Box } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        About This Dashboard
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          This mini project demonstrates different rendering strategies in Next.js:
        </Typography>

        <Typography variant="body2" paragraph>
          <b>CSR</b> (Client-Side Rendering): Data is fetched directly in the browser after page load.
        </Typography>
        <Typography variant="body2" paragraph>
          <b>SSR</b> (Server-Side Rendering): Page is generated on the server at request time.
        </Typography>
        <Typography variant="body2" paragraph>
          <b>ISR</b> (Incremental Static Regeneration): Page is pre-rendered and revalidated every few seconds.
        </Typography>
        <Typography variant="body2" paragraph>
          <b>SSG</b> (Static Site Generation): Fully static pages built at compile time.
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          This dashboard uses Material UI for a clean and simple design.
        </Typography>
      </Box>
    </Container>
  );
}
