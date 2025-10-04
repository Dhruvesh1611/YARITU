import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function SearchBar({ label = "Enter scheme code", onSubmit }) {
  const [value, setValue] = useState("");

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(value.trim()); }} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
      <TextField
        size="small"
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ "aria-label": label }}
        fullWidth
      />
      <Button type="submit" variant="contained" aria-label="Search">Search</Button>
    </Box>
  );
}
