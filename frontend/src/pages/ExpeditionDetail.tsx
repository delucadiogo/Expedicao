import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { expeditionService } from '@/lib/api';
import { Expedition, Product, QualityControl, Rejection } from '@/types/expedition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExpeditionDetail() {
  const { id } = useParams<{ id: string }>();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExpedition = async () => {
      if (!id) {
        setError('ID da expedição não fornecido.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await expeditionService.getById(id);
        setExpedition(data);
      } catch (err) {
        console.error('Erro ao carregar detalhes da expedição:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes da expedição');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes da expedição.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExpedition();
  }, [id, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500';
      case 'em_analise': return 'bg-blue-500';
      case 'aprovado': return 'bg-green-500';
      case 'rejeitado': return 'bg-red-500';
      case 'retido': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'aprovado': return 'Aprovado';
      case 'rejeitado': return 'Rejeitado';
      case 'retido': return 'Retido';
      default: return status;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando detalhes da expedição...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erro: {error}</div>;
  }

  if (!expedition) {
    return <div className="text-center py-8 text-gray-500">Expedição não encontrada.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detalhes da Expedição: {expedition.expeditionNumber}</h1>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" /> Imprimir
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Número:</strong> {expedition.expeditionNumber}</p>
          <p><strong>Data/Hora:</strong> {new Date(expedition.dateTime).toLocaleString()}</p>
          <div><strong>Status:</strong> <Badge className={getStatusColor(expedition.status)}>{formatStatus(expedition.status)}</Badge></div>
          <p><strong>Criado em:</strong> {new Date(expedition.createdAt).toLocaleString()}</p>
          <p><strong>Criado por:</strong> {expedition.createdBy}</p>
          {expedition.updatedAt && <p><strong>Atualizado em:</strong> {new Date(expedition.updatedAt).toLocaleString()}</p>}
          {expedition.updatedBy && <p><strong>Atualizado por:</strong> {expedition.updatedBy}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações de Transporte</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Placa do Caminhão:</strong> {expedition.truckPlate}</p>
          <p><strong>Nome do Motorista:</strong> {expedition.driverName}</p>
          <p><strong>Documento do Motorista:</strong> {expedition.driverDocument}</p>
          {expedition.transportCompany && <p><strong>Empresa de Transporte:</strong> {expedition.transportCompany}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Nome do Fornecedor:</strong> {expedition.supplierName}</p>
          <p><strong>Documento do Fornecedor:</strong> {expedition.supplierDocument}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsável pela Expedição</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Nome do Responsável:</strong> {expedition.expeditionResponsible}</p>
          {expedition.responsiblePosition && <p><strong>Cargo/Setor:</strong> {expedition.responsiblePosition}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {expedition.products && expedition.products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expedition.products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.batch || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.expiryDate || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(product.status)}>{formatStatus(product.status)}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.observations || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nenhum produto associado a esta expedição.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controle de Qualidade</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Responsável:</strong> {expedition.qualityControl.responsibleName}</p>
          {expedition.qualityControl.analysisDateTime && <p><strong>Data/Hora da Análise:</strong> {new Date(expedition.qualityControl.analysisDateTime).toLocaleString()}</p>}
          <div><strong>Status de Aprovação:</strong> <Badge className={getStatusColor(expedition.qualityControl.approvalStatus)}>{formatStatus(expedition.qualityControl.approvalStatus)}</Badge></div>
          {expedition.qualityControl.justification && <p><strong>Justificativa:</strong> {expedition.qualityControl.justification}</p>}
          {expedition.qualityControl.digitalSignature && <p><strong>Assinatura Digital:</strong> {expedition.qualityControl.digitalSignature}</p>}
          {expedition.qualityControl.observations && <p><strong>Observações:</strong> {expedition.qualityControl.observations}</p>}
        </CardContent>
      </Card>

      {expedition.rejection && (
        <Card>
          <CardHeader>
            <CardTitle>Informações de Rejeição</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Motivo:</strong> {expedition.rejection.reason}</p>
            <p><strong>Enviado para Suprimentos:</strong> {expedition.rejection.sentToSupplies ? 'Sim' : 'Não'}</p>
            {expedition.rejection.suppliesDateTime && <p><strong>Data/Hora Suprimentos:</strong> {new Date(expedition.rejection.suppliesDateTime).toLocaleString()}</p>}
            {expedition.rejection.suppliesResponsible && <p><strong>Responsável Suprimentos:</strong> {expedition.rejection.suppliesResponsible}</p>}
            <p><strong>Carga Retida:</strong> {expedition.rejection.cargoRetained ? 'Sim' : 'Não'}</p>
            {expedition.rejection.retainedQuantity && <p><strong>Quantidade Retida:</strong> {expedition.rejection.retainedQuantity}</p>}
            {expedition.rejection.retentionLocation && <p><strong>Local de Retenção:</strong> {expedition.rejection.retentionLocation}</p>}
            {expedition.rejection.correctiveActions && <p><strong>Ações Corretivas:</strong> {expedition.rejection.correctiveActions}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 