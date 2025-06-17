import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { QualityResponsible, CreateQualityResponsibleDTO, UpdateQualityResponsibleDTO } from '@/types/qualityResponsible';
import { qualityResponsibleService } from '@/lib/api';

interface CadastroResponsaveisProps {
  onBack: () => void;
}

const CadastroResponsaveis: React.FC<CadastroResponsaveisProps> = ({ onBack }) => {
  const [qualityResponsibles, setQualityResponsibles] = useState<QualityResponsible[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateQualityResponsibleDTO>({
    name: '',
    position: '',
    sector: '',
    email: '',
    phone: '',
    digitalSignature: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResponsibles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await qualityResponsibleService.getAll();
      setQualityResponsibles(data);
    } catch (err) {
      console.error("Erro ao buscar responsáveis da qualidade:", err);
      setError("Não foi possível carregar os responsáveis da qualidade.");
      toast.error("Erro", { description: "Não foi possível carregar os responsáveis da qualidade." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponsibles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (editingId) {
        await qualityResponsibleService.update(editingId, formData);
        toast.success("Sucesso", { description: "Responsável da qualidade atualizado com sucesso!" });
      } else {
        await qualityResponsibleService.create(formData);
        toast.success("Sucesso", { description: "Responsável da qualidade cadastrado com sucesso!" });
      }
      fetchResponsibles(); // Recarrega a lista
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar responsável da qualidade:", err);
      setError("Não foi possível salvar o responsável da qualidade.");
      toast.error("Erro", { description: "Não foi possível salvar o responsável da qualidade." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (responsavel: QualityResponsible) => {
    setFormData({
      name: responsavel.name,
      position: responsavel.position,
      sector: responsavel.sector,
      email: responsavel.email || '',
      phone: responsavel.phone || '',
      digitalSignature: responsavel.digitalSignature || ''
    });
    setEditingId(responsavel.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este responsável?")) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await qualityResponsibleService.delete(id);
      toast.success("Sucesso", { description: "Responsável da qualidade deletado com sucesso!" });
      fetchResponsibles(); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao deletar responsável da qualidade:", err);
      setError("Não foi possível deletar o responsável da qualidade.");
      toast.error("Erro", { description: "Não foi possível deletar o responsável da qualidade." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      sector: '',
      email: '',
      phone: '',
      digitalSignature: ''
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
          <Button onClick={() => setShowForm(true)} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Responsável
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Novo'} Responsável</CardTitle>
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
                    <Label htmlFor="position">Cargo</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sector">Setor</Label>
                    <Input
                      id="sector"
                      value={formData.sector}
                      onChange={(e) => setFormData({...formData, sector: e.target.value})}
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
                    <Label htmlFor="digitalSignature">Assinatura Digital</Label>
                    <Input
                      id="digitalSignature"
                      value={formData.digitalSignature}
                      onChange={(e) => setFormData({...formData, digitalSignature: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isLoading}>
                    {editingId ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading && <p>Carregando responsáveis...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && (
          <Card>
            <CardHeader>
              <CardTitle>Responsáveis Cadastrados ({qualityResponsibles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Assinatura Digital</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityResponsibles.map((responsavel) => (
                    <TableRow key={responsavel.id}>
                      <TableCell className="font-medium">{responsavel.name}</TableCell>
                      <TableCell>{responsavel.position}</TableCell>
                      <TableCell>{responsavel.sector}</TableCell>
                      <TableCell>{responsavel.email}</TableCell>
                      <TableCell>{responsavel.digitalSignature}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(responsavel)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(responsavel.id)}
                            disabled={isLoading}
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
        )}
      </div>
    </div>
  );
};

export default CadastroResponsaveis;
