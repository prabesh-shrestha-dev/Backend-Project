const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// Waterfall middleware handling by express

//custom middleware loggger 
app.use(logger);

// Cross Origin Resource Sharing
const whitelist = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// Middleware to explicitly allow PNA requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get(['/', '/index.html', '/index'], (req, res) => {
  // res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get(['/new-page.html', '/new-page'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

// Redirect
app.get(['/old-page.html', '/old-page'], (req, res) => {
  // Permanently moved to new page // 301
  res.redirect(301, '/new-page.html'); // 302 by default
});

// Route handlers
app.get(['/hello.html', '/hello'], (req, res, next) => {
  console.log('attempted to load hello.html');
  next();
}, (req, res) => {
  res.send('Hello World!');
});

// chaining route handlers
const one = (req, res, next) => {
  console.log('one');
  next();
};

const two = (req, res, next) => {
  console.log('two');
  next();
};

const three = (req, res, next) => {
  console.log('three');
  res.send('Finished!');
};

// app.get(['/chain.html', '/chain'], [one, two, three]);
app.get(['/chain.html', '/chain'], one, two, three);

app.all('/{*splat}', (req, res) => {
  // By default express will send 200 since successful sendFile
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});