import pool from '../config/database';
import { Truck, CreateTruckDTO, UpdateTruckDTO } from '../types/truck';
import { v4 as uuidv4 } from 'uuid';

export class TruckService {
  // Obter todos os caminhões
  async getAll(): Promise<Truck[]> {
    const query = 'SELECT * FROM trucks ORDER BY plate ASC';
    const result = await pool.query(query);
    return result.rows.map(this.mapDbRowToTruck);
  }

  // Obter caminhão por ID
  async getById(id: string): Promise<Truck | null> {
    const query = 'SELECT * FROM trucks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.mapDbRowToTruck(result.rows[0]) : null;
  }

  // Criar novo caminhão
  async create(data: CreateTruckDTO): Promise<Truck> {
    const truckId = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO trucks (
        id, plate, model, brand, year, axles, capacity,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      truckId,
      data.plate,
      data.model,
      data.brand,
      data.year,
      data.axles,
      data.capacity,
      now,
      now,
    ];

    const result = await pool.query(query, values);
    return this.mapDbRowToTruck(result.rows[0]);
  }

  // Atualizar caminhão
  async update(id: string, data: UpdateTruckDTO): Promise<Truck | null> {
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
      UPDATE trucks
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] ? this.mapDbRowToTruck(result.rows[0]) : null;
  }

  // Deletar caminhão
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM trucks WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Função auxiliar para mapear nomes de colunas do banco de dados para nomes de propriedades de interface
  private mapDbRowToTruck(row: any): Truck {
    return {
      id: row.id,
      plate: row.plate,
      model: row.model,
      brand: row.brand,
      year: row.year,
      axles: row.axles,
      capacity: row.capacity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Função auxiliar para converter camelCase para snake_case
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
} 