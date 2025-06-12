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

        <div className="p-6 space-y-6 print:p-0 print:space-y-1">
          <div className="text-center print:py-2">
            <h1 className="text-2xl font-bold print:text-base print:mb-0.5">Relatório de Expedição</h1>
            <p className="text-gray-500 print:text-xs print:leading-tight">Número: {data.expeditionNumber}</p>
            <p className="text-gray-500 print:text-xs print:leading-tight">
              Data: {new Date(data.dateTime).toLocaleString()}
            </p>
          </div>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <div className="flex items-center justify-between">
                <CardTitle className="print:text-sm print:mb-0">Informações da Expedição</CardTitle>
                <Badge className={getStatusColor(data.status) + " print:text-xs print:px-1 print:py-0.5"}>
                  {formatStatus(data.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                <div>
                  <h3 className="font-medium mb-2 print:text-xs print:mb-0.5">Informações do Transporte</h3>
                  <p className="print:text-xs print:leading-tight">Placa: {data.truckPlate}</p>
                  <p className="print:text-xs print:leading-tight">Motorista: {data.driverName}</p>
                  <p className="print:text-xs print:leading-tight">Documento: {data.driverDocument}</p>
                  {data.transportCompany && (
                    <p className="print:text-xs print:leading-tight">Empresa: {data.transportCompany}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2 print:text-xs print:mb-0.5">Informações do Fornecedor</h3>
                  <p className="print:text-xs print:leading-tight">Nome: {data.supplierName}</p>
                  <p className="print:text-xs print:leading-tight">CNPJ: {data.supplierDocument}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 print:text-xs print:mb-0.5">Responsável</h3>
                  <p className="print:text-xs print:leading-tight">Nome: {data.expeditionResponsible}</p>
                  {data.responsiblePosition && (
                    <p className="print:text-xs print:leading-tight">Cargo/Setor: {data.responsiblePosition}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <CardTitle className="print:text-sm print:mb-0">Produtos</CardTitle>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="space-y-4 print:space-y-0.5">
                <table className="min-w-full divide-y divide-gray-200 print:text-xs">
                  <thead>
                    <tr>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Nome</th>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Código</th>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Qtd.</th>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Lote</th>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Val.</th>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-1 py-0.5 text-left font-medium text-gray-700 uppercase tracking-wider">Obs.</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.name}</td>
                        <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.code}</td>
                        <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.quantity} {product.unit}</td>
                        <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.batch || '-'}</td>
                        <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '-'}</td>
                        <td className="px-1 py-0.5 whitespace-nowrap print:leading-tight">{product.status}</td>
                        <td className="px-1 py-0.5 print:leading-tight">{product.observations || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="print:mb-1">
            <CardHeader className="print:py-1 print:px-1">
              <CardTitle className="print:text-sm print:mb-0">Controle de Qualidade</CardTitle>
            </CardHeader>
            <CardContent className="print:p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                <div>
                  <p className="print:text-xs print:leading-tight">Responsável: {data.qualityControl.responsibleName}</p>
                  <p className="print:text-xs print:leading-tight">Status: {formatStatus(data.qualityControl.approvalStatus)}</p>
                </div>
                {data.qualityControl.justification && (
                  <div>
                    <p className="font-medium print:text-xs print:mb-0.5 print:leading-tight">Justificativa:</p>
                    <p className="print:text-xs print:leading-tight">{data.qualityControl.justification}</p>
                  </div>
                )}
                {data.qualityControl.observations && (
                  <div>
                    <p className="font-medium print:text-xs print:mb-0.5 print:leading-tight">Observações:</p>
                    <p className="print:text-xs print:leading-tight">{data.qualityControl.observations}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {data.rejection && (
            <Card className="print:mb-1">
              <CardHeader className="print:py-1 print:px-1">
                <CardTitle className="print:text-sm print:mb-0">Detalhes da Rejeição</CardTitle>
              </CardHeader>
              <CardContent className="print:p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-x-1 print:gap-y-0.5">
                  <div>
                    <p className="print:text-xs print:leading-tight">Motivo: {data.rejection.reason}</p>
                    <p className="print:text-xs print:leading-tight">Responsável: {data.rejection.responsible}</p>
                    <p className="print:text-xs print:leading-tight">Enviado para Suprimentos: {data.rejection.sentToSupplies ? 'Sim' : 'Não'}</p>
                    <p className="print:text-xs print:leading-tight">Carga Retida: {data.rejection.cargoRetained ? 'Sim' : 'Não'}</p>
                  </div>
                  {data.rejection.retentionLocation && (
                    <div>
                      <p className="font-medium print:text-xs print:mb-0.5 print:leading-tight">Local de Retenção:</p>
                      <p className="print:text-xs print:leading-tight">{data.rejection.retentionLocation}</p>
                    </div>
                  )}
                  {data.rejection.retainedQuantity && (
                    <div>
                      <p className="font-medium print:text-xs print:mb-0.5 print:leading-tight">Quantidade Retida:</p>
                      <p className="print:text-xs print:leading-tight">{data.rejection.retainedQuantity}</p>
                    </div>
                  )}
                  {data.rejection.correctiveActions && (
                    <div>
                      <p className="font-medium print:text-xs print:mb-0.5 print:leading-tight">Ações Corretivas:</p>
                      <p className="print:text-xs print:leading-tight">{data.rejection.correctiveActions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 print:mt-1 print:mb-0">
            <div className="border-t pt-8 print:pt-1">
              <div className="grid grid-cols-2 gap-8 print:gap-x-1 print:gap-y-0.5">
                <div>
                  <p className="font-medium print:text-xs print:leading-tight">Responsável da Expedição</p>
                  <div className="border-t pt-2 print:mt-1 print:pt-0.5">
                    <p className="print:text-xs print:leading-tight">{data.expeditionResponsible}</p>
                    {data.responsiblePosition && <p className="print:text-xs print:leading-tight">{data.responsiblePosition}</p>}
                  </div>
                </div>
                <div>
                  <p className="font-medium print:text-xs print:leading-tight">Responsável da Qualidade</p>
                  <div className="border-t pt-2 print:mt-1 print:pt-0.5">
                    <p className="print:text-xs print:leading-tight">{data.qualityControl.responsibleName}</p>
                    {data.qualityControl.digitalSignature && <p className="print:text-xs print:leading-tight">Assinatura: {data.qualityControl.digitalSignature}</p>}
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
          .print\:hidden { display: none !important; }
          .print\:p-0 { padding: 0 !important; }
          .print\:bg-white { background-color: white !important; }
          .print\:w-full { width: 100% !important; }
          .print\:max-w-none { max-width: none !important; }
          .print\:py-0\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
          .print\:mt-16 { margin-top: 4rem !important; }
          .print\:text-base { font-size: 1rem !important; }
          .print\:text-sm { font-size: 0.875rem !important; }
          .print\:text-xs { font-size: 0.75rem !important; }
          .print\:text-\[0\.65rem\] { font-size: 0.65rem !important; }
          .print\:space-y-0 > :not([hidden]) ~ :not([hidden]) { margin-top: 0 !important; }
          .print\:gap-x-1 { column-gap: 0.25rem !important; }
          .print\:gap-y-0 { row-gap: 0 !important; }
          .print\:mb-0.5 { margin-bottom: 0.125rem !important; }
          .print\:px-0\.5 { padding-left: 0.125rem !important; padding-right: 0.125rem !important; }
          .print\:py-0\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
          .print\:p-0 { padding: 0 !important; }
          .print\:mb-0 { margin-bottom: 0 !important; }
          .print\:mt-0 { margin-top: 0 !important; }
          .print\:pt-0 { padding-top: 0 !important; }
          .print\:leading-tight { line-height: 1.2 !important; }

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
            padding: 0;
          }

          /* General A4 adjustments */
          @page {
            size: A4;
            margin: 1cm;
          }

          h1, h2, h3, h4, h5, h6 { page-break-after: avoid; margin: 0; padding: 0; }
          p { page-break-inside: avoid; margin: 0; padding: 0; orphans: 3; widows: 3;}
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; /* page-break-after: auto; */ }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }

          /* Specific adjustments for cards/sections */
          .Card {
            page-break-inside: avoid;
            margin-bottom: 0.5rem;
            flex-shrink: 0 !important;
          }

          /* Force new page for products if list is long */
          .CardTitle:has(+ .CardContent .space-y-4) {
            page-break-before: auto;
          }
        }
      `}</style>
    </div>
  );
}
