
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

interface Motorista {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  email: string;
  cnh: string;
  validadeCnh: string;
}

interface CadastroMotoristasProps {
  onBack: () => void;
}

const CadastroMotoristas: React.FC<CadastroMotoristasProps> = ({ onBack }) => {
  const [motoristas, setMotoristas] = useState<Motorista[]>([
    {
      id: '1',
      nome: 'João Silva',
      documento: '123.456.789-10',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com',
      cnh: '12345678901',
      validadeCnh: '2025-12-31'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    documento: '',
    telefone: '',
    email: '',
    cnh: '',
    validadeCnh: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setMotoristas(prev => prev.map(m => 
        m.id === editingId ? { ...formData, id: editingId } : m
      ));
    } else {
      const newMotorista: Motorista = {
        ...formData,
        id: Date.now().toString()
      };
      setMotoristas(prev => [...prev, newMotorista]);
    }
    
    resetForm();
  };

  const handleEdit = (motorista: Motorista) => {
    setFormData({
      nome: motorista.nome,
      documento: motorista.documento,
      telefone: motorista.telefone,
      email: motorista.email,
      cnh: motorista.cnh,
      validadeCnh: motorista.validadeCnh
    });
    setEditingId(motorista.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setMotoristas(prev => prev.filter(m => m.id !== id));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      documento: '',
      telefone: '',
      email: '',
      cnh: '',
      validadeCnh: ''
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
          <Button onClick={() => setShowForm(true)}>
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
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="documento">CPF</Label>
                    <Input
                      id="documento"
                      value={formData.documento}
                      onChange={(e) => setFormData({...formData, documento: e.target.value})}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
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
                    <Label htmlFor="validadeCnh">Validade da CNH</Label>
                    <Input
                      id="validadeCnh"
                      type="date"
                      value={formData.validadeCnh}
                      onChange={(e) => setFormData({...formData, validadeCnh: e.target.value})}
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
                    <TableCell className="font-medium">{motorista.nome}</TableCell>
                    <TableCell>{motorista.documento}</TableCell>
                    <TableCell>{motorista.telefone}</TableCell>
                    <TableCell>{motorista.cnh}</TableCell>
                    <TableCell>
                      {new Date(motorista.validadeCnh).toLocaleDateString('pt-BR')}
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
