import pool from '../config/database';
import { Driver, CreateDriverDTO, UpdateDriverDTO } from '../types/driver';
import { v4 as uuidv4 } from 'uuid';

export class DriverService {
  // Obter todos os motoristas
  async getAll(): Promise<Driver[]> {
    const query = 'SELECT * FROM drivers ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows.map(this.mapDbRowToDriver);
  }

  // Obter motorista por ID
  async getById(id: string): Promise<Driver | null> {
    const query = 'SELECT * FROM drivers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.mapDbRowToDriver(result.rows[0]) : null;
  }

  // Criar novo motorista
  async create(data: CreateDriverDTO): Promise<Driver> {
    const driverId = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO drivers (
        id, name, document, phone, email, cnh, cnh_expiration_date,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      driverId,
      data.name,
      data.document,
      data.phone || null,
      data.email || null,
      data.cnh,
      data.cnhExpirationDate,
      now,
      now,
    ];

    const result = await pool.query(query, values);
    return this.mapDbRowToDriver(result.rows[0]);
  }

  // Atualizar motorista
  async update(id: string, data: UpdateDriverDTO): Promise<Driver | null> {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${this.toSnakeCase(key)} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    fields.push(`updated_at = $${paramCount}`);
    values.push(now);
    paramCount++;

    const query = `
      UPDATE drivers
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] ? this.mapDbRowToDriver(result.rows[0]) : null;
  }

  // Deletar motorista
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM drivers WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Função auxiliar para mapear nomes de colunas do banco de dados para nomes de propriedades de interface
  private mapDbRowToDriver(row: any): Driver {
    return {
      id: row.id,
      name: row.name,
      document: row.document,
      phone: row.phone,
      email: row.email,
      cnh: row.cnh,
      cnhExpirationDate: row.cnh_expiration_date, // Mapeamento de snake_case para camelCase
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Função auxiliar para converter camelCase para snake_case
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
} 