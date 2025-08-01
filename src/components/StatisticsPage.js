import React from 'react';
import { Typography, Button, Card, CardContent } from '@mui/material';

export default function StatisticsPage() {
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4">URL Shortener Statistics</Typography>
      <Button variant="outlined" onClick={() => window.location.href = '/'}>Back</Button>
      {logs.map((log, i) => (
        <Card key={i} style={{ marginTop: '1rem' }}>
          <CardContent>
            <Typography>{log}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
