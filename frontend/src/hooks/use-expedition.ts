import { useState, useCallback } from 'react';
import { Expedition, CreateExpeditionDTO, UpdateExpeditionDTO, ExpeditionStatus, ExpeditionStats } from '@/types/expedition';
import { expeditionService } from '@/lib/api';
import { useToast } from './use-toast';

export function useExpedition() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [stats, setStats] = useState<ExpeditionStats>({
    total: 0,
    pending: 0,
    inAnalysis: 0,
    approved: 0,
    rejected: 0,
    retained: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateExpeditionNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `EXP-${year}${month}${day}-${random}`;
  }, []);

  // Carregar todas as expedições
  const loadExpeditions = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await expeditionService.getAll(filters);
      setExpeditions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar expedições');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as expedições',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expeditionService.getStats();
      console.log('Dados de estatísticas recebidos do serviço:', data);
      setStats({
        total: data.total,
        pending: data.pending,
        inAnalysis: data.in_analysis,
        approved: data.approved,
        rejected: data.rejected,
        retained: data.retained,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as estatísticas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Criar nova expedição
  const createExpedition = useCallback(async (data: CreateExpeditionDTO) => {
    try {
      setLoading(true);
      setError(null);
      const expeditionData: CreateExpeditionDTO = {
        ...data,
        expeditionNumber: data.expeditionNumber || generateExpeditionNumber(),
        status: data.status || 'pendente',
        dateTime: data.dateTime || new Date().toISOString(),
        createdBy: data.createdBy || 'user.system',
      };

      const newExpedition = await expeditionService.create(expeditionData);
      setExpeditions(prev => [...prev, newExpedition]);
      loadStats(); // Recarregar estatísticas após criar expedição
      toast({
        title: 'Sucesso',
        description: 'Expedição criada com sucesso',
      });
      return newExpedition;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar expedição');
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a expedição',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [expeditions, generateExpeditionNumber, toast, loadStats]);

  // Atualizar expedição
  const updateExpedition = useCallback(async (id: string, data: UpdateExpeditionDTO) => {
    try {
      setLoading(true);
      setError(null);
      const updatedExpedition = await expeditionService.update(id, data);
      setExpeditions(prev => prev.map(expedition => 
        expedition.id === id 
          ? { 
              ...expedition, 
              ...updatedExpedition,
            }
          : expedition
      ));
      loadStats(); // Recarregar estatísticas após atualizar expedição
      toast({
        title: 'Sucesso',
        description: 'Expedição atualizada com sucesso',
      });
      return updatedExpedition;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar expedição');
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a expedição',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast, loadStats]);

  // Deletar expedição
  const deleteExpedition = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await expeditionService.delete(id);
      setExpeditions(prev => prev.filter(exp => exp.id !== id));
      loadStats(); // Recarregar estatísticas após deletar expedição
      toast({
        title: 'Sucesso',
        description: 'Expedição excluída com sucesso',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar expedição');
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a expedição',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [expeditions, toast, loadStats]);

  // Atualizar controle de qualidade
  const updateQualityControl = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedExpedition = await expeditionService.updateQualityControl(id, data);
      setExpeditions(prev =>
        prev.map(exp => (exp.id === id ? updatedExpedition : exp))
      );
      loadStats(); // Recarregar estatísticas após atualizar controle de qualidade
      toast({
        title: 'Sucesso',
        description: 'Controle de qualidade atualizado com sucesso',
      });
      return updatedExpedition;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar controle de qualidade');
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o controle de qualidade',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [expeditions, toast, loadStats]);

  // Atualizar rejeição
  const updateRejection = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedExpedition = await expeditionService.updateRejection(id, data);
      setExpeditions(prev =>
        prev.map(exp => (exp.id === id ? updatedExpedition : exp))
      );
      loadStats(); // Recarregar estatísticas após atualizar rejeição
      toast({
        title: 'Sucesso',
        description: 'Rejeição atualizada com sucesso',
      });
      return updatedExpedition;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar rejeição');
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a rejeição',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [expeditions, toast, loadStats]);

  const refetchAllExpeditionData = useCallback(() => {
    loadExpeditions();
    loadStats();
  }, [loadExpeditions, loadStats]);

  return {
    expeditions,
    stats,
    loading,
    error,
    loadExpeditions,
    loadStats,
    createExpedition,
    updateExpedition,
    deleteExpedition,
    updateQualityControl,
    updateRejection,
    refetchAllExpeditionData,
  };
} 