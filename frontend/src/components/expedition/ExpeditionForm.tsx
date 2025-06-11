import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { ExpeditionStatus, Product } from '@/types/expedition';
import ProductDialog from './ProductDialog';
import ProductList from './ProductList';

const formSchema = z.object({
  truckPlate: z.string().min(1, 'Placa é obrigatória'),
  driverName: z.string().min(1, 'Nome do motorista é obrigatório'),
  driverDocument: z.string().min(1, 'Documento do motorista é obrigatório'),
  transportCompany: z.string().optional(),
  supplierName: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  supplierDocument: z.string().min(1, 'CNPJ do fornecedor é obrigatório'),
  expeditionResponsible: z.string().min(1, 'Responsável é obrigatório'),
  responsiblePosition: z.string().optional(),
  products: z.array(z.any()).min(1, 'Pelo menos um produto é obrigatório'),
  qualityControl: z.object({
    responsible: z.string().min(1, 'Responsável é obrigatório'),
    approvalStatus: z.string().min(1, 'Status é obrigatório'),
    justification: z.string().optional(),
    digitalSignature: z.string().optional(),
    observations: z.string().optional(),
  }),
});

interface ExpeditionFormProps {
  onSuccess?: () => void;
}

export default function ExpeditionForm({ onSuccess }: ExpeditionFormProps) {
  const { createExpedition } = useExpeditionContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truckPlate: '',
      driverName: '',
      driverDocument: '',
      transportCompany: '',
      supplierName: '',
      supplierDocument: '',
      expeditionResponsible: '',
      responsiblePosition: '',
      products: [],
      qualityControl: {
        responsible: '',
        approvalStatus: 'pendente',
        justification: '',
        digitalSignature: '',
        observations: '',
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const expeditionData = {
        ...values,
        status: 'pendente' as ExpeditionStatus,
        dateTime: new Date().toISOString(),
        products,
      };

      await createExpedition(expeditionData);
      form.reset();
      setProducts([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao criar expedição:', error);
    }
  };

  const handleAddProduct = (product: Product) => {
    if (productToEdit) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }]);
    }
    setProductToEdit(undefined);
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProducts(products.filter((p) => p.id !== product.id));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Transporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="truckPlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa do Caminhão</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Motorista</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento do Motorista</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transportCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa de Transporte</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Fornecedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Fornecedor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ do Fornecedor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expeditionResponsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsiblePosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo/Setor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Produtos</CardTitle>
              <Button
                type="button"
                onClick={() => setIsProductDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controle de Qualidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="qualityControl.responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityControl.approvalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input {...field} value="pendente" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityControl.justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justificativa</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityControl.digitalSignature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assinatura Digital</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityControl.observations"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>

        <ProductDialog
          open={isProductDialogOpen}
          onOpenChange={setIsProductDialogOpen}
          product={productToEdit}
          onSubmit={handleAddProduct}
        />
      </form>
    </Form>
  );
}
