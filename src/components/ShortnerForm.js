import React, { useState } from 'react';
import {
  TextField, Button, Grid, Card, CardContent, Typography
} from '@mui/material';
import { isValidUrl, isValidShortCode } from '../utils/validators';
import { generateShortCode } from '../utils/generateShortCode';
import { loggerMiddleware } from '../middleware/logger';

export default function ShortenerForm() {
  const [inputs, setInputs] = useState([{ url: '', validity: '', code: '' }]);
  const [results, setResults] = useState([]);
  const [existingCodes, setExistingCodes] = useState(new Set());

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const handleAddInput = () => {
    if (inputs.length < 5) setInputs([...inputs, { url: '', validity: '', code: '' }]);
  };

  const handleShorten = () => {
    const result = [];
    for (let input of inputs) {
      if (!isValidUrl(input.url)) {
        alert('Invalid URL');
        loggerMiddleware("Invalid URL entered.");
        return;
      }

      const validity = input.validity ? parseInt(input.validity) : 30;
      if (isNaN(validity) || validity <= 0) {
        alert('Validity must be a positive integer');
        loggerMiddleware("Invalid validity input.");
        return;
      }

      let code = input.code.trim();
      if (code) {
        if (!isValidShortCode(code)) {
          alert('Invalid shortcode');
          loggerMiddleware("Invalid shortcode.");
          return;
        }
        if (existingCodes.has(code)) {
          alert('Shortcode already exists');
          loggerMiddleware("Shortcode collision.");
          return;
        }
      } else {
        code = generateShortCode(existingCodes);
      }

      existingCodes.add(code);

      const expiry = new Date(Date.now() + validity * 60000).toLocaleString();
      result.push({ original: input.url, short: `http://localhost:3000/${code}`, expiry });
      loggerMiddleware(`Shortened URL: ${input.url} → ${code}`);
    }
    setResults(result);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4">URL Shortener</Typography>
      <Grid container spacing={2} mt={2}>
        {inputs.map((input, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <TextField fullWidth label="Long URL" value={input.url}
                  onChange={(e) => handleChange(index, 'url', e.target.value)} margin="normal" />
                <TextField fullWidth label="Validity (minutes)" value={input.validity}
                  onChange={(e) => handleChange(index, 'validity', e.target.value)} margin="normal" />
                <TextField fullWidth label="Custom Shortcode (optional)" value={input.code}
                  onChange={(e) => handleChange(index, 'code', e.target.value)} margin="normal" />
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleAddInput} disabled={inputs.length >= 5}>+ Add More</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleShorten}>Shorten URLs</Button>
        </Grid>
        <Grid item xs={12}>
          {results.map((res, idx) => (
            <Card key={idx} style={{ marginTop: '1rem' }}>
              <CardContent>
                <Typography><strong>Original:</strong> {res.original}</Typography>
                <Typography><strong>Short:</strong> <a href={res.short}>{res.short}</a></Typography>
                <Typography><strong>Expires At:</strong> {res.expiry}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

