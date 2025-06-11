import React from 'react';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Expedition, ExpeditionStatus } from '@/types/expedition';

interface ExpeditionDetailsProps {
  expeditionId: string;
  onPrintRequest: (expedition: Expedition) => void;
}

export default function ExpeditionDetails({ expeditionId, onPrintRequest }: ExpeditionDetailsProps) {
  const { expeditions } = useExpeditionContext();
  const navigate = useNavigate();

  const expedition = expeditions.find(e => e.id === expeditionId);

  if (!expedition) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p>Expedição não encontrada</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={() => onPrintRequest(expedition)}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Expedição {expedition.expeditionNumber}</CardTitle>
            <Badge className={getStatusColor(expedition.status)}>
              {formatStatus(expedition.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Informações do Transporte</h3>
              <p>Placa: {expedition.truckPlate}</p>
              <p>Motorista: {expedition.driverName}</p>
              <p>Documento: {expedition.driverDocument}</p>
              {expedition.transportCompany && (
                <p>Empresa: {expedition.transportCompany}</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Informações do Fornecedor</h3>
              <p>Nome: {expedition.supplierName}</p>
              <p>CNPJ: {expedition.supplierDocument}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Responsável</h3>
              <p>Nome: {expedition.expeditionResponsible}</p>
              {expedition.responsiblePosition && (
                <p>Cargo/Setor: {expedition.responsiblePosition}</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Data e Hora</h3>
              <p>{new Date(expedition.dateTime).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expedition.products.map((product) => (
              <div key={product.id} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">Código: {product.code}</p>
                  </div>
                  <div>
                    <p>Quantidade: {product.quantity} {product.unit}</p>
                    {product.batch && <p>Lote: {product.batch}</p>}
                    {product.expiryDate && (
                      <p>Validade: {new Date(product.expiryDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    <p>Status: {product.status}</p>
                    {product.observations && (
                      <p className="text-sm text-gray-500">{product.observations}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controle de Qualidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>Responsável: {expedition.qualityControl.responsible}</p>
              <p>Status: {expedition.qualityControl.approvalStatus}</p>
            </div>
            {expedition.qualityControl.justification && (
              <div>
                <p className="font-medium">Justificativa:</p>
                <p>{expedition.qualityControl.justification}</p>
              </div>
            )}
            {expedition.qualityControl.observations && (
              <div>
                <p className="font-medium">Observações:</p>
                <p>{expedition.qualityControl.observations}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {expedition.rejection && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Rejeição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>Motivo: {expedition.rejection.reason}</p>
                <p>Responsável: {expedition.rejection.responsible}</p>
                <p>Enviado para Suprimentos: {expedition.rejection.sentToSupplies ? 'Sim' : 'Não'}</p>
                <p>Carga Retida: {expedition.rejection.cargoRetained ? 'Sim' : 'Não'}</p>
              </div>
              {expedition.rejection.retentionLocation && (
                <div>
                  <p className="font-medium">Local de Retenção:</p>
                  <p>{expedition.rejection.retentionLocation}</p>
                </div>
              )}
              {expedition.rejection.retainedQuantity && (
                <div>
                  <p className="font-medium">Quantidade Retida:</p>
                  <p>{expedition.rejection.retainedQuantity}</p>
                </div>
              )}
              {expedition.rejection.correctiveActions && (
                <div>
                  <p className="font-medium">Ações Corretivas:</p>
                  <p>{expedition.rejection.correctiveActions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
