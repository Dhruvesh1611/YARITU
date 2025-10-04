import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function FundDetail({ schemeName, schemeCode, latestNav, latestDate, recentNavs = [] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{schemeName || schemeCode}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Latest NAV: {latestNav ?? "-"} • Date: {fmtDate(latestDate)}
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>Recent NAVs</Typography>
        {recentNavs.length === 0 ? (
          <Typography>No recent NAVs available.</Typography>
        ) : (
          <Table size="small" aria-label="recent navs">
            <TableBody>
              {recentNavs.map((r) => (
                <TableRow key={r.date}>
                  <TableCell>{fmtDate(r.date)}</TableCell>
                  <TableCell>{r.nav}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
