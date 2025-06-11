import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { productCatalogService } from '@/lib/api';
import { ProductCatalog, CreateProductCatalogDTO, UpdateProductCatalogDTO } from '@/types/productCatalog';
import { useToast } from '@/hooks/use-toast';

interface CadastroProdutosProps {
  onBack: () => void;
}

const CadastroProdutos: React.FC<CadastroProdutosProps> = ({ onBack }) => {
  const [produtos, setProdutos] = useState<ProductCatalog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProductCatalogDTO | UpdateProductCatalogDTO>({
    name: '',
    code: '',
    category: '',
    unit: '',
    description: ''
  });
  const { toast } = useToast();

  const categorias = ['Eletrônicos', 'Industrial', 'Alimentício', 'Químico', 'Têxtil', 'Outro'];
  const unidades = ['UN', 'KG', 'L', 'M', 'M²', 'M³', 'CX', 'PCT'];

  const loadProdutos = async () => {
    try {
      const data = await productCatalogService.getAll();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos do catálogo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos do catálogo.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productCatalogService.update(editingId, formData as UpdateProductCatalogDTO);
        toast({
          title: 'Sucesso',
          description: 'Produto atualizado com sucesso.',
        });
      } else {
        await productCatalogService.create(formData as CreateProductCatalogDTO);
        toast({
          title: 'Sucesso',
          description: 'Produto cadastrado com sucesso.',
        });
      }
      resetForm();
      loadProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${editingId ? 'atualizar' : 'cadastrar'} o produto. Verifique os dados.`, 
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (produto: ProductCatalog) => {
    setFormData({
      name: produto.name,
      code: produto.code,
      category: produto.category,
      unit: produto.unit,
      description: produto.description,
    });
    setEditingId(produto.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await productCatalogService.delete(id);
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso.',
      });
      loadProdutos();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o produto.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      unit: '',
      description: ''
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
            <h1 className="text-2xl font-bold">Cadastro de Produtos</h1>
          </div>
          <Button onClick={() => {
            resetForm();
            setShowForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Novo'} Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Código/SKU</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unit">Unidade</Label>
                    <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {unidades.map((un) => (
                          <SelectItem key={un} value={un}>{un}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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
            <CardTitle>Produtos Cadastrados ({produtos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.name}</TableCell>
                    <TableCell>{produto.code}</TableCell>
                    <TableCell>{produto.category}</TableCell>
                    <TableCell>{produto.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(produto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(produto.id)}
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

export default CadastroProdutos;
