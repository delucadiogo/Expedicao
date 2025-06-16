import React, { useState } from 'react';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, Printer, Trash2, Pencil, List } from 'lucide-react';
import { Expedition, ExpeditionStatus } from '@/types/expedition';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ExpeditionListProps {
  onPrintRequest: (expedition: Expedition) => void;
}

export default function ExpeditionList({ onPrintRequest }: ExpeditionListProps) {
  const { expeditions, deleteExpedition, loadExpeditions, loading } = useExpeditionContext();
  const [expeditionToDelete, setExpeditionToDelete] = useState<Expedition | null>(null);
  const navigate = useNavigate();

  // Filter states
  const [filterExpeditionNumber, setFilterExpeditionNumber] = useState<string>('');
  const [filterTruckPlate, setFilterTruckPlate] = useState<string>('');
  const [filterDriverName, setFilterDriverName] = useState<string>('');
  const [filterSupplierName, setFilterSupplierName] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<ExpeditionStatus | '' | 'all'>('all');
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);

  React.useEffect(() => {
    // Carregar todas as expedições na montagem inicial
    // loadExpeditions(); // Não chamar aqui, pois handleSearch chamará na primeira vez
  }, []);

  // Carrega as expedições na primeira renderização ou quando os filtros mudam
  React.useEffect(() => {
    handleSearch();
  }, [loadExpeditions]); // Depende apenas de loadExpeditions para ser chamado uma vez

  const handleSearch = () => {
    const filters = {
      expeditionNumber: filterExpeditionNumber || undefined,
      truckPlate: filterTruckPlate || undefined,
      driverName: filterDriverName || undefined,
      supplierName: filterSupplierName || undefined,
      status: filterStatus === 'all' ? undefined : filterStatus,
      startDate: filterStartDate ? format(filterStartDate, 'yyyy-MM-dd') : undefined,
      endDate: filterEndDate ? format(filterEndDate, 'yyyy-MM-dd') : undefined,
    };
    loadExpeditions(filters);
  };

  const handleClearFilters = () => {
    setFilterExpeditionNumber('');
    setFilterTruckPlate('');
    setFilterDriverName('');
    setFilterSupplierName('');
    setFilterStatus('all');
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    // Chame a busca com filtros vazios para recarregar todas as expedições
    loadExpeditions({});
  };

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
        <div className="mb-6 p-4 border rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="expeditionNumber" className="block text-sm font-medium text-gray-700">Número da Expedição</label>
            <Input
              id="expeditionNumber"
              placeholder="Ex: EXP-20231225-0001"
              value={filterExpeditionNumber}
              onChange={(e) => setFilterExpeditionNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="truckPlate" className="block text-sm font-medium text-gray-700">Placa do Caminhão</label>
            <Input
              id="truckPlate"
              placeholder="Ex: ABC-1234"
              value={filterTruckPlate}
              onChange={(e) => setFilterTruckPlate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">Nome do Motorista</label>
            <Input
              id="driverName"
              placeholder="Ex: João Silva"
              value={filterDriverName}
              onChange={(e) => setFilterDriverName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">Nome do Fornecedor</label>
            <Input
              id="supplierName"
              placeholder="Ex: Empresa XYZ"
              value={filterSupplierName}
              onChange={(e) => setFilterSupplierName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select value={filterStatus} onValueChange={(value: ExpeditionStatus | '' | 'all') => setFilterStatus(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="retido">Retido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filterStartDate && "text-muted-foreground"
                  )}
                >
                  {filterStartDate ? format(filterStartDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterStartDate}
                  onSelect={setFilterStartDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filterEndDate && "text-muted-foreground"
                  )}
                >
                  {filterEndDate ? format(filterEndDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterEndDate}
                  onSelect={setFilterEndDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end space-x-2 mt-4">
            <Button onClick={handleSearch}>
              <List className="h-4 w-4 mr-2" /> Buscar
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Carregando expedições...</p>
        ) : expeditions.length === 0 ? (
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
                          onClick={() => navigate(`/expeditions/${expedition.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/expeditions/edit/${expedition.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
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
      </CardContent>

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
    </Card>
  );
}
