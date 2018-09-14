const fs = require('fs')
const url = require('url');
var httpProxy = require('http-proxy');
const SSL_PORT = process.env.SSL_PORT || 3003;
const TO_PORT = process.env.PORT || 3000;

const goingTo = 'http://localhost:' + TO_PORT;

console.log('listening on port:', SSL_PORT);
console.log('https://localhost:' + SSL_PORT);
console.log('proxy to ', goingTo)

const allowedOrigins = ['iot.us-east-1.amazonaws.com'];

// var proxy = httpProxy.createProxyServer(options); // See (†)
const s = httpProxy.createServer({
  ssl: {
    key: fs.readFileSync('cert/key.pem', 'utf8'),
    cert: fs.readFileSync('cert/cert.pem', 'utf8')
  },
  target: goingTo,
  secure: false, // Depends on your needs, could be false.
  protocolRewrite: 'https'
}).listen(SSL_PORT);

s.on('proxyRes', (proxyRes, req, res, next) => {
  console.log('proxyRes', req.url);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // next();
  // return
  let allowedOrigin = false;
  if (req.headers.origin) {
    const originHostName = url.parse(req.headers.origin).hostname;
    // if (originHostName && allowedOrigins.some(o => o === originHostName)) {
      res.setHeader('access-control-allow-origin', req.headers.origin);
      res.setHeader('access-control-allow-credentials', 'true');
      allowedOrigin = true;
    // }
  }

  if (req.headers['access-control-request-method']) {
    res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
  }

  if (req.headers['access-control-request-headers']) {
    res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
  }

  if (allowedOrigin) {
    res.setHeader('access-control-max-age', 60 * 60 * 24 * 30);
    if (req.method === 'OPTIONS') {
      res.send(200);
      res.end();
    }
  }
});