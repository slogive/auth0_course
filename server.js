const express = require('express'),
  jwt = require('jsonwebtoken'),
  cors = require('cors'),
  { config } = require('./config'),
  app = express();

const corsOptions = { origin: 'http://localhost' };

app.use(cors(corsOptions));

app.use(express.json());

app.post('/api/auth/token', (req, res) => {
  const { email, username, name } = req.body;

  const token = jwt.sign({ sub: email, username, name }, config.authJwtSecret);

  res.json({ access_token: token });
});

app.use('/api/auth/verify', (req, res, next) => {
  const { access_token } = req.query;

  try {
    const decoded = jwt.verify(access_token, config.authJwtSecret);

    res.json({ message: 'The access token is valid', username: decoded.sub });
  } catch (err) {
    next(err);
  }
});

const server = app.listen(5000, () => {});

console.log(`Listening http://localhost:${server.address().port}`);
