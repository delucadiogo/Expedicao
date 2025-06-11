import pool from '../config/database';
import { ExpeditionResponsible, CreateExpeditionResponsibleDTO, UpdateExpeditionResponsibleDTO } from '../types/expeditionResponsible';
import { v4 as uuidv4 } from 'uuid';

export class ExpeditionResponsibleService {
  // Obter todos os responsáveis de expedição
  async getAll(): Promise<ExpeditionResponsible[]> {
    const query = 'SELECT * FROM expedition_responsibles ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows.map(this.mapDbRowToExpeditionResponsible);
  }

  // Obter responsável de expedição por ID
  async getById(id: string): Promise<ExpeditionResponsible | null> {
    const query = 'SELECT * FROM expedition_responsibles WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.mapDbRowToExpeditionResponsible(result.rows[0]) : null;
  }

  // Criar novo responsável de expedição
  async create(data: CreateExpeditionResponsibleDTO): Promise<ExpeditionResponsible> {
    const responsibleId = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO expedition_responsibles (
        id, name, position, sector, email, phone,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      responsibleId,
      data.name,
      data.position,
      data.sector,
      data.email || null,
      data.phone || null,
      now,
      now,
    ];

    const result = await pool.query(query, values);
    return this.mapDbRowToExpeditionResponsible(result.rows[0]);
  }

  // Atualizar responsável de expedição
  async update(id: string, data: UpdateExpeditionResponsibleDTO): Promise<ExpeditionResponsible | null> {
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
      UPDATE expedition_responsibles
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] ? this.mapDbRowToExpeditionResponsible(result.rows[0]) : null;
  }

  // Deletar responsável de expedição
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM expedition_responsibles WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Função auxiliar para mapear nomes de colunas do banco de dados para nomes de propriedades de interface
  private mapDbRowToExpeditionResponsible(row: any): ExpeditionResponsible {
    return {
      id: row.id,
      name: row.name,
      position: row.position,
      sector: row.sector,
      email: row.email,
      phone: row.phone,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Função auxiliar para converter camelCase para snake_case
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
} 