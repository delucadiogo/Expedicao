import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/expedition';
import { Combobox } from '@/components/ui/combobox';
import { productCatalogService } from '@/lib/api';
import { ProductCatalog } from '@/types/productCatalog';
import NewProductDialog from '@/components/product/NewProductDialog';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
  quantity: z.string().min(1, 'Quantidade é obrigatória'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  batch: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.string().min(1, 'Status é obrigatório'),
  observations: z.string().optional(),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [productCatalog, setProductCatalog] = React.useState<ProductCatalog[]>([]);
  const [isNewProductCatalogDialogOpen, setIsNewProductCatalogDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchProductCatalog = async () => {
      try {
        const data = await productCatalogService.getAll();
        setProductCatalog(data);
      } catch (error) {
        console.error('Erro ao carregar catálogo de produtos:', error);
      }
    };
    fetchProductCatalog();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      code: product?.code || '',
      quantity: product?.quantity?.toString() || '',
      unit: product?.unit || '',
      batch: product?.batch || '',
      expiryDate: product?.expiryDate || '',
      status: product?.status || 'a_verificar',
      observations: product?.observations || '',
    },
  });

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const selectedProductCatalog = productCatalog.find(p => p.id === values.name);

    if (!selectedProductCatalog) {
      alert('Produto não encontrado no catálogo. Por favor, selecione um produto válido ou cadastre um novo.');
      return;
    }

    onSubmit({
      ...values,
      name: selectedProductCatalog.name,
      code: selectedProductCatalog.code,
      unit: selectedProductCatalog.unit,
      quantity: values.quantity,
      batch: values.batch,
      expiryDate: values.expiryDate,
      status: values.status,
      observations: values.observations,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Combobox
                      options={productCatalog.map(p => ({ label: p.name, value: p.id }))}
                      value={field.value}
                      onValueChange={(productId) => {
                        field.onChange(productId);
                        const selectedProduct = productCatalog.find(p => p.id === productId);
                        if (selectedProduct) {
                          form.setValue('name', selectedProduct.name);
                          form.setValue('code', selectedProduct.code);
                          form.setValue('unit', selectedProduct.unit);
                        } else {
                          form.setValue('name', '');
                          form.setValue('code', '');
                          form.setValue('unit', '');
                        }
                      }}
                      placeholder="Selecione ou digite o produto..."
                      displayField="label"
                      valueField="value"
                    />
                  </FormControl>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => setIsNewProductCatalogDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!!form.watch('name')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                    <SelectItem value="danificado">Danificado</SelectItem>
                    <SelectItem value="a_verificar">A verificar</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lote</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Validade</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {product ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>

      <NewProductDialog
        isOpen={isNewProductCatalogDialogOpen}
        onClose={() => setIsNewProductCatalogDialogOpen(false)}
        onSuccess={(newProduct) => {
          setProductCatalog((prev) => [...prev, newProduct]);
          form.setValue('name', newProduct.id);
          form.setValue('code', newProduct.code);
          form.setValue('unit', newProduct.unit);
          setIsNewProductCatalogDialogOpen(false);
        }}
      />
    </Form>
  );
} 