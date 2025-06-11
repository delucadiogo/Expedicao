import pool from '../config/database';
import { ProductCatalog, CreateProductCatalogDTO, UpdateProductCatalogDTO } from '../types/productCatalog';
import { v4 as uuidv4 } from 'uuid';

export class ProductCatalogService {
  // Obter todos os itens do catálogo de produtos
  async getAll(): Promise<ProductCatalog[]> {
    const query = 'SELECT * FROM products_catalog ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows.map(this.mapDbRowToProductCatalog);
  }

  // Obter item do catálogo de produtos por ID
  async getById(id: string): Promise<ProductCatalog | null> {
    const query = 'SELECT * FROM products_catalog WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.mapDbRowToProductCatalog(result.rows[0]) : null;
  }

  // Criar novo item do catálogo de produtos
  async create(data: CreateProductCatalogDTO): Promise<ProductCatalog> {
    const productId = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO products_catalog (
        id, name, code, category, unit, description,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      productId,
      data.name,
      data.code,
      data.category,
      data.unit,
      data.description || null,
      now,
      now,
    ];

    const result = await pool.query(query, values);
    return this.mapDbRowToProductCatalog(result.rows[0]);
  }

  // Atualizar item do catálogo de produtos
  async update(id: string, data: UpdateProductCatalogDTO): Promise<ProductCatalog | null> {
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
      UPDATE products_catalog
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] ? this.mapDbRowToProductCatalog(result.rows[0]) : null;
  }

  // Deletar item do catálogo de produtos
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM products_catalog WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Função auxiliar para mapear nomes de colunas do banco de dados para nomes de propriedades de interface
  private mapDbRowToProductCatalog(row: any): ProductCatalog {
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      category: row.category,
      unit: row.unit,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Função auxiliar para converter camelCase para snake_case
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
} 