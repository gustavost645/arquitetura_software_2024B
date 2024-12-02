module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'node',
      args: 'dist/index.js',  
      cwd: './packages/auth-service', 
    },
    {
      name: 'certificado-service',
      script: 'node',
      args: 'dist/index.js',
      cwd: './packages/certificado-service',  
    },
    {
      name: 'email-service',
      script: 'node',
      args: 'dist/index.js',
      cwd: './packages/email-service',  
    },
    {
      name: 'evento-service',
      script: 'node',
      args: 'dist/index.js',
      cwd: './packages/eventos-service',  
    },
    {
      name: 'inscricao-service',
      script: 'node',
      args: 'dist/index.js',
      cwd: './packages/inscricoes-service',  
    },
  ]
};
