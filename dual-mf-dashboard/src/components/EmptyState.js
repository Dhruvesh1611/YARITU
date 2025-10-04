import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function EmptyState({ title = "No results", message = "Try a different code or check the MFAPI." }) {
  return (
    <Paper sx={{ p: 2, textAlign: "center" }} role="status" aria-live="polite">
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      </Box>
    </Paper>
  );
}
