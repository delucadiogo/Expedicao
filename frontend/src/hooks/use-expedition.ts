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
  const loadExpeditions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expeditionService.getAll();
      setExpeditions(data);
      updateStats(data);
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
      setStats(data);
      updateStats(expeditions);
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
  }, [toast, expeditions]);

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
      updateStats([...expeditions, newExpedition]);
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
  }, [expeditions, generateExpeditionNumber, toast]);

  // Atualizar expedição
  const updateExpedition = useCallback(async (id: string, data: UpdateExpeditionDTO) => {
    try {
      setLoading(true);
      setError(null);
      setExpeditions(prev => prev.map(expedition => 
        expedition.id === id 
          ? { 
              ...expedition, 
              ...data,
              status: data.status || expedition.status,
              updatedAt: new Date().toISOString(),
              updatedBy: 'user.system',
            }
          : expedition
      ));
      updateStats(expeditions.map(expedition => 
        expedition.id === id 
          ? { 
              ...expedition, 
              ...data,
              status: data.status || expedition.status,
            }
          : expedition
      ));
      toast({
        title: 'Sucesso',
        description: 'Expedição atualizada com sucesso',
      });
      return data;
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
  }, [expeditions]);

  // Deletar expedição
  const deleteExpedition = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await expeditionService.delete(id);
      setExpeditions(prev => prev.filter(exp => exp.id !== id));
      updateStats(expeditions.filter(exp => exp.id !== id));
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
  }, [expeditions]);

  // Atualizar controle de qualidade
  const updateQualityControl = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedExpedition = await expeditionService.updateQualityControl(id, data);
      setExpeditions(prev =>
        prev.map(exp => (exp.id === id ? updatedExpedition : exp))
      );
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
  }, [toast]);

  // Atualizar rejeição
  const updateRejection = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedExpedition = await expeditionService.updateRejection(id, data);
      setExpeditions(prev =>
        prev.map(exp => (exp.id === id ? updatedExpedition : exp))
      );
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
  }, [toast]);

  const updateStats = useCallback((expeditions: Expedition[]) => {
    const newStats: ExpeditionStats = {
      total: expeditions.length,
      pending: expeditions.filter(e => e.status === 'pendente').length,
      inAnalysis: expeditions.filter(e => e.status === 'em_analise').length,
      approved: expeditions.filter(e => e.status === 'aprovado').length,
      rejected: expeditions.filter(e => e.status === 'rejeitado').length,
      retained: expeditions.filter(e => e.status === 'retido').length,
    };
    setStats(newStats);
    localStorage.setItem('expeditions', JSON.stringify(expeditions));
  }, []);

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
  };
} 