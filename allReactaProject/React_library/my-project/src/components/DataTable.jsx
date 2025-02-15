import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 130 },
  { field: "age", headerName: "Age", width: 90 },
];

const rows = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Smith", age: 30 },
];

export default function DataTable() {
  return (
    <Box sx={{ height: 400, width: "100%", marginTop: 3 }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </Box>
  );
}
