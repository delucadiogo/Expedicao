import { ArrowLeft, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expedition, ExpeditionStatus } from '@/types/expedition';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ExpeditionDetailsProps {
  expedition: Expedition;
  onPrintRequest: (expedition: Expedition) => void;
}

export default function ExpeditionDetails({ expedition, onPrintRequest }: ExpeditionDetailsProps) {
  const navigate = useNavigate();

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
        <Button onClick={() => navigate('/?tab=list')}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Informações Gerais</h3>
              <p>Número: {expedition.expeditionNumber}</p>
              <div>Status: <Badge className={getStatusColor(expedition.status)}>{formatStatus(expedition.status)}</Badge></div>
              <p>Criado por: {expedition.createdBy}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Data e Hora</h3>
              <p>Data/Hora: {new Date(expedition.dateTime).toLocaleString()}</p>
              <p>Criado em: {new Date(expedition.createdAt).toLocaleString()}</p>
              <p>Atualizado em: {new Date(expedition.updatedAt).toLocaleString()}</p>
            </div>

            {expedition.arrivalDateTime && (
              <div>
                <h3 className="font-medium mb-2">Chegada do Caminhão</h3>
                <p>{new Date(expedition.arrivalDateTime).toLocaleString()}</p>
              </div>
            )}

            {expedition.observations && (
              <div className="md:col-span-2">
                <h3 className="font-medium mb-2">Observações da Expedição</h3>
                <p>{expedition.observations}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Transporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>Placa do Caminhão: {expedition.truckPlate}</p>
              <p>Motorista: {expedition.driverName}</p>
              <p>Documento do Motorista: {expedition.driverDocument}</p>
              {expedition.transportCompany && (
                <p>Empresa de Transporte: {expedition.transportCompany}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>Nome do Fornecedor: {expedition.supplierName}</p>
              <p>Documento do Fornecedor: {expedition.supplierDocument}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsável pela Expedição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>Nome do Responsável: {expedition.expeditionResponsible}</p>
              {expedition.responsiblePosition && (
                <p>Cargo/Setor: {expedition.responsiblePosition}</p>
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
                      <p className="text-sm text-gray-500">Observações: {product.observations}</p>
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
              <p>Responsável: {expedition.qualityControl.responsibleName}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Informações de Rejeição</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Campos removidos conforme solicitado */}
        </CardContent>
      </Card>
    </div>
  );
}
