import React from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function AppLinkCard({ title, description, href }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
          {description}
        </Typography>
        <Box>
          <Button component={Link} href={href} variant="contained" size="small">Open</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
