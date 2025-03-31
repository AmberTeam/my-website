import express from 'express';
import jwt from 'jsonwebtoken';
import algosdk from 'algosdk';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const challenges = new Map();
const CHALLENGE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Generate a unique challenge for login
app.get('/challenge', (req, res) => {
  const id = crypto.randomUUID();
  const message = `Login to MyApp at ${new Date().toISOString()}`;
  challenges.set(id, { message, timestamp: Date.now() });
  res.json({ id, message });
});

// Verify signature and issue token
app.post('/login', (req, res) => {
  const { id, signature, address } = req.body;
  const challenge = challenges.get(id);

  if (!challenge || Date.now() - challenge.timestamp > CHALLENGE_EXPIRY) {
    return res.status(400).json({ error: 'Invalid or expired challenge' });
  }

  const message = challenge.message;
  const signatureBytes = Buffer.from(signature, 'base64');

  try {
    const verified = algosdk.verifyBytes(Buffer.from(message, 'utf8'), signatureBytes, address);
    if (verified) {
      challenges.delete(id); // Remove used challenge
      const token = jwt.sign({ address }, 'your-secret-key', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Verification failed' });
  }
});

// Protected route example
app.get('/dashboard', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    res.json({ message: `Welcome, ${decoded.address}` });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));