import pool from '../config/database';
import { CreateExpeditionDTO, UpdateExpeditionDTO, Expedition, ExpeditionStats } from '../types/expedition';
import { v4 as uuidv4 } from 'uuid';

export class ExpeditionService {
  // Obter todas as expedições
  async getAll(): Promise<Expedition[]> {
    const query = `
      SELECT 
        e.*,
        json_agg(p.*) as products,
        qc.*,
        r.*
      FROM expeditions e
      LEFT JOIN products p ON p.expedition_id = e.id
      LEFT JOIN quality_control qc ON qc.expedition_id = e.id
      LEFT JOIN rejections r ON r.expedition_id = e.id
      GROUP BY e.id, qc.id, r.id
      ORDER BY e.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // Obter estatísticas das expedições
  async getStats(): Promise<ExpeditionStats> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'em_analise' THEN 1 END) as in_analysis,
        COUNT(CASE WHEN status = 'aprovado' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejeitado' THEN 1 END) as rejected,
        COUNT(CASE WHEN status = 'retido' THEN 1 END) as retained
      FROM expeditions
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  // Obter expedição por ID
  async getById(id: string): Promise<Expedition | null> {
    const query = `
      SELECT 
        e.*,
        json_agg(p.*) as products,
        qc.*,
        r.*
      FROM expeditions e
      LEFT JOIN products p ON p.expedition_id = e.id
      LEFT JOIN quality_control qc ON qc.expedition_id = e.id
      LEFT JOIN rejections r ON r.expedition_id = e.id
      WHERE e.id = $1
      GROUP BY e.id, qc.id, r.id
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Criar nova expedição
  async create(data: CreateExpeditionDTO): Promise<Expedition> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const expeditionId = uuidv4();
      const now = new Date().toISOString();

      // Inserir expedição
      const expeditionQuery = `
        INSERT INTO expeditions (
          id, expedition_number, date_time, status,
          truck_plate, driver_name, driver_document, transport_company,
          expedition_responsible, responsible_position, supplier_name,
          created_at, updated_at, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const expeditionValues = [
        expeditionId,
        data.expeditionNumber,
        data.dateTime,
        data.status,
        data.truckPlate,
        data.driverName,
        data.driverDocument,
        data.transportCompany,
        data.expeditionResponsible,
        data.responsiblePosition,
        data.supplierName,
        now,
        now,
        data.createdBy
      ];

      const expeditionResult = await client.query(expeditionQuery, expeditionValues);

      // Inserir produtos
      if (data.products && data.products.length > 0) {
        const productQuery = `
          INSERT INTO products (
            id, expedition_id, name, code, quantity, unit,
            batch, expiry_date, status, observations
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        for (const product of data.products) {
          const productValues = [
            uuidv4(),
            expeditionId,
            product.name,
            product.code,
            product.quantity,
            product.unit,
            product.batch,
            product.expiryDate,
            product.status,
            product.observations
          ];

          await client.query(productQuery, productValues);
        }
      }

      // Inserir controle de qualidade
      const qualityControlQuery = `
        INSERT INTO quality_control (
          id, expedition_id, responsible_name, analysis_date_time,
          approval_status, justification, digital_signature, observations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      const qualityControlValues = [
        uuidv4(),
        expeditionId,
        data.qualityControl.responsibleName,
        data.qualityControl.analysisDateTime,
        data.qualityControl.approvalStatus,
        data.qualityControl.justification,
        data.qualityControl.digitalSignature,
        data.qualityControl.observations
      ];

      await client.query(qualityControlQuery, qualityControlValues);

      // Inserir rejeição se houver
      if (data.rejection) {
        const rejectionQuery = `
          INSERT INTO rejections (
            id, expedition_id, reason, sent_to_supplies,
            supplies_date_time, supplies_responsible, cargo_retained,
            retained_quantity, retention_location, corrective_actions
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        const rejectionValues = [
          uuidv4(),
          expeditionId,
          data.rejection.reason,
          data.rejection.sentToSupplies,
          data.rejection.suppliesDateTime,
          data.rejection.suppliesResponsible,
          data.rejection.cargoRetained,
          data.rejection.retainedQuantity,
          data.rejection.retentionLocation,
          data.rejection.correctiveActions
        ];

        await client.query(rejectionQuery, rejectionValues);
      }

      await client.query('COMMIT');
      return this.getById(expeditionId) as Promise<Expedition>;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Atualizar expedição
  async update(id: string, data: UpdateExpeditionDTO): Promise<Expedition | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const now = new Date().toISOString();

      // Atualizar expedição
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(data)) {
        if (key !== 'products' && key !== 'qualityControl' && key !== 'rejection') {
          updateFields.push(`${key} = $${paramCount}`);
          updateValues.push(value);
          paramCount++;
        }
      }

      if (updateFields.length > 0) {
        updateFields.push(`updated_at = $${paramCount}`);
        updateValues.push(now);
        paramCount++;

        const updateQuery = `
          UPDATE expeditions
          SET ${updateFields.join(', ')}
          WHERE id = $${paramCount}
          RETURNING *
        `;

        updateValues.push(id);
        await client.query(updateQuery, updateValues);
      }

      // Atualizar produtos se fornecidos
      if (data.products) {
        // Remover produtos existentes
        await client.query('DELETE FROM products WHERE expedition_id = $1', [id]);

        // Inserir novos produtos
        const productQuery = `
          INSERT INTO products (
            id, expedition_id, name, code, quantity, unit,
            batch, expiry_date, status, observations
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        for (const product of data.products) {
          const productValues = [
            uuidv4(),
            id,
            product.name,
            product.code,
            product.quantity,
            product.unit,
            product.batch,
            product.expiryDate,
            product.status,
            product.observations
          ];

          await client.query(productQuery, productValues);
        }
      }

      // Atualizar controle de qualidade se fornecido
      if (data.qualityControl) {
        const qualityControlQuery = `
          UPDATE quality_control
          SET 
            responsible_name = $1,
            analysis_date_time = $2,
            approval_status = $3,
            justification = $4,
            digital_signature = $5,
            observations = $6
          WHERE expedition_id = $7
        `;

        const qualityControlValues = [
          data.qualityControl.responsibleName,
          data.qualityControl.analysisDateTime,
          data.qualityControl.approvalStatus,
          data.qualityControl.justification,
          data.qualityControl.digitalSignature,
          data.qualityControl.observations,
          id
        ];

        await client.query(qualityControlQuery, qualityControlValues);
      }

      // Atualizar rejeição se fornecida
      if (data.rejection) {
        const rejectionQuery = `
          UPDATE rejections
          SET 
            reason = $1,
            sent_to_supplies = $2,
            supplies_date_time = $3,
            supplies_responsible = $4,
            cargo_retained = $5,
            retained_quantity = $6,
            retention_location = $7,
            corrective_actions = $8
          WHERE expedition_id = $9
        `;

        const rejectionValues = [
          data.rejection.reason,
          data.rejection.sentToSupplies,
          data.rejection.suppliesDateTime,
          data.rejection.suppliesResponsible,
          data.rejection.cargoRetained,
          data.rejection.retainedQuantity,
          data.rejection.retentionLocation,
          data.rejection.correctiveActions,
          id
        ];

        await client.query(rejectionQuery, rejectionValues);
      }

      await client.query('COMMIT');
      return this.getById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Deletar expedição
  async delete(id: string): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Deletar registros relacionados
      await client.query('DELETE FROM products WHERE expedition_id = $1', [id]);
      await client.query('DELETE FROM quality_control WHERE expedition_id = $1', [id]);
      await client.query('DELETE FROM rejections WHERE expedition_id = $1', [id]);
      
      // Deletar expedição
      const result = await client.query('DELETE FROM expeditions WHERE id = $1 RETURNING id', [id]);
      
      await client.query('COMMIT');
      return result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Atualizar controle de qualidade
  async updateQualityControl(id: string, qualityControlData: any): Promise<Expedition | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const qualityControlQuery = `
        UPDATE quality_control
        SET 
          responsible_name = $1,
          analysis_date_time = $2,
          approval_status = $3,
          justification = $4,
          digital_signature = $5,
          observations = $6
        WHERE expedition_id = $7
      `;

      const qualityControlValues = [
        qualityControlData.responsibleName,
        qualityControlData.analysisDateTime,
        qualityControlData.approvalStatus,
        qualityControlData.justification,
        qualityControlData.digitalSignature,
        qualityControlData.observations,
        id
      ];

      await client.query(qualityControlQuery, qualityControlValues);

      // Atualizar status da expedição baseado no status do controle de qualidade
      const statusUpdateQuery = `
        UPDATE expeditions
        SET 
          status = CASE 
            WHEN $1 = 'aprovado' THEN 'aprovado'
            WHEN $1 = 'rejeitado' THEN 'rejeitado'
            ELSE status
          END,
          updated_at = $2
        WHERE id = $3
      `;

      await client.query(statusUpdateQuery, [
        qualityControlData.approvalStatus,
        new Date().toISOString(),
        id
      ]);

      await client.query('COMMIT');
      return this.getById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Atualizar rejeição
  async updateRejection(id: string, rejectionData: any): Promise<Expedition | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const rejectionQuery = `
        UPDATE rejections
        SET 
          reason = $1,
          sent_to_supplies = $2,
          supplies_date_time = $3,
          supplies_responsible = $4,
          cargo_retained = $5,
          retained_quantity = $6,
          retention_location = $7,
          corrective_actions = $8
        WHERE expedition_id = $9
      `;

      const rejectionValues = [
        rejectionData.reason,
        rejectionData.sentToSupplies,
        rejectionData.suppliesDateTime,
        rejectionData.suppliesResponsible,
        rejectionData.cargoRetained,
        rejectionData.retainedQuantity,
        rejectionData.retentionLocation,
        rejectionData.correctiveActions,
        id
      ];

      await client.query(rejectionQuery, rejectionValues);

      // Atualizar status da expedição para retido se o cargo estiver retido
      if (rejectionData.cargoRetained) {
        const statusUpdateQuery = `
          UPDATE expeditions
          SET 
            status = 'retido',
            updated_at = $1
          WHERE id = $2
        `;

        await client.query(statusUpdateQuery, [new Date().toISOString(), id]);
      }

      await client.query('COMMIT');
      return this.getById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
} 