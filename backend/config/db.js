const sql = require("mssql");

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),

  options: {
    encrypt: true,
    trustServerCertificate: false,
  },

  connectionTimeout: 30000,
  requestTimeout: 30000,
};

module.exports = {
  sql,
  dbConfig,
};