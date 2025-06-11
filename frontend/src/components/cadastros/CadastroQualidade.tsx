
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

interface ResponsavelQualidade {
  id: string;
  nome: string;
  cargo: string;
  setor: string;
  email: string;
  telefone: string;
  assinaturaDigital: string;
}

interface CadastroQualidadeProps {
  onBack: () => void;
}

const CadastroQualidade: React.FC<CadastroQualidadeProps> = ({ onBack }) => {
  const [responsaveis, setResponsaveis] = useState<ResponsavelQualidade[]>([
    {
      id: '1',
      nome: 'Ana Costa',
      cargo: 'Analista de Qualidade',
      setor: 'Controle de Qualidade',
      email: 'ana@oliveira.com',
      telefone: '(11) 5555-5555',
      assinaturaDigital: 'AC2024'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    setor: '',
    email: '',
    telefone: '',
    assinaturaDigital: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setResponsaveis(prev => prev.map(r => 
        r.id === editingId ? { ...formData, id: editingId } : r
      ));
    } else {
      const newResponsavel: ResponsavelQualidade = {
        ...formData,
        id: Date.now().toString()
      };
      setResponsaveis(prev => [...prev, newResponsavel]);
    }
    
    resetForm();
  };

  const handleEdit = (responsavel: ResponsavelQualidade) => {
    setFormData({
      nome: responsavel.nome,
      cargo: responsavel.cargo,
      setor: responsavel.setor,
      email: responsavel.email,
      telefone: responsavel.telefone,
      assinaturaDigital: responsavel.assinaturaDigital
    });
    setEditingId(responsavel.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setResponsaveis(prev => prev.filter(r => r.id !== id));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: '',
      setor: '',
      email: '',
      telefone: '',
      assinaturaDigital: ''
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
            <h1 className="text-2xl font-bold">Cadastro de Responsáveis da Qualidade</h1>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Responsável
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Novo'} Responsável da Qualidade</CardTitle>
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
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={formData.cargo}
                      onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="setor">Setor</Label>
                    <Input
                      id="setor"
                      value={formData.setor}
                      onChange={(e) => setFormData({...formData, setor: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assinaturaDigital">Código de Assinatura Digital</Label>
                    <Input
                      id="assinaturaDigital"
                      value={formData.assinaturaDigital}
                      onChange={(e) => setFormData({...formData, assinaturaDigital: e.target.value})}
                      placeholder="ex: AC2024"
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
            <CardTitle>Responsáveis da Qualidade Cadastrados ({responsaveis.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assinatura</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responsaveis.map((responsavel) => (
                  <TableRow key={responsavel.id}>
                    <TableCell className="font-medium">{responsavel.nome}</TableCell>
                    <TableCell>{responsavel.cargo}</TableCell>
                    <TableCell>{responsavel.setor}</TableCell>
                    <TableCell>{responsavel.email}</TableCell>
                    <TableCell>{responsavel.assinaturaDigital}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(responsavel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(responsavel.id)}
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

export default CadastroQualidade;
