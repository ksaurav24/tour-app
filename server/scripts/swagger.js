const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentation',
    version: '1.0.0',
  },
  host: 'localhost:3000', // Update this to your server's host and port
  schemes: ['http'], // Use ['https'] for production
};

const outputFile = '../swagger-output.json';
const endpointsFiles = ['../app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);