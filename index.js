require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const urlParser = require('url');

express.urlencoded();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// middleware function for checking url validation
function urlCheck(req, res, next) {
  try { // if unable to parse
    const url = req.body.url;
    dns.lookup(urlParser.parse(url).hostname, (err, address, family) => {
      if (!address) {
        return res.json({ error: 'invalid url' });
      }
      else {
        next();
      }
    });
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

}

let urlArray = [];

app.post('/api/shorturl', urlCheck, (req, res) => {
  urlArray.push(req.body.url);
  res.json({
    original_url: req.body.url,
    short_url: urlArray.length - 1
  })
})

app.get('/api/shorturl/:id', (req, res) => {
  res.redirect(urlArray[req.params.id]);
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
