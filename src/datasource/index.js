/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const { DataSource } = require('typeorm');

exports.default = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '../core/entities/*.entity.ts'],
  migrations: ['dist/migrations/*.js'],
});
