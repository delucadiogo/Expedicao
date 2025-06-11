import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { driverService } from '@/lib/api';
import { Driver, CreateDriverDTO, UpdateDriverDTO } from '@/types/driver';
import { useToast } from '@/hooks/use-toast';

interface CadastroMotoristasProps {
  onBack: () => void;
}

const CadastroMotoristas: React.FC<CadastroMotoristasProps> = ({ onBack }) => {
  const [motoristas, setMotoristas] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateDriverDTO | UpdateDriverDTO>({
    name: '',
    document: '',
    phone: '',
    email: '',
    cnh: '',
    cnhExpirationDate: ''
  });
  const { toast } = useToast();

  const loadMotoristas = async () => {
    try {
      const data = await driverService.getAll();
      setMotoristas(data);
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os motoristas.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadMotoristas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await driverService.update(editingId, formData as UpdateDriverDTO);
        toast({
          title: 'Sucesso',
          description: 'Motorista atualizado com sucesso.',
        });
      } else {
        await driverService.create(formData as CreateDriverDTO);
        toast({
          title: 'Sucesso',
          description: 'Motorista cadastrado com sucesso.',
        });
      }
      resetForm();
      loadMotoristas();
    } catch (error) {
      console.error('Erro ao salvar motorista:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${editingId ? 'atualizar' : 'cadastrar'} o motorista. Verifique os dados.`, 
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (motorista: Driver) => {
    setFormData({
      name: motorista.name,
      document: motorista.document,
      phone: motorista.phone,
      email: motorista.email,
      cnh: motorista.cnh,
      cnhExpirationDate: motorista.cnhExpirationDate
    });
    setEditingId(motorista.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await driverService.delete(id);
      toast({
        title: 'Sucesso',
        description: 'Motorista excluído com sucesso.',
      });
      loadMotoristas();
    } catch (error) {
      console.error('Erro ao deletar motorista:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o motorista.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      document: '',
      phone: '',
      email: '',
      cnh: '',
      cnhExpirationDate: ''
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
            <h1 className="text-2xl font-bold">Cadastro de Motoristas</h1>
          </div>
          <Button onClick={() => {
            resetForm();
            setShowForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Motorista
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Novo'} Motorista</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="document">CPF</Label>
                    <Input
                      id="document"
                      value={formData.document}
                      onChange={(e) => setFormData({...formData, document: e.target.value})}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnh">CNH</Label>
                    <Input
                      id="cnh"
                      value={formData.cnh}
                      onChange={(e) => setFormData({...formData, cnh: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnhExpirationDate">Validade da CNH</Label>
                    <Input
                      id="cnhExpirationDate"
                      type="date"
                      value={formData.cnhExpirationDate}
                      onChange={(e) => setFormData({...formData, cnhExpirationDate: e.target.value})}
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
            <CardTitle>Motoristas Cadastrados ({motoristas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>CNH</TableHead>
                  <TableHead>Validade CNH</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motoristas.map((motorista) => (
                  <TableRow key={motorista.id}>
                    <TableCell className="font-medium">{motorista.name}</TableCell>
                    <TableCell>{motorista.document}</TableCell>
                    <TableCell>{motorista.phone}</TableCell>
                    <TableCell>{motorista.cnh}</TableCell>
                    <TableCell>
                      {new Date(motorista.cnhExpirationDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(motorista)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(motorista.id)}
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

export default CadastroMotoristas;
