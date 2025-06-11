import pool from '../config/database';
import { TransportCompany, CreateTransportCompanyDTO, UpdateTransportCompanyDTO } from '../types/transportCompany';
import { v4 as uuidv4 } from 'uuid';

export class TransportCompanyService {
  // Obter todas as empresas de transporte
  async getAll(): Promise<TransportCompany[]> {
    const query = 'SELECT * FROM transport_companies ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows.map(this.mapDbRowToTransportCompany);
  }

  // Obter empresa de transporte por ID
  async getById(id: string): Promise<TransportCompany | null> {
    const query = 'SELECT * FROM transport_companies WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.mapDbRowToTransportCompany(result.rows[0]) : null;
  }

  // Criar nova empresa de transporte
  async create(data: CreateTransportCompanyDTO): Promise<TransportCompany> {
    const companyId = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO transport_companies (
        id, name, document, phone, email, address, city, state, zip_code,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      companyId,
      data.name,
      data.document,
      data.phone || null,
      data.email || null,
      data.address || null,
      data.city || null,
      data.state || null,
      data.zipCode || null,
      now,
      now,
    ];

    const result = await pool.query(query, values);
    return this.mapDbRowToTransportCompany(result.rows[0]);
  }

  // Atualizar empresa de transporte
  async update(id: string, data: UpdateTransportCompanyDTO): Promise<TransportCompany | null> {
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
      UPDATE transport_companies
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] ? this.mapDbRowToTransportCompany(result.rows[0]) : null;
  }

  // Deletar empresa de transporte
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM transport_companies WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Função auxiliar para mapear nomes de colunas do banco de dados para nomes de propriedades de interface
  private mapDbRowToTransportCompany(row: any): TransportCompany {
    return {
      id: row.id,
      name: row.name,
      document: row.document,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Função auxiliar para converter camelCase para snake_case
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
} 