const mariadb = require("mariadb");
const dotenv = require('dotenv');
dotenv.config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
});

async function query(sql, params = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    // Nota: mariadb añade metadata en rows.meta; puedes retornarlo tal cual
    return rows;
  } finally {
    if (conn) conn.release();
  }
}

async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query("SELECT 1");
        return res[0]['1'] === 1; // Verifica que la consulta retorne 1
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
  query,
  pool,
  testConnection
};