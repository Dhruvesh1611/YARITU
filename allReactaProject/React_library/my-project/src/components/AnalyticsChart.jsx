import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Box, Typography } from "@mui/material";

const data = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 300 },
  { name: "Mar", users: 500 },
];

const AnalyticsChart = () => {
  return (
    <Box sx={{ marginTop: 3, textAlign: "center" }}>
      <Typography variant="h6">User Growth</Typography>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="users" fill="#1976D2" />
      </BarChart>
    </Box>
  );
};

export default AnalyticsChart; // This line is crucial for default export
