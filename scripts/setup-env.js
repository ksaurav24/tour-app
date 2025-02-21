const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');

const variables = [
  { name: 'BACKEND_URI', default: 'http://localhost:8000' },
  { name: 'CLIENT_URI', default: 'http://localhost:3000' },
  { name: 'NODE_ENV', default: 'development' },
  { name: 'PORT', default: '8000' },
  { name: 'MONGO_URI', default: '' },
  { name: 'SESSION_SECRET', default: '' },
  { name: 'JWT_SECRET', default: '' },
  { name: 'GOOGLE_CLIENT_ID', default: '' },
  { name: 'GOOGLE_CLIENT_SECRET', default: '' },
  { name: 'SMTP_HOST', default: '' },
  { name: 'MAIL_USER', default: '' },
  { name: 'MAIL_PASSWORD', default: '' }
];

const envContent = [];

variables.forEach(variable => {
  const defaultValue = variable.default ? ` (default: ${variable.default})` : '';
  const value = prompt(`Enter value for ${variable.name}${defaultValue}: `);
  const finalValue = value || variable.default;
  if (finalValue !== '') {
    envContent.push(`${variable.name}=${finalValue}`);
  }
});

const envPath = path.join(__dirname, '/../server/.env');
fs.writeFileSync(envPath, envContent.join('\n'));
console.log('.env file created successfully!');
