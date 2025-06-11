import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { transportCompanyService } from '@/lib/api';
import { TransportCompany, CreateTransportCompanyDTO, UpdateTransportCompanyDTO } from '@/types/transportCompany';
import { useToast } from '@/hooks/use-toast';

interface CadastroEmpresasProps {
  onBack: () => void;
}

const CadastroEmpresas: React.FC<CadastroEmpresasProps> = ({ onBack }) => {
  const [empresas, setEmpresas] = useState<TransportCompany[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTransportCompanyDTO | UpdateTransportCompanyDTO>({
    name: '',
    document: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const { toast } = useToast();

  const loadEmpresas = async () => {
    try {
      const data = await transportCompanyService.getAll();
      setEmpresas(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as empresas de transporte.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await transportCompanyService.update(editingId, formData as UpdateTransportCompanyDTO);
        toast({
          title: 'Sucesso',
          description: 'Empresa atualizada com sucesso.',
        });
      } else {
        await transportCompanyService.create(formData as CreateTransportCompanyDTO);
        toast({
          title: 'Sucesso',
          description: 'Empresa cadastrada com sucesso.',
        });
      }
      resetForm();
      loadEmpresas();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${editingId ? 'atualizar' : 'cadastrar'} a empresa. Verifique os dados.`, 
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (empresa: TransportCompany) => {
    setFormData({
      name: empresa.name,
      document: empresa.document,
      phone: empresa.phone,
      email: empresa.email,
      address: empresa.address,
      city: empresa.city,
      state: empresa.state,
      zipCode: empresa.zipCode,
    });
    setEditingId(empresa.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await transportCompanyService.delete(id);
      toast({
        title: 'Sucesso',
        description: 'Empresa excluída com sucesso.',
      });
      loadEmpresas();
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a empresa.',
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
      address: '',
      city: '',
      state: '',
      zipCode: '',
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
            <h1 className="text-2xl font-bold">Cadastro de Empresas de Transporte</h1>
          </div>
          <Button onClick={() => {
            resetForm();
            setShowForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Nova'} Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="document">CNPJ</Label>
                    <Input
                      id="document"
                      value={formData.document}
                      onChange={(e) => setFormData({...formData, document: e.target.value})}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      placeholder="00000-000"
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
            <CardTitle>Empresas Cadastradas ({empresas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>CEP</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">{empresa.name}</TableCell>
                    <TableCell>{empresa.document}</TableCell>
                    <TableCell>{empresa.phone}</TableCell>
                    <TableCell>{empresa.email}</TableCell>
                    <TableCell>{empresa.address}</TableCell>
                    <TableCell>{empresa.city}</TableCell>
                    <TableCell>{empresa.state}</TableCell>
                    <TableCell>{empresa.zipCode}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(empresa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(empresa.id)}
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

export default CadastroEmpresas;
