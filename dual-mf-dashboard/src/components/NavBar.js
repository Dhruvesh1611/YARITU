"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function NavBar() {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dual MF Dashboard
        </Typography>

        <Button color="inherit" component={Link} href="/">
          Home
        </Button>
        <Button color="inherit" component={Link} href="/csr">
          CSR
        </Button>
        <Button color="inherit" component={Link} href="/ssr">
          SSR
        </Button>
        <Button color="inherit" component={Link} href="/market/isr">
          ISR
        </Button>
        <Button color="inherit" component={Link} href="/about">
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
}
