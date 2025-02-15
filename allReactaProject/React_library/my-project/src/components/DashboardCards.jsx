import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

export default function DashboardCards() {
  const metrics = [
    { title: "Total Users", value: "1,200" },
    { title: "Revenue", value: "$50,000" },
    { title: "Orders", value: "300" },
    { title: "Feedbacks", value: "85%" },
  ];

  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6">{metric.title}</Typography>
              <Typography variant="h4">{metric.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
