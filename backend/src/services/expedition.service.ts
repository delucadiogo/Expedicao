import pool from '../config/database';
import { CreateExpeditionDTO, UpdateExpeditionDTO, Expedition, ExpeditionStats } from '../types/expedition';
import { v4 as uuidv4 } from 'uuid';
import { PoolClient } from 'pg';

export class ExpeditionService {
  // Obter todas as expedições com filtros
  async getAll(filters?: { 
    expeditionNumber?: string;
    truckPlate?: string;
    driverName?: string;
    supplierName?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Expedition[]> {
    let query = `
      SELECT
        e.id,
        e.expedition_number AS "expeditionNumber",
        e.date_time AS "dateTime",
        e.status,
        e.truck_plate AS "truckPlate",
        e.driver_name AS "driverName",
        e.driver_document AS "driverDocument",
        e.transport_company AS "transportCompany",
        e.supplier_name AS "supplierName",
        e.supplier_document AS "supplierDocument",
        e.expedition_responsible AS "expeditionResponsible",
        e.responsible_position AS "responsiblePosition",
        json_agg(
            json_build_object(
                'id', p.id,
                'name', p.name,'code', p.code,
                'quantity', p.quantity,
                'unit', p.unit,
                'batch', p.batch,
                'expiryDate', p.expiry_date,
                'status', p.status,
                'observations', p.observations
            ) ORDER BY p.id
        ) FILTER (WHERE p.id IS NOT NULL) AS products,
        json_build_object(
            'responsibleName', qc.responsible_name,
            'analysisDateTime', qc.analysis_date_time,
            'approvalStatus', qc.approval_status,
            'justification', qc.justification,
            'digitalSignature', qc.digital_signature,
            'observations', qc.observations
        ) AS "qualityControl",
        json_build_object(
            'reason', r.reason,
            'sentToSupplies', r.sent_to_supplies,
            'suppliesDateTime', r.supplies_date_time,
            'suppliesResponsible', r.supplies_responsible,
            'cargoRetained', r.cargo_retained,
            'retainedQuantity', r.retained_quantity,
            'retentionLocation', r.retention_location,
            'correctiveActions', r.corrective_actions
        ) AS rejection,
        e.created_at AS "createdAt",
        e.updated_at AS "updatedAt",
        e.created_by AS "createdBy",
        e.updated_by AS "updatedBy",
        e.observations AS observations
      FROM expeditions e
      LEFT JOIN products p ON p.expedition_id = e.id
      LEFT JOIN quality_control qc ON qc.expedition_id = e.id
      LEFT JOIN rejections r ON r.expedition_id = e.id
    `;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (filters?.expeditionNumber) {
      conditions.push(`e.expedition_number ILIKE $${paramIndex++}`);
      values.push(`%${filters.expeditionNumber}%`);
    }
    if (filters?.truckPlate) {
      conditions.push(`e.truck_plate ILIKE $${paramIndex++}`);
      values.push(`%${filters.truckPlate}%`);
    }
    if (filters?.driverName) {
      conditions.push(`e.driver_name ILIKE $${paramIndex++}`);
      values.push(`%${filters.driverName}%`);
    }
    if (filters?.supplierName) {
      conditions.push(`e.supplier_name ILIKE $${paramIndex++}`);
      values.push(`%${filters.supplierName}%`);
    }
    if (filters?.status) {
      conditions.push(`e.status = $${paramIndex++}`);
      values.push(filters.status);
    }
    if (filters?.startDate) {
      conditions.push(`e.date_time >= $${paramIndex++}`);
      values.push(`${filters.startDate} 00:00:00`); // Ajuste para timestamp without time zone
    }
    if (filters?.endDate) {
      conditions.push(`e.date_time <= $${paramIndex++}`);
      values.push(`${filters.endDate} 23:59:59`); // Ajuste para timestamp without time zone
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY e.id, qc.id, r.id
      ORDER BY e.created_at DESC
    `;

    const result = await pool.query(query, values);
    console.log('Resultado da query getAll (backend - FINAL):', result.rows); // Log para depuração
    return result.rows;
  }

  // Obter estatísticas das expedições
  async getStats(filters?: { startDate?: string; endDate?: string; }): Promise<ExpeditionStats> {
    try {
      let query = `
        SELECT 
          CAST(COUNT(*) AS INTEGER) as total,
          CAST(COUNT(CASE WHEN status = 'pendente' THEN 1 END) AS INTEGER) as pending,
          CAST(COUNT(CASE WHEN status = 'em_analise' THEN 1 END) AS INTEGER) as "inAnalysis",
          CAST(COUNT(CASE WHEN status = 'aprovado' THEN 1 END) AS INTEGER) as approved,
          CAST(COUNT(CASE WHEN status = 'rejeitado' THEN 1 END) AS INTEGER) as rejected,
          CAST(COUNT(CASE WHEN status = 'retido' THEN 1 END) AS INTEGER) as retained
        FROM expeditions e
      `;

      const conditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (filters?.startDate) {
        conditions.push(`e.date_time >= $${paramIndex++}`);
        values.push(`${filters.startDate} 00:00:00`); // Ajuste para timestamp without time zone
      }
      if (filters?.endDate) {
        conditions.push(`e.date_time <= $${paramIndex++}`);
        values.push(`${filters.endDate} 23:59:59`); // Ajuste para timestamp without time zone
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      console.log('Query final para getStats (backend):', query);
      console.log('Valores da query para getStats (backend):', values);

      const result = await pool.query(query, values);
      console.log('Resultado do getStats do backend:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar estatísticas no service:', error); // Log detalhado
      throw error;
    }
  }

  // Obter expedição por ID
  async getById(id: string): Promise<Expedition | null> {
    const query = `
      SELECT
        e.id,
        e.expedition_number AS "expeditionNumber",
        e.date_time AS "dateTime",
        e.status,
        e.truck_plate AS "truckPlate",
        e.driver_name AS "driverName",
        e.driver_document AS "driverDocument",
        e.transport_company AS "transportCompany",
        e.supplier_name AS "supplierName",
        e.supplier_document AS "supplierDocument",
        e.expedition_responsible AS "expeditionResponsible",
        e.responsible_position AS "responsiblePosition",
        json_agg(
            json_build_object(
                'id', p.id,
                'name', p.name,
                'code', p.code,
                'quantity', p.quantity,
                'unit', p.unit,
                'batch', p.batch,
                'expiryDate', p.expiry_date,
                'status', p.status,
                'observations', p.observations
            ) ORDER BY p.id
        ) FILTER (WHERE p.id IS NOT NULL) AS products,
        json_build_object(
            'responsibleName', qc.responsible_name,
            'analysisDateTime', qc.analysis_date_time,
            'approvalStatus', qc.approval_status,
            'justification', qc.justification,
            'digitalSignature', qc.digital_signature,
            'observations', qc.observations
        ) AS "qualityControl",
        json_build_object(
            'reason', r.reason,
            'sentToSupplies', r.sent_to_supplies,
            'suppliesDateTime', r.supplies_date_time,
            'suppliesResponsible', r.supplies_responsible,
            'cargoRetained', r.cargo_retained,
            'retainedQuantity', r.retained_quantity,
            'retentionLocation', r.retention_location,
            'correctiveActions', r.corrective_actions
        ) AS rejection,
        e.created_at AS "createdAt",
        e.updated_at AS "updatedAt",
        e.created_by AS "createdBy",
        e.updated_by AS "updatedBy",
        e.arrival_datetime AS "arrivalDateTime",
        e.observations AS observations
      FROM expeditions e
      LEFT JOIN products p ON p.expedition_id = e.id
      LEFT JOIN quality_control qc ON qc.expedition_id = e.id
      LEFT JOIN rejections r ON r.expedition_id = e.id
      WHERE e.id = $1
      GROUP BY e.id, qc.id, r.id
    `;

    const result = await pool.query(query, [id]);
    console.log('Resultado da query getById (backend - FINAL):', result.rows[0]); // Log para depuração
    return result.rows[0] || null;
  }

  // Criar nova expedição
  async create(data: CreateExpeditionDTO): Promise<Expedition> {
    console.log('ExpeditionService.create received data:', data); // Log para depuração
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
          expedition_responsible, responsible_position, supplier_name, supplier_document,
          created_at, updated_at, created_by, observations, arrival_datetime
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
        data.supplierDocument,
        now,
        now,
        data.createdBy || 'system',
        data.observations || null,
        data.arrivalDateTime || null
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
            Number(product.quantity),
            product.unit,
            (product.batch === '' || product.batch === undefined) ? null : product.batch,
            (product.expiryDate === '' || product.expiryDate === undefined) ? null : product.expiryDate,
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
          Number(data.rejection.retainedQuantity),
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
    console.log('ExpeditionService.update received data:', data); // Log para depuração
    const client = await pool.connect();
    
    try {
      console.log('BEGINNING TRANSACTION'); // Novo log
      await client.query('BEGIN');

      const now = new Date().toISOString();

      // Atualizar expedição
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      // Tratar campos específicos primeiro
      if ('observations' in data) {
        console.log('Observations value:', data.observations); // Log para debug
        updateFields.push(`observations = $${paramCount}`);
        updateValues.push(data.observations || null);
        paramCount++;
      }

      // Tratar arrivalDateTime especificamente
      if ('arrivalDateTime' in data) {
        updateFields.push(`arrival_datetime = $${paramCount}`);
        updateValues.push(data.arrivalDateTime || null); // Permite null
        paramCount++;
      }

      // Tratar os demais campos
      for (const [key, value] of Object.entries(data)) {
        if (key !== 'products' && key !== 'qualityControl' && key !== 'rejection' && key !== 'observations' && key !== 'arrivalDateTime') {
          const snakeKey = this.toSnakeCase(key);
          updateFields.push(`${snakeKey} = $${paramCount}`);
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
        console.log('Update fields:', updateFields); // Log para debug
        console.log('Update values:', updateValues); // Log para debug
        console.log('Final update query:', updateQuery); // Log para debug

        const result = await client.query(updateQuery, updateValues);
        console.log('Result from main expedition update:', result.rows[0]); // Log para debug

        if ((result.rowCount || 0) === 0) {
          await client.query('ROLLBACK');
          return null;
        }
      }

      // Atualizar produtos se fornecidos
      if (data.products) {
        console.log('Products data received for update:', data.products);
        // Remover produtos existentes associados a esta expedição para re-inserir (abordagem simplificada)
        const deleteProductsQuery = 'DELETE FROM products WHERE expedition_id = $1';
        await client.query(deleteProductsQuery, [id]);

        // Inserir todos os produtos da lista (incluindo os atualizados e os novos)
        const productQuery = `
          INSERT INTO products (
            id, expedition_id, name, code, quantity, unit,
            batch, expiry_date, status, observations
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        for (const product of data.products) {
          const productValues = [
            product.id, // Usa o ID existente do produto, ou um novo se for adição via frontend
            id,
            product.name,
            product.code,
            Number(product.quantity),
            product.unit,
            (product.batch === '' || product.batch === undefined) ? null : product.batch,
            (product.expiryDate === '' || product.expiryDate === undefined) ? null : product.expiryDate,
            product.status,
            product.observations
          ];

          await client.query(productQuery, productValues);
        }
      }

      // Atualizar controle de qualidade se fornecido
      if (data.qualityControl) {
        await this.updateQualityControl(id, data.qualityControl, client);
      }

      // Atualizar rejeição se fornecido
      if (data.rejection) {
        await this.updateRejection(id, data.rejection, client);
      }

      await client.query('COMMIT');
      console.log('COMMITTING TRANSACTION'); // Novo log
      return this.getById(id);
    } catch (error) {
      console.error('Erro ao atualizar expedição no service:', error);
      console.log('ROLLING BACK TRANSACTION - Error:', error); // Novo log
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
      return (result.rowCount || 0) > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Atualizar controle de qualidade
  async updateQualityControl(id: string, qualityControlData: any, client: PoolClient): Promise<Expedition | null> {
    console.log('ExpeditionService.updateQualityControl received qualityControlData:', qualityControlData); // Log para depuração
    
    try {
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

      // Não faremos o getById aqui, pois a transação ainda está em andamento
      return null; // ou um objeto de status simples se necessário
    } catch (error) {
      console.error('Erro ao atualizar controle de qualidade no service:', error);
      // Não faremos rollback aqui, será tratado pela função chamadora
      throw error;
    } 
  }

  // Atualizar rejeição
  async updateRejection(id: string, rejectionData: any, client: PoolClient): Promise<Expedition | null> {
    console.log('ExpeditionService.updateRejection received rejectionData:', rejectionData); // Log para depuração
    
    try {
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
        Number(rejectionData.retainedQuantity),
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

      // Não faremos o getById aqui, pois a transação ainda está em andamento
      return null; // ou um objeto de status simples se necessário
    } catch (error) {
      console.error('Erro ao atualizar rejeição no service:', error);
      // Não faremos rollback aqui, será tratado pela função chamadora
      throw error;
    } 
  }

  // Atualizar controle de qualidade (versão standalone)
  async updateQualityControlStandalone(id: string, qualityControlData: any): Promise<Expedition | null> {
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
      console.error('Erro ao atualizar controle de qualidade no service:', error);
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Atualizar rejeição (versão standalone)
  async updateRejectionStandalone(id: string, rejectionData: any): Promise<Expedition | null> {
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
        Number(rejectionData.retainedQuantity),
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
      console.error('Erro ao atualizar rejeição no service:', error);
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
} 