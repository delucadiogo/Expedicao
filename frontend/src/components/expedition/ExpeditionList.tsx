import React, { useState } from 'react';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, Printer, Trash2 } from 'lucide-react';
import { Expedition, ExpeditionStatus } from '@/types/expedition';

interface ExpeditionListProps {
  onPrintRequest: (expedition: Expedition) => void;
}

export default function ExpeditionList({ onPrintRequest }: ExpeditionListProps) {
  const { expeditions, deleteExpedition } = useExpeditionContext();
  const [expeditionToDelete, setExpeditionToDelete] = useState<Expedition | null>(null);

  const handleDelete = async () => {
    if (expeditionToDelete) {
      try {
        await deleteExpedition(expeditionToDelete.id);
        setExpeditionToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir expedição:', error);
      }
    }
  };

  const getStatusColor = (status: ExpeditionStatus) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-500';
      case 'em_analise':
        return 'bg-blue-500';
      case 'aprovado':
        return 'bg-green-500';
      case 'rejeitado':
        return 'bg-red-500';
      case 'retido':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatus = (status: ExpeditionStatus) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_analise':
        return 'Em Análise';
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'retido':
        return 'Retido';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expedições</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expeditions.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma expedição encontrada</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Número</th>
                    <th className="text-left py-2">Data/Hora</th>
                    <th className="text-left py-2">Fornecedor</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Responsável</th>
                    <th className="text-right py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {expeditions.map((expedition) => (
                    <tr key={expedition.id} className="border-b">
                      <td className="py-2">{expedition.expeditionNumber}</td>
                      <td className="py-2">
                        {new Date(expedition.dateTime).toLocaleString()}
                      </td>
                      <td className="py-2">{expedition.supplierName}</td>
                      <td className="py-2">
                        <Badge className={getStatusColor(expedition.status)}>
                          {formatStatus(expedition.status)}
                        </Badge>
                      </td>
                      <td className="py-2">{expedition.expeditionResponsible}</td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPrintRequest(expedition)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/expeditions/${expedition.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpeditionToDelete(expedition)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AlertDialog open={!!expeditionToDelete} onOpenChange={() => setExpeditionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta expedição? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
