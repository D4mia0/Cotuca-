const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false, // Alterar para true se usares Azure
        trustServerCertificate: true // Necessário para desenvolvimento local
    }
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Conectado ao SQL Server com sucesso!');
        return pool;
    } catch (err) {
        console.error('Erro de conexão ao banco:', err);
        throw err;
    }
}

module.exports = { sql, connectToDatabase };