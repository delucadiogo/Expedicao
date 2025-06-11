import { Pool } from 'pg';
import db from '../config/database';
import { QualityResponsible, CreateQualityResponsibleDTO, UpdateQualityResponsibleDTO } from '../types/qualityResponsible';
import { v4 as uuidv4 } from 'uuid';

export class QualityResponsibleService {
  private pool: Pool;

  constructor() {
    this.pool = db;
  }

  private mapDbRowToQualityResponsible(row: any): QualityResponsible {
    return {
      id: row.id,
      name: row.name,
      position: row.position,
      sector: row.sector,
      email: row.email,
      phone: row.phone,
      digitalSignature: row.digital_signature,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toSnakeCase<T>(obj: T): { [key: string]: any } {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        newObj[snakeCaseKey] = obj[key];
      }
    }
    return newObj;
  }

  async getAll(): Promise<QualityResponsible[]> {
    const result = await this.pool.query(
      'SELECT * FROM quality_responsibles ORDER BY name ASC'
    );
    return result.rows.map(this.mapDbRowToQualityResponsible);
  }

  async getById(id: string): Promise<QualityResponsible | null> {
    const result = await this.pool.query(
      'SELECT * FROM quality_responsibles WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapDbRowToQualityResponsible(result.rows[0]);
  }

  async create(data: CreateQualityResponsibleDTO): Promise<QualityResponsible> {
    const id = uuidv4();
    const now = new Date();
    const snakeCaseData = this.toSnakeCase(data);

    const query = `
      INSERT INTO quality_responsibles (
        id, name, position, sector, email, phone, digital_signature, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      id,
      snakeCaseData.name,
      snakeCaseData.position,
      snakeCaseData.sector,
      snakeCaseData.email || null,
      snakeCaseData.phone || null,
      snakeCaseData.digital_signature || null,
      now,
      now,
    ];
    const result = await this.pool.query(query, values);
    return this.mapDbRowToQualityResponsible(result.rows[0]);
  }

  async update(id: string, data: UpdateQualityResponsibleDTO): Promise<QualityResponsible | null> {
    const now = new Date();
    const snakeCaseData = this.toSnakeCase(data);

    const fields = Object.keys(snakeCaseData)
      .filter(key => snakeCaseData[key] !== undefined) // Filter out undefined values
      .map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(snakeCaseData)
      .filter(value => value !== undefined);

    if (fields.length === 0) {
      const existing = await this.getById(id);
      return existing;
    }

    values.push(now); // updated_at
    values.push(id);

    const query = `
      UPDATE quality_responsibles
      SET ${fields.join(', ')}, updated_at = $${values.length - 1}
      WHERE id = $${values.length}
      RETURNING *
    `;
    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }
    return this.mapDbRowToQualityResponsible(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM quality_responsibles WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
} 