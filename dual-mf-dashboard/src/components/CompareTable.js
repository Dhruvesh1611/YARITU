import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export default function CompareTable({ series = [] }) {
  // series: [{ code, name, latestNav, latestDate, returns: { "3m": x, "6m": y } }, ...]
  if (!series || series.length === 0) {
    return <Typography>No funds selected for comparison.</Typography>;
  }

  return (
    <Table size="small" aria-label="compare table">
      <TableHead>
        <TableRow>
          <TableCell>Metric</TableCell>
          {series.map((s) => (
            <TableCell key={s.code} align="center">{s.name || s.code}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Latest NAV</TableCell>
          {series.map((s) => <TableCell key={s.code} align="center">{s.latestNav ?? "-"}</TableCell>)}
        </TableRow>
        <TableRow>
          <TableCell>Latest Date</TableCell>
          {series.map((s) => <TableCell key={s.code} align="center">{s.latestDate ?? "-"}</TableCell>)}
        </TableRow>
        <TableRow>
          <TableCell>3m Return (%)</TableCell>
          {series.map((s) => <TableCell key={s.code} align="center">{s.returns?.["3m"] ?? "—"}</TableCell>)}
        </TableRow>
        <TableRow>
          <TableCell>6m Return (%)</TableCell>
          {series.map((s) => <TableCell key={s.code} align="center">{s.returns?.["6m"] ?? "—"}</TableCell>)}
        </TableRow>
      </TableBody>
    </Table>
  );
}
