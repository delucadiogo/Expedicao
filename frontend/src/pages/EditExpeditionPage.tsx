import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import ExpeditionForm from '@/components/expedition/ExpeditionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Expedition } from '@/types/expedition';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const EditExpeditionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expeditions, updateExpedition, loading, error, loadExpeditions } = useExpeditionContext();
  const [currentExpedition, setCurrentExpedition] = useState<Expedition | null>(null);
  const [isLoadingExpedition, setIsLoadingExpedition] = useState(true);

  useEffect(() => {
    if (id && expeditions.length === 0) {
      // Se as expedições ainda não foram carregadas, tente carregá-las.
      // Isso é importante caso o usuário acesse a URL de edição diretamente.
      loadExpeditions();
    }
  }, [id, expeditions.length, loadExpeditions]);

  useEffect(() => {
    if (id && expeditions.length > 0) {
      const foundExpedition = expeditions.find(exp => exp.id === id);
      if (foundExpedition) {
        setCurrentExpedition(foundExpedition);
      } else {
        toast({
          title: "Expedição não encontrada",
          description: "A expedição que você tentou editar não existe.",
          variant: "destructive",
        });
        navigate('/?tab=list'); // Redirecionar para a lista de expedições na aba correta
      }
      setIsLoadingExpedition(false);
    } else if (!id) {
      toast({
        title: "Erro",
        description: "ID da expedição não fornecido.",
        variant: "destructive",
      });
      navigate('/?tab=list'); // Redirecionar para a lista de expedições na aba correta
      setIsLoadingExpedition(false);
    }
  }, [id, expeditions, navigate, toast]);

  const handleUpdate = async (data: any) => {
    if (!id) return;

    try {
      await updateExpedition(id, data);
      toast({
        title: "Sucesso",
        description: "Expedição atualizada com sucesso!",
      });
      navigate('/?tab=list'); // Alterado para navegar para a lista de expedições na aba correta
    } catch (err) {
      toast({
        title: "Erro ao atualizar",
        description: error || "Não foi possível atualizar a expedição.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingExpedition || loading) {
    return <div className="text-center py-8">Carregando expedição...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erro: {error}</div>;
  }

  if (!currentExpedition) {
    return <div className="text-center py-8">Expedição não disponível para edição.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Editar Expedição</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/?tab=list')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para a Lista
          </Button>
        </CardHeader>
        <CardContent>
          <ExpeditionForm initialData={currentExpedition} onSubmit={handleUpdate} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditExpeditionPage; 