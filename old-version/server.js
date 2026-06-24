const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'dist' directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, send index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  // If dist doesn't exist yet (dev mode), this might fail, but that's expected.
  // We'll use Vite for dev.
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Note: For development, use 'npm run dev' to use Vite server.`);
    console.log(`For production, run 'npm run build' then 'npm start'.`);
});
