/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const { DataSource } = require('typeorm');

exports.default = new DataSource({
  database: process.env.DB_NAME,
  entities: [__dirname + '../core/entities/*.entity.ts'],
  host: process.env.DB_HOST,
  migrations: ['dist/migrations/*.js'],
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  type: process.env.DB_TYPE,
  username: process.env.DB_USERNAME,
});
