const fs = require('fs')
var httpProxy = require('http-proxy');
const SSL_PORT = process.env.SSL_PORT || 3003;
const TO_PORT = process.env.PORT || 3000;

const goingTo = 'http://localhost:' + TO_PORT;

console.log('listening on port:', SSL_PORT);
console.log('https://localhost:'+SSL_PORT);
console.log('proxy to ', goingTo)
 
// var proxy = httpProxy.createProxyServer(options); // See (†)
httpProxy.createServer({
    ssl: {
      key: fs.readFileSync('cert/key.pem', 'utf8'),
      cert: fs.readFileSync('cert/cert.pem', 'utf8')
    },
    target: goingTo,
    secure: false, // Depends on your needs, could be false.
    protocolRewrite: 'https'
  }).listen(SSL_PORT);
