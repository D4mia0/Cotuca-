const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

async function connectToDatabase() {
  try {
    if (pool) return pool;
    pool = await sql.connect(dbConfig);
    console.log('Conectado ao SQL Server');
    return pool;
  } catch (err) {
    console.error('Erro de conexão:', err);
    throw err;
  }
}

async function query(queryString, params = {}) {
  const pool = await connectToDatabase();
  const request = pool.request();

  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }

  return request.query(queryString);
}

module.exports = { sql, connectToDatabase, query };
