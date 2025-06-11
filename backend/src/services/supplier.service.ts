import pool from '../config/database';
import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '../types/supplier';
import { v4 as uuidv4 } from 'uuid';

export class SupplierService {
  // Obter todos os fornecedores
  async getAll(): Promise<Supplier[]> {
    const query = 'SELECT * FROM suppliers ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows.map(this.mapDbRowToSupplier);
  }

  // Obter fornecedor por ID
  async getById(id: string): Promise<Supplier | null> {
    const query = 'SELECT * FROM suppliers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.mapDbRowToSupplier(result.rows[0]) : null;
  }

  // Criar novo fornecedor
  async create(data: CreateSupplierDTO): Promise<Supplier> {
    const supplierId = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO suppliers (
        id, name, document, email, phone, address,
        city, state, zip_code, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      supplierId,
      data.name,
      data.document,
      data.email || null,
      data.phone || null,
      data.address || null,
      data.city || null,
      data.state || null,
      data.zipCode || null,
      now,
      now,
    ];

    const result = await pool.query(query, values);
    return this.mapDbRowToSupplier(result.rows[0]);
  }

  // Atualizar fornecedor
  async update(id: string, data: UpdateSupplierDTO): Promise<Supplier | null> {
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
      UPDATE suppliers
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] ? this.mapDbRowToSupplier(result.rows[0]) : null;
  }

  // Deletar fornecedor
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM suppliers WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Função auxiliar para mapear nomes de colunas do banco de dados para nomes de propriedades de interface
  private mapDbRowToSupplier(row: any): Supplier {
    return {
      id: row.id,
      name: row.name,
      document: row.document,
      email: row.email,
      phone: row.phone,
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