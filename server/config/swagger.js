
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
// custom base url

const swaggerDocs = (app, port) => {
    swaggerFile.host = `localhost:${port}`;
    swaggerFile.schemes = ['http'];
    swaggerFile.basePath = '/';
    
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

};

module.exports = swaggerDocs;
