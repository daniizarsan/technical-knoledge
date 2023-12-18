import express from 'express';

import morgan from 'morgan';
import cors from 'cors';
import fileupload from 'express-fileupload';

import config from '@config';
import routes from '@router/index.router';

import { controlLogsMorgan } from '@middleware/morgan.middleware'
import { checkInvalidChars } from '@utils/chars.utils';

const app = express();

app.set('PUERTO', config.API_PORT);

app.use(fileupload(
    {
        limits: { fileSize: 10485760 },
        abortOnLimit: true,
        uploadTimeout: 60000,
        responseOnLimit: 'The file exceeds the maximum allowed file size of 10 MB.',
    }
));

app.use(morgan(controlLogsMorgan));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(checkInvalidChars)

app.use('/api', routes);
app.use('/public', express.static(config.PUBLIC_PATH));

export default app;
