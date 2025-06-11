import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, X } from 'lucide-react';
import { Expedition, ExpeditionStatus } from '@/types/expedition';

interface PrintExpeditionProps {
  data: Expedition;
  onClose: () => void;
}

export default function PrintExpedition({ data, onClose }: PrintExpeditionProps) {
  const handlePrint = () => {
    window.print();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-lg w-full max-w-4xl print:w-full print:max-w-none print:rounded-none">
        <div className="p-4 border-b print:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Imprimir Expedição</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 print:p-0">
          <div className="text-center print:py-8">
            <h1 className="text-2xl font-bold">Relatório de Expedição</h1>
            <p className="text-gray-500">Número: {data.expeditionNumber}</p>
            <p className="text-gray-500">
              Data: {new Date(data.dateTime).toLocaleString()}
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informações da Expedição</CardTitle>
                <Badge className={getStatusColor(data.status)}>
                  {formatStatus(data.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Informações do Transporte</h3>
                  <p>Placa: {data.truckPlate}</p>
                  <p>Motorista: {data.driverName}</p>
                  <p>Documento: {data.driverDocument}</p>
                  {data.transportCompany && (
                    <p>Empresa: {data.transportCompany}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Informações do Fornecedor</h3>
                  <p>Nome: {data.supplierName}</p>
                  <p>CNPJ: {data.supplierDocument}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Responsável</h3>
                  <p>Nome: {data.expeditionResponsible}</p>
                  {data.responsiblePosition && (
                    <p>Cargo/Setor: {data.responsiblePosition}</p>
                  )}
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
                {data.products.map((product) => (
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
                  <p>Responsável: {data.qualityControl.responsible}</p>
                  <p>Status: {data.qualityControl.approvalStatus}</p>
                </div>
                {data.qualityControl.justification && (
                  <div>
                    <p className="font-medium">Justificativa:</p>
                    <p>{data.qualityControl.justification}</p>
                  </div>
                )}
                {data.qualityControl.observations && (
                  <div>
                    <p className="font-medium">Observações:</p>
                    <p>{data.qualityControl.observations}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {data.rejection && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Rejeição</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p>Motivo: {data.rejection.reason}</p>
                    <p>Responsável: {data.rejection.responsible}</p>
                    <p>Enviado para Suprimentos: {data.rejection.sentToSupplies ? 'Sim' : 'Não'}</p>
                    <p>Carga Retida: {data.rejection.cargoRetained ? 'Sim' : 'Não'}</p>
                  </div>
                  {data.rejection.retentionLocation && (
                    <div>
                      <p className="font-medium">Local de Retenção:</p>
                      <p>{data.rejection.retentionLocation}</p>
                    </div>
                  )}
                  {data.rejection.retainedQuantity && (
                    <div>
                      <p className="font-medium">Quantidade Retida:</p>
                      <p>{data.rejection.retainedQuantity}</p>
                    </div>
                  )}
                  {data.rejection.correctiveActions && (
                    <div>
                      <p className="font-medium">Ações Corretivas:</p>
                      <p>{data.rejection.correctiveActions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 print:mt-16">
            <div className="border-t pt-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-medium">Responsável da Expedição</p>
                  <div className="mt-16 border-t pt-2">
                    <p>{data.expeditionResponsible}</p>
                    {data.responsiblePosition && <p>{data.responsiblePosition}</p>}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Responsável da Qualidade</p>
                  <div className="mt-16 border-t pt-2">
                    <p>{data.qualityControl.responsible}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
