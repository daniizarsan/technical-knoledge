import dotenv from 'dotenv';
dotenv.config();

export default {
  LOG_LEVEL: process.env.LOG_LEVEL || 'DEBUG',
  API_PORT: process.env.API_PORT || '3030',
  JWT_SECRET: process.env.JWT_SECRET || '',

  DB_NAME: process.env.DB_NAME || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASS: process.env.DB_PASS || '',
  DB_HOST: process.env.DB_HOST || '',
  DB_PORT: process.env.DB_PORT || '',

  SSL_KEY: process.env.SSL_KEY || '',
  SSL_CERT: process.env.SSL_CERT || '',

  PUBLIC_PATH: process.env.PUBLIC_PATH || '',

  ALLOWED_IMAGE: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg'],
  ALLOWED_VIDEO: ['video/mp4', 'video/webm'],

}
