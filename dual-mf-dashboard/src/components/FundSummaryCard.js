import React from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function FundSummaryCard({ schemeCode, schemeName, latestNav, latestDate, href }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{schemeName || schemeCode}</Typography>
        <Typography variant="body2" color="text.secondary">
          NAV: {latestNav ?? "-"} • Date: {fmtDate(latestDate)}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Link href={href || `/learn/fund/${schemeCode}`}>View details</Link>
        </Box>
      </CardContent>
    </Card>
  );
}
