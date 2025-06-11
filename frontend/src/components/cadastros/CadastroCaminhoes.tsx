import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { truckService } from '@/lib/api';
import { Truck, CreateTruckDTO, UpdateTruckDTO } from '@/types/truck';
import { useToast } from '@/hooks/use-toast';

interface CadastroCaminhoesProps {
  onBack: () => void;
}

const CadastroCaminhoes: React.FC<CadastroCaminhoesProps> = ({ onBack }) => {
  const [caminhoes, setCaminhoes] = useState<Truck[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTruckDTO | UpdateTruckDTO>({
    plate: '',
    model: '',
    brand: '',
    year: 0,
    axles: 0,
    capacity: 0,
  });
  const { toast } = useToast();

  const loadCaminhoes = async () => {
    try {
      const data = await truckService.getAll();
      setCaminhoes(data);
    } catch (error) {
      console.error('Erro ao carregar caminhões:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os caminhões.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadCaminhoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await truckService.update(editingId, { ...formData, year: Number(formData.year), axles: Number(formData.axles), capacity: Number(formData.capacity) } as UpdateTruckDTO);
        toast({
          title: 'Sucesso',
          description: 'Caminhão atualizado com sucesso.',
        });
      } else {
        await truckService.create({ ...formData, year: Number(formData.year), axles: Number(formData.axles), capacity: Number(formData.capacity) } as CreateTruckDTO);
        toast({
          title: 'Sucesso',
          description: 'Caminhão cadastrado com sucesso.',
        });
      }
      resetForm();
      loadCaminhoes();
    } catch (error) {
      console.error('Erro ao salvar caminhão:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${editingId ? 'atualizar' : 'cadastrar'} o caminhão. Verifique os dados.`, 
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (caminhao: Truck) => {
    setFormData({
      plate: caminhao.plate,
      model: caminhao.model,
      brand: caminhao.brand,
      year: caminhao.year,
      axles: caminhao.axles,
      capacity: caminhao.capacity,
    });
    setEditingId(caminhao.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await truckService.delete(id);
      toast({
        title: 'Sucesso',
        description: 'Caminhão excluído com sucesso.',
      });
      loadCaminhoes();
    } catch (error) {
      console.error('Erro ao deletar caminhão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o caminhão.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      plate: '',
      model: '',
      brand: '',
      year: 0,
      axles: 0,
      capacity: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Cadastro de Caminhões</h1>
          </div>
          <Button onClick={() => {
            resetForm();
            setShowForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Caminhão
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Novo'} Caminhão</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plate">Placa</Label>
                    <Input
                      id="plate"
                      value={formData.plate}
                      onChange={(e) => setFormData({...formData, plate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Ano</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="axles">Eixos</Label>
                    <Input
                      id="axles"
                      type="number"
                      value={formData.axles}
                      onChange={(e) => setFormData({...formData, axles: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidade (kg)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingId ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Caminhões Cadastrados ({caminhoes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Eixos</TableHead>
                  <TableHead>Capacidade (kg)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caminhoes.map((caminhao) => (
                  <TableRow key={caminhao.id}>
                    <TableCell className="font-medium">{caminhao.plate}</TableCell>
                    <TableCell>{caminhao.model}</TableCell>
                    <TableCell>{caminhao.brand}</TableCell>
                    <TableCell>{caminhao.year}</TableCell>
                    <TableCell>{caminhao.axles}</TableCell>
                    <TableCell>{caminhao.capacity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(caminhao)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(caminhao.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroCaminhoes;
