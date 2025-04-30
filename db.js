import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: "localhost",
    database: "library",
    password: process.env.DB_PASSWORD,
    port: 5432,
});

export default pool;
