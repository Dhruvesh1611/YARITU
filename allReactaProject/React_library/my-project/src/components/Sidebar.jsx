import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <Drawer variant="permanent" open={open} sx={{ width: 240 }}>
      <List>
        {["Dashboard", "Users", "Analytics"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index === 0 ? <DashboardIcon /> : index === 1 ? <PeopleIcon /> : <BarChartIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
