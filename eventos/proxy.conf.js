const PROXY_CONFIG = [
  {
    context: ['/auth'],
    target: 'http://localhost:3001/',
    secure: false,
    logLevel: 'debug',
  },
  {
    context: ['/certificado'],
    target: 'http://localhost:3002/',
    secure: false,
    logLevel: 'debug',
  },
  {
    context: ['/email'],
    target: 'http://localhost:3003/',
    secure: false,
    logLevel: 'debug',
  },
  {
    context: ['/evento'],
    target: 'http://localhost:3004/',
    secure: false,
    logLevel: 'debug',
  },
  {
    context: ['/inscricao'],
    target: 'http://localhost:3005/',
    secure: false,
    logLevel: 'debug',
  }
];

module.exports = PROXY_CONFIG;
