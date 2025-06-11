
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

interface Caminhao {
  id: string;
  placa: string;
  modelo: string;
  ano: string;
  renavam: string;
  capacidade: string;
}

interface CadastroCaminhoesProps {
  onBack: () => void;
}

const CadastroCaminhoes: React.FC<CadastroCaminhoesProps> = ({ onBack }) => {
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([
    {
      id: '1',
      placa: 'ABC-1234',
      modelo: 'Mercedes-Benz Actros',
      ano: '2020',
      renavam: '12345678901',
      capacidade: '25 toneladas'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    ano: '',
    renavam: '',
    capacidade: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setCaminhoes(prev => prev.map(c => 
        c.id === editingId ? { ...formData, id: editingId } : c
      ));
    } else {
      const newCaminhao: Caminhao = {
        ...formData,
        id: Date.now().toString()
      };
      setCaminhoes(prev => [...prev, newCaminhao]);
    }
    
    resetForm();
  };

  const handleEdit = (caminhao: Caminhao) => {
    setFormData({
      placa: caminhao.placa,
      modelo: caminhao.modelo,
      ano: caminhao.ano,
      renavam: caminhao.renavam,
      capacidade: caminhao.capacidade
    });
    setEditingId(caminhao.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCaminhoes(prev => prev.filter(c => c.id !== id));
  };

  const resetForm = () => {
    setFormData({
      placa: '',
      modelo: '',
      ano: '',
      renavam: '',
      capacidade: ''
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
          <Button onClick={() => setShowForm(true)}>
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
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      value={formData.placa}
                      onChange={(e) => setFormData({...formData, placa: e.target.value})}
                      placeholder="ABC-1234"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      value={formData.ano}
                      onChange={(e) => setFormData({...formData, ano: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="renavam">RENAVAM</Label>
                    <Input
                      id="renavam"
                      value={formData.renavam}
                      onChange={(e) => setFormData({...formData, renavam: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="capacidade">Capacidade</Label>
                    <Input
                      id="capacidade"
                      value={formData.capacidade}
                      onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                      placeholder="ex: 25 toneladas"
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
                  <TableHead>Ano</TableHead>
                  <TableHead>RENAVAM</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caminhoes.map((caminhao) => (
                  <TableRow key={caminhao.id}>
                    <TableCell className="font-medium">{caminhao.placa}</TableCell>
                    <TableCell>{caminhao.modelo}</TableCell>
                    <TableCell>{caminhao.ano}</TableCell>
                    <TableCell>{caminhao.renavam}</TableCell>
                    <TableCell>{caminhao.capacidade}</TableCell>
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
