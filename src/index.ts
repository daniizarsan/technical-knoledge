import app from './app';
import config from '@config';

import fs from "fs";
import https from 'https';

import { swaggerConfig } from './swagger.config'

if (config.SSL_KEY !== '' && config.SSL_CERT !== '') {
  const certificateOptions = {
    key: fs.readFileSync(config.SSL_KEY),
    cert: fs.readFileSync(config.SSL_CERT)
  };

  https.createServer(certificateOptions, app).listen(app.get('PUERTO'), () => {
    console.log('[HTTPS] API escuchando en el PUERTO ' + app.get('PUERTO'));
  });
} else {
  const expressSwagger = require('express-swagger-generator')(app);
  expressSwagger(swaggerConfig)

  app.listen(app.get('PUERTO'), () => {
    console.log('[HTTP] API escuchando en el PUERTO ' + app.get('PUERTO'));
  });
}