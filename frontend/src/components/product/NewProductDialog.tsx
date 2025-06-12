import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productCatalogService } from '@/lib/api'; // Certifique-se de que este serviço existe
import { CreateProductCatalogDTO, ProductCatalog } from '@/types/productCatalog';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProduct: ProductCatalog) => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  code: z.string().min(1, 'Código do produto é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  description: z.string().optional(),
});

export default function NewProductDialog({ isOpen, onClose, onSuccess }: NewProductDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      category: '',
      unit: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newProduct: CreateProductCatalogDTO = {
        name: values.name,
        code: values.code,
        category: values.category,
        unit: values.unit,
        description: values.description || undefined,
      };
      const createdProduct = await productCatalogService.create(newProduct);
      toast({
        title: 'Sucesso',
        description: 'Produto cadastrado com sucesso!',
        variant: 'default',
      });
      onSuccess(createdProduct);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o produto. Verifique se o código do produto já existe.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KG">Quilograma (KG)</SelectItem>
                      <SelectItem value="L">Litro (L)</SelectItem>
                      <SelectItem value="UN">Unidade (UN)</SelectItem>
                      <SelectItem value="M">Metro (M)</SelectItem>
                      <SelectItem value="CX">Caixa (CX)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Cadastrar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 