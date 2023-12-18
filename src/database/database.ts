import mysql from 'mysql2';
import config from '@config';

const db = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    multipleStatements: true
});

export default db;