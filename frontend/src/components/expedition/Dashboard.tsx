import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ExpeditionStatus } from '@/types/expedition';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';

export default function Dashboard() {
  const { stats, loadStats } = useExpeditionContext();

  const [filterStartDate, setFilterStartDate] = React.useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    handleSearch();
  }, [loadStats]);

  const handleSearch = () => {
    const filters = {
      startDate: filterStartDate ? format(filterStartDate, 'yyyy-MM-dd') : undefined,
      endDate: filterEndDate ? format(filterEndDate, 'yyyy-MM-dd') : undefined,
    };
    loadStats(filters);
  };

  const handleClearFilters = () => {
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    loadStats({}); // Recarrega as estatísticas sem filtros
  };

  const chartData = [
    { name: 'Pendentes', value: stats.pending },
    { name: 'Em Análise', value: stats.inAnalysis },
    { name: 'Aprovados', value: stats.approved },
    { name: 'Rejeitados', value: stats.rejected },
    { name: 'Retidos', value: stats.retained },
  ];

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{String(stats.inAnalysis)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.retained}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 p-4 border rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-end space-x-2 mt-auto">
          <Button onClick={handleSearch}>
            <List className="h-4 w-4 mr-2" /> Buscar
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status das Expedições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
