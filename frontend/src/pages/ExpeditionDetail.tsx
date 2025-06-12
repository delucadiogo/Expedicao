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
    <>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <h1 className="text-3xl font-bold">Detalhes da Expedição: {expedition.expeditionNumber}</h1>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Imprimir
          </Button>
        </div>

        {/* Conteúdo do relatório para impressão */}
        <div className="print:p-0 print:space-y-1">
          <div className="text-center print:py-2">
            <h1 className="text-2xl font-bold print:text-base print:mb-0.5">Relatório de Expedição</h1>
            <p className="text-gray-500 print:text-xs print:leading-tight">Número: {expedition.expeditionNumber}</p>
            <p className="text-gray-500 print:text-xs print:leading-tight">
              Data: {new Date(expedition.dateTime).toLocaleString()}
            </p>
          </div>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <div className="flex items-center justify-between">
                <CardTitle className="print:text-sm print:mb-0">Informações Gerais</CardTitle>
                <Badge className={getStatusColor(expedition.status) + " print:text-xs print:px-1 print:py-0.5"}>
                  {formatStatus(expedition.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                <p className="print:text-xs print:leading-tight"><strong>Número:</strong> {expedition.expeditionNumber}</p>
                <p className="print:text-xs print:leading-tight"><strong>Data/Hora:</strong> {new Date(expedition.dateTime).toLocaleString()}</p>
                <div className="print:text-xs print:leading-tight"><strong>Status:</strong> <Badge className={getStatusColor(expedition.status)}>{formatStatus(expedition.status)}</Badge></div>
                <p className="print:text-xs print:leading-tight"><strong>Criado em:</strong> {new Date(expedition.createdAt).toLocaleString()}</p>
                <p className="print:text-xs print:leading-tight"><strong>Criado por:</strong> {expedition.createdBy}</p>
                {expedition.updatedAt && <p className="print:text-xs print:leading-tight"><strong>Atualizado em:</strong> {new Date(expedition.updatedAt).toLocaleString()}</p>}
                {expedition.updatedBy && <p className="print:text-xs print:leading-tight"><strong>Atualizado por:</strong> {expedition.updatedBy}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <CardTitle className="print:text-sm print:mb-0">Informações de Transporte</CardTitle>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                <p className="print:text-xs print:leading-tight"><strong>Placa do Caminhão:</strong> {expedition.truckPlate}</p>
                <p className="print:text-xs print:leading-tight"><strong>Nome do Motorista:</strong> {expedition.driverName}</p>
                <p className="print:text-xs print:leading-tight"><strong>Documento do Motorista:</strong> {expedition.driverDocument}</p>
                {expedition.transportCompany && <p className="print:text-xs print:leading-tight"><strong>Empresa de Transporte:</strong> {expedition.transportCompany}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <CardTitle className="print:text-sm print:mb-0">Informações do Fornecedor</CardTitle>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                <p className="print:text-xs print:leading-tight"><strong>Nome do Fornecedor:</strong> {expedition.supplierName}</p>
                <p className="print:text-xs print:leading-tight"><strong>Documento do Fornecedor:</strong> {expedition.supplierDocument}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <CardTitle className="print:text-sm print:mb-0">Responsável pela Expedição</CardTitle>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                <p className="print:text-xs print:leading-tight"><strong>Nome do Responsável:</strong> {expedition.expeditionResponsible}</p>
                {expedition.responsiblePosition && <p className="print:text-xs print:leading-tight"><strong>Cargo/Setor:</strong> {expedition.responsiblePosition}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <CardTitle className="print:text-sm print:mb-0">Produtos</CardTitle>
            </CardHeader>
            <CardContent className="print:p-1">
              {expedition.products && expedition.products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 print:text-xs">
                    <thead>
                      <tr>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Nome</th>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Código</th>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Quantidade</th>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Unidade</th>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Lote</th>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Validade</th>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Observações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expedition.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.name}</td>
                          <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.code}</td>
                          <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.quantity}</td>
                          <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.unit}</td>
                          <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.batch || '-'}</td>
                          <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.expiryDate || '-'}</td>
                          <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">
                            <Badge className={getStatusColor(product.status)}>{formatStatus(product.status)}</Badge>
                          </td>
                          <td className="px-1 py-0.5 print:leading-tight">{product.observations || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="print:text-xs print:leading-tight">Nenhum produto associado a esta expedição.</p>
              )}
            </CardContent>
          </Card>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <CardTitle className="print:text-sm print:mb-0">Controle de Qualidade</CardTitle>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                <p className="print:text-xs print:leading-tight"><strong>Responsável:</strong> {expedition.qualityControl.responsibleName}</p>
                {expedition.qualityControl.analysisDateTime && <p className="print:text-xs print:leading-tight"><strong>Data/Hora da Análise:</strong> {new Date(expedition.qualityControl.analysisDateTime).toLocaleString()}</p>}
                <div className="print:text-xs print:leading-tight"><strong>Status de Aprovação:</strong> <Badge className={getStatusColor(expedition.qualityControl.approvalStatus)}>{formatStatus(expedition.qualityControl.approvalStatus)}</Badge></div>
                {expedition.qualityControl.justification && <p className="print:text-xs print:leading-tight"><strong>Justificativa:</strong> {expedition.qualityControl.justification}</p>}
                {expedition.qualityControl.digitalSignature && <p className="print:text-xs print:leading-tight"><strong>Assinatura Digital:</strong> {expedition.qualityControl.digitalSignature}</p>}
                {expedition.qualityControl.observations && <p className="print:text-xs print:leading-tight"><strong>Observações:</strong> {expedition.qualityControl.observations}</p>}
              </div>
            </CardContent>
          </Card>

          {expedition.rejection && (
            <Card className="print:mb-1">
              <CardHeader className="print:py-1 print:px-1">
                <CardTitle className="print:text-sm print:mb-0">Informações de Rejeição</CardTitle>
              </CardHeader>
              <CardContent className="print:p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                  <p className="print:text-xs print:leading-tight"><strong>Motivo:</strong> {expedition.rejection.reason}</p>
                  <p className="print:text-xs print:leading-tight"><strong>Enviado para Suprimentos:</strong> {expedition.rejection.sentToSupplies ? 'Sim' : 'Não'}</p>
                  {expedition.rejection.suppliesDateTime && <p className="print:text-xs print:leading-tight"><strong>Data/Hora Suprimentos:</strong> {new Date(expedition.rejection.suppliesDateTime).toLocaleString()}</p>}
                  {expedition.rejection.suppliesResponsible && <p className="print:text-xs print:leading-tight"><strong>Responsável Suprimentos:</strong> {expedition.rejection.suppliesResponsible}</p>}
                  <p className="print:text-xs print:leading-tight"><strong>Carga Retida:</strong> {expedition.rejection.cargoRetained ? 'Sim' : 'Não'}</p>
                  {expedition.rejection.retainedQuantity && <p className="print:text-xs print:leading-tight"><strong>Quantidade Retida:</strong> {expedition.rejection.retainedQuantity}</p>}
                  {expedition.rejection.retentionLocation && <p className="print:text-xs print:leading-tight"><strong>Local de Retenção:</strong> {expedition.rejection.retentionLocation}</p>}
                  {expedition.rejection.correctiveActions && <p className="print:text-xs print:leading-tight"><strong>Ações Corretivas:</strong> {expedition.rejection.correctiveActions}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seções de Assinatura */}
          <div className="mt-8 print:mt-1 print:mb-0">
            <div className="border-t pt-8 print:pt-1">
              <div className="grid grid-cols-2 gap-8 print:gap-x-1 print:gap-y-0.5">
                <div>
                  <p className="font-medium print:text-xs print:leading-tight">Responsável da Expedição</p>
                  <div className="border-t pt-2 print:mt-1 print:pt-0.5">
                    <p className="print:text-xs print:leading-tight">{expedition.expeditionResponsible}</p>
                    {expedition.responsiblePosition && <p className="print:text-xs print:leading-tight">{expedition.responsiblePosition}</p>}
                  </div>
                </div>
                <div>
                  <p className="font-medium print:text-xs print:leading-tight">Responsável da Qualidade</p>
                  <div className="border-t pt-2 print:mt-1 print:pt-0.5">
                    <p className="print:text-xs print:leading-tight">{expedition.qualityControl.responsibleName}</p>
                    {expedition.qualityControl.digitalSignature && <p className="print:text-xs print:leading-tight">Assinatura: {expedition.qualityControl.digitalSignature}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media print {
          * { box-sizing: border-box !important; }
          html, body { margin: 0 !important; padding: 0 !important; height: auto !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:py-0\\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
          .print\\:mt-16 { margin-top: 4rem !important; }
          .print\\:text-base { font-size: 1rem !important; }
          .print\\:text-sm { font-size: 0.875rem !important; }
          .print\\:text-xs { font-size: 0.75rem !important; }
          .print\\:text-\[0\\.65rem\] { font-size: 0.65rem !important; }
          .print\\:space-y-0 > :not([hidden]) ~ :not([hidden]) { margin-top: 0 !important; }
          .print\\:gap-x-1 { column-gap: 0.25rem !important; }
          .print\\:gap-y-0 { row-gap: 0 !important; }
          .print\\:mb-0\\.5 { margin-bottom: 0.125rem !important; }
          .print\\:px-0\\.5 { padding-left: 0.125rem !important; padding-right: 0.125rem !important; }
          .print\\:py-0\\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:mb-0 { margin-bottom: 0 !important; }
          .print\\:mt-0 { margin-top: 0 !important; }
          .print\\:pt-0 { padding-top: 0 !important; }
          .print\\:leading-tight { line-height: 1.2 !important; } /* Ajuste o line-height */

          .fixed.inset-0 {
            position: static !important;
            transform: none !important;
            width: 100% !important;
            height: auto !important;
            background: none !important;
            display: block !important;
            overflow: visible !important;
          }

          .bg-white.rounded-lg.w-full.max-w-4xl {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            padding: 0; /* Ajustar conforme necessário para o conteúdo dentro da estrutura do Card */
          }

          /* General A4 adjustments */
          @page {
            size: A4;
            margin: 1cm; /* Margens A4 reintroduzidas */
          }

          h1, h2, h3, h4, h5, h6 { page-break-after: avoid; margin: 0; padding: 0; }
          p { page-break-inside: avoid; margin: 0; padding: 0; orphans: 3; widows: 3;}
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; /* page-break-after: auto; */ }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }

          /* Specific adjustments for cards/sections */
          .Card {
            page-break-inside: avoid; /* Reaplicado */
            margin-bottom: 0.5rem; /* Espaço entre cards reintroduzido */
            flex-shrink: 0 !important;
          }

          /* Force new page for products if list is long */
          .CardTitle:has(+ .CardContent .space-y-4) {
            page-break-before: auto;
          }
        }
      `}</style>
    </>
  );
} 