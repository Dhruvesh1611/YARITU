import React, { useState } from 'react';
import { Button, Box, Typography, Paper, Fade, Pagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart } from '@mui/x-charts/BarChart';


export default function App() {
  const [activePage, setActivePage] = useState('charts');

  // Sample data for DataGrid
  const rows = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 28 },
    { id: 4, name: 'David', age: 35 },
  ];
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
  ];

  // Sample data for BarChart
  const chartData = {
    series: [{ data: [30, 60, 80, 45, 90] }],
    xAxis: [{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }],
  };

  // Function to render pages
  const renderPage = () => {
    switch (activePage) {
      case 'charts':
        return (
          <Fade in={true} timeout={500}>
            <Paper className="page-content">
              <Typography variant="h5">📊 Sales Chart</Typography>
              <BarChart {...chartData} height={250} />
            </Paper>
          </Fade>
        );
      case 'pagination':
        return (
          <Fade in={true} timeout={500}>
            <Paper className="page-content">
              <Typography variant="h5">🔢 Pagination Example</Typography>
              <Pagination count={10} color="primary" />
            </Paper>
          </Fade>
        );
      case 'table':
        return (
          <Fade in={true} timeout={500}>
            <Paper className="page-content">
              <Typography variant="h5">📋 User Data Table</Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={5} />
              </Box>
            </Paper>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Box className="app-container">
      {/* Navigation Buttons */}
      <Box className="button-container">
        <Button variant="contained" onClick={() => setActivePage('charts')}>
          Charts
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setActivePage('pagination')}>
          Pagination
        </Button>
        <Button variant="contained" color="success" onClick={() => setActivePage('table')}>
          Data Table
        </Button>
      </Box>


      <h1 className='text-600-red font-lg font-bold'>Hello Ayy Boaringggggggg</h1>

      {/* Page Content */}
      <Box className="content-container">{renderPage()}</Box>
    </Box>
  );
}
