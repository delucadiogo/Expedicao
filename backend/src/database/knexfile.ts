import type { Knex } from "knex";
import * as dotenv from 'dotenv'; // Reativado o import do dotenv
dotenv.config({ path: './.env' }); // Reativado a chamada de config com o caminho correto

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL, // Variável de ambiente para conexão em produção
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

if (process.env.NODE_ENV !== 'production') {
  console.log('DEBUG: CWD do Knexfile:', process.cwd());
  console.log('DEBUG: DB_USER do Knexfile:', process.env.DB_USER);
  console.log('DEBUG: DB_PASSWORD do Knexfile:', process.env.DB_PASSWORD);
}

export default config; 