const fs = require('fs')
var httpProxy = require('http-proxy');

const PORT = 3001;

console.log('listening on port ', PORT);
 
// var proxy = httpProxy.createProxyServer(options); // See (†)
httpProxy.createServer({
    ssl: {
      key: fs.readFileSync('cert/key.pem', 'utf8'),
      cert: fs.readFileSync('cert/cert.pem', 'utf8')
    },
    target: 'http://localhost:3000',
    secure: false, // Depends on your needs, could be false.
    protocolRewrite: 'https'
  }).listen(PORT);