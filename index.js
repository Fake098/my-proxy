import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  // Extract refererUrl and imageUrl from query parameters
  const { refererUrl, imageUrl } = req.query;

  // Check if both refererUrl and imageUrl are provided
  if (!refererUrl || !imageUrl) {
    return res.status(400).send('Missing refererUrl or imageUrl');
  }

  try {
    // Fetch the image from the target URL
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*', // Customize headers if necessary
        'Referer': refererUrl, // Set the Referer header
      },
    });

    if (!response.ok) {
      res.status(response.status).send('Error fetching image');
      return;
    }

    // Pipe the response to the client
    res.set('Content-Type', response.headers.get('content-type'));
    response.body.pipe(res);
  } catch (error) {
    res.status(500).send('Error occurred');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
